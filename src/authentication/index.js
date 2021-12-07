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

let iframe = userManager._iframeNavigator.prepare();
let sessionIframe = document.createElement("iframe");

let iframeWindow, iframeUrl;

const pollSession = () => {

    if (iframeWindow && iframeUrl) {

        // send a message to trigger a session check
        iframeWindow.postMessage('checkSession', iframeUrl);

    }
};

iframe.then(frame => {
    debugger
    // look up the check session URL
    userManager._settings._metadataService.getCheckSessionIframe().then((url) => {

        iframeUrl = url;
        sessionIframe.src = url;
        sessionIframe.style.display = "none";
        // add load listener first
        sessionIframe.onload = () => {

            // save the iframe's window reference
            iframeWindow = frame._frame.contentWindow;

            // start polling
            pollSession();

            // remove listener
            sessionIframe.onload = null;

        };

        // go to our check session page
        frame.navigate({
            url: iframeUrl
        });

    });

});

//
//  ADD LISTENER FOR MESSAGE RESPONSES
//

window.onmessage = function (event) {
    console.log(event?.originalEvent?.data);

    // set up another poll
    setTimeout(function () {
        pollSession();
    }, 5000);

}


export { userManager }