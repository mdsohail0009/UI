import { fetchMemberWallets, fetchPortfolio, fetchYourPortfolio, getPortfolioGraph } from '../components/dashboard.component/api'
import { getDashboardNotices } from '../components/documents.component/api';
import { publishTransactionRefresh } from '../utils/pubsub';
const FETCH_DETAIL_DATA = "fetchDetailData";
const SET_DETAIL_DATA = "setDetailData";
const REJECT_DETAIL_DATA = "rejectDetailData";
const HANDLE_NOTICES = "handleNotices";
const SET_NOTIF_COUNT = "setNotificationCount";
const SET_COIN_DETAIL = "setSelctedCoinDetail";
const GET_COIN_MARKET_DATA ="fetchMarketCoinData";
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
const setSelctedCoinDetail = (payload) => {
    return {
        type: SET_COIN_DETAIL,
        payload
    }
}
const fetchMarketCoinData =(payload) => {
    return {
        type: GET_COIN_MARKET_DATA,
        payload
    }
}
const fetchDashboardcalls = () => {
  publishTransactionRefresh()
    return async (dispatch) => {
        dispatch(fetchMemberWalletsData())
        // dispatch(fetchPortfolioData())
        dispatch(fetchYourPortfoliodata())

    }
}
const fetchMemberWalletsData = () => {
    return async (dispatch) => {
        dispatch(fetchDetailData({ key: "wallets", loading: true, data: [] }));
        const response = await fetchMemberWallets();
        if (response.ok) {
            dispatch(setDetailData({ key: "wallets", loading: false, data: response.data }));
        } else {
            dispatch(rejectDetailData({ key: "wallets", loading: false, data: [], error: response.originalError.message }));
        }
    }
}
// const fetchPortfolioData = () => {
//     return async (dispatch) => {
//         dispatch(fetchDetailData({ key: "portFolio", loading: true, data: {} }));
//         const response = await fetchPortfolio();
//         if (response.ok) {
//             dispatch(setDetailData({ key: "portFolio", loading: false, data: response.data }));
//         } else {
//             dispatch(rejectDetailData({ key: "portFolio", loading: false, data: {}, error: response.originalError.message }));
//         }
//     }
// }
const fetchGraphInfo = (customer_id, type) => {
    return async (dispatch) => {
        dispatch(setDetailData({ key: "portFolioGraph", loading: true, data: [] }));
        const response = await getPortfolioGraph(customer_id, type);
        if (response.ok) {
            dispatch(setDetailData({ key: "portFolioGraph", loading: false, data: { BTC: response.data.map(item => { return { time: item.datetime, value: item.value } }) } }));
        } else {
            dispatch(rejectDetailData({ key: "portFolioGraph", loading: false, data: [], error: response.originalError.message }));
        }
    }
}
const fetchYourPortfoliodata = () => {
    return async (dispatch) => {
        dispatch(fetchDetailData({ key: "cryptoPortFolios", loading: true, data: [] }));
        const response = await fetchYourPortfolio();
        if (response.ok) {
            dispatch(setDetailData({ key: "cryptoPortFolios", loading: false, data: response.data }));
        } else {
            dispatch(rejectDetailData({ key: "cryptoPortFolios", loading: false, data: [], error: response.originalError.message }));
        }
    }
}
const fetchNotices = () => {
    return async dispatch => {
        dispatch(handleNotices({ data: [], loading: true }));
        const response = await getDashboardNotices();
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
    notificationCount: null,
    marketSelectedCoin: null,
    isCoinViewChange:false
}
let dashboardReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_DETAIL_DATA:
            return { ...state, [action.payload.key]: { data: action.payload.data, loading: true } };
        case SET_DETAIL_DATA:
            return { ...state, [action.payload.key]: { data: action.payload.data, loading: false } };
        case REJECT_DETAIL_DATA:
            return { ...state, [action.payload.key]: { data: action.payload.data, loading: false } };
        case HANDLE_NOTICES:
            return { ...state, notices: { data: action.payload.data, loading: action.payload.loading } }
        case SET_COIN_DETAIL:
            return { ...state, marketSelectedCoin: action.payload }
        case GET_COIN_MARKET_DATA:
            return { ...state, isCoinViewChange: action.payload }
            case SET_NOTIF_COUNT:
            let _count = action.payload
            if (action?.payload < 0) {
                _count = 0;
            }
            state = { ...state, notificationCount: _count }
            return state;
        default:
            return state;
    }
}
export default dashboardReducer;
export { fetchMemberWalletsData, fetchYourPortfoliodata, fetchDashboardcalls, fetchGraphInfo, fetchNotices, setNotificationCount, setSelctedCoinDetail,fetchMarketCoinData }