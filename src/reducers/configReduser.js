import apiCalls from "../api/apiCalls";
import { setNotificationCount } from "./dashboardReducer";
const USEER_INFO = "userInfo";
const UPDATE_DOC_REQUEST = "updateDocRequest";
const FETCH_TRACK_AUDITLOGS = "fetchtrackauditlogs";
const CLEAR_USER_INFO = "clearUserInfo";
const UPDATE_TWOFACTOR = "updatetwofactor";
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
const updatetwofactor = (payload) => {
    return {
        type: UPDATE_TWOFACTOR,
        payload
    }
};
const clearUserInfo = () => {
    return { type: CLEAR_USER_INFO, payload: null }
}
const getmemeberInfo = () => {
    return async (dispatch) => {
        apiCalls.getMember().then((res) => {
            if (res.ok) {
                dispatch(userInfo(res.data));
                dispatch(setNotificationCount(res.data?.unReadCount))
                dispatch(updatetwofactor({ loading: false, isEnabled: res.data.twofactorVerified }));
              
            }
        });
    }
}

const getIpRegisteryData = () => {
    return async (dispatch) => {
        await apiCalls.getIpRegistery().then((res) => {
            var userAgent = window?.navigator?.userAgent;
            var Browser = userAgent?.match(/(chrome|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)[1];
            var version = userAgent?.match(/(chrome|firefox|msie|trident(?=\/))\/?\s*(\d+)/i)[2];
            var osRegex = /(Windows NT|Mac OS X|Linux|iPhone|iPad|iPod|Android)[^\s;)]*/i;
            var osMatch = userAgent?.match(osRegex);    
            var operatingSystem = osMatch ? osMatch[0] : "Unknown";
            const start = userAgent.indexOf('(') + 1;
            const end = userAgent.indexOf(')');
            const deviceInfo = userAgent.substring(start, end);
            const deviceName = deviceInfo.split(';')[0].trim();
            if (res.ok) {
                let ipInfo = {
                    "Ip": res.data.ip,
                    "Location": {
                        "countryName": res.data?.country_name,
                        "state": res.data.region_name,
                        "city": res.data?.city,
                        "postal": res.data?.zip,
                        "latitude": res.data?.latitude,
                        "longitude": res.data?.longitude
                    },
                    "Browser": Browser,
                    "DeviceType": {
                        "name": deviceName,
                        "type": res.data?.type,
                        "version":operatingSystem + " " + version
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
    twoFA: { loading: true, isEnabled: false }
};
const UserConfig = (state = initialState, action) => {
    switch (action.type) {
        case USEER_INFO:
            state = { ...state, userProfileInfo: action.payload }
            return state;
        case UPDATE_DOC_REQUEST:
            state = { ...state, userProfileInfo: { ...state.userProfileInfo, isDocsRequested: action.payload } }
            return state;
        case UPDATE_TWOFACTOR:
            if (typeof action.payload == "boolean")
                state = { ...state, userProfileInfo: { ...state.userProfileInfo, twofactorVerified: action.payload } }
            else
                state = { ...state, twoFA: { loading: action.payload.loading, isEnabled: action.payload.isEnabled } }
            return state;
        case FETCH_TRACK_AUDITLOGS:
            state = { ...state, trackAuditLogData: action.payload }
            return state;
        case CLEAR_USER_INFO:
            state = { userProfileInfo: null, trackAuditLogData: {} };
            return state;
        default:
            return state;
    }
}

export default UserConfig;
export { userInfo, getmemeberInfo, updateDocRequest, getIpRegisteryData, fetchtrackauditlogs, clearUserInfo, updatetwofactor };