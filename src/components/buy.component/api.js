import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config';
const getportfolio = (member_id) => {
    return apiClient.get(ApiControllers.member + `MemberCrypto?memberId=${member_id}`);
}
const getCryptos = () => {
    return apiClient.get(ApiControllers.buySell + 'Coins');
}
const getMemberfiat = (member_id) => {
    return apiClient.get(ApiControllers.member + 'MemberFiat?memberId=' + member_id);
}
const getSellamnt = (Value, isSwap, coin, isCrypto, memId, screenName, currencyCode) => {
    return apiClient.get(ApiControllers.master + 'CryptoFiatConverter?coin=' + coin + '&currency=' + currencyCode + '&amount=' + Value + '&isCrypto=' + isCrypto + '&memberId=' + memId + '&screenName=' + screenName);
}
const getSellPreviewData = (sellObject) => {
    return apiClient.get(ApiControllers.sell + `Preview/${sellObject?.fromWalletCode}/${sellObject?.toWalletCode}/${(sellObject.isSwap ? sellObject.fromValue : sellObject.toValue)}/${(sellObject.isSwap === true ? false : true)}`);
}
const savesellData = (obj) => {
    return apiClient.post(ApiControllers.sell + 'Sell', obj);
}
const getCoins = (type) => {
    return apiClient.get(ApiControllers.buySell + `Coins/${type}`);
}
const getSelectedCoinDetails = (coin_code, member_id) => {
    return apiClient.get(ApiControllers.buySell + `MemberCoinDetail?memberId=${member_id}&coin=${coin_code}`)
}
const fetchCurrencyConvertionValue = ({ from, to, value, isCrypto, memId, screenName }) => {
    return apiClient.get(ApiControllers.master + `CryptoFiatConverter?coin=${from}&currency=${to}&amount=${value}&isCrypto=${isCrypto}&memberId=${memId}&screenName=${screenName}`);
}
const getPreview = ({ coin, currency = "USD", amount, isCrypto }) => {
    return apiClient.get(ApiControllers.buy + `Preview/${coin}/${currency}/${amount}/${isCrypto}`)
}
const buyCrypto = (obj) => {
    return apiClient.post(ApiControllers.buy + `Buy`, obj);
}
export { getportfolio, getCryptos, getMemberfiat, getSellamnt, getCoins, getSelectedCoinDetails, fetchCurrencyConvertionValue, getSellPreviewData, savesellData, getPreview, buyCrypto }

