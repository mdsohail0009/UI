import { apiClient } from './';
const Portfolio = "Exchange/";
const getportfolio = () => {
    return apiClient.get(Portfolio +`MemberCrypto?memberId=2E8E3877-BC8E-466D-B62D-F3F8CCBBD019`);
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
const updateKyc=(userid)=>{
    return apiClient.get(Portfolio+'UpdateKYC?isKyc=true&userId='+userid);
}

export default {getportfolio,getCryptos,getMember,sumsubacesstoken, updateKyc}