import { apiClient, firebaseServer } from '.';
import { ApiControllers } from './config'
export const sendNotification = ({ message, from, type, tokens }) => {
    const obj = {
        data: { user_id: from, type },
        notification: {
            title: "Suisse Base",
            body: message
        },
        registration_ids: tokens
    }
    if (tokens && tokens.length > 0) {
        firebaseServer.post("fcm/send", obj).then(response => {
        });
    }
}
export const changePassword = (obj) => {

    return apiClient.post(ApiControllers.exchange + "changePassword", obj);
}
export const withdrawRecepientNamecheck = (memberid,name) => {

    return apiClient.get(ApiControllers.depositWithdraw + "FavouriteNameCheck?memberId="+memberid+"&name="+name);
}
export const getCountryStateLu = () => {

    return apiClient.get(ApiControllers.exchange +"ControlCodes?codeCategory=country");
}
export const getStateLookup = (country) => {

    return apiClient.get(ApiControllers.exchange +"States?countryName="+country);
}
export const withdrawSave = (obj) => {

    return apiClient.post(ApiControllers.depositWithdraw + "WithdrawFiat", obj);
}
export const ProfileImageSave=(obj)=>{
    return apiClient.post(ApiControllers.exchange + "SaveImage", obj); 
}
