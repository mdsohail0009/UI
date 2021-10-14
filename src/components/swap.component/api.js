import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config'
const Portfolio = "Exchange/";

const getportfolio = (member_id) => {
    return apiClient.get(ApiControllers.member + `MemberCrypto?memberId=${member_id}`);
}
const fetchCurrConvertionValue = (from, to, value, memeberid, screenName) => {
    return apiClient.get(ApiControllers.exchange+`CryptoToCrypto?fromCoin=${from}&toCoin=${to}&fromValue=${value}&memberId=${memeberid}&screenName=${screenName||''}`);
}
const swapPreviewData = (coin, currency, amount) => {
    return apiClient.get(ApiControllers.exchange+`Preview?coin=${coin}&currency=${currency}&amount=${amount}`);
}
const getfromCoinList = (member_id) => {
    return apiClient.get(ApiControllers.exchange+`MemberCoins?memberId=${member_id}`);
}
const gettoCoinList = (member_id,fromcoin) => {
    return apiClient.get(ApiControllers.exchange+`GetSwapCoins?coin=${fromcoin}&memberId=${member_id}`);
}
const saveSwapData = (obj) => {
    return apiClient.post(ApiControllers.exchange + 'Swap', obj);
}
export { getportfolio , fetchCurrConvertionValue , swapPreviewData , saveSwapData, getfromCoinList, gettoCoinList}