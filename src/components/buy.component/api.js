import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config';
const getportfolio = () => {
    return apiClient.get(ApiControllers.wallets + 'Crypto');
}
const getCryptos = () => {
    return apiClient.get(ApiControllers.buySell + 'Coins');
}
const getMemberfiat = () => {
    return apiClient.get(ApiControllers.wallets + 'Fiat');
}
const getSellamnt = (Value, coin, isCrypto, screenName, currencyCode) => {
    return apiClient.get(ApiControllers.master + `CryptoFiatConverter/${coin}/${currencyCode}/${Value}/${isCrypto}/${screenName||null}`) ;
}
const getSellPreviewData = (sellObject) => {
    return apiClient.get(ApiControllers.buySell + `Sell/Coins/${sellObject?.fromWalletCode}/${sellObject?.toWalletCode}/${(sellObject.isSwap ? sellObject.fromValue : sellObject.toValue)}/${(sellObject.isSwap === true ? false : true)}`);
}
const savesellData = (obj) => {
    return apiClient.post(ApiControllers.buySell + 'Sell', obj);
}
const getCoins = (type) => {
    return apiClient.get(ApiControllers.markets + `Coins/${type}`);
}
const getSelectedCoinDetails = (coin_code) => {
    return apiClient.get(ApiControllers.buySell + `Coins/${coin_code}`)
}
const fetchCurrencyConvertionValue = ({ from, to, value, isCrypto, screenName }) => {
    return apiClient.get(ApiControllers.master + `CryptoFiatConverter/${from}/${to}/${value}/${isCrypto}/${screenName||null}`);
}
const getPreview = ({ coin, currency = "USD", amount, isCrypto }) => {
    return apiClient.get(ApiControllers.buySell + `Buy/Coins/${coin}/${currency}/${amount}/${isCrypto}`)
}
const buyCrypto = (obj) => {
    return apiClient.post(ApiControllers.buySell + `Buy`, obj);
}
export { getportfolio, getCryptos, getMemberfiat, getSellamnt, getCoins, getSelectedCoinDetails, fetchCurrencyConvertionValue, getSellPreviewData, savesellData, getPreview, buyCrypto }

