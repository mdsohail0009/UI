import { apiClient } from "../../api"
import { ApiControllers } from "../../api/config"
const getCardStatus = (customer_id) => {
    return apiClient.get(ApiControllers.customers + `Cards/${customer_id}`);
}
const applyCard = (customer_id) => {
    return apiClient.put(ApiControllers.customers + `ApplyCards/${customer_id}`);
}
export { getCardStatus, applyCard }