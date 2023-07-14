import { apiClient } from "../../api";
import { ApiControllers } from "../../api/config";

const getCustomerDeails = ( reference) => {
    return apiClient.get(ApiControllers.customers + `${reference}`);
}

export { getCustomerDeails };
