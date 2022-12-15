
import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config'

const getCurrencyLu = (customer_id) => {
    return apiClient.get(ApiControllers.wallets + `Fiat/${customer_id}`);
}

const savePayments = (obj) => {
    return apiClient.post(ApiControllers.massPayment + "Savepayments", obj);
}
const updatePayments = (obj) => {
    return apiClient.put(ApiControllers.massPayment + "UpdateUserpayments", obj);
}
const getPaymentsData = (id, customerId,currency) => {
    return apiClient.get(ApiControllers.massPayment + `payments/${id}/${customerId}/${currency}`);
}
const getBankData = (addressId) => {
    return apiClient.get(ApiControllers.massPayment + `BankDetails/${addressId}`);
}
const saveBeneficiary = (obj) => {
    return apiClient.post(ApiControllers.withdraw + "Favourite", obj);
}
const getFavourite = (id) => {
    return apiClient.get(ApiControllers.depositWithdraw + `Withdraw/Favourite/${id}`);
}
const getFileURL = (obj) => {
    return apiClient.post(ApiControllers.customers + `FetchFile`, obj);
};
const creatPayment = (id) => {
    return apiClient.get(ApiControllers.massPayment + `payment/${id}`);
};
const deletePayDetials = (id) => {
    return apiClient.delete(ApiControllers.massPayment + `BillPayments/payment/${id}`);
};
export { getCurrencyLu,saveBeneficiary,getFileURL, savePayments,getFavourite, getPaymentsData, updatePayments, getBankData,creatPayment,deletePayDetials}

//https://routechanges.azurewebsites.net/api/v1/DepositeWithdraw/Favourite
//https://routechanges.azurewebsites.net/api/v1/Wallets/Fiat/f8be2fd6-9778-4408-ba57-7502046e13a5
//https://routechanges.azurewebsites.net/api/v1/DepositeWithdraw/Withdraw/Favourite/9619c559-adfa-4210-a6bb-c75f652e5c99