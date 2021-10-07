import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config';
const getportfolio = (member_id) => {
    return apiClient.get(ApiControllers.exchange + `MemberCrypto?memberId=${member_id}`);
}
const getCryptos = () => {
    return apiClient.get(ApiControllers.exchange + 'Coins');
}
const getMemberfiat = (member_id) => {
    return apiClient.get(ApiControllers.exchange + 'MemberFiat?memberId=' + member_id);
}
const getSellamnt = (Value, isSwap, coin, isCrypto, memId, screenName) => {
    return apiClient.get(ApiControllers.exchange + 'CryptoFiatConverter?coin=' + coin + '&currency=USD&amount=' + Value + '&isCrypto=' + isCrypto + '&memberId=' + memId + '&screenName=' + screenName);
}
const getSellPreviewData = (sellObject) => {
    return apiClient.get(ApiControllers.exchange + 'Preview?coin=' + sellObject.fromWalletCode + '&currency=USD&amount=' + (sellObject.isSwap ? sellObject.fromValue : sellObject.toValue) + '&isCrypto=' + (sellObject.isSwap === true ? false : true));
}
const savesellData = (obj) => {
    return apiClient.post(ApiControllers.exchange + 'SellCrypto', obj);
}
const getCoins = (type) => {
    return apiClient.get(ApiControllers.exchange + "Coins?type=" + type);
}
const getSelectedCoinDetails = (coin_code, member_id) => {
    return apiClient.get(ApiControllers.exchange + `MemberCoinDetail?memberId=${member_id}&coin=${coin_code}`)
}
const fetchCurrencyConvertionValue = ({ from, to, value, isCrypto, memId, screenName }) => {
    return apiClient.get(ApiControllers.exchange + `CryptoFiatConverter?coin=${from}&currency=${to}&amount=${value}&isCrypto=${isCrypto}&memberId=${memId}&screenName=${screenName}`);
}
const getPreview = ({ coin, currency = "USD", amount, isCrypto }) => {
    return apiClient.get(ApiControllers.exchange + `Preview?coin=${coin}&currency=${currency}&amount=${amount}&isCrypto=${isCrypto}`)
}
const buyCrypto = (obj) => {
    return apiClient.post(ApiControllers.exchange + `BuyCrypto`, obj);
}
export { getportfolio, getCryptos, getMemberfiat, getSellamnt, getCoins, getSelectedCoinDetails, fetchCurrencyConvertionValue, getSellPreviewData, savesellData, getPreview, buyCrypto }

