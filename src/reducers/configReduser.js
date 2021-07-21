const USEER_INFO = "userInfo";

const userInfo = (payload) => {
    return {
        type: USEER_INFO,
        payload
    }
};


let initialState = {
    userProfileInfo:null
};
const UserConfig = (state = initialState, action) => {
    switch (action.type) {
        case USEER_INFO:
            state = { ...state, userProfileInfo: action.payload }
            return state;
        default:
            return state;
    }
}

export default UserConfig;
export { userInfo };