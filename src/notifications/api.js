import { apiClient } from '../api';
import { ApiControllers } from '../api/config';
const getNotifications = (memberId) => {
    return apiClient.get(ApiControllers.notifications + `${memberId}`)
}
const readNotification = (id, isRead) => {
    return apiClient.put(ApiControllers.notifications + `UpdateReadMsg/${id}`)
}
const deleteToken = (obj) => {
    return apiClient.post(ApiControllers.accounts + `Tokens`, obj)
}
const saveUserToken = (obj) => {
    return apiClient.post(ApiControllers.accounts + `Tokens`, obj)
}
export { getNotifications, readNotification, deleteToken, saveUserToken }