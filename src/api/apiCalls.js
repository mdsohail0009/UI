import { apiClient, ipRegistry } from './';
import { ApiControllers } from './config';
import counterpart from 'counterpart';
import { store } from '../store';
import CryptoJS from 'crypto-js'

const getportfolio = (memID) => {
    return apiClient.get(ApiControllers.wallets + `Crypto/${memID}`);
}
const getCryptos = () => {
    return apiClient.get(ApiControllers.buySell + 'Coins');
}
const getMember = (useremail) => {
    return apiClient.get(ApiControllers.accounts + '/' + useremail);
}
const sumsubacesstoken = (userid,flow) => {
    https://api.sumsub.com/resources/accessTokens?userId=JamesBond007&levelName=basic-kyc-level
    return apiClient.get('Sumsub/AccessToken1?applicantId=' + userid+'&levelName='+flow);
}
const sumsublivenessacesstoken = (userid, flow) => {
    return apiClient.get('Sumsub/ExternalAccessToken?userId=' + userid+'&levelName='+flow);
}
const sumsubacesstokennew = (userid) => {
    return apiClient.get('Sumsub/KYBAccessToken?applicantId=' + userid);
}
const updateKyc = (userid) => {
    return apiClient.put(ApiControllers.accounts + `${userid}/KYC`);
}
const trackEvent = (obj) => {
    const { userConfig: { userProfileInfo, trackAuditLogData } } = store.getState()
    let trackObj = {
        "id": "00000000-0000-0000-0000-000000000000",
        "date": "",
        "type": obj.Type,
        "featurePath": obj.FullFeatureName,
        "username": obj.userName,
        "memberId": userProfileInfo?.id,
        "feature": obj.Feature,
        "action": obj.Action,
        "remarks": obj.Remarks,
        "ipAddress": trackAuditLogData?.Ip,
        "countryName": trackAuditLogData?.Location?.countryName,
        "info": JSON.stringify(trackAuditLogData)
    }
    return apiClient.post(ApiControllers.master + `Auditlogs`, trackObj);
}

const getIpRegistery = () => {
    return ipRegistry.get("/?key=l4rtc0buncs5dej9");
}
const sellMemberCrypto = (memID) => {
    return apiClient.get(ApiControllers.wallets + memID);
}
const convertLocalLang = (key) => {
    return counterpart.translate(key)
}
const getIBANData = (ibannumber) => {
    return apiClient.get(ApiControllers.master + `GetIBANAccountDetails?ibanNumber=` + ibannumber);
}

const getdshKpis = (userid) => {
    return apiClient.get(ApiControllers.dashboard + `KPI/${userid}`);
}
const getdshcumulativePnl = (userid, days) => {
    return apiClient.get(ApiControllers.dashboard + `CumulativePNL/${userid}/${days}`);
}
const getAssetNetwroth = (userid, days) => {
    return apiClient.get(ApiControllers.dashboard + `AssetsNetWorth/${userid}/${days}`);
}
const getAssetAllowcation = (userid, days) => {
    return apiClient.get(ApiControllers.dashboard + `AssetAllocation/${userid}/${days}`);
}
const getprofits = (userid, days) => {
    return apiClient.get(ApiControllers.dashboard + `Profits/${userid}/${days}`);
}
const getdailypnl = (userid, days) => {
    return apiClient.get(ApiControllers.dashboard + `DailyPNL/${userid}/${days}`);
}

const getCode = (AccountId, isResendOTP) => {
    return apiClient.get(ApiControllers.master + `SendOTP/${AccountId}/${isResendOTP}`);

}
const getVerification = (AccountId, code) => {
    return apiClient.get(ApiControllers.master + `OTPVerification/${AccountId}/${code}`)
}

const downloadKyc = (memberId) => {
    return apiClient.get(ApiControllers.accounts + `DownloadFile/${memberId}`)
}

const encryptValue = (msg, key) => {

    msg = typeof (msg) == 'string' ? msg : JSON.stringify(msg);
    let salt = CryptoJS.lib.WordArray.random(128 / 8);

    let key1 = CryptoJS.PBKDF2(key, salt, {
        keySize: 256 / 32,
        iterations: 10
    });

    let iv = CryptoJS.lib.WordArray.random(128 / 8);

    let encrypted = CryptoJS.AES.encrypt(msg, key1, {
        iv: iv,
        padding: CryptoJS.pad.Pkcs7,
        mode: CryptoJS.mode.CBC

    });
    return ((salt.toString()) + (iv.toString()) + (encrypted.toString()));
}
let apicalls = {
    getportfolio, getCryptos, getMember, sumsubacesstoken, updateKyc, sumsubacesstokennew, sumsublivenessacesstoken, trackEvent, sellMemberCrypto, convertLocalLang, getIBANData,
    getdshKpis, getdshcumulativePnl, getAssetNetwroth, getAssetAllowcation, getprofits, getdailypnl, getCode, getVerification, getIpRegistery, encryptValue, downloadKyc
}
export default apicalls