import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config'

const getCurrencyLu = (memberId) => {
    return apiClient.get(ApiControllers.wallets + `Fiat/${memberId}`);
}

const savePayments = (obj) => {
    return apiClient.post(ApiControllers.massPayment + "Savepayments", obj);
}
const updatePayments = (obj) => {
    return apiClient.put(ApiControllers.massPayment + "Savepayments", obj);
}
const getPaymentsData = (id, memberId,currency) => {
    return apiClient.get(ApiControllers.massPayment + `Getpayments/${id}/${memberId}/${currency}`);
}
const getBankData = (addressId) => {
    return apiClient.get(ApiControllers.massPayment + `BankDetails/${addressId}`);
}
export { getCurrencyLu, savePayments, getPaymentsData, updatePayments, getBankData }