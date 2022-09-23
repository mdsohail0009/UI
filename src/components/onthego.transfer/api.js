import { apiClient, uploadClient } from "../../api";
import { ApiControllers } from "../../api/config";

const fetchIBANDetails = (iban) => {
    return apiClient.get(ApiControllers.master + `GetIBANAccountDetails?ibanNumber=${iban}`)
}
const createPayee = (account_id, addr_book_id, address_type) => {
    addr_book_id = addr_book_id || "00000000-0000-0000-0000-000000000000";
    return apiClient.get(ApiControllers.addressbook + `payee/Withdraw/Favourite/${addr_book_id}/${account_id}/${address_type}`)
}
const payeeAccountObj = () => {
    return {
        "id": "00000000-0000-0000-0000-000000000000",
        "line1": "",
        "line2": "",
        "city": "",
        "state": "",
        "country": "",
        "postalCode": "",
        "currencyType": "",
        "walletCode": "",
        "accountNumber": "",
        "swiftRouteBICNumber": "",
        "bankName": "",
        "userCreated": "",
        "iban": "",
        "bic": "",
        "bankBranch": "",
        "abaRoutingCode": "",
        "documents": null
    }


}
const document = () => {
    return {
        "id": "00000000-0000-0000-0000-000000000000",
        "typeId": "",
        "transactionId": "",
        "path": "",
        "adminId": "",
        "date": "",
        "type": "",
        "customerId": "",
        "note": "",
        "remarks": "",
        "status": true,
        "state": "",
        "info": "",
        "details": [

        ]
    }
}
const uploadFile = (file) => {
    return uploadClient.post("UploadFile", file);
}
const savePayee = (obj) => {
    return apiClient.post(ApiControllers.addressbook + `payee`, obj);
}
const confirmTransaction = (obj) => {
    return apiClient.post(ApiControllers.withdraw + `/Fiat/Confirm`, obj);
}
const fetchPayees = (customer_id, currency) => {
    return apiClient.get(ApiControllers.addressbook + `PayeeLu/${customer_id}/${currency}`);
}
const fetchPastPayees = (customer_id, currency) => {
    return apiClient.get(ApiControllers.addressbook + `Payee/${customer_id}/${currency}`);
}
const updatePayee = (obj) => {
    return apiClient.post(ApiControllers.addressbook + `UpdatePayee`, obj);
}
const saveWithdraw = (obj) => {
    return apiClient.post(ApiControllers.withdraw + `/Withdraw/Fiat`, obj);
}
const validateAmount = (obj) => {
    return apiClient.post(ApiControllers.withdraw + `Fiat/commision`, obj)
}
const validateCryptoAmount = (obj) => {
    return apiClient.post(ApiControllers.withdraw + `Crypto/commision`, obj)
}
export { fetchIBANDetails, createPayee, payeeAccountObj, uploadFile, document, savePayee, confirmTransaction, fetchPayees, fetchPastPayees, updatePayee, saveWithdraw, validateAmount, validateCryptoAmount };
