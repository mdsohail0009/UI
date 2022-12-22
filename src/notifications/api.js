import { apiClient } from '../api';
import { ApiControllers } from '../api/config';
const getNotifications = () => {
    return apiClient.get(ApiControllers.common + `Customer/Notification`)
}
const readNotification = () => {
    return apiClient.put(ApiControllers.common + `UpdateReadMsg`)
}
const deleteToken = (obj) => {
    return apiClient.post(ApiControllers.customers + `Tokens`, obj)
}
const saveUserToken = (obj) => {
    return apiClient.post(ApiControllers.customers + `Tokens`, obj)
}
export { getNotifications, readNotification, deleteToken, saveUserToken }