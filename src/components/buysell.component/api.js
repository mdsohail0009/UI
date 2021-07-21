import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config'
const Portfolio = "Exchange/";
const memId = "E3BF0F02-70E5-4575-8552-F8C49533B7C6";
const getportfolio = () => {
    return apiClient.get(Portfolio + `MemberCrypto?memberId=E3BF0F02-70E5-4575-8552-F8C49533B7C6`);
}
const getCryptos = () => {
    return apiClient.get(ApiControllers.exchange + 'Coins');
}
const getMemberfiat = () => {
    return apiClient.get(Portfolio + 'MemberFiat?memberId=E3BF0F02-70E5-4575-8552-F8C49533B7C6');
}
const getSellamnt = (Value, isSwap) => {
    return apiClient.get(ApiControllers.exchange + 'CryptoFiatConverter?from=BTC&to=USD&value=' + Value + '&isCrypto=' + !isSwap);
}
const getCoins = (type) => {
    return apiClient.get(ApiControllers.exchange + "Coins?type=" + type);
}
const getSelectedCoinDetails = (coin_code, member_id = memId) => {
    return apiClient.get(ApiControllers.exchange + `MemberCoinDetail?memberId=${member_id}&coin=${coin_code} `)
}
const fetchCurrencyConvertionValue = ({ from, to, value, isCrypto }) => {
    return apiClient.get(ApiControllers.exchange+`CryptoFiatConverter?from=${from}&to=${to}&value=${value}&isCrypto=${isCrypto}`);
}
export { getportfolio, getCryptos, getMemberfiat, getSellamnt, getCoins, getSelectedCoinDetails,fetchCurrencyConvertionValue }