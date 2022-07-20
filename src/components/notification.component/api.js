import { apiClient } from '../../api'
import { ApiControllers } from '../../api/config'
const getNotifications = ( CustomerId ) => {
return apiClient.get(ApiControllers.common + `Notification/${CustomerId}`)
}
const saveNotification=(obj)=>{
return apiClient.put(ApiControllers.common + `Notification`,obj)
}
export { getNotifications, saveNotification}
