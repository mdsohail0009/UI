import { apiClient } from '../../api';
import  { ApiControllers } from '../../api/config'
const Portfolio = "Exchange/";
const getportfolio = () => {
    return apiClient.get(Portfolio +`MemberCrypto?memberId=E3BF0F02-70E5-4575-8552-F8C49533B7C6`);
}
const getCryptos=()=>{
    return apiClient.get(ApiControllers.exchange +'Coins');
}
const getMemberfiat=()=>{
    return apiClient.get(Portfolio +'MemberFiat?memberId=2E8E3877-BC8E-466D-B62D-F3F8CCBBD019');
}
const getSellamnt=(coin,Value,isSwap)=>{
    return apiClient.get(ApiControllers.exchange +'fiatToCryptoConvert?fromcoin='+(isSwap?coin:'USD')+'&fromfiat='+(isSwap?'USD':coin)+'&fiatValue='+Value);
}
export {getportfolio,getCryptos,getMemberfiat,getSellamnt}