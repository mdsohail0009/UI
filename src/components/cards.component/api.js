import { apiClient } from "../../api"
import { ApiControllers } from "../../api/config"


const getCardStatus =(memid)=>{
    return apiClient.get(ApiControllers.accounts+`Cards/${memid}`);
}
export {getCardStatus}