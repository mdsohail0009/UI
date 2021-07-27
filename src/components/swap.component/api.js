import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config'
const Portfolio = "Exchange/";

const getportfolio = (member_id) => {
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