
import { getCoins, getMemberfiat, getportfolio, getPreview, getSelectedCoinDetails } from '../components/buy.component/api'
const FETCH_MEMBERCOINS = "fetchMemberCoins";
const FETCH_MEMBERCOINS_REJECTED = "fetchMemberCoinsRejected";
const FETCH_MEMBERCOINS_SUCCESS = "fetchMemberCoinsSuccess";
const UPDATE_COINDETAILS = "updateCoinDetails";
const UPDATE_SELLSAVEOBJECT = 'updatesellsaveObject';
const HANDLE_FETCH = "handleFetch";
const HANDLE_COINS_FETCH = "handleCoinsFetch";
const SET_WALLET = "setWallet";
const SET_COIN_WALLET = "setCoinWallet";
const SET_EXCHANGE_VALUE = "setExchangeValue";
const fetchMemberCoins = () => {
    return { type: FETCH_MEMBERCOINS };
}
const setWallet = (payload) => {
    return {
        type: SET_WALLET,
        payload
    }
}
const setCoinWallet = (payload) => {
    return {
        type: SET_COIN_WALLET,
        payload
    }
}
const setExchangeValue = (payload) => {
    return {
        type: SET_EXCHANGE_VALUE,
        payload
    }
}
const fetchMemberCoinsSuccess = (payload, key) => {
    return {
        type: FETCH_MEMBERCOINS_SUCCESS,
        payload: { data: payload, key }
    }
}
const fetchMemberCoinsRejected = (paylaod) => {
    return {
        type: FETCH_MEMBERCOINS_REJECTED,
        payload: paylaod
    }
}
const updateCoinDetails = (payload) => {
    return { type: UPDATE_COINDETAILS, payload }
}
const updatesellsaveObject = (payload) => {
    return { type: UPDATE_SELLSAVEOBJECT, payload }
}
const handleCoinsFetch = (payload) => {
    return {
        type: HANDLE_COINS_FETCH,
        payload
    }
}
const handleFetch = (payload) => {
    return {
        type: HANDLE_FETCH,
        payload
    }
}
const fetchCoins = (type) => {
    return async (dispatch) => {
        dispatch(handleCoinsFetch({ key: type, loading: true, data: [] }));
        const response = await getCoins(type);
        if (response.ok) {
            dispatch(handleCoinsFetch({ key: type, loading: false, data: response.data }));
        } else {
            dispatch(handleCoinsFetch({ key: type, loading: false, data: [], error: response.originalError.message }));
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
const fetchMemberFiat = (customer_id) => {
    return async (dispatch) => {
        dispatch(handleFetch({ key: "memberFiat", loading: true, data: [] }));
        const response = await getMemberfiat(customer_id);
        if (response.ok) {
            dispatch(handleFetch({ key: "memberFiat", loading: false, data: response.data }));
        } else {
            dispatch(handleFetch({ key: "memberFiat", loading: false, data: [], error: response.originalError.message }));
        }
    }
}
const fetchPreview = ({ coin, wallet, amount }) => {
    return async (dispatch) => {
        dispatch(handleFetch({ key: "previewDetails", loading: true, data: null }));
        const response = await getPreview({ coin, currency: wallet.currencyCode, amount });
        if (response.ok) {
            dispatch(handleFetch({ key: "previewDetails", loading: false, data: response.data }));
        } else {
            dispatch(handleFetch({ key: "previewDetails", loading: false, data: null, error: response.originalError.message }));
        }
    }
}
const getMemberCoins = (customer_id) => {
    return dispatch => {
        dispatch(fetchMemberCoins());
        getportfolio().then(
            (response) => {
                if (response.ok) {
                    dispatch(fetchMemberCoinsSuccess(response.data, 'MemberCoins'));
                } else {
                    dispatch(fetchMemberCoinsRejected(response.data));
                }
            },
            (error) => {
                dispatch(fetchMemberCoinsRejected(error));
            },
        );
        getMemberfiat(customer_id).then(
            (response) => {
                if (response.ok) {
                    dispatch(fetchMemberCoinsSuccess(response.data, 'MemberFiat'));
                } else {
                    dispatch(fetchMemberCoinsRejected(response.data));
                }
            },
            (error) => {
                dispatch(fetchMemberCoinsRejected(error));
            },
        );
    }
}
let initialState = {
    isLoading: true,
    error: null,
    MemberCoins: [],
    MemberFiat: [],
    coinDetailData: {}, sellsaveObject: {},
    coins: { all: { loading: false, data: [] }, gainers: { loading: false, data: [], losers: { loading: false, data: [] } } },
    selectedCoin: { loading: false, data: null },
    memberFiat: { loading: false, data: [] },
    previewDetails: { loading: false, data: null },
    selectedWallet: null,
    coinWallet: null,
    exchangeValues: {},
    headerTab: ""
}


let buyReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MEMBERCOINS:
            state = { ...state, isLoading: true }
            return state;
        case FETCH_MEMBERCOINS_SUCCESS:
            state = { ...state, [action.payload.key]: action.payload.data, isLoading: false };
            return state;
        case FETCH_MEMBERCOINS_REJECTED:
            state = { ...state, isLoading: false, error: { [action.payload.key]: action.payload.data } }
            return state;
        case UPDATE_COINDETAILS:
            return { ...state, coinDetailData: action.payload };
        case UPDATE_SELLSAVEOBJECT:
            return { ...state, sellsaveObject: action.payload }
        case HANDLE_FETCH:
            state = { ...state, [action.payload.key]: action.payload };
            return state;
        case HANDLE_COINS_FETCH:
            state = { ...state, coins: { ...state.coins, [action.payload.key]: { loading: action.payload.loading, data: action.payload.data } } };
            return state;
        case SET_WALLET:
            state = { ...state, selectedWallet: action.payload };
            return state;
        case SET_COIN_WALLET:
            state = { ...state, coinWallet: action.payload };
            return state;
        case SET_EXCHANGE_VALUE:
            state = { ...state, exchangeValues: { ...state.exchangeValues, [action.payload.key]: action.payload.value } };
            return state;
        default:
            return state;
    }
}
export default buyReducer;
export { setExchangeValue, getMemberCoins, updateCoinDetails, updatesellsaveObject, fetchCoins, fetchSelectedCoinDetails, fetchMemberFiat, fetchPreview, setWallet, setCoinWallet }