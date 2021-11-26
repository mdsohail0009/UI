import { apiClient, ipRegistry } from './';
import { appInsights } from "../Shared/appinsights";
import { ApiControllers } from './config';
import counterpart from 'counterpart';
import { store } from '../store';

const getportfolio = (memID) => {
    return apiClient.get(ApiControllers.wallets + `Crypto/${memID}`);
}
const getCryptos = () => {
    return apiClient.get(ApiControllers.buySell + 'Coins');
}
const getMember = (useremail) => {
    return apiClient.get(ApiControllers.accounts + '/' + useremail);
}
const sumsubacesstoken = (userid) => {
    return apiClient.get('Sumsub/AccessToken?applicantId=' + userid);
}
const sumsublivenessacesstoken = (userid, flow) => {
    return apiClient.get('Sumsub/ExternalAccessToken?userId=' + userid);
}
const sumsubacesstokennew = (userid) => {
    return apiClient.get('Sumsub/KYBAccessToken?applicantId=' + userid);
}
const updateKyc = (userid) => {
    return apiClient.put(ApiControllers.accounts + `${userid}/KYC`);
}
// const trackEvent = (obj) => {
//     return appInsights.trackEvent({
//         name: obj.Feature, properties: { "Type": 'Admin', "Action": obj.Action, "Username": obj.userName, "MemeberId": obj.id, "Feature": obj.Feature, "Remarks": obj.Remarks, "Duration": 1, "Url": window.location.href, "FullFeatureName": obj.FullFeatureName }
//     });
// }
const trackEvent = (obj) => {
    const { userConfig: { userProfileInfo, trackAuidtLogData } } = store.getState()
 let trackObj={
    "id": "00000000-0000-0000-0000-000000000000",
    "date": "",
    "featurePath": obj.FullFeatureName,
    "username": obj.userName,
    "memberId": userProfileInfo.id,
    "feature": obj.Feature,
    "action": obj.Action,
    "remarks": obj.Remarks,
    "ipAddress":trackAuidtLogData.Ip ,
    "countryName": trackAuidtLogData.Location.countryName,
    "info": JSON.stringify(trackAuidtLogData)
  

 }
    // return appInsights.trackPageView({
    //     name: obj.Feature, properties: { "Type": 'Admin', "Action": 'Page view', "Username": obj.userName, "MemeberId": obj.id, "Feature": obj.Feature, "Remarks": obj.Remarks, "Duration": 1, "Url": window.location.href, "FullFeatureName": obj.FullFeatureName }
    // });
    return apiClient.post(ApiControllers.master + `Auditlogs`, trackObj);
}

const getIpRegistery = () => {
    debugger
   // return ipRegistry.get('https://api.ipregistry.co/?key=v230l9ji9ra7hp7c')
    return ipRegistry.get("/?key=v230l9ji9ra7hp7c");
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

const getCode = (AccountId) => {
    return apiClient.get(ApiControllers.master + `SendOTP/${AccountId}`);
}
const getVerification = (AccountId, code) => {
    return apiClient.get(ApiControllers.master + `OTPVerification/${AccountId}/${code}`)
}
let apicalls = {
    getportfolio, getCryptos, getMember, sumsubacesstoken, updateKyc, sumsubacesstokennew, sumsublivenessacesstoken, trackEvent, sellMemberCrypto, convertLocalLang, getIBANData,
    getdshKpis, getdshcumulativePnl, getAssetNetwroth, getAssetAllowcation, getprofits, getdailypnl, getCode, getVerification, getIpRegistery
}
export default apicalls