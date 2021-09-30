import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config';
const userNameLuSearch = (user_name) => {
    return apiClient.get(ApiControllers.exchange + "UserLookup?username=" + user_name);
}
const getFeatureLuSearch = () => {
    return apiClient.get(ApiControllers.exchange + "FeatureLookUp");
}

export {userNameLuSearch, getFeatureLuSearch}