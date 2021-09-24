import { apiClient, coinGekoClient } from "../../api";
import { ApiControllers } from "../../api/config";
const fetchMarketCaps = ({ pageNo }) => {
    return coinGekoClient.get(`coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1000&page=${pageNo || 1}&sparkline=false'`)
}
const fetchMemberWallets = (member_id) => {
    return apiClient.get(ApiControllers.exchange + `MemberFiatDashboard?memberId=${member_id}`)
}
const fetchPortfolio=(member_id)=>{
    return apiClient.get(ApiControllers.exchange+`Portfolio?memberId=${member_id}`)
}
const fetchYourPortfolio=(member_id)=>{
    return apiClient.get(ApiControllers.exchange+`MemberCryptofolio?memberId=${member_id}`)
}
const getNotices = (member_id)=>{
    return apiClient.get(ApiControllers.exchange+`MemberNoticesDashboard?memberId=${member_id}`)
}
const getPortfolioGraph =(memId,type)=>{
    return apiClient.get(ApiControllers.exchange+`DashBoardGraph?memberId=${memId}&type=${type}`)
}
export { fetchMarketCaps,fetchMemberWallets,fetchPortfolio,fetchYourPortfolio,getNotices,getPortfolioGraph }