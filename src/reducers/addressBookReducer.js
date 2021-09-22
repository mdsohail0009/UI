import { favouriteFiatAddress } from "../components/addressbook.component/api";
const SET_STEP = "setStep";
const CLEAR_STEP = "clearStep";
const FETCH_ADDRESS = 'fetchAddress';
const setStep = (payload) => {
    return {
        type: SET_STEP,
        payload
    }
}
const clearStep = (payload) => {
    return {
        type: CLEAR_STEP,
        payload
    }
}
const fetchAddress = (payload) => {
    return {
        type: FETCH_ADDRESS,
        payload
    }
}
const handleFavouritAddress = () => {
    return async (dispatch) => {
        dispatch(fetchAddress({ key: "favouriteAddress", loading: true, data: [] }));
        const response = await favouriteFiatAddress();
        if (response.ok) {
            dispatch(fetchAddress({ key: "favouriteAddress", loading: false, data: response.data, error: null }))
        } else {
            dispatch(fetchAddress({ key: "favouriteAddress", loading: false, data: [], error: response.originalError }))
        }
    }
}
let initialState = {
    favouriteAddress:[],
    stepcode: "step1",
    stepTitles: {
        newaddress: "suissebase_personal",
        fiataddress:"",
    },
    stepSubTitles: {
        newaddress: "avail_wallet_weprovide",
        fiataddress:"",
       
    }

}
const AddressBookReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_STEP:
            state = { ...state, stepcode: action.payload };
            return state;
        case CLEAR_STEP:
            state = { ...state, stepcode: action.payload };
            return state;
        case FETCH_ADDRESS:
            state = { ...state, [action.payload.key]: { data: action.payload.data, error: action.payload.error, loading: action.payload.loading } }
            return state;
        default:
            return state;
    }

}
export default AddressBookReducer;
export { setStep, clearStep ,handleFavouritAddress}