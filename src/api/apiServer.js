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