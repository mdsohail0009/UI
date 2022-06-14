import { apiClient } from "../../api"
import { ApiControllers } from "../../api/config"
const getCardStatus = (memid) => {
    return apiClient.get(ApiControllers.accounts + `Cards/${memid}`);
}
const applyCard = (memid) => {
    return apiClient.put(ApiControllers.accounts + `ApplyCards/${memid}`);
}
export { getCardStatus, applyCard }