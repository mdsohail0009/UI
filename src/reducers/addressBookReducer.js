import { favouriteFiatAddress, getSelectedCoinDetails, getAddress } from "../components/addressbook.component/api";
const SET_ADDRESS_STEP = "setAddressStep";
const CLEAR_STEP = "clearStep";
const FETCH_ADDRESS = 'fetchAddress';
const HANDLE_FETCH = 'handleFetch';
const SET_COIN = "setCoin";
const SET_EXCHANGE_VALUE = "setExchangeValue";
const REJECT_COIN = 'rejectCoin';
const FETCH_USERSID_UPDATE = 'fetchUsersIdUpdate';

const handleFetch = (payload) => {
    return { type: HANDLE_FETCH, payload }
}
const setCoin = (payload) => {
    return {
        type: SET_COIN,
        payload
    }
}
const setAddressStep = (payload) => {
    return {
        type: SET_ADDRESS_STEP,
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
const setExchangeValue = (payload) => {
    return {
        type: SET_EXCHANGE_VALUE,
        payload
    }
}
const rejectCoin = (payload) => {
    return {
        type: REJECT_COIN,
        payload
    }
}
const fetchUsersIdUpdate = (payload) => {
    return {
        type: FETCH_USERSID_UPDATE,
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
const fetchSelectedCoinDetails = (coin, member_id) => {
    return async (dispatch) => {
        dispatch(handleFetch({ key: "selectedCoin", loading: true, data: null }));
        const response = await getSelectedCoinDetails(coin, member_id);
        if (response.ok) {
            dispatch(handleFetch({ key: "selectedCoin", loading: false, data: response.data }));
        } else {
            dispatch(handleFetch({ key: "selectedCoin", loading: false, data: null, error: response.originalError.message }));
        }
    }
}
const fetchGetAddress = (member_id, type) => {
    return async (dispatch) => {
        dispatch(handleFetch({ key: "getAddress", loading: true, data: [] }));
        const response = await getAddress(member_id,type);
        if (response.ok) {
            dispatch(handleFetch({ key: "getAddress", loading: false, data: response.data }));
        } else {
            dispatch(handleFetch({ key: "getAddress", loading: false, data: [], error: response.originalError.message }));
        }
    }
}

let initialState = {
    selectedCoin: {},
    favouriteAddress: [],
    coinWallet: {},
    selectedRowData:{},
    exchangeValues: {},
    getAddress: { loading: false, data: [] },
    stepcode: "step1",
    stepTitles: {
        newaddress: "suissebase_personal",
        fiataddress: "",
    },
    stepSubTitles: {
        newaddress: "avail_wallet_weprovide",
        fiataddress: "",

    }

}
const AddressBookReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ADDRESS_STEP:
            state = { ...state, stepcode: action.payload };
            return state;
        case CLEAR_STEP:
            state = { ...state, stepcode: action.payload };
            return state;
        case FETCH_ADDRESS:
            state = { ...state, [action.payload.key]: { data: action.payload.data, error: action.payload.error, loading: action.payload.loading } }
            return state;
        case HANDLE_FETCH:
            state = { ...state, [action.payload.key]: { ...state[action.payload.key], ...action.payload } };
            return state;
        case SET_COIN:
            state = { ...state, coinWallet: action.payload };
            return state;
        case REJECT_COIN:
            state = { ...state, coinWallet: {} };
            return state;
        case SET_EXCHANGE_VALUE:
            state = { ...state, exchangeValues: { ...state.exchangeValues, [action.payload.key]: action.payload.value } };
            return state;
        case FETCH_USERSID_UPDATE:
            state = { ...state, selectedRowData: action.payload }
        default:
            return state;
    }

}
export default AddressBookReducer;
export { setAddressStep, clearStep, setCoin, handleFavouritAddress, fetchSelectedCoinDetails, setExchangeValue, rejectCoin,fetchUsersIdUpdate, fetchGetAddress}