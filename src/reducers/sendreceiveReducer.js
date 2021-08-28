import { getCryptoWithDrawWallets } from "../components/send.component/api";

const SET_STEP = "setStep";
const CLEAR_STEP = "clearStep";
const SET_WALLET_ADDRESS = "setWalletAddress";
const HANDLE_SEND_FETCH = "handleSendFetch";
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
const handleSendFetch = (payload) => {
    return {
        type: HANDLE_SEND_FETCH,
        payload
    }
}
const setWalletAddress = (payload) => {
    return { type: SET_WALLET_ADDRESS, payload }
}

const fetchWithDrawWallets = ({ memberId }) => {
    return async dispatch => {
        dispatch(handleSendFetch({ key: "cryptoWithdraw", wallets: { loading: true, data: [], error: null } }));
        const response = await getCryptoWithDrawWallets({ memberId });
        if (response.ok) {
            dispatch(handleSendFetch({ key: "cryptoWithdraw", wallets: { loading: false, data: response.data } }));
        } else {
            dispatch(handleSendFetch({ key: "cryptoWithdraw", wallets: { loading: false, error: response.data, data: [] } }));
        }
    }
}
const setSelectedWithDrawWallet = (wallet) => {
    return dispatch => {
        dispatch(handleSendFetch({ key: "cryptoWithdraw", selectedWallet: wallet }));
    }
}
let initialState = {
    stepcode: "step1",
    stepTitles: {
        depositecrypto: "deposit",
        withdraw: 'withdraw',
        scanner: 'scan_your_crypto',
        withdrawaddress: 'withdraw',
        withdrawsummary: 'withdraw_Btc',
        verifyidentity: 'verify_identity',
        withdrawscan: 'deposit',

    },
    stepSubTitles: {
        depositecrypto: "select_a_currency",
        withdraw: 'select_a_currency',
        scanner: 'center_qr',
        withdrawaddress: 'send_wallet_fiat',
        withdrawsummary: 'withdraw_summary_sub',
        withdrawscan: 'withdraw_summary_sub',


    },
    depositWallet: "",
    cryptoWithdraw: {},
}
const sendReceiveReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_STEP:
            state = { ...state, stepcode: action.payload };
            return state;
        case CLEAR_STEP:
            state = { ...state, stepcode: action.payload };
            return state;
        case SET_WALLET_ADDRESS:
            state = { ...state, depositWallet: action.payload };
            return state;
        case HANDLE_SEND_FETCH:
            state = { ...state, [action.payload.key]: { ...state[action.payload.key], ...action.payload } };
            return state
        default:
            return state;
    }

}
export default sendReceiveReducer;
export { setStep, clearStep, setWalletAddress, fetchWithDrawWallets,setSelectedWithDrawWallet }