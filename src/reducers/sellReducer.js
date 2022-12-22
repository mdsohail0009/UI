import api from '../api/apiCalls';
const HANDLE_API_FETCH = "handleFetch";
const UPDATE_COINDETAIL = "updateCoinDetail";
const UPDATE_SELLSAVEOBJECT = 'updatesellsaveObject';
const SET_SELL_FINAL_RES = "setSellFinalRes"

const handleApiFetch = (payload) => {
    return {
        type: HANDLE_API_FETCH,
        payload
    }
}
const setSellFinalRes = (payload) => {
    return {
        type: SET_SELL_FINAL_RES,
        payload
    }
}
const updateCoinDetailValue = (payload) => {
    return {
        type: UPDATE_COINDETAIL,
        payload
    }
}
const updatesellsaveObject = (payload) => {
    return { type: UPDATE_SELLSAVEOBJECT, payload }
}
const getMemberCoins = () => {
    return async dispatch => {
        dispatch(handleApiFetch({ key: "memberCoins", loading: true, data: [] }));
        const response = await api.sellMemberCrypto();
        if (response.ok) {
            dispatch(handleApiFetch({ data: response.data, loading: false, key: 'memberCoins' }));
        } else {
            dispatch(handleApiFetch({ data: null, error: response.data || response.originalError.message, loading: false, key: 'memberCoins' }));
        }
    }
}
const updateCoinDetail = (data) => {
    return (dispatch) => {
        dispatch(updateCoinDetailValue(data))
    }
}
const initialState = {
    memberCoins: {},
    memberFiat: {},
    coinDetailData: {},
    coinWallet: {},
    exchangeValues: {},
    sellsaveObject: {},
    sellFinalRes: {}
}

const sellReducer = (state = initialState, action) => {
    switch (action.type) {
        case HANDLE_API_FETCH:
            state = { ...state, [action.payload.key]: action.payload };
            return state;
        case UPDATE_COINDETAIL:
            state = { ...state, coinDetailData: action.payload };
            return state;
        case UPDATE_SELLSAVEOBJECT:
            return { ...state, sellsaveObject: action.payload }
        case SET_SELL_FINAL_RES:
            return { ...state, sellFinalRes: action.payload }
        default:
            return state;
    }

}

export default sellReducer;
export { getMemberCoins, updateCoinDetail, updatesellsaveObject, setSellFinalRes }