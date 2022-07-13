import { apiClient } from "../../api"
import { ApiControllers } from "../../api/config"
const getCardStatus = (memid) => {
    return apiClient.get(ApiControllers.customers + `Cards/${memid}`);
}
const applyCard = (memid) => {
    return apiClient.put(ApiControllers.customers + `ApplyCards/${memid}`);
}
export { getCardStatus, applyCard }