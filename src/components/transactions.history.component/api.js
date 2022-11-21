import { apiClient,  } from "../../api";
import { ApiControllers } from "../../api/config";

const getTransactionSearch = () => {
    return apiClient.get(ApiControllers.transaction + `Customers/Types`);
}
const getTransactionCurrency = () => {
    return apiClient.get(ApiControllers.common + `CurrencyLU`);
}
export  { getTransactionSearch,getTransactionCurrency}

