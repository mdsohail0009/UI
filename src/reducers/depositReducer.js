import {getCurrencywithBank} from '../../src/components/deposit.component/api';
const FETCH_CURRENCIESWITHBANKDETAILS = "fetchcurrencieswithbankdetails";
const FETCH_CURRENCIESWITHBANKDETAILS_REJECTED = "fetchcurrencieswithbankdetailsRejected";
const FETCH_CURRENCIESWITHBANKDETAILS_SUCCESS = "fetchcurrencieswithbankdetailsSuccess";
const SET_DEPOSITCURRENCY='setdepositCurrency'

const fetchcurrencieswithbankdetails = () => {
    return { type: FETCH_CURRENCIESWITHBANKDETAILS,payload:true };
}
const fetchcurrencieswithbankdetailsSuccess = (payload) => {
    return {
        type: FETCH_CURRENCIESWITHBANKDETAILS_SUCCESS,
        payload: payload
    }
}
const fetchcurrencieswithbankdetailsRejected = (payload) => {
    return {
        type: FETCH_CURRENCIESWITHBANKDETAILS_REJECTED,
        payload: payload
    }
}
const setdepositCurrency=(payload)=>{
    return {
        type: SET_DEPOSITCURRENCY,
        payload: payload
    }  
}
const initialState = {
    isLoading: true,
    error: null,
    currenciesWithBankInfo: [],depositCurrency:null
}
const getCurrencieswithBankDetails = () => {
    return async (dispatch) => {
        dispatch(fetchcurrencieswithbankdetails());
        try {
            const response = await getCurrencywithBank()
            if (response.ok) {
                dispatch(fetchcurrencieswithbankdetailsSuccess({ data: response.data}));
            } else {
                dispatch(fetchcurrencieswithbankdetailsRejected(response.originalError));
            }
        }
        catch (error) {
            dispatch(fetchcurrencieswithbankdetailsRejected(error));
        }
      }
}
const depositReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_CURRENCIESWITHBANKDETAILS:
            state = { ...state, isLoading: true }
            return state;
        case FETCH_CURRENCIESWITHBANKDETAILS_SUCCESS:
            state = { ...state, currenciesWithBankInfo: action.payload.data, isLoading: false };
            return state;
        case FETCH_CURRENCIESWITHBANKDETAILS_REJECTED:
            state = { ...state, isLoading: false, error: action.payload }
            return state;
            case SET_DEPOSITCURRENCY:
                state={...state,depositCurrency:action.payload}
        default:
            return state;
    }
}

export default depositReducer;
export { getCurrencieswithBankDetails,setdepositCurrency }