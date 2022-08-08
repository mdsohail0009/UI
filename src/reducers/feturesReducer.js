import { getFeaturePermissions, getFeatures } from "../components/shared/permissions/api";
import { store } from "../store";
const SET_DATA = "setData";
const GET_DATA = "getData";
const UPDATE_PERMISSIONS = "updatePermissions";
const CLEAR_PERMISSIONS = "clearPermissions";
const SET_SELECTED_FEATUREID = "setSelectedFeatureMenu";
const getData = (payload) => {
    return {
        type: GET_DATA,
        payload
    }
}
const setData = (payload) => {
    return {
        type: SET_DATA,
        payload
    }
}
const clearPermissions = () => {
    return {
        type: CLEAR_PERMISSIONS,
    }
}
const updatePermissions = (payload) => {
    return {
        type: UPDATE_PERMISSIONS,
        payload
    }
}
const setSelectedFeatureMenu = (payload) => {
    return {
        type: SET_SELECTED_FEATUREID,
        payload
    }
}
const fetchFeatures = (app_id, customer_id) => {
    return async (dispatch) => {
        dispatch(getData({ data: [], error: null, loading: true, key: "features" }));
        const response = await getFeatures(app_id, customer_id);
        if (response.ok) {
            let menu = [...response.data];
            for (let item of menu) {
                if (item.menuitemType === "dropdown") {
                    item.subMenu = menu.filter(menuItem => menuItem.parentId === item.id);
                }
            }
            const _cockpit = menu.find(item => (item.key == "cockpit" || item.path == "/cockpit"));
            menu = menu.filter(item => (!item.isTab && !["/cockpit", "/balances"].includes(item.path)));
            dispatch(setData({ data: menu, error: null, key: "features", loading: false }));
            if (_cockpit && window.location.pathname?.includes('cockpit')) {
                dispatch(setSelectedFeatureMenu(_cockpit.id))
            }
            const _userConfig = store.getState().userConfig.userProfileInfo;
            dispatch(fetchFeaturePermissions(_cockpit.id, _userConfig.id))
        } else {
            dispatch(setData({ data: null, loading: false, error: response.data?.message || response.data || response.originalError.message, key: "features" }));
        };

    }

}
const fetchFeaturePermissions = (feature_id, customer_id, callback) => {
    return async (dispatch) => {
        dispatch(getData({ data: [], error: null, loading: true, key: "featurePermissions" }));
        const response = await getFeaturePermissions({ feature_id, customer_id });
        if (response.ok) {
            dispatch(setData({ [response.data?.key || response.data?.screenName]: response.data, error: null, key: "featurePermissions", loading: false }));
        } else {
            dispatch(setData({ data: null, loading: false, error: response.data?.message || response.data || response.originalError.message, key: "featurePermissions" }));
        }
        if (callback)
            callback(response);
    }

}
const initialState = {
    features: { loading: true, data: [], error: null },
    featurePermissions: { loading: true, data: [], error: null,selectedScreenFeatureId: null  }

}
const featuresReducer = (state = initialState, action) => {

    switch (action.type) {

        case GET_DATA:
            state = { ...state, [action.payload.key]: { ...state[action.payload.key], ...action.payload } };
            return state;
        case SET_DATA:
            state = { ...state, [action.payload.key]: { ...state[action.payload.key], ...action.payload } };
            return state;
        case SET_SELECTED_FEATUREID:
            state = { ...state, featurePermissions: { ...state.featurePermissions, selectedScreenFeatureId: action.payload,  } };
            return state;
        case CLEAR_PERMISSIONS:
            state = { ...state, featurePermissions: { data: [], error: null, loading: true,selectedScreenFeatureId: null } };
            return state;
        default:
            return state;
    }
}

export default featuresReducer;
export { fetchFeatures, fetchFeaturePermissions, clearPermissions, updatePermissions, setSelectedFeatureMenu };