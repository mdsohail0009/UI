import { apiClient as clientApi } from "../../api"
import { ApiControllers } from "../../api/config"
function uuidv4() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
const getDocList = () => {
    return clientApi.get(ApiControllers.exchange + ``);
}
const sendRequest = (obj) => {
    return clientApi.post(ApiControllers.member + `SaveDoument`, obj);
}
const uploadFile = () => {
    return clientApi.get(ApiControllers.exchange + ``);
}
const getDocDetails = (docId) => {
    return clientApi.get(ApiControllers.member + `GetUserDocument?docId=${docId}`)
}
const getDocumentReplies = (docDetailId) => {
    return clientApi.get(ApiControllers.member + `GetMessages?docdetailId=${docDetailId}`)
}
const saveDocReply = (obj) => {
    return clientApi.post(ApiControllers.member + `SaveMessages`, obj)
}
const approveDoc = (obj) => {
    return clientApi.post(ApiControllers.member + `DocumentStateChange`, obj)
}
const getDashboardNotices = (id) => {
    return clientApi.get(ApiControllers.member+`GetDashboardNotices?memberId=${id}`)
}
export { sendRequest, getDocList, uploadFile, uuidv4, getDocDetails, getDocumentReplies, saveDocReply, approveDoc,getDashboardNotices }