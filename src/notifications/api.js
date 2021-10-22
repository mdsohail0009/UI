import { apiClient } from '../api';
import { ApiControllers } from '../api/config';
const getNotifications = (memberId) => {
    return apiClient.get(ApiControllers.member + `GetNotifications?memberId=${memberId}`)
}

export { getNotifications }