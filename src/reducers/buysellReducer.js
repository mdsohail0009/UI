const SET_STEP = "setStep";
const CLEAR_STEP = "clearStep";
const CHANGE_STEP = "changeStep"
const SET_TAB = "setTab";
const setStep = (payload) => {
    return {
        type: SET_STEP,
        payload
    }
}
const setTab = (payload) => {
    return {
        type: SET_TAB,
        payload
    }
}
const changeStep = (payload) => {
    return {
        type: CHANGE_STEP,
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
        buycrypto: "buy_assets",
        selectcrypto: "selected_crypto",
        summary: "selected_crypto",
        billtype: "link_a_card",
        addcard: "credit_card",
        depositcrypto: "deposit",
        billingaddress: "change_billing_address",
        addressscanner: "deposit",
        depositfiat: "deposit",
        selectedcrypto: "sell_btc",
        sellsummary: "sell_btc",
        wiretransfor: "wire_transfer"
    },
    stepSubTitles: {
        buycrypto: null,
        selectcrypto: "crypto_compare_val",
        summary: "crypto_compare_val",
        billtype: "select_from_below",
        addcard: null,
        depositcrypto: "select_a_currency",
        billingaddress: null,
        addressscanner: "select_a_currency",
        depositfiat: "select_a_currency",
        selectedcrypto: "sell_compare_val",
        sellsummary: "confirm_sell",
        wiretransfor: "select_a_method"
    },
    tabKey: 1
}
const buySellReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_STEP:
            state = { ...state, stepcode: action.payload };
            return state;
        case CHANGE_STEP:
            state = { ...state, stepcode: action.payload };
            return state;
        case CLEAR_STEP:
            state = { ...state, stepcode: action.payload };
            return state;
        case SET_TAB:
            state = { ...state, tabKey: action.payload };
            return state;
        default:
            return state;
    }

}
export default buySellReducer;
export { setStep, clearStep, changeStep,setTab }