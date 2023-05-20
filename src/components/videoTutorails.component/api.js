import { apiClient } from "../../api";
import { ApiControllers } from "../../api/config";
const getVideoTutorials = () => {
    return apiClient.get(ApiControllers.customers + `Tutorials1`);
}
export { getVideoTutorials }