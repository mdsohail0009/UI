import apiCalls from "../api/apiCalls";

const USEER_INFO = "userInfo";

const userInfo = (payload) => {
    return {
        type: USEER_INFO,
        payload
    }
};

const getmemeberInfo = (useremail) => {
    return async (dispatch) => {
        apiCalls.getMember(useremail).then((res) => {
            if(res.ok){
            dispatch(userInfo(res.data))
            }
        });
    }
}

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
export { userInfo, getmemeberInfo };