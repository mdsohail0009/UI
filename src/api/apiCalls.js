import { apiClient,sumSubClient } from './';
const Portfolio = "Exchange/";
const getportfolio = () => {
    return apiClient.get(Portfolio +`MemberCrypto?memberId=2E8E3877-BC8E-466D-B62D-F3F8CCBBD019`);
}
const getCryptos=()=>{
    return apiClient.get(Portfolio +'Coins');
}
const sumsubacesstoken=()=>{
    return sumSubClient.post('resources/accessTokens?userId=narersh&ttlInSecs=600',null);
}
export default {getportfolio,getCryptos,sumsubacesstoken}