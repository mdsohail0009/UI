import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config'

const getportfolio = (customer_id) => {
    return apiClient.get(ApiControllers.wallets + `Crypto/${customer_id}`);
}
const fetchCurrConvertionValue = (from, to, value, memeberid, screenName) => {
    return apiClient.get(ApiControllers.master + `CryptoToCrypto/${memeberid}/${from}/${to}/${value}/${screenName || null}`);
}
const fetchCurrConvertionCommisionValue = (from, to, value, memeberid, screenName) => {
    return apiClient.get(ApiControllers.master + `Comission/${memeberid}/${from}/${to}/${value}/${screenName || null}`);
}
const swapPreviewData = (coin, currency, amount) => {
    return apiClient.get(ApiControllers.swap + `Preview?coin=${coin}&currency=${currency}&amount=${amount}`);
}
const getfromCoinList = (customer_id) => {
    return apiClient.get(ApiControllers.swap + `${customer_id}/FromCoins`);
}
const gettoCoinList = (customer_id, fromcoin) => {
    return apiClient.get(ApiControllers.swap + `${customer_id}/ToCoins/${fromcoin}`);
}
const saveSwapData = (obj) => {
    return apiClient.post(ApiControllers.swap + 'Swap', obj);
}
export { getportfolio, fetchCurrConvertionValue, swapPreviewData, saveSwapData, getfromCoinList, gettoCoinList,fetchCurrConvertionCommisionValue }