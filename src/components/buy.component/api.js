import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config';
const getportfolio = (member_id) => {
    return apiClient.get(ApiControllers.member + `MemberCrypto?memberId=${member_id}`);
}
const getCryptos = () => {
    return apiClient.get(ApiControllers.buySell + 'Coins');
}
const getMemberfiat = (member_id) => {
    return apiClient.get(ApiControllers.wallets + 'Fiat/' + member_id);
}
const getSellamnt = (Value, isSwap, coin, isCrypto, memId, screenName, currencyCode) => {
    return apiClient.get(ApiControllers.master + 'CryptoFiatConverter/' + coin + '/' + currencyCode + '/' + Value + '/' + isCrypto + '/' + screenName);
}
const getSellPreviewData = (sellObject) => {
    return apiClient.get(ApiControllers.buySell + `Sell/${sellObject?.membershipId}/Coins/${sellObject?.fromWalletCode}/${sellObject?.toWalletCode}/${(sellObject.isSwap ? sellObject.fromValue : sellObject.toValue)}/${(sellObject.isSwap === true ? false : true)}`);
}
const savesellData = (obj) => {
    return apiClient.post(ApiControllers.buySell + 'Sell', obj);
}
const getCoins = (type) => {
    return apiClient.get(ApiControllers.markets + `Coins/${type}`);
}
const getSelectedCoinDetails = (coin_code, member_id) => {
    return apiClient.get(ApiControllers.buySell + `${member_id}/Coins/${coin_code}`)
}
const fetchCurrencyConvertionValue = ({ from, to, value, isCrypto, memId, screenName }) => {
    return apiClient.get(ApiControllers.master + `CryptoFiatConverter/${from}/${to}/${value}/${isCrypto}/${screenName}`);
}
const getPreview = ({ coin, currency = "USD", amount, isCrypto }) => {
    return apiClient.get(ApiControllers.buySell + `Preview/${coin}/${currency}/${amount}/${isCrypto}`)
}
const buyCrypto = (obj) => {
    return apiClient.post(ApiControllers.buySell + `Buy`, obj);
}
export { getportfolio, getCryptos, getMemberfiat, getSellamnt, getCoins, getSelectedCoinDetails, fetchCurrencyConvertionValue, getSellPreviewData, savesellData, getPreview, buyCrypto }

