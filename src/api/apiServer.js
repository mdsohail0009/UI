import { apiClient } from '.';
import { ApiControllers } from './config'

export const changePassword = (obj) => {

    return apiClient.put(ApiControllers.customers + "ChangePassword", obj);
}
export const withdrawRecepientNamecheck = (memberid, name) => {

    return apiClient.get(ApiControllers.depositWithdraw + "FavouriteNameCheck?memberId=" + memberid + "&name=" + name);
}
export const getCountryStateLu = () => {

    return apiClient.get(ApiControllers.common + "ControlCodes?codeCategory=country");
}
export const getStateLookup = (country) => {

    return apiClient.get(ApiControllers.master + "States?countryName=" + country);
}
export const withdrawSave = (obj) => {

    return apiClient.post(ApiControllers.withdraw + "Withdraw/Fiat", obj);
}
export const ProfileImageSave = (obj) => {
    return apiClient.put(ApiControllers.customers + "Avatar", obj);
}
export const getSettingsLuData = () => {
    return apiClient.get(ApiControllers.customers + "Settings");
}
export const saveSettingsData = (obj) => {
    return apiClient.post(ApiControllers.customers + "Settings", obj);
}

export const getAccountHolder=(customerId,type)=>{
    return apiClient.get(ApiControllers.addressbook + `WithdrawPayeeLu/${customerId}/${type}`);
}

export const getAccountWallet=(AccountId)=>{
    return apiClient.get(ApiControllers.wallets + `Fiat/${AccountId}`);
}

export const getAccountBankDetails=(payeeId,currency)=>{
    return apiClient.get(ApiControllers.addressbook + `PayeeLableLu/${payeeId}/${currency}`);
}

// https://tstapi.suissebase.io/api/v1/addressbook/PayeeLu/{accountId}/{type} Account holder names

// https://tstapi.suissebase.io/api/v1/Wallets/Fiat/{AccountId}

// https://tstapi.suissebase.io/api/v1/addressbook/PayeeLableLu/{payeeId}/{currency}
//https://tstapi.suissebase.io/api/v1/addressbook/WithdrawPayeeLu/{accountId}/{type}