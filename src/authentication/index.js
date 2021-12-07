import { WebStorageStateStore } from 'oidc-client';
import { createUserManager } from 'redux-oidc';
import ReactDOM from 'react-dom';
const config = {
    authority: process.env.REACT_APP_AUTHORITY,
    client_id: process.env.REACT_APP_CLIENT_ID,
    redirect_uri: process.env.REACT_APP_REDIRECT_URI,
    response_type: "id_token token",
    scope: "openid profile",
    silent_redirect_uri: `${window.location.protocol}//${window.location.hostname}${window.location.port || ""}/silent_renew.html`,
    automaticSilentRenew: true,
    userStore: new WebStorageStateStore({ store: window.localStorage })
}
const userManager = createUserManager(config);

var stat = "unchanged";
var mes = process.env.REACT_APP_CLIENT_ID;
var targetOrigin = process.env.REACT_APP_AUTHORITY; // Validates origin
var opFrameId = "op";
var timerID;

function check_session() {
    debugger
    var win = window.parent.frames[opFrameId]?.contentWindow
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

//setTimer();

export { userManager }