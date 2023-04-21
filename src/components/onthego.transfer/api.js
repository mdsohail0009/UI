import { apiClient, uploadClient } from "../../api";
import { ApiControllers } from "../../api/config";

const fetchIBANDetails = (iban) => {
    return apiClient.get(ApiControllers.master + `GetIBANAccountDetails?ibanNumber=${iban}`)
}
const createPayee = ( addr_book_id, address_type) => {
    addr_book_id = addr_book_id || "00000000-0000-0000-0000-000000000000";
    return apiClient.get(ApiControllers.addressbook + `payee/Withdraw/Favorite/${addr_book_id}/${address_type}`)
}
const getCoinwithBank=()=>{
    return apiClient.get(ApiControllers.withdraw + `Withdraw/CurrencyWithBank`)
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
const fetchPayees = ( currency) => {
    return apiClient.get(ApiControllers.addressbook + `PayeeLu/${currency}`);
}
const fetchPastPayees = ( currency) => {
    return apiClient.get(ApiControllers.addressbook + `Payee/${currency}`);
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
const getRelationDetails = () => {
    return apiClient.get(ApiControllers.common + `controlcodes?codecategory=Relationship To Beneficiary`)
}
const getReasonforTransferDetails = () => {
    return apiClient.get(ApiControllers.common + `controlcodes?codecategory=Reason For Transfer`)
}
const getWithdrawValidation=()=>{
    return apiClient.get(ApiControllers.withdraw + `Validation`)
}
export { fetchIBANDetails, getCoinwithBank,createPayee, payeeAccountObj, uploadFile, document, savePayee, confirmTransaction, fetchPayees, fetchPastPayees, updatePayee, saveWithdraw, validateAmount, validateCryptoAmount,getRelationDetails,getReasonforTransferDetails,getWithdrawValidation };
