import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config'

const getportfolio = (member_id) => {
    return apiClient.get(ApiControllers.member + `MemberCrypto?memberId=${member_id}`);
}
const fetchCurrConvertionValue = (from, to, value, memeberid, screenName) => {
    return apiClient.get(ApiControllers.master+`CryptoToCrypto?fromCoin=${from}&toCoin=${to}&fromValue=${value}&memberId=${memeberid}&screenName=${screenName||''}`);
}
const swapPreviewData = (coin, currency, amount) => {
    return apiClient.get(ApiControllers.swap+`Preview?coin=${coin}&currency=${currency}&amount=${amount}`);
}
const getfromCoinList = (member_id) => {
    return apiClient.get(ApiControllers.swap+`MemberCoins?memberId=${member_id}`);
}
const gettoCoinList = (member_id,fromcoin) => {
    return apiClient.get(ApiControllers.swap+`GetSwapCoins?coin=${fromcoin}&memberId=${member_id}`);
}
const saveSwapData = (obj) => {
    return apiClient.post(ApiControllers.swap + 'Swap', obj);
}
export { getportfolio , fetchCurrConvertionValue , swapPreviewData , saveSwapData, getfromCoinList, gettoCoinList}