const SET_STEP = "setStep";
const CLEAR_STEP = "clearStep";
const SET_SUB_TITLE = "setSubTitle";
const SET_RECEIVE_FIAT_HEADER = "setReceiveFiatHead";
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
  const setReceiveFiatHead = (payload) => {
    return {
      type: SET_RECEIVE_FIAT_HEADER,
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
        fiatdeposit: 'withdrawFiat',
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
    },
    receiveFiatHeader: null

}
const BuyFiatReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_STEP:
            return { ...state, stepcode: action.payload };
        case CLEAR_STEP:
            return { ...state, stepcode: action.payload };
        case SET_RECEIVE_FIAT_HEADER:
            return { ...state, receiveFiatHeader: action.payload }
        default:
            return state;
    }

}
export default BuyFiatReducer;
export { setStep, clearStep, setSubTitle, setReceiveFiatHead }