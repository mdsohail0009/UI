import { apiClient } from '../api';
import { ApiControllers } from '../api/config';
const getNotifications = (CustomerId) => {
    return apiClient.get(ApiControllers.common + `${CustomerId}`)
}
const readNotification = (id, isRead) => {
    return apiClient.put(ApiControllers.common + `UpdateReadMsg/${id}`)
}
const deleteToken = (obj) => {
    return apiClient.post(ApiControllers.customers + `Tokens`, obj)
}
const saveUserToken = (obj) => {
    return apiClient.post(ApiControllers.customers + `Tokens`, obj)
}
export { getNotifications, readNotification, deleteToken, saveUserToken }