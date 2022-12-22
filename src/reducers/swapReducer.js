import { getportfolio } from '../components/swap.component/api'
const SET_STEP = "setStep";
const CLEAR_STEP = "clearStep"
const UPDATE_COINDETAILS = "updateCoinDetails";
const UPDATE_RECEIVECOINDETAILS = "updateReceiveCoinDetails";
const UPDATE_FROMCOININPUTVALUE = "updateFromCoinInputValue";
const FETCH_MEMBERCOINS_REJECTED = "fetchMemberCoinsRejected";
const FETCH_MEMBERCOINS_SUCCESS = "fetchMemberCoinsSuccess";
const FETCH_MEMBERCOINS = "fetchMemberCoins";
const UPDATE_SWAPDATA = "updateSwapdata";
const CLEAR_SWAPDATA = "clearSwapData";
const SET_SWAP_FINAL_RES = "setSwapFinalRes";

const setStep = (payload) => {
    return {
        type: SET_STEP,
        payload
    }
}
const setSwapFinalRes = (payload) => {
    return {
        type: SET_SWAP_FINAL_RES,
        payload
    }
}
const clearStep = (payload) => {
    return {
        type: CLEAR_STEP,
        payload
    }
}
const updateCoinDetails = (payload) => {
    return { type: UPDATE_COINDETAILS, payload }
}
const updateReceiveCoinDetails = (payload) => {
    return { type: UPDATE_RECEIVECOINDETAILS, payload }
}

const updateFromCoinInputValue = (payload) => {
    return { type: UPDATE_FROMCOININPUTVALUE, payload }
}
const updateSwapdata = (payload) => {

    return { type: UPDATE_SWAPDATA, payload }
}
const fetchMemberCoins = () => {
    return { type: FETCH_MEMBERCOINS };
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
const clearSwapData = (paylaod) => {
    return {
        type: CLEAR_SWAPDATA,
        payload: {...initialState,stepcode:null}
    }
}

const getMemberCoins = () => {
    return async (dispatch) => {
        dispatch(fetchMemberCoins());
        const response = await getportfolio();
        if (response.ok) {
            dispatch(fetchMemberCoinsSuccess(response.data, 'MemberCoins'));
        } else {
            dispatch(fetchMemberCoinsRejected(response.data));
        }
    }
}

let initialState = {
    stepcode: null,
    stepTitles: {
        swapcoins: "swap_title",
        selectcrypto: 'swap_title',
        swapsummary: 'swap_title',
        toreceive: 'swap_title'
    },
    stepSubTitles: {
        swapcoins: "swap_desc",
        selectcrypto: 'swap_desc',
        swapsummary: 'swap_desc',
        toreceive: 'swap_desc'
    },
    swapdata: {
        fromCoin: null,
        receiveCoin: null,
        price: null,
        fromValue: null,
        receiveValue: null,
        errorMessage: null
    },
    coinDetailData: {},
    coinReceiveDetailData: {},
    fromCoinInputValue: null,
    isLoading: true,
    MemberCoins: [],
    swapFinalRes: {}
}

const SwapReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_STEP:
            return { ...state, stepcode: action.payload };
        case CLEAR_STEP:
            return { ...state, stepcode: action.payload };
        case UPDATE_COINDETAILS:
            return { ...state, coinDetailData: action.payload };
        case UPDATE_RECEIVECOINDETAILS:
            return { ...state, coinReceiveDetailData: action.payload };
        case UPDATE_FROMCOININPUTVALUE:
            return { ...state, fromCoinInputValue: action.payload };
        case UPDATE_SWAPDATA:
            return { ...state, swapdata: action.payload };
        case FETCH_MEMBERCOINS:
            state = { ...state, isLoading: true }
            return state;
        case FETCH_MEMBERCOINS_SUCCESS:
            state = { ...state, [action.payload.key]: action.payload.data, isLoading: false };
            return state;
        case FETCH_MEMBERCOINS_REJECTED:
            state = { ...state, isLoading: false, error: { [action.payload.key]: action.payload.data } }
            return state;
        case CLEAR_SWAPDATA:
            state = { ...initialState }
            return state;
        case SET_SWAP_FINAL_RES:
            return { ...state, swapFinalRes: action.payload };
        default:
            return state;
    }
}

export default SwapReducer;
export { setStep, clearStep, updateCoinDetails, updateReceiveCoinDetails, updateFromCoinInputValue, getMemberCoins, updateSwapdata, clearSwapData, setSwapFinalRes }