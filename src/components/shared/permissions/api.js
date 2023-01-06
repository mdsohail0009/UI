import { apiClient } from "../../../api";
import { ApiControllers } from "../../../api/config";
const getFeatures = (app_id) => {
    return apiClient.get(ApiControllers.security + `Features/${app_id}`);
}
const getFeaturePermissions = ({ feature_id}) => {
    return apiClient.get(ApiControllers.security + `Toolbar/${feature_id}`);
}
export { getFeatures,getFeaturePermissions };