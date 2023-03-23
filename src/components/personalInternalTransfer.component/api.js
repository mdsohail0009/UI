import { apiClient } from "../../api";
import { ApiControllers } from "../../api/config";
const fetchPayees = ( currency) => {
    return apiClient.get(ApiControllers.addressbook + `PayeeLu/${currency}`);
}
const fetchPastPayees = ( currency) => {
    return apiClient.get(ApiControllers.addressbook + `Payee/${currency}`);
}
const saveWithdraw = (obj) => {
    return apiClient.post(ApiControllers.withdraw + `/Withdraw/Fiat`, obj);
}

const validateAmount = (obj) => {
    return apiClient.post(ApiControllers.withdraw + `PersonalBank/Fiat/Confirm`,obj)
}
export { fetchPayees, fetchPastPayees,saveWithdraw,validateAmount, };