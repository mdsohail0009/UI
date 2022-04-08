import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config'

const getCurrencyLu = (memberId) => {
    return apiClient.get(ApiControllers.wallets + `Fiat/${memberId}`);
}

const savePayments = (obj) => {
    return apiClient.post(ApiControllers.massPayment + "Savepayments", obj);
}
const updatePayments = (obj) => {
    return apiClient.put(ApiControllers.massPayment + "UpdatePayments", obj);
}
const getPaymentsData = (id, memberId,currency) => {
    return apiClient.get(ApiControllers.massPayment + `payments/${id}/${memberId}/${currency}`);
}
const getBankData = (addressId) => {
    return apiClient.get(ApiControllers.massPayment + `BankDetails/${addressId}`);
}
const saveBeneficiary = (obj) => {
    return apiClient.post(ApiControllers.depositWithdraw + "Favourite", obj);
}
const getFavourite = (id) => {
    return apiClient.get(ApiControllers.depositWithdraw + `Withdraw/Favourite/${id}`);
}
const getFileURL = (obj) => {
    return apiClient.post(ApiControllers.accounts + `FetchFile`, obj);
};
const creatPayment = (id) => {
    return apiClient.get(ApiControllers.massPayment + `payment/${id}`);
};

export { getCurrencyLu,saveBeneficiary,getFileURL, savePayments,getFavourite, getPaymentsData, updatePayments, getBankData,creatPayment}

//https://routechanges.azurewebsites.net/api/v1/DepositeWithdraw/Favourite
//https://routechanges.azurewebsites.net/api/v1/Wallets/Fiat/f8be2fd6-9778-4408-ba57-7502046e13a5
//https://routechanges.azurewebsites.net/api/v1/DepositeWithdraw/Withdraw/Favourite/9619c559-adfa-4210-a6bb-c75f652e5c99