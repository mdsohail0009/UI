import { getCardStatus } from "./api";
const SET_STATUS = "setStaus";
const setStaus = (payload) => {
    return {
        type: SET_STATUS,
        payload
    }
}
const getStaus = (memid) => {
    return async (dispatch) => {
        dispatch(setStaus({ loading: true, status: "", error: null }));
        const respose = await getCardStatus(memid);
        if (respose.ok) {
            dispatch(setStaus({ loading: false, status: respose.data }));
        } else {
            dispatch(setStaus({ loading: false, error: respose.data }));
        }
    }
}
const initialState = {
    loading: true,
    status: "",
    error:null
}
const cardsReducer = (state = initialState, {type,payload}) => {
    switch (type) {
        case SET_STATUS:
            state = { loading: payload.loading, status: payload.status,error:payload.error };
            return state;
        default:
            return state;
    }
}
export { getStaus, setStaus };
export default cardsReducer;