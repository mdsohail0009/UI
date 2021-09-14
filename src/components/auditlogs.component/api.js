import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config';

// const getSearchGrid = () => {
//     return apiClient.get(ApiControllers.exchange + `GetAdminLogsK?timeSpan=Custom&fromdate=2021-09-01&todate=2021-09-08&userName=All%20Users&feature=All%20Features`);
// }
const userNameLuSearch = (user_name) => {
    debugger
    return apiClient.get(ApiControllers.exchange + "UserLookup?username=" + user_name);
}
const getFeatureLuSearch = () => {
    return apiClient.get(ApiControllers.exchange + "FeatureLookUp");
}

export {userNameLuSearch, getFeatureLuSearch}