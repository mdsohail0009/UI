import { apiClient, coinGekoClient } from "../../api";
import { ApiControllers } from "../../api/config";
const fetchMarketCaps = ({ pageNo }) => {
    return coinGekoClient.get(`coins/markets?vs_currency=usd&order=market_cap_desc&per_page=1000&page=${pageNo || 1}&sparkline=false'`)
}
const fetchMemberWallets = (member_id) => {
    return apiClient.get(ApiControllers.member + `MemberFiatDashboard?memberId=${member_id}`)
}
const fetchPortfolio=(member_id)=>{
    return apiClient.get(ApiControllers.member+`Portfolio?memberId=${member_id}`)
}
const fetchYourPortfolio=(member_id)=>{
    return apiClient.get(ApiControllers.member+`MemberCryptofolio?memberId=${member_id}`)
}
const getNotices = (member_id)=>{
    return apiClient.get(ApiControllers.member+`MemberNoticesDashboard?memberId=${member_id}`)
}
const getPortfolioGraph =(memId,type)=>{
    return apiClient.get(ApiControllers.member+`DashBoardGraph?memberId=${memId}&type=${type}`)
}
export { fetchMarketCaps,fetchMemberWallets,fetchPortfolio,fetchYourPortfolio,getNotices,getPortfolioGraph }