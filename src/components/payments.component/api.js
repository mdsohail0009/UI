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
const getPaymentsData = (id, memberId) => {
    return apiClient.get(ApiControllers.massPayment + `Getpayments/${id}/${memberId}`);
}
const getBankData = (addressId) => {
    return apiClient.get(ApiControllers.massPayment + `BankDetails/${addressId}`);
}
//https://routechanges.azurewebsites.net/api/v1/MassPayment/Getpayments/id/memberid
//https://routechanges.azurewebsites.net/api/v1/MassPayment/Savepayments
//https://routechanges.azurewebsites.net/api/v1/MassPayment/Updatepayments
// https://routechanges.azurewebsites.net/api/v1/Wallets/Fiat/{memberId}
//https://routechanges.azurewebsites.net/api/v1/MassPayment/BankDetails/%7BaddresId%7D
export { getCurrencyLu, savePayments, getPaymentsData, updatePayments, getBankData }
