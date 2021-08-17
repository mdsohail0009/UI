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
const getSellamnt = (Value, isSwap,coin) => {
    return apiClient.get(ApiControllers.exchange + 'CryptoFiatConverter?from='+coin+'&to=USD&value=' + Value + '&isCrypto=' + !isSwap);
}
const getSellPreviewData = (sellObject) => {
    return apiClient.get(ApiControllers.exchange + 'Preview?coin=' + sellObject.fromWalletCode + '&currency=USD&amount=' + sellObject.fromValue);
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
const fetchCurrencyConvertionValue = ({ from, to, value, isCrypto }) => {
    return apiClient.get(ApiControllers.exchange + `CryptoFiatConverter?from=${from}&to=${to}&value=${value}&isCrypto=${isCrypto}`);
}
const getPreview = ({ coin, currency = "USD", amount }) => {
    return apiClient.get(ApiControllers.exchange + `Preview?coin=${coin}&currency=${currency}&amount=${amount}`)
}
const buyCrypto = (obj) => {
    return apiClient.post(ApiControllers.exchange + `BuyCrypto`, obj);
}
export { getportfolio, getCryptos, getMemberfiat, getSellamnt, getCoins, getSelectedCoinDetails, fetchCurrencyConvertionValue, getSellPreviewData, savesellData, getPreview, buyCrypto }

