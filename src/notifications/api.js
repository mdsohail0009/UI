import { apiClient } from '../api';
import { ApiControllers } from '../api/config';
const getNotifications = (memberId) => {
    return apiClient.get(ApiControllers.notifications + `${memberId}`)
}
const readNotification = (id) => {
    return apiClient.get(ApiControllers.member + `UpdateReadMsg?id=${id}&isRead=true`)
}
const deleteToken = (obj) => {
    return apiClient.post(ApiControllers.member + `DeleteUserToken`, obj)
}
const saveUserToken = (obj) => {
    return apiClient.post(ApiControllers.member + `SaveUserTokens`, obj)
}
export { getNotifications, readNotification, deleteToken, saveUserToken }