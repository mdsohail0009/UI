import { apiClient } from "../../api"
import { ApiControllers } from "../../api/config"



const saveCustomer = (obj)=>{
    return apiClient.post(ApiControllers.customers+'SaveUser',obj);
}

export {saveCustomer}