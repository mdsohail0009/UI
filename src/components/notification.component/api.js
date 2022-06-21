import { apiClient } from '../../api'
import { ApiControllers } from '../../api/config'
const getNotifications = ( MembershipId ) => {
return apiClient.get(ApiControllers.common + `Notification/${MembershipId}`)
}
const saveNotification=(obj)=>{
return apiClient.post(ApiControllers.common + `Notification`,obj)
}
export { getNotifications, saveNotification}