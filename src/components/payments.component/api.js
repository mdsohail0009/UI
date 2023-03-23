import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config'

const getCurrencyLu = () => {
    return apiClient.get(ApiControllers.wallets + `Fiat/BatchPayments`);
}

const savePayments = (obj) => {
    return apiClient.post(ApiControllers.massPayment + "Savepayments", obj);
}
const updatePayments = (obj) => {
    return apiClient.put(ApiControllers.massPayment + "UpdateUserpayments", obj);
}
const getPaymentsData = (id,currency) => {
    return apiClient.get(ApiControllers.massPayment + `payments/${id}/${currency}`);
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