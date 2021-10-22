import firebase from 'firebase';
import { saveUserToken } from '../notifications/api';
import { setToken } from '../reducers/authReducer';
import { store } from '../store'
var firebaseConfig = {
    apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
    authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_FIREBASE_MESSENGER_ID,
    appId: process.env.REACT_APP_FIREBASE_APP_ID
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();
messaging.requestPermission().then(() => {
    return messaging.getToken()
})
    .then((token) => {
        store.dispatch(setToken(token));
        saveUserToken({ UserId: store.getState().userConfig?.userProfileInfo?.id, Token: token });
    })
    .catch(err => {
        console.log(err)
    });
export const onMessageListener = () =>
    new Promise((resolve) => {
        messaging.onMessage((payload) => {
            resolve(payload);
        });
    });
export const getToken = () => {
    return messaging.getToken();
}
export default firebase;