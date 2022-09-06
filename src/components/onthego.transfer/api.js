import { apiClient, uploadClient } from "../../api";
import { ApiControllers } from "../../api/config";

const fetchIBANDetails = (iban) => {
    return apiClient.get(ApiControllers.master + `GetIBANAccountDetails?ibanNumber=${iban}`)
}
const createPayee = (account_id, addr_book_id) => {
    addr_book_id = addr_book_id || "00000000-0000-0000-0000-000000000000";
    return apiClient.get(ApiControllers.addressbook + `payee/Withdraw/Favourite/${addr_book_id}/${account_id}`)
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
const savePayee = (obj)=>{
    return apiClient.post(ApiControllers.addressbook+`payee`,obj);
}
export { fetchIBANDetails, createPayee, payeeAccountObj, uploadFile,document,savePayee };
