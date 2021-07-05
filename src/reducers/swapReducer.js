const SET_STEP = "setStep";
const CLEAR_STEP ="clearStep"

const setStep =(payload) => {
    return{
        type:SET_STEP,
        payload
    }
}

const clearStep =(payload) => {
    return{
        type:CLEAR_STEP,
        payload
    }
}

let initialState ={
   stepcode:'step1' ,
   stepTitles:"",
   stepSubTitles:""
}

const SwapReducer =(state = initialState, action ) =>{
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

export default SwapReducer;
export {setStep, clearStep }