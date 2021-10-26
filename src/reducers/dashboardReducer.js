import { fetchMemberWallets, fetchPortfolio, fetchYourPortfolio, getPortfolioGraph } from '../components/dashboard.component/api'
import { getDashboardNotices } from '../components/documents.component/api';
const FETCH_DETAIL_DATA = "fetchDetailData";
const SET_DETAIL_DATA = "setDetailData";
const REJECT_DETAIL_DATA = "rejectDetailData";
const HANDLE_NOTICES = "handleNotices";
const SET_NOTIF_COUNT="setNotificationCount";
const fetchDetailData = (payload) => {
    return { type: FETCH_DETAIL_DATA, payload }
}
const setDetailData = (payload) => {
    return { type: SET_DETAIL_DATA, payload }
}
const rejectDetailData = (payload) => {
    return { type: REJECT_DETAIL_DATA, payload }
}
const handleNotices = (payload) => {
    return {
        type: HANDLE_NOTICES,
        payload
    }
}
const setNotificationCount = (payload) => {
    return {
        type: SET_NOTIF_COUNT,
        payload
    }
}
const fetchDashboardcalls = (member_id) => {
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
const fetchGraphInfo = (member_id, type) => {
    return async (dispatch) => {
        dispatch(setDetailData({ key: "portFolioGraph", loading: true, data: [] }));
        const response = await getPortfolioGraph(member_id, type);
        if (response.ok) {
            dispatch(setDetailData({ key: "portFolioGraph", loading: false, data: { BTC: response.data.map(item => { return { time: item.datetime, value: item.value } }) } }));
        } else {
            dispatch(rejectDetailData({ key: "portFolioGraph", loading: false, data: [], error: response.originalError.message }));
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
const fetchNotices = (memberId) => {
    return async dispatch => {
        dispatch(handleNotices({ data: [], loading: true }));
        const response = await getDashboardNotices(memberId);
        if (response.ok) {
            dispatch(handleNotices({ data: response.data, loading: false }));
        } else {
            dispatch(handleNotices({ data: [], loading: false }));
        }
    }
}
let initialState = {
    isLoading: true,
    wallets: { loading: false, data: [] },
    portFolio: { loading: false, data: {} },
    cryptoPortFolios: { loading: false, data: [] },
    notices: { loading: false, data: [] },
    notificationCount:null
}
let dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_DETAIL_DATA:
            state = { ...state, [action.payload.key]: { data: action.payload.data, loading: true } };
            return state;
        case SET_DETAIL_DATA:
            state = { ...state, [action.payload.key]: { data: action.payload.data, loading: false } };
            return state;
        case REJECT_DETAIL_DATA:
            state = { ...state, [action.payload.key]: { data: action.payload.data, loading: false } };
            return state;
        case HANDLE_NOTICES:
            state = { ...state, notices: { data: action.payload.data, loading: action.payload.loading } }
            return state;
            case SET_NOTIF_COUNT:
                state = { ...state, notificationCount:action.payload }
                return state;
        default:
            return state;
    }
}
export default dashboardReducer;
export { fetchMemberWalletsData, fetchPortfolioData, fetchYourPortfoliodata, fetchDashboardcalls, fetchGraphInfo, fetchNotices,setNotificationCount }