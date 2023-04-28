import { create, } from 'apisauce';
import { store } from '../store';
import CryptoJS from 'crypto-js';
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
const bankClient = create({
    baseURL: process.env.REACT_APP_BANKAPI_END_POINT
})
const ipStackClient = create({
    baseURL: process.env.REACT_APP_IPSTACK_API
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
    const { oidc: { profile, deviceToken }, userConfig: { userProfileInfo }, currentAction: { action },
        menuItems } = store.getState()
    config.headers.Authorization = `Bearer ${deviceToken}`
    // if (userProfileInfo?.id) config.headers.AuthInformation = userProfileInfo?.id ? _encrypt(`{CustomerId:"${userProfileInfo?.id}", Action:"${action || "view"
    //     }", FeatureId:"${menuItems?.featurePermissions?.selectedScreenFeatureId}"}`, userProfileInfo.sk) : ''
    return config;
});
bankClient.axiosInstance.interceptors.request.use((config) => {
    const { oidc: { profile, deviceToken }, userConfig: { userProfileInfo }, currentAction: { action },
        menuItems } = store.getState()
    config.headers.Authorization = `Bearer ${deviceToken}`
    if (userProfileInfo?.id) config.headers.AuthInformation = userProfileInfo?.id ? _encrypt(`{CustomerId:"${userProfileInfo?.id}", Action:"${action || "view"
        }", FeatureId:"${menuItems?.featurePermissions?.selectedScreenFeatureId}"}`, userProfileInfo.sk) : ''
    return config;
});
uploadClient.axiosInstance.interceptors.request.use((config) => {
    const { oidc: { profile, deviceToken }, 
    } = store.getState()
    config.headers.Authorization = `Bearer ${deviceToken}`
    return config;
});

export { apiClient, coinGekoClient, identityClient, uploadClient, ipRegistry, sumsub, bankClient, ipStackClient }