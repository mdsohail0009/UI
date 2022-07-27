import { getFeaturePermissions, getFeatures } from "../components/shared/permissions/api";

const SET_DATA = "setData";
const GET_DATA = "getData";
const UPDATE_PERMISSIONS = "updatePermissions";
const CLEAR_PERMISSIONS = "clearPermissions";



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







const fetchFeatures = (app_id, customer_id) => {

    return async dispatch => {
        dispatch(getData({ data: [], error: null, loading: true, key: "features" }));
        const response = await getFeatures(app_id, customer_id);
        if (response.ok) {
            dispatch(setData({ data: response.data, error: null, key: "features", loading: false }));
        } else {
            setData({ data: null, loading: false, error: response.data?.message || response.data || response.originalError.message, key: "features" });
        }

    }

}
const fetchFeaturePermissions = (feature_id) => {

    return async dispatch => {
        dispatch(getData({ data: [], error: null, loading: true, key: "featurePermissions" }));
        const response = await getFeaturePermissions({ feature_id });
        if (response.ok) {
            dispatch(setData({ [response.data?.key]: response.data, error: null, key: "featurePermissions", loading: false }));
        } else {
            setData({ data: null, loading: false, error: response.data?.message || response.data || response.originalError.message, key: "featurePermissions" });
        }

    }

}





let initialState = {
    features: { loading: false, data: [], error: null },
    featurePermissions: { loading: false, data: [], error: null }

}

const featuresReducer = (state = initialState, action) => {

    switch (action.key) {
        case GET_DATA:
            state = { ...state, [action.payload.key]: { ...action.payload } };
            return state;
        case SET_DATA:
        case GET_DATA:
            state = { ...state, [action.payload.key]: { ...action.payload } };
            return state;
        default:
            return state;
    }
}

export default featuresReducer;
export { fetchFeatures, fetchFeaturePermissions };