import { getCoins, getSelectedCoinDetails, getPreview, getMemberfiat } from '../components/buy.component/api'
const HANDLE_FETCH = "handleFetch";
const SET_COIN = "setCoin";
const SET_EXCHANGE_VALUE = "setExchangeValue";
const SET_WALLET = "setWallet";
const SET_BUY_FINAL_RES = "setBuyFinalRes";

const handleFetch = (payload) => {
    return { type: HANDLE_FETCH, payload }
}
const setCoin = (payload) => {
    return { type: SET_COIN, payload }
}
const setWallet = (payload) => {
    return {
        type: SET_WALLET,
        payload
    }
}
const setBuyFinalRes = (payload) => {
    return {
        type: SET_BUY_FINAL_RES,
        payload
    }
}
const fetchCoins = (type) => {
    return async dispatch => {
        dispatch(handleFetch({ key: "coins", [type]: { data: [], error: null, loading: true } }));
        const response = await getCoins(type);
        if (response.ok) {
            dispatch(handleFetch({ key: "coins", [type]: { data: response.data, error: null, loading: false } }));
        } else {
            dispatch(handleFetch({ key: "coins", [type]: { data: [], error: response.data || response.originalError.message, loading: false } }));
        }
    }
}
const fetchSelectedCoinDetails = (coin) => {
    return async (dispatch) => {
        dispatch(handleFetch({ key: "selectedCoin", loading: true, data: null }));
        const response = await getSelectedCoinDetails(coin);
        if (response.ok) {
            dispatch(handleFetch({ key: "selectedCoin", loading: false, data: response.data }));
        } else {
            dispatch(handleFetch({ key: "selectedCoin", loading: false, data: null, error: response.originalError.message }));
        }
    }
}
const setExchangeValue = (payload) => {
    return {
        type: SET_EXCHANGE_VALUE,
        payload
    }
}
const fetchPreview = ({ coin, wallet, amount, isCrypto = false }) => {
    return async (dispatch) => {
        dispatch(handleFetch({ key: "previewDetails", loading: true, data: null }));

        const response = await getPreview({ coin, currency: wallet.currencyCode, amount, isCrypto });
        if (response.ok) {
            dispatch(handleFetch({ key: "previewDetails", loading: false, data: response.data }));
            dispatch(setExchangeValue({ key: coin, value: response.data?.oneCoinValue }));
        } else {
            dispatch(handleFetch({ key: "previewDetails", loading: false, data: null, error: response.originalError.message }));
        }
    }
}
const fetchMemberFiat = (member_id) => {
    return async (dispatch) => {
        dispatch(handleFetch({ key: "memberFiat", loading: true, data: [] }));
        const response = await getMemberfiat(member_id);
        if (response.ok) {
            dispatch(handleFetch({ key: "memberFiat", loading: false, data: response.data }));
        } else {
            dispatch(handleFetch({ key: "memberFiat", loading: false, data: [], error: response.originalError.message }));
        }
    }
}
const initialState = {
    coins: {},
    wallet: {},
    selectedCoin: {},
    coinWallet: {},
    exchangeValues: {},
    previewDetails: { loading: false, data: null },
    selectedWallet: null,
    memberFiat: { loading: false, data: [] },
    buyFinalRes: {}
}

const buyReducer = (state = initialState, action) => {
    switch (action.type) {
        case HANDLE_FETCH:
            state = { ...state, [action.payload.key]: { ...state[action.payload.key], ...action.payload } };
            return state;
        case SET_COIN:
            state = { ...state, coinWallet: action.payload };
            return state;
        case SET_EXCHANGE_VALUE:
            state = { ...state, exchangeValues: { ...state.exchangeValues, [action.payload.key]: action.payload.value } };
            return state;
        case SET_WALLET:
            state = { ...state, selectedWallet: action.payload };
            return state;
        case SET_BUY_FINAL_RES:
            state = { ...state, buyFinalRes: action.payload };
            return state;
        default:
            return state
    }
}

export default buyReducer;
export {
    fetchCoins, fetchSelectedCoinDetails, setCoin, setExchangeValue, fetchPreview, setWallet, fetchMemberFiat,
    setBuyFinalRes
}