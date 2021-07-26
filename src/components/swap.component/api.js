import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config'
const Portfolio = "Exchange/";
const memId = "E3BF0F02-70E5-4575-8552-F8C49533B7C6";

const getportfolio = (member_id) => {
debugger;
    return apiClient.get(Portfolio + `MemberCrypto?memberId=${member_id}`);
}
const fetchCurrConvertionValue = (from, to, value) => {
    return apiClient.get(ApiControllers.exchange+`CryptoToCrypto?fromCoin=${from}&toCoin=${to}&fromValue=${value}`);
}
const swapPreviewData = (coin, currency, amount) => {
    return apiClient.get(ApiControllers.exchange+`Preview?coin=${coin}&currency=${currency}&amount=${amount}`);
}
const saveSwapData = (obj) => {
    return apiClient.post(ApiControllers.exchange + 'Swap', obj);
}
export { getportfolio , fetchCurrConvertionValue , swapPreviewData , saveSwapData}