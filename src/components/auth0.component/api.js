import { apiClient } from "../../api"
import { ApiControllers } from "../../api/config"



const saveCustomer = (obj)=>{
    return apiClient.put(ApiControllers.customers+'SaveUser',obj);
}

export {saveCustomer}