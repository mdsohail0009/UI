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
        faitsummary: '',
        selectfiat: "suissebase_personal",
        addcard: 'link_newcard',
        selectwallet: 'withdraw',
        billingaddress: 'change_billing_address',
        fiatdeposit: 'Fiat_deposit',
        addAddress:'fiatAddress',
        withdrwalfiatsummary:'withdraw_fiat_summary',
        withdrwlive:'withdraw_live'
    },
    stepSubTitles: {
        buyfiat: "avail_wallet_weprovide",
        faitsummary: null,
        selectfiat: "wallet_in_usd",
        addcard: null,
        selectwallet: "select_wallet",
        billingaddress: null,
        fiatdeposit: null,
        addAddress:null
    }

}
const BuyFiatReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_STEP:
            state = { ...state, stepcode: action.payload };
            return state;
        case CLEAR_STEP:
            return { ...state, stepcode: action.payload };
        default:
            return state;
    }

}
export default BuyFiatReducer;
export { setStep, clearStep }