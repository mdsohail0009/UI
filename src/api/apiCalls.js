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

export default {getportfolio,getCryptos,getMember,sumsubacesstoken, updateKyc,sumsubacesstokennew}