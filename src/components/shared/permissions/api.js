import { apiClient } from "../../../api";
import { ApiControllers } from "../../../api/config";
const getFeatures = (app_id, customer_id) => {
    return apiClient.get(ApiControllers.security + `Features/${app_id}/${customer_id}`);
}
const getFeaturePermissions = ({ feature_id,customer_id }) => {
    return apiClient.get(ApiControllers.security + `Toolbar/${customer_id}/${feature_id}`);
}
export { getFeatures,getFeaturePermissions };