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

// var stat = "unchanged";
// var mes = process.env.REACT_APP_CLIENT_ID;
// var targetOrigin = process.env.REACT_APP_AUTHORITY; // Validates origin
// var opFrameId = window.document.createElement("iframe");
// opFrameId.style.display = "none";
// opFrameId.src = process.env.REACT_APP_AUTHORITY + `/connect/checksession`;
// window.document.body.appendChild(opFrameId);
// var timerID;
// opFrameId.onload = (even) => {
//     setTimer();
// }
// function check_session() {
//     opFrameId.contentWindow.postMessage(mes, targetOrigin);
// }
// window.addEventListener("message", receiveMessage, false);
// function receiveMessage(e) {
//     if (e.origin !== targetOrigin) {
//         return;
//     }
//     stat = e.data;

//     if (stat === "changed") {
//         userManager.clearStaleState();
//         clearInterval(timerID);
//         // then take the actions below...
//     }
// }
// function setTimer() {
//     check_session();
//     timerID = setInterval(check_session, 5* 1000);
// }


export { userManager }