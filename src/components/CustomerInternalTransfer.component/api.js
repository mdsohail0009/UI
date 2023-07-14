import { apiClient } from "../../api";
import { ApiControllers } from "../../api/config";

const getCustomerDeail = ( reference) => {
    return apiClient.get(ApiControllers.customers + `${reference}`);
}
const internalCustomerTransfer = ( obj) => {
    return apiClient.post(ApiControllers.withdraw +`InternalCustomerTransfer/Confirm`,obj);
}

export { getCustomerDeail,internalCustomerTransfer };
