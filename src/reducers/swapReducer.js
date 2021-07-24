const SET_STEP = "setStep";
const CLEAR_STEP = "clearStep"
const UPDATE_COINDETAILS = "updateCoinDetails";
const UPDATE_RECEIVECOINDETAILS = "updateReceiveCoinDetails";

const setStep = (payload) => {
    return {
        type: SET_STEP,
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


let initialState = {
    stepcode: 'step1',
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
    coinDetailData: {},
    coinReceiveDetailData: {}

}

const SwapReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_STEP:
            state = { ...state, stepcode: action.payload };
            return state;
        case CLEAR_STEP:
            state = { ...state, stepcode: action.payload };
            return state;
        case UPDATE_COINDETAILS:
            return { ...state, coinDetailData: action.payload };
        case UPDATE_RECEIVECOINDETAILS:
            return { ...state, coinReceiveDetailData: action.payload };
        default:
            return state;
    }
}

export default SwapReducer;
export { setStep, clearStep , updateCoinDetails , updateReceiveCoinDetails }