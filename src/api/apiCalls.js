import { apiClient } from './';
import { appInsights } from "../Shared/appinsights";
import { ApiControllers } from './config';
import counterpart from 'counterpart';

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
    return apiClient.get(ApiControllers.member + 'UpdateKYC?isKyc=true&userId=' + userid);
}
const trackEvent = (obj) => {
    return appInsights.trackEvent({
        name: obj.Feature, properties: { "Type": 'Admin', "Action": obj.Action, "Username": obj.userName, "MemeberId": obj.id, "Feature": obj.Feature, "Remarks": obj.Remarks, "Duration": 1, "Url": window.location.href, "FullFeatureName": obj.FullFeatureName }
    });
}
const trackPageview = (obj) => {
    return appInsights.trackPageView({
        name: obj.Feature, properties: { "Type": 'Admin', "Action": 'Page view', "Username": obj.userName, "MemeberId": obj.id, "Feature": obj.Feature, "Remarks": obj.Remarks, "Duration": 1, "Url": window.location.href, "FullFeatureName": obj.FullFeatureName }
    });
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
let apicalls = { getportfolio, getCryptos, getMember, sumsubacesstoken, updateKyc, sumsubacesstokennew, sumsublivenessacesstoken, trackEvent, trackPageview, sellMemberCrypto, convertLocalLang, getIBANData }
export default apicalls