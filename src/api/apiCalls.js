import { apiClient } from './';
const Portfolio = "Exchange/";
const getportfolio = () => {
    return apiClient.get(Portfolio +`MemberCrypto?memberId=2E8E3877-BC8E-466D-B62D-F3F8CCBBD019`);
}
const getCryptos=()=>{
    return apiClient.get(Portfolio +'Coins');
}
const getMember=()=>{
    return apiClient.get(Portfolio +'/Member?userId=B1889EEF-651D-4667-9D87-C27A3F9AA07D');
}
const sumsubacesstoken=()=>{
    return apiClient.get('Sumsub/AccessToken?applicantId=naresh1');
}
export default {getportfolio,getCryptos,getMember,sumsubacesstoken}