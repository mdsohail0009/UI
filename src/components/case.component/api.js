import { apiClient as clientApi } from "../../api";
import { ApiControllers } from "../../api/config";
const crypto = require("crypto");
const uuidv4 = () => {
  let randumnumberval;
  let buf = crypto.randomBytes(16);
  randumnumberval = buf.toString("hex");
  return (
    randumnumberval.substr(0, 8) +
    "-" +
    randumnumberval.substr(8, 4) +
    "-" +
    randumnumberval.substr(12, 4) +
    "-" +
    randumnumberval.substr(16, 4) +
    "-" +
    randumnumberval.substr(20, 12)
  );
};
const sendRequest = (obj) => {
  return clientApi.post(ApiControllers.member + `SaveDoument`, obj);
};
const getDocDetails = (docId) => {
  return clientApi.get(ApiControllers.documents + `Accouts/${docId}`);
};
//https://routechanges.azurewebsites.net/api/v1/Documents/Accouts/{Id}--Id means DocumentId
//https://apiuat.suissebase.ch/api/v1/Documents/Accounts/{id}/Messages
const getDocumentReplies = (docDetailId) => {
  return clientApi.get(
    ApiControllers.documents + `Accounts/${docDetailId}/Messages`
  );
};
const saveDocReply = (obj) => {
  return clientApi.post(ApiControllers.documents + `Accounts`, obj);
};
const approveDoc = (obj) => {
  return clientApi.post(ApiControllers.documents + `Actions/Status`, obj);
};
const getDashboardNotices = (id) => {
  return clientApi.get(
    ApiControllers.accounts + `Dashboard/Notifications/${id}`
  );
};
const getFileURL = (obj) => {
  return clientApi.post(ApiControllers.accounts + `FetchFile`, obj);
};
export {
  sendRequest,
  uuidv4,
  getDocDetails,
  getDocumentReplies,
  saveDocReply,
  approveDoc,
  getDashboardNotices,
  getFileURL,
};