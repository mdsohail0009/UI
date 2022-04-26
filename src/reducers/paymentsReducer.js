const SET_STEP = "setStep";
const CLEAR_STEP = "clearStep";
const CHANGE_STEP = "changeStep"
const SET_TAB = "setTab";
const SET_HEADER_TAB = "setHeaderTab";

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
let initialState = {
    stepcode: "step1",
    stepTitles: {
        newBeneficiary: "add_new_beneficiary",
        kycDocuments: 'kyc_documents',
        successMsg: null
    },
    stepSubTitles: {
        newBeneficiary: null,
        kycDocuments: null,
        successMsg: null
    },
    tabKey: 1,
    headerTab:""
}
const payementsReducer = (state = initialState, action) => {
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
        default:
            return state;
    }

}
export default payementsReducer;
export { setStep, clearStep, changeStep, setTab,setHeaderTab }