import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config';
const getportfolio = (customer_id) => {
    return apiClient.get(ApiControllers.wallets + `Crypto/${customer_id}`);
}
const getCryptos = () => {
    return apiClient.get(ApiControllers.buySell + 'Coins');
}
const getMemberfiat = (customer_id) => {
    return apiClient.get(ApiControllers.wallets + 'Fiat/' + customer_id);
}
const getSellamnt = (Value, coin, isCrypto, customer_id, screenName, currencyCode) => {
    return apiClient.get(ApiControllers.master + `CryptoFiatConverter/${customer_id}/${coin}/${currencyCode}/${Value}/${isCrypto}/${screenName||null}`) ;
}
const getSellPreviewData = (sellObject) => {
    return apiClient.get(ApiControllers.buySell + `Sell/${sellObject?.customerId}/Coins/${sellObject?.fromWalletCode}/${sellObject?.toWalletCode}/${(sellObject.isSwap ? sellObject.fromValue : sellObject.toValue)}/${(sellObject.isSwap === true ? false : true)}`);
}
const savesellData = (obj) => {
    return apiClient.post(ApiControllers.buySell + 'Sell', obj);
}
const getCoins = (type) => {
    return apiClient.get(ApiControllers.markets + `Coins/${type}`);
}
const getSelectedCoinDetails = (coin_code, customer_id) => {
    return apiClient.get(ApiControllers.buySell + `${customer_id}/Coins/${coin_code}`)
}
const fetchCurrencyConvertionValue = ({ from, to, value, isCrypto, customer_id, screenName }) => {
    return apiClient.get(ApiControllers.master + `CryptoFiatConverter/${customer_id}/${from}/${to}/${value}/${isCrypto}/${screenName||null}`);
}
const getPreview = ({ coin, currency = "USD", amount, isCrypto, customer_id }) => {
    return apiClient.get(ApiControllers.buySell + `Buy/${customer_id}/Coins/${coin}/${currency}/${amount}/${isCrypto}`)
}
const buyCrypto = (obj) => {
    return apiClient.post(ApiControllers.buySell + `Buy`, obj);
}
export { getportfolio, getCryptos, getMemberfiat, getSellamnt, getCoins, getSelectedCoinDetails, fetchCurrencyConvertionValue, getSellPreviewData, savesellData, getPreview, buyCrypto }

