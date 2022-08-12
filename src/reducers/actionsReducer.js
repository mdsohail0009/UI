const SET_CURRENT_ACTION = "setCurrentAction";

const setCurrentAction = (payload) => {
    return {
        type: SET_CURRENT_ACTION,
        payload
    }
}

const initialValues = {
    action: null
}

const currentActionReducer = (state = initialValues, action) => {
    switch (action.type) {
        case SET_CURRENT_ACTION:
            state = { ...state, action: action.payload };
            return state;
        case "removeCurrentAction":
            state = { ...state, action: null };
            return state;
        default:
            return state;
    }
}
export default currentActionReducer;
export { setCurrentAction }