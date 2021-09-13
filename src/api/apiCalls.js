import { apiClient } from './';
const Portfolio = "Exchange/";
const getportfolio = (memID) => {
    return apiClient.get(Portfolio +`MemberCrypto?memberId=`+memID);
}
const getCryptos=()=>{
    return apiClient.get(Portfolio +'Coins');
}
const getMember=(useremail)=>{
    return apiClient.get(Portfolio +'/Member?email='+useremail);
}
const sumsubacesstoken=(userid)=>{
    return apiClient.get('Sumsub/AccessToken?applicantId='+userid);
}
const sumsubacesstokennew=(userid)=>{
    return apiClient.get('Sumsub/KYBAccessToken?applicantId='+userid);
}
const updateKyc=(userid)=>{
    return apiClient.get(Portfolio+'UpdateKYC?isKyc=true&userId='+userid);
}
const getSearchGrid = () => {
    return apiClient.get(Portfolio + `GetAdminLogsK?timeSpan=Custom&fromdate=2021-09-01&todate=2021-09-08&userName=All%20Users&feature=All%20Features`);
}
const userNameLuSearch = (user_name) => {
    return apiClient.get(Portfolio + "UserLookup?username=" + user_name);
}
const getFeatureLuSearch = () => {
    return apiClient.get(Portfolio + "FeatureLookUp");
}

export default {getportfolio,getCryptos,getMember,sumsubacesstoken, updateKyc,sumsubacesstokennew, getSearchGrid, userNameLuSearch, getFeatureLuSearch}