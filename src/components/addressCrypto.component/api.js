
import { apiClient } from "../../api";
import { ApiControllers } from "../../api/config";
const crypto = require("crypto");
const uuidv4 = () => {
    let randumnumberval
    let buf = crypto.randomBytes(16)
    randumnumberval = buf.toString('hex')
    return (randumnumberval.substr(0, 8) + "-" + randumnumberval.substr(8, 4) + "-" + randumnumberval.substr(12, 4) + "-" + randumnumberval.substr(16, 4) + "-" + randumnumberval.substr(20, 12))
}
const getCryptoData = (id,customerId) => {
	return apiClient.get(
		ApiControllers.addressbook + `Crypto/${id}/${customerId}`
	);
};
const getCoinList = (type) => {
	return apiClient.get(ApiControllers.markets + `Coins/${type}`);
};
const saveCryptoData = (obj) => {
	return apiClient.post(ApiControllers.addressbook + `Crypto`, obj);
};
const networkLu = (coinName) => {
    return apiClient.get(
        ApiControllers.common + `NetWorkLU/${coinName}`
    );
};
export {getCryptoData,saveCryptoData,networkLu,getCoinList}