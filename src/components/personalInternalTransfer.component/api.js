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

const validateAmount = (amount,walletCode) => {
    return apiClient.post(ApiControllers.withdraw + `PersonalBank/Confirm/${amount}/${walletCode}`)
}
export { fetchPayees, fetchPastPayees,saveWithdraw,validateAmount, };