import { apiClient } from '../../api';
import  { ApiControllers } from '../../api/config'
const Portfolio = "Exchange/";
const getportfolio = () => {
    return apiClient.get(Portfolio +`MemberCrypto?memberId=2E8E3877-BC8E-466D-B62D-F3F8CCBBD019`);
}
const getCryptos=()=>{
    return apiClient.get(ApiControllers.exchange +'Coins');
}
const getMemberfiat=()=>{
    return apiClient.get(Portfolio +'MemberFiat?memberId=2E8E3877-BC8E-466D-B62D-F3F8CCBBD019');
}
export {getportfolio,getCryptos,getMemberfiat}