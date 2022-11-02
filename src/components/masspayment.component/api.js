import { apiClient } from "../../api";
import { ApiControllers } from "../../api/config";
const crypto = require('crypto');
const uuidv4 = () => {
    let randumnumberval
    let buf = crypto.randomBytes(16)
    randumnumberval = buf.toString('hex')
    return (randumnumberval.substr(0, 8) + "-" + randumnumberval.substr(8, 4) + "-" + randumnumberval.substr(12, 4) + "-" + randumnumberval.substr(16, 4) + "-" + randumnumberval.substr(20, 12))
}

const SaveTransaction = (obj) => {
    return apiClient.post(ApiControllers.importexcel + `SaveTransaction`, obj)
}
const getFileURL = (id) => {
    return apiClient.get(ApiControllers.importexcel + "gettransactionexcel?massPaymentId=" + id)
}

export { uuidv4, getFileURL, SaveTransaction }