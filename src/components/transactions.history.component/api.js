import { apiClient,  } from "../../api";
import { ApiControllers } from "../../api/config";

const getTransactionSearch = () => {
    return apiClient.get(ApiControllers.transaction + `Customers/Types`);
}
const getTransactionCurrency = () => {
    return apiClient.get(ApiControllers.common + `CurrencyLU`);
}
const downloadTransaction=(id,type)=>{
    return apiClient.get(ApiControllers.transaction + `Transaction/${id}/${type}`);  
}
const transactionsView=(id,type)=>{
    return apiClient.get(ApiControllers.transaction + `TemplatesTranction/${id}/${type}`)
}
export  { getTransactionSearch,getTransactionCurrency,downloadTransaction,transactionsView}

