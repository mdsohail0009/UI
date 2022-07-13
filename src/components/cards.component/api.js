import { apiClient } from "../../api"
import { ApiControllers } from "../../api/config"
const getCardStatus = (customerid) => {
    return apiClient.get(ApiControllers.customers + `Cards/${customerid}`);
}
const applyCard = (customerid) => {
    return apiClient.put(ApiControllers.customers + `ApplyCards/${customerid}`);
}
export { getCardStatus, applyCard }