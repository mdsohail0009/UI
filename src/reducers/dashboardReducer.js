import { fetchMemberWallets, fetchPortfolio, fetchYourPortfolio} from '../components/dashboard.component/api'
const FETCH_DETAIL_DATA = "fetchDetailData";
const SET_DETAIL_DATA = "setDetailData";
const REJECT_DETAIL_DATA = "rejectDetailData";

const fetchDetailData = (payload) => {
    return { type: FETCH_DETAIL_DATA, payload }
}
const setDetailData = (payload) => {
    return { type: SET_DETAIL_DATA, payload }
}
const rejectDetailData = (payload) => {
    return { type: REJECT_DETAIL_DATA, payload }
}
const fetchDashboardcalls = (member_id) =>{
    return async (dispatch) => {
        dispatch(fetchMemberWalletsData(member_id))
        dispatch(fetchPortfolioData(member_id))
        dispatch(fetchYourPortfoliodata(member_id))
    }
}
const fetchMemberWalletsData = (member_id) => {
    return async (dispatch) => {
        dispatch(fetchDetailData({ key: "wallets", loading: true, data: [] }));
        const response = await fetchMemberWallets(member_id);
        if (response.ok) {
            dispatch(setDetailData({ key: "wallets", loading: false, data: response.data }));
        } else {
            dispatch(rejectDetailData({ key: "wallets", loading: false, data: [], error: response.originalError.message }));
        }
    }
}
const fetchPortfolioData = (member_id) => {
    return async (dispatch) => {
        dispatch(fetchDetailData({ key: "portFolio", loading: true, data: {} }));
        const response = await fetchPortfolio(member_id);
        if (response.ok) {
            dispatch(setDetailData({ key: "portFolio", loading: false, data: response.data }));
        } else {
            dispatch(rejectDetailData({ key: "portFolio", loading: false, data: {}, error: response.originalError.message }));
        }
    }
}
const fetchYourPortfoliodata = (member_id) => {
    return async (dispatch) => {
        dispatch(fetchDetailData({ key: "cryptoPortFolios", loading: true, data: [] }));
        const response = await fetchYourPortfolio(member_id);
        if (response.ok) {
            dispatch(setDetailData({ key: "cryptoPortFolios", loading: false, data: response.data }));
        } else {
            dispatch(rejectDetailData({ key: "cryptoPortFolios", loading: false, data: [], error: response.originalError.message }));
        }
    }
}
let initialState = {
    isLoading: true,
    wallets:{loading:false,data:[]},
    portFolio:{loading:false,data:{}},
    cryptoPortFolios:{loading:false,data:[]},
}
let dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_DETAIL_DATA:
            state = { ...state, [action.payload.key]: {data:action.payload.data,loading:true} };
            return state;
        case SET_DETAIL_DATA:
            state = { ...state, [action.payload.key]: {data:action.payload.data,loading:false} };
            return state;
        case REJECT_DETAIL_DATA:
            state = { ...state, [action.payload.key]: {data:action.payload.data,loading:false} };
            return state;
        default:
            return state;
    }
}
export default dashboardReducer;
export { fetchMemberWalletsData,fetchPortfolioData,fetchYourPortfoliodata,fetchDashboardcalls }