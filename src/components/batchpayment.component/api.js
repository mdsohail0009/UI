
import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config'
const crypto = require("crypto");

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
const saveTransaction = (obj) => {
    return apiClient.post(ApiControllers.massPayment + "savetransaction", obj);
}
const confirmGetDetails = (id) => {
    return apiClient.get(ApiControllers.massPayment + `Confirm/Transactions/${id}`);
};
  const deleteBatchPayments = (id) => {
    return apiClient.delete(ApiControllers.massPayment + `BatchPayments/${id}`);
};

const refreshTransaction=(id)=>{
    return apiClient.get(ApiControllers.massPayment + `RefreshTransaction/${id}`);
}
const proceedTransaction=(id)=>{
    return apiClient.get(ApiControllers.massPayment + `Transactions/${id}`);
}
const uploadDocuments=(obj)=>{
    return apiClient.post(ApiControllers.massPayment + `UploadDocument`,obj);
}
export { getCurrencyLu,saveBeneficiary,getFileURL, savePayments,getFavourite, getPaymentsData, updatePayments, getBankData,creatPayment,deletePayDetials,saveTransaction,deleteBatchPayments,refreshTransaction,confirmGetDetails,proceedTransaction,uploadDocuments}

