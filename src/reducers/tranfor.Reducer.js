const SET_STEP_CODE = "setStepcode";
const CLEAR_STEP = "clearStep";
const SET_TRANSFOR_OBJ = "setTransforObj";

const setStepcode = (payload) => {
    return {
        type: SET_STEP_CODE,
        payload
    }
}
const setTransforObj = (payload) => {
    return {
        type: SET_TRANSFOR_OBJ,
        payload
    }
}
// const clearStep = (payload) => {
//     return {
//         type: CLEAR_STEP,
//         payload
//     }
// }




let initialState = {
    stepcode: null,
    stepTitles: {
        tranforcoin: "transfor_title",
        tranforsummary: 'transfor_title',
        tranforsuccess: 'transfor_title',
    },
    stepSubTitles: {
        tranforcoin: "transfor_desc",
        tranforsummary: 'transfor_desc',
        tranforsuccess: '',
    },
    transforObj:null
}

const TransforReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_STEP_CODE:
            return { ...state, stepcode: action.payload };
        case SET_TRANSFOR_OBJ:
            return { ...state, transforObj: action.payload };
        case CLEAR_STEP:
            return { ...state, stepcode: action.payload };
        default:
            return state;
    }
}

export default TransforReducer;
export { setStepcode, setTransforObj}