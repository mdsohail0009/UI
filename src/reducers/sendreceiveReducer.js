import { getWithdrawmemberCrypto } from "../components/send.component/api";

const SET_STEP = "setStep";
const CLEAR_STEP = "clearStep";
const SET_WALLET_ADDRESS = "setWalletAddress";
const HANDLE_SEND_FETCH = "handleSendFetch";
const SET_WITHDRAWFIAT = "setWithdrawfiat";
const REJECT_WITHDRAWFIAT = "rejectWithdrawfiat";
const SET_WITHDRAWFIAT_ENABLE = "setWithdrawfiatenaable";
const REJECT_WITHDRAWFIAT_ENABLE = "rejectWithdrawfiatenaable";
const SET_WITHDRAWCRYPTO = "setWithdrawcrypto";
const SET_SUB_TITLE = "setSubTitle";
const SET_ADDRESS = "setAddress";
const setStep = (payload) => {
    return {
        type: SET_STEP,
        payload
    }
}
const setSubTitle = (payload) => {
    return {
        type: SET_SUB_TITLE,
        payload
    }
}
const setWithdrawfiat = (payload) => {
    return {
        type: SET_WITHDRAWFIAT,
        payload
    }
}
const setWithdrawcrypto = (payload) => {
    return {
        type: SET_WITHDRAWCRYPTO,
        payload
    }
}
const rejectWithdrawfiat = (payload) => {
    return {
        type: REJECT_WITHDRAWFIAT,
        payload
    }
}
const setWithdrawfiatenaable = (payload) => {
    return {
        type: SET_WITHDRAWFIAT_ENABLE,
        payload
    }
}
const rejectWithdrawfiatenaable = (payload) => {
    return {
        type: REJECT_WITHDRAWFIAT_ENABLE,
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
const setAddress = (payload) => {
    return {
        type: SET_ADDRESS,
        payload
    }
}
const fetchWithDrawWallets = ({ memberId }) => {
    return async dispatch => {
        dispatch(handleSendFetch({ key: "cryptoWithdraw", wallets: { loading: true, data: [], error: null } }));
        const response = await getWithdrawmemberCrypto({ memberId });
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
        depositecrypto: "dep_with_assets",
        withdraw: 'withdraw',
        scanner: 'scan_your_crypto',
        withdrawaddress: 'withdraw',
        withdrawsummary: 'withdraw_Btc',
        verifyidentity: 'verify_identity',
        withdrawscan: 'deposit',
        selectAddress: 'withdraw',
        selectCrypto:null,
        withdraw_crypto_liveness:'liveVarification',
        withdraw_crpto_summary:'withdraw',
        //withdraw_crpto_success:'withdraw_summary',

    },
    stepSubTitles: {
        depositecrypto: null,
        withdraw: null,
        scanner: 'center_qr',
        withdrawaddress: 'send_wallet_fiat',
        withdrawsummary: 'withdraw_summary_sub',
        withdrawscan: 'withdraw_summary_sub',
        selectAddress: 'null',
        selectCrypto:null,
        withdraw_crypto_liveness:'Withdraw_liveness'
    },
    depositWallet: "",
    cryptoWithdraw: {},
    withdrawFiatObj: null,
    withdrawFiatEnable: false,
    subTitle: null,
    withdrawCryptoObj: null,
    addressObj:null
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
        case SET_WITHDRAWFIAT:
            state = { ...state, withdrawFiatObj: action.payload };
            return state;
        case SET_WITHDRAWCRYPTO:
            state = { ...state, withdrawCryptoObj: action.payload };
            return state;
        case REJECT_WITHDRAWFIAT:
            state = { ...state, withdrawFiatObj: null };
            return state;
        case SET_WITHDRAWFIAT_ENABLE:
            state = { ...state, withdrawFiatEnable: action.payload };
            return state;
        case REJECT_WITHDRAWFIAT_ENABLE:
            state = { ...state, withdrawFiatEnable: false };
            return state;
        case HANDLE_SEND_FETCH:
            state = { ...state, [action.payload.key]: { ...state[action.payload.key], ...action.payload } };
            return state;
        case SET_SUB_TITLE:
            state = { ...state, subTitle: action.payload };
            return state;
            case SET_ADDRESS:
                state = { ...state, addressObj: action.payload  };
                return state;
        default:
            return state;
    }

}
export default sendReceiveReducer;
export { setStep, clearStep, setWalletAddress, fetchWithDrawWallets, setSelectedWithDrawWallet, handleSendFetch, setSubTitle, setWithdrawfiat, rejectWithdrawfiat, setWithdrawfiatenaable, rejectWithdrawfiatenaable,setWithdrawcrypto,setAddress }