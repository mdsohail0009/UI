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
    return apiClient.get(Portfolio +'MemberFiat?memberId=E3BF0F02-70E5-4575-8552-F8C49533B7C6');
}
const getSellamnt=(Value,isSwap)=>{
    return apiClient.get(ApiControllers.exchange +'CryptoFiatConverter?from=BTC&to=USD&value='+Value+'&isCrypto='+!isSwap);
}
export {getportfolio,getCryptos,getMemberfiat,getSellamnt}