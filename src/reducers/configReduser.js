import apiCalls from "../api/apiCalls";
import { setNotificationCount } from "./dashboardReducer";

const USEER_INFO = "userInfo";
const UPDATE_DOC_REQUEST = "updateDocRequest";
const userInfo = (payload) => {
    return {
        type: USEER_INFO,
        payload
    }
};
const updateDocRequest = (payload) => {
    return {
        type: UPDATE_DOC_REQUEST,
        payload
    }
};
const getmemeberInfo = (useremail) => {
    return async (dispatch) => {
        apiCalls.getMember(useremail).then((res) => {
            if(res.ok){
            dispatch(userInfo(res.data));
            dispatch(setNotificationCount(res.data?.unReadCount))
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
            case UPDATE_DOC_REQUEST:
                state = { ...state, userProfileInfo: {...state.userProfileInfo,isDocsRequested:action.payload} }
                return state;
        default:
            return state;
    }
}

export default UserConfig;
export { userInfo, getmemeberInfo,updateDocRequest };