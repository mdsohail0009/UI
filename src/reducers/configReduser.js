import apiCalls from "../api/apiCalls";
import { setNotificationCount } from "./dashboardReducer";

const USEER_INFO = "userInfo";
const UPDATE_DOC_REQUEST = "updateDocRequest";
const FETCH_TRACK_AUDITLOGS = "fetchtrackauditlogs";
const CLEAR_USER_INFO = "clearUserInfo";
const ADDRESS_TAB_UPDATE = "addressTabUpdate";
const userInfo = (payload) => {
    return {
        type: USEER_INFO,
        payload
    }
};
const fetchtrackauditlogs = (payload) => {
    return {
        type: FETCH_TRACK_AUDITLOGS,
        payload
    }
};
const updateDocRequest = (payload) => {
    return {
        type: UPDATE_DOC_REQUEST,
        payload
    }
};
const clearUserInfo = ()=>{
    return {type:CLEAR_USER_INFO,payload:null}
}
const getmemeberInfo = (useremail) => {
    return async (dispatch) => {
        apiCalls.getMember(useremail).then((res) => {
            if (res.ok) {
                dispatch(userInfo(res.data));
                dispatch(setNotificationCount(res.data?.unReadCount))
            }
        });
    }
}

const addressTabUpdate = (payload) => {
    debugger
    return {
        type: ADDRESS_TAB_UPDATE,
        payload
    }
}
const getIpRegisteryData = () => {
    return async (dispatch) => {
        apiCalls.getIpRegistery().then((res) => {
            if (res.ok) {
                let ipInfo = {
                    "Ip": res.data.ip,
                    "Location": {
                        "countryName": res.data.location.country.name,
                        "state": res.data.location.region.name.replace(/ā/g, 'a'),
                        "city": res.data.location.city,
                        "postal": res.data.location.postal,
                        "latitude": res.data.location.latitude,
                        "longitude": res.data.location.longitude
                    },
                    "Browser": res.data.user_agent.name,
                    "DeviceType": {
                        "name": res.data.user_agent.device.name,
                        "type": res.data.user_agent.os.type,
                        "version": res.data.user_agent.os.name + ' ' + res.data.user_agent.os.version
                    }
                }
                dispatch(fetchtrackauditlogs(ipInfo));
            }
        });
    }
}

let initialState = {
    userProfileInfo: null,
    trackAuditLogData: {},
    addressTab:false
};
const UserConfig = (state = initialState, action) => {
    switch (action.type) {
        case USEER_INFO:
            state = { ...state, userProfileInfo: action.payload }
            return state;
        case UPDATE_DOC_REQUEST:
            state = { ...state, userProfileInfo: { ...state.userProfileInfo, isDocsRequested: action.payload } }
            return state;
        case FETCH_TRACK_AUDITLOGS:
            state = { ...state, trackAuditLogData: action.payload }
            return state;
        case CLEAR_USER_INFO:
            state = { userProfileInfo: null, trackAuditLogData: {} };
            return state;
            case ADDRESS_TAB_UPDATE:
            return { ...state, addressTab: action.payload  }
        default:
            return state;
    }
}

export default UserConfig;
export { userInfo, getmemeberInfo, updateDocRequest, getIpRegisteryData,addressTabUpdate, fetchtrackauditlogs,clearUserInfo };