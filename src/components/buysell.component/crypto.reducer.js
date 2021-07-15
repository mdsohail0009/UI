
import { getMemberfiat, getportfolio } from './api'
import { apiClient } from '../../api';

const FETCH_MEMBERCOINS = "fetchMemberCoins";
const FETCH_MEMBERCOINS_REJECTED = "fetchMemberCoinsRejected";
const FETCH_MEMBERCOINS_SUCCESS = "fetchMemberCoinsSuccess";
const UPDATE_COINDETAILS = "updateCoinDetails";
const fetchMemberCoins = () => {
    return { type: FETCH_MEMBERCOINS };
}
const fetchMemberCoinsSuccess = (payload, key) => {
    return {
        type: FETCH_MEMBERCOINS_SUCCESS,
        payload: { data: payload, key }
    }
}
const fetchMemberCoinsRejected = (paylaod) => {
    return {
        type: FETCH_MEMBERCOINS_REJECTED,
        payload: paylaod
    }
}
const updateCoinDetails = (payload) => {
    return { type: UPDATE_COINDETAILS, payload }
}
const initialState = {
    isLoading: true,
    error: null,
    MemberCoins:[] ,
    MemberFiat: [],
    coinDetailData: {}
}

const getMemberCoins = () => {
    return async (dispatch) => {
        dispatch(fetchMemberCoins({ key: "MemberCoins", loading: true, data: [] }));
        Promise.all([
            getportfolio().then(
                (response) => {
                    if (response.ok) {
                        dispatch(fetchMemberCoinsSuccess( response.data, 'MemberCoins' ));
                    } else {
                        dispatch(fetchMemberCoinsRejected(response.data, 'MemberCoins'));
                    }
                },
                (error) => {
                    dispatch(fetchMemberCoinsRejected(error, 'MemberCoins'));
                },
            ),
            getMemberfiat().then(
                (response) => {
                    if (response.ok) {
                        dispatch(fetchMemberCoinsSuccess(response.data, 'MemberFiat'));
                    } else {
                        dispatch(fetchMemberCoinsRejected(response.data, 'MemberFiat'));
                    }
                },
                (error) => {
                    dispatch(fetchMemberCoinsRejected(error, 'MemberFiat'));
                },
            ),
        ]);
        try {
        } catch (error) { }
    }
}
const sellReducer = (state = initialState, action) => {
    switch (action.type) {
        case FETCH_MEMBERCOINS:
            state = { ...state, isLoading: true }
            return state;
        case FETCH_MEMBERCOINS_SUCCESS:
            state = { ...state, [action.payload.key]: action.payload.data, isLoading: false};
            return state;
        case FETCH_MEMBERCOINS_REJECTED:
            state = { ...state, isLoading: false, error: { [action.payload.key]: action.payload.data} }
            return state;
        case UPDATE_COINDETAILS:
            return { ...state, coinDetailData: action.payload};
        default:
            return state;
    }
}

export default sellReducer;
export { getMemberCoins, updateCoinDetails }