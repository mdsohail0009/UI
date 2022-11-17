import firebase from 'firebase';
import { saveUserToken } from '../notifications/api';
import { setToken } from '../reducers/authReducer';
import { store } from '../store'
import AppConfig from './app_config';
var firebaseConfig = {
    apiKey: AppConfig.REACT_APP_FIREBASE_API_KEY,
    authDomain: AppConfig.REACT_APP_FIREBASE_AUTH_DOMAIN,
    projectId: AppConfig.REACT_APP_FIREBASE_PROJECT_ID,
    storageBucket: AppConfig.REACT_APP_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: AppConfig.REACT_APP_FIREBASE_MESSENGER_ID,
    appId: AppConfig.REACT_APP_FIREBASE_APP_ID
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