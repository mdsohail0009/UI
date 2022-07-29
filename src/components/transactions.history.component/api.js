import { apiClient,  } from "../../api";
import { ApiControllers } from "../../api/config";

const getTransactionSearch = () => {
    return apiClient.get(ApiControllers.transaction + `Customers/Types`);
}
export  { getTransactionSearch}

//https://apiuat.suissebase.ch/api/v1/Transaction/Accounts/Types