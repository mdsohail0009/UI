import { apiClient, firebaseServer } from '.';
import { ApiControllers } from './config'

export const changePassword = (obj) => {

    return apiClient.put(ApiControllers.accounts + "ChangePassword", obj);
}
export const withdrawRecepientNamecheck = (memberid, name) => {

    return apiClient.get(ApiControllers.depositWithdraw + "FavouriteNameCheck?memberId=" + memberid + "&name=" + name);
}
export const getCountryStateLu = () => {

    return apiClient.get(ApiControllers.master + "ControlCodes?codeCategory=country");
}
export const getStateLookup = (country) => {

    return apiClient.get(ApiControllers.master + "States?countryName=" + country);
}
export const withdrawSave = (obj) => {

    return apiClient.post(ApiControllers.depositWithdraw + "Withdraw/Fiat", obj);
}
export const ProfileImageSave = (obj) => {
    return apiClient.put(ApiControllers.accounts + "Avatar", obj);
}
export const getSettingsLuData = () => {
    return apiClient.get(ApiControllers.accounts + "Settings");
}
export const saveSettingsData = (obj) => {
    return apiClient.post(ApiControllers.accounts + "Settings", obj);
}
