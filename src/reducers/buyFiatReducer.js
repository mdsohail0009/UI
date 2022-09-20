const SET_STEP = "setStep";
const CLEAR_STEP = "clearStep";
const SET_SUB_TITLE = "setSubTitle";
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
const setSubTitle = (payload) => {
    return {
      type: SET_SUB_TITLE,
      payload
    };
  };
let initialState = {
    stepcode: "step1",
    stepTitles: {
        buyfiat: "suissebase_personal",
        faitsummary: 'confirm_transaction',
        FaitDepositSummary: null,
        addcard: 'link_newcard',
        selectwallet: 'withdraw',
        billingaddress: 'change_billing_address',
        fiatdeposit: 'Fiat_deposit',
        addAddress: 'fiatAddress',
        withdrwalfiatsummary: 'withdraw_fiat_summary',
        withdrwlive: 'withdraw_live',
        withdrawfaitsummary: 'withdraw_fiat_summary'
    },
    stepSubTitles: {
        buyfiat: "avail_wallet_weprovide",
        faitsummary: null,
        FaitDepositSummary: null,
        addcard: null,
        selectwallet: "select_wallet",
        billingaddress: null,
        fiatdeposit: null,
        addAddress: null,
        withdrawfaitsummary: null
    }

}
const BuyFiatReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_STEP:
            return { ...state, stepcode: action.payload };
        case CLEAR_STEP:
            return { ...state, stepcode: action.payload };
        default:
            return state;
    }

}
export default BuyFiatReducer;
export { setStep, clearStep, setSubTitle }