import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config';
const userNameLuSearch = (user_name) => {
    return apiClient.get(ApiControllers.master + `${user_name}`);
}
const getFeatureLuSearch = () => {
    return apiClient.get(ApiControllers.master + "AuditLogs/User");
}

export {userNameLuSearch, getFeatureLuSearch}