import { create } from 'apisauce';
import { store } from '../store';
import CryptoJS from 'crypto-js'
const firebaseServer = create({
    baseURL: "https://fcm.googleapis.com/",
    // headers: {
    //     "AUthorization": "key=" + REACT_APP_FIREBASE_AUTH
    // }
});
const apiClient = create({
    baseURL: process.env.REACT_APP_API_END_POINT
})
const identityClient = create({
    baseURL: process.env.REACT_APP_AUTHORITY
})
const coinGekoClient = create({
    baseURL: process.env.REACT_APP_COIN_GECO_API
})
const uploadClient=create({
    baseURL: process.env.REACT_APP_UPLOAD_API
})
const _encrypt = (msg, key) =>{

    msg = typeof (msg) == 'object' ? JSON.stringify(msg) : msg;
    var salt = CryptoJS.lib.WordArray.random(128 / 8);

    var key = CryptoJS.PBKDF2(key, salt, {
        keySize: 256 / 32,
        iterations: 10
    });

    var iv = CryptoJS.lib.WordArray.random(128 / 8);

    var encrypted = CryptoJS.AES.encrypt(msg, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC

    });
    var transitmessage = salt.toString() + iv.toString() + encrypted.toString();
    return transitmessage;
}
apiClient.axiosInstance.interceptors.request.use((config) => {
    const { oidc: { user }, userConfig:{ userProfileInfo }} = store.getState()
    config.headers.Authorization = `Bearer ${user.access_token}`
    if(userProfileInfo?.id)config.headers.AuthInformation = userProfileInfo?.id?_encrypt(`{MemberId:"${userProfileInfo?.id}"}`, userProfileInfo.sk):''
    return config;
})
export { firebaseServer, apiClient, coinGekoClient,identityClient,uploadClient }