const SET_STEP_CODE = "setStepcode";
const CLEAR_STEP = "clearStep"

const setStepcode = (payload) => {
    return {
        type: SET_STEP_CODE,
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
    stepcode: null
}

const TransforReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_STEP_CODE:
            return { ...state, stepcode: action.payload };
        case CLEAR_STEP:
            return { ...state, stepcode: action.payload };
        default:
            return state;
    }
}

export default TransforReducer;
export { setStepcode }