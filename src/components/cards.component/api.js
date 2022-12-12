import { apiClient } from "../../api"
import { ApiControllers } from "../../api/config"
const getCardStatus = () => {
    return apiClient.get(ApiControllers.customers + `Cards`);
}
const applyCard = () => {
    return apiClient.put(ApiControllers.customers + `ApplyCards`);
}
export { getCardStatus, applyCard }