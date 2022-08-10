import { create, } from 'apisauce';
import { store } from '../store';
import CryptoJS from 'crypto-js';
import { useHistory } from 'react-router-dom';

const ipRegistry = create({
    baseURL: 'https://api4.ipregistry.co'
})
const sumsub = create({
    baseURL: 'https://api.sumsub.com/'
})
const apiClient = create({
    baseURL: process.env.REACT_APP_API_END_POINT
})
const identityClient = create({
    baseURL: process.env.REACT_APP_AUTHORITY
})
const coinGekoClient = create({
    baseURL: process.env.REACT_APP_COIN_GECO_API
})
const uploadClient = create({
    baseURL: process.env.REACT_APP_UPLOAD_API
})
const _encrypt = (msg, key) => {

    msg = typeof (msg) == 'object' ? JSON.stringify(msg) : msg;
    var salt = CryptoJS.lib.WordArray.random(128 / 8);

    key = CryptoJS.PBKDF2(key, salt, {
        keySize: 256 / 32,
        iterations: 10
    });

    var iv = CryptoJS.lib.WordArray.random(128 / 8);

    var encrypted = CryptoJS.AES.encrypt(msg, key, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC

    });
    return ((salt.toString()) + (iv.toString()) + (encrypted.toString()));
}
apiClient.axiosInstance.interceptors.request.use((config) => {
    const { oidc: { user }, userConfig: { userProfileInfo }, currentAction: { action },
        menuItems } = store.getState()
    console.log("ApiIndex", config.url, `{CustomerId:"${userProfileInfo?.id}", Action:"${action || "view"
        }", FeatureId:"${menuItems?.featurePermissions?.selectedScreenFeatureId}"}`);
    config.headers.Authorization = `Bearer ${user.access_token}`
    if (userProfileInfo?.id) config.headers.AuthInformation = userProfileInfo?.id ? _encrypt(`{CustomerId:"${userProfileInfo?.id}", Action:"${action || "view"
        }", FeatureId:"${menuItems?.featurePermissions?.selectedScreenFeatureId}"}`, userProfileInfo.sk) : ''
    return config;
});
apiClient.axiosInstance.interceptors.response.use((response) => {
    return response;
}, (err) => {
    if (err.status === "401") {
        const navigate = useHistory();
        navigate.push("/accessdenied");
    } else{ return err;}
       
})
export { apiClient, coinGekoClient, identityClient, uploadClient, ipRegistry, sumsub }