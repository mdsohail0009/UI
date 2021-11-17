import { apiClient as clientApi } from "../../api"
import { ApiControllers } from "../../api/config"
const crypto = require('crypto');
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = rendamNumber() | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
const rendamNumber = () => {
    return crypto.randomBytes(16, (err, buf) => {
        return buf.toString('hex');
    });

}
const sendRequest = (obj) => {
    return clientApi.post(ApiControllers.member + `SaveDoument`, obj);
}
const getDocDetails = (docId) => {
    return clientApi.get(ApiControllers.documents + `Accouts/${docId}`)
}
const getDocumentReplies = (docDetailId) => {
    return clientApi.get(ApiControllers.documents + `Accounts/${docDetailId}/Messages`)
}
const saveDocReply = (obj) => {
    return clientApi.post(ApiControllers.documents + `Accounts`, obj)
}
const approveDoc = (obj) => {
    return clientApi.post(ApiControllers.documents + `Actions/Status`, obj)
}
const getDashboardNotices = (id) => {
    return clientApi.get(ApiControllers.accounts + `Dashboard/Notifications/${id}`)
}
export { sendRequest, uuidv4, getDocDetails, getDocumentReplies, saveDocReply, approveDoc, getDashboardNotices }

