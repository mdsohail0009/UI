import { apiClient } from '../../api'
import { ApiControllers } from '../../api/config'
const getNotifications = (  ) => {
return apiClient.get(ApiControllers.common + `Notification`)
}
const saveNotification=(obj)=>{
return apiClient.put(ApiControllers.common + `Notification`,obj)
}
export { getNotifications, saveNotification}
