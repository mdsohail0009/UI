import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config'
const Portfolio = "Exchange/";
const memId = "E3BF0F02-70E5-4575-8552-F8C49533B7C6";

const fetchCurrConvertionValue = (from, to, value) => {
    return apiClient.get(ApiControllers.exchange+`CryptoToCrypto?fromCoin=${from}&toCoin=${to}&fromValue=${value}`);
}
export { fetchCurrConvertionValue }