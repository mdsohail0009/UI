import { apiClient, coinGekoClient } from "../../api";
import { ApiControllers } from "../../api/config";
const fetchMarketCaps = ({ pageNo }) => {
    return coinGekoClient.get(`coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1000&page=${pageNo || 1}&sparkline=false'`)
}
const fetchMemberWallets = () => {
    return apiClient.get(ApiControllers.wallets + `FiatDashboard/Exchange`);
}
const fetchPortfolio = () => {
    return apiClient.get(ApiControllers.customers + 'Portfolio');
}
const fetchYourPortfolio = () => {
    return apiClient.get(ApiControllers.wallets + `CryptoPortFolio/Exchange`);
}
const getcoinDetails = (Coin) => {
    return apiClient.get(ApiControllers.markets + `Coins/PriceChart/${Coin}`);
}
const getPortfolioGraph = (memId, type) => {
    return apiClient.get(ApiControllers.customers + `/${memId}/DashBoard/${type}`);
}
const getCoinChatData = (coinName, currency, days) => {
    return coinGekoClient.get(`coins/${coinName}/market_chart?vs_currency=${currency}&days=${days}`);
}
const getData = () => {
    return apiClient.get(ApiControllers.transaction + `Customers/Dashboard`);
}
const getNotices = () => {
    return apiClient.get(ApiControllers.customers + 'Dashboard/Notice');
}

export { fetchMarketCaps,getData, fetchMemberWallets, fetchPortfolio, fetchYourPortfolio, getPortfolioGraph, getcoinDetails,
    getNotices, getCoinChatData }
