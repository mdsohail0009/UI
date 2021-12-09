import { WebStorageStateStore } from 'oidc-client';
import { createUserManager } from 'redux-oidc';
const config = {
    authority: process.env.REACT_APP_AUTHORITY,
    client_id: process.env.REACT_APP_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_REDIRECT_URI,
    response_type: "id_token token",
    scope: "openid profile",
    silent_redirect_uri: process.env.REACT_APP_SILENT_REDIRECT_URI,
    automaticSilentRenew: true,
    userStore: new WebStorageStateStore({ store: window.localStorage })
}
const userManager = createUserManager(config);

var stat = "unchanged";
var mes = process.env.REACT_APP_CLIENT_ID;
var targetOrigin = process.env.REACT_APP_AUTHORITY; // Validates origin
var opFrameId = document.createElement("iframe");
opFrameId.src = process.env.REACT_APP_AUTHORITY + `/connect/checksession`;
opFrameId.style.display = "none";
var timerID;

function check_session() {
    debugger
    var win = opFrameId.contentWindow
    win.postMessage(mes, targetOrigin);
}

function setTimer() {
    check_session();
    timerID = setInterval(check_session, 5 * 1000);
}

window.addEventListener("message", receiveMessage, false);

function receiveMessage(e) {
    if (e.origin !== targetOrigin) {
        return;
    }
    stat = e.data;

    if (stat === "changed") {
        clearInterval(timerID);
        // then take the actions below...
    }
}

opFrameId.onload = function () {
    setTimer();
}
export { userManager }