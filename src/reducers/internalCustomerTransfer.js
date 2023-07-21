
const SET_SELECTED_WALLET= "selectedWallet";
const SET_SUMMARY_DETAILS= "summaryDetails";

const setSelectedWallet = (payload) => {
    return {
        type: SET_SELECTED_WALLET,
        payload
    }
}
const setSummaryDetails = (payload) => {
    return {
        type: SET_SUMMARY_DETAILS,
        payload
    }
}
let initialState = {
    selectedWallet: null,
    summaryDetails:null,
}
const internalCustomerTransfer = (state = initialState, action) => {
    switch (action.type) {
        case SET_SELECTED_WALLET:
            return { ...state, selectedWallet: action.payload };
        case SET_SUMMARY_DETAILS:
            return { ...state, summaryDetails: action.payload };
        default:
            return state;
    }

}
export default internalCustomerTransfer;
export { setSelectedWallet,setSummaryDetails }