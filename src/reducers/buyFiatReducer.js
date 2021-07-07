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
        buyfiat: "suissebase_personal",
        selectfiat: "suissebase_personal",
        addcard: 'link_newcard',
        selectwallet: 'withdraw',
        faitsummary:'confirm_transaction',
        billingaddress:'withdraw'
    },
    stepSubTitles: {
        buyfiat: "avail_wallet_weprovide",
        selectfiat: "wallet_in_usd",
        addcard: null,
        selectwallet: "select_wallet",
        faitsummary:'confirm_transaction_decs',
        billingaddress:'withdraw'
    }

}
const BuyFiatReducer = (state = initialState, action) => {
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
export default BuyFiatReducer;
export { setStep, clearStep }