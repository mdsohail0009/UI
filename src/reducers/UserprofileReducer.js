
const UPDATE_CHANGE = "updatechange";
const CLEARVALUES="clearvalues";
const WITHDRAWVERIFYOBJ="withdrawVerifyObj"
const updatechange = (payload) => {
    return {
        type: UPDATE_CHANGE,
        payload
    }
}
const clearvalues=(payload)=>{
    return {
        type: CLEARVALUES,
        payload
    }
}
const withdrawVerifyObj=(payload)=>{
    return{
        type:WITHDRAWVERIFYOBJ,
        payload
    }
}
const initialState = {
   isNew:false,
   withdrawVerifyObj:{}
}

const UserprofileReducer = (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_CHANGE:
            state = { ...state, isNew: true };
            return state;
        case clearvalues:
            state = { ...state, isNew: false };
            return state;
            case WITHDRAWVERIFYOBJ:
                state = { ...state, withdrawVerifyObj: action.payload };
                return state;   
        default:
            return state;
    }

}

export default UserprofileReducer;
export { updatechange,withdrawVerifyObj }