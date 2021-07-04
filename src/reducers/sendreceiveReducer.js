const SET_STEP = "setStep";
const CLEAR_STEP = "clearStep";
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
let initialState = {
    stepcode: "step1",
    stepTitles: {
        depositecrypto: "deposit",
        withdraw: 'withdraw',
        scanner: 'deposit',
        withdrawaddress: 'withdraw',

    },
    stepSubTitles: {
        depositecrypto: "select_a_currency",
        withdraw: 'select_a_currency',
        scanner: 'usd_available',
        withdrawaddress: 'send_wallet_fiat',

    }
}
const sendReceiveReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_STEP:
            state = { ...state, stepcode: action.payload };
            return state;
        case CLEAR_STEP:
            state = { ...state, stepcode: action.payload };
            return state;
        default:
            return state;
    }

}
export default sendReceiveReducer;
export { setStep, clearStep }