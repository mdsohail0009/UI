const { USER_FOUND, USER_EXPIRING, USER_EXPIRED, SILENT_RENEW_ERROR } = require("redux-oidc");
const USER_LOG_OUT = "userLogout";
const USER_TOKEN = "userToken";
const GET_PROFILE_SUCCESS = "getProfileSuccess";
const SET_DEVICE_TOKEN = "setDeviceToken";
const userLogout = () => {
    return {
        type: USER_LOG_OUT
    }
};
const userToken = (payload) => {
    return {
        type: USER_TOKEN,
        payload

    }
};
const profileSuccess = (info) => {
    return {
        type: GET_PROFILE_SUCCESS,
        payload: info
    }
}
const setToken = (payload) => {
    return {
        type: SET_DEVICE_TOKEN,
        payload
    }
}
let initialState = {
    user: null,
    token:null,
    deviceToken: null,
    isLogout: false
};
const authReducer = (state = initialState, action) => {
    switch (action.type) {
        case USER_FOUND:
            state = {...state, user: action.payload,isLogout:false }
            return state;
        case USER_EXPIRING:
            return state;
        case USER_LOG_OUT:
            state = {...state, user: null, profile: null,isLogout:true,deviceToken:null };
            return state;
            case USER_TOKEN:
                state = {...state, token: action.payload};
                return state;
        case USER_EXPIRED:
                state = {...state, user: null, profile: null };
                return state;
        case GET_PROFILE_SUCCESS:
            state = {...state, profile: action.payload };
            return state;
        case SET_DEVICE_TOKEN:
            state = {...state, deviceToken: action.payload };
            return state;
        case SILENT_RENEW_ERROR:
            console.log("Silent renew error : " + action.payload);
            return state;
        default:
            return state;
    }
}

export default authReducer;
export { userLogout, profileSuccess, setToken,userToken};