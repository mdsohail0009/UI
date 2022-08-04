import { favouriteFiatAddress, getSelectedCoinDetails, getAddress } from "../components/addressbook.component/api";
const SET_ADDRESS_STEP = "setAddressStep";
const CLEAR_STEP = "clearStep";
const FETCH_ADDRESS = 'fetchAddress';
const HANDLE_FETCH = 'handleFetch';
const SET_COIN = "setAddressCoin";
const SET_EXCHANGE_VALUE = "setExchangeValue";
const REJECT_COIN = 'rejectCoin';
const CLEAR_VALUES = 'clearValues';
const FETCH_USERSID_UPDATE = 'fetchUsersIdUpdate';
const FETCH_ADDRESS_CRYPTO = 'fetchAddressCrypto';
const CLEAR_CRYPTO_VALUES = 'clearCryptoValues';
const ADDRESS_TAB_UPDATE = "addressTabUpdate";
const WITHDRAW_FIAT_UPDATE = "withdrawfiatUpdate";
const SELECTED_TAB = "selectedTab"
const handleFetch = (payload) => {
    return { type: HANDLE_FETCH, payload }
}
const setAddressCoin = (payload) => {
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
const clearValues = (payload) => {
    return {
        type: CLEAR_VALUES,
        payload
    }
}
const clearCryptoValues = (payload) => {
    return {
        type: CLEAR_CRYPTO_VALUES,
        payload
    }
}
const fetchUsersIdUpdate = (payload) => {
    return {
        type: FETCH_USERSID_UPDATE,
        payload
    }
}
const selectedTab = (payload) => {
    return {
        type: SELECTED_TAB,
        payload
    }
}
const fetchAddressCrypto = (payload) => {
    return {
        type: FETCH_ADDRESS_CRYPTO,
        payload
    }
}
const addressTabUpdate = (payload) => {

    return {
        type: ADDRESS_TAB_UPDATE,
        payload
    }
}
const withdrawfiatUpdate = (payload) => {

    return {
        type: WITHDRAW_FIAT_UPDATE,
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
const fetchSelectedCoinDetails = (coin, customer_id) => {
    return async (dispatch) => {
        dispatch(handleFetch({ key: "selectedCoin", loading: true, data: null }));
        const response = await getSelectedCoinDetails(coin, customer_id);
        if (response.ok) {
            dispatch(handleFetch({ key: "selectedCoin", loading: false, data: response.data }));
        } else {
            dispatch(handleFetch({ key: "selectedCoin", loading: false, data: null, error: response.originalError.message }));
        }
    }
}
const fetchGetAddress = (customer_id, type) => {
    return async (dispatch) => {
        dispatch(handleFetch({ key: "getAddress", loading: true, data: [] }));
        const response = await getAddress(customer_id, type);
        if (response.ok) {
            dispatch(handleFetch({ key: "getAddress", loading: false, data: response.data }));
        } else {
            dispatch(handleFetch({ key: "getAddress", loading: false, data: [], error: response.originalError.message }));
        }
    }
}

let initialState = {
    addressTab: false,
    withdrawTab: false,
    selectedCoin: {},
    favouriteAddress: [],
    coinWallet: null,
    selectedRowData: null,
    exchangeValues: {},
    cryptoValues: null,
    cryptoTab: true,
    getAddress: { loading: false, data: [] },
    stepcode: "step1",
    step: "step2",
    stepTitles: {
        cryptoaddressbook: "cryptoAddress",
        selectcrypto: "cryptoAddress",
    },
    stepSubTitles: {
        cryptoaddressbook: null,
        selectcrypto: "select_a_currency",

    }

}
const AddressBookReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_ADDRESS_STEP:
            return { ...state, stepcode: action.payload };
        case CLEAR_STEP:
            return { ...state, stepcode: action.payload };
        case FETCH_ADDRESS:
            return { ...state, [action.payload.key]: { data: action.payload.data, error: action.payload.error, loading: action.payload.loading } }
        case HANDLE_FETCH:
            state = { ...state, [action.payload.key]: { ...state[action.payload.key], ...action.payload } };
            return state;
        case SET_COIN:
            return { ...state, coinWallet: action.payload };
        case REJECT_COIN:
            return { ...state, coinWallet: null };
        case SET_EXCHANGE_VALUE:
            state = { ...state, exchangeValues: { ...state.exchangeValues, [action.payload.key]: action.payload.value } };
            return state;
        case FETCH_USERSID_UPDATE:
            return { ...state, selectedRowData: action.payload }
        case SELECTED_TAB:
            return { ...state, cryptoTab: action.payload }
        case FETCH_ADDRESS_CRYPTO:
            return { ...state, cryptoValues: action.payload };
        case CLEAR_CRYPTO_VALUES:
            return { ...state, cryptoValues: null };
        case CLEAR_VALUES:
            return { ...state, selectedRowData: null };
        case ADDRESS_TAB_UPDATE:
            return { ...state, addressTab: action.payload }
        case WITHDRAW_FIAT_UPDATE:
            return { ...state, withdrawTab: action.payload }
        default:
            return state;
    }

}
export default AddressBookReducer;
export { setAddressStep, clearStep, setAddressCoin, handleFavouritAddress, fetchSelectedCoinDetails, setExchangeValue, rejectCoin, selectedTab, fetchUsersIdUpdate, fetchGetAddress, clearValues, fetchAddressCrypto, clearCryptoValues, addressTabUpdate, withdrawfiatUpdate }