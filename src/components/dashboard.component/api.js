import { apiClient, coinGekoClient } from "../../api";
import { ApiControllers } from "../../api/config";
const fetchMarketCaps = ({ pageNo }) => {
    return coinGekoClient.get(`coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1000&page=${pageNo || 1}&sparkline=false'`)
}
const fetchMemberWallets = (customer_id) => {
    return apiClient.get(ApiControllers.wallets + `FiatDashboard/${customer_id}/Exchange`);
}
const fetchPortfolio = (member_id) => {
    return apiClient.get(ApiControllers.customers + `${member_id}/Portfolio`);
}
const fetchYourPortfolio = (customer_id) => {
    return apiClient.get(ApiControllers.wallets + `CryptoPortFolio/${customer_id}/Exchange`);
}
const getcoinDetails = (coinName,member_id) => {
    return apiClient.get(ApiControllers.markets + `Coins/PriceChart/${coinName}/${member_id}`);
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

// https://localhost:44384/api/v1/Transactions/Dashboard/Tranactions/35623f43-9271-4b8b-a554-fab0ed7e3d60

export { fetchMarketCaps,getData, fetchMemberWallets, fetchPortfolio, fetchYourPortfolio, getPortfolioGraph, getcoinDetails,
    getNotices, getCoinChatData }
