const SET_STEP = "setStep";
const CLEAR_STEP = "clearStep";
const CHANGE_STEP = "changeStep"
const SET_TAB = "setTab";
const SET_HEADER_TAB = "setHeaderTab";
const SET_SELL_HEADER_HIDE = "setSellHeaderHide";
const SET_SELECTED_SELL_COIN = "setSelectedSellCoin";

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
const setHeaderTab = (payload) => {
    return {
        type: SET_HEADER_TAB,
        payload
    }
}
const setSellHeaderHide = (payload) => {
    return {
        type: SET_SELL_HEADER_HIDE,
        payload
    }
}
const setSelectedSellCoin = (payload) => {
    return {
        type: SET_SELECTED_SELL_COIN,
        payload
    }
}

let initialState = {
    stepcode: "step1",
    stepTitles: {
        buycrypto: "buy_assets",
        sellcrypto: "sell_assets",
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
        selectcrypto: null,
        summary: "crypto_compare_val",
        billtype: "select_from_below",
        addcard: null,
        depositcrypto: "select_a_currency",
        billingaddress: null,
        addressscanner: "select_a_currency",
        depositfiat: "select_a_currency",
        selectedcrypto: null,
        sellsummary: "confirm_sell",
        wiretransfor: "select_a_method"
    },
    tabKey: 1,
    headerTab:"",
    sellHeader: null,
    selectedSellCoin: null
}
const buySellReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_STEP:
            return { ...state, stepcode: action.payload };
        case CHANGE_STEP:
            return { ...state, stepcode: action.payload };
        case CLEAR_STEP:
            return { ...state, stepcode: action.payload };
        case SET_TAB:
            return { ...state, tabKey: action.payload };
        case SET_HEADER_TAB:
            return { ...state, headerTab: action.payload };
        case SET_SELL_HEADER_HIDE:
            return { ...state, sellHeader: action.payload };
        case SET_SELECTED_SELL_COIN:
                return { ...state, selectedSellCoin: action.payload };
        default:
            return state;
    }

}
export default buySellReducer;
export { setStep, clearStep, changeStep, setTab,setHeaderTab, setSellHeaderHide, setSelectedSellCoin }