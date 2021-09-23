import { apiClient as clientApi } from "../../api"
import { ApiControllers } from "../../api/config"
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
const getDocList = (category) => {
    return clientApi.get(ApiControllers.exchange + ``);
}
const sendRequest = (obj) => {
    return clientApi.post(ApiControllers.exchange + `SaveDoument`, obj);
}

const uploadFile = (obj) => {
    return clientApi.get(ApiControllers.exchange + ``);
}
const getDocDetails = (docId) => {
    return clientApi.get(ApiControllers.exchange + `GetDocument?docId=${docId}`)
}
const getDocumentReplies = (docDetailId) => {
    return clientApi.get(ApiControllers.exchange + `GetMessages?docdetailId=${docDetailId}`)
}
const saveDocReply = (obj) => {
    return clientApi.post(ApiControllers.exchange+`SaveMessages`,obj)
}
const approveDoc = (obj) => {
    return clientApi.post(ApiControllers.exchange+`DocumentStateChange`,obj)
}
export { sendRequest, getDocList, uploadFile, uuidv4, getDocDetails, getDocumentReplies,saveDocReply,approveDoc }