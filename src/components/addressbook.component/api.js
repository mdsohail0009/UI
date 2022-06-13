import { apiClient } from "../../api";
import { ApiControllers } from "../../api/config";

const favouriteFiatAddress = (accountId, type, coin) => {
	return apiClient.get(
		ApiControllers.addressbook +
		`Favourite/${accountId}/${type}/${coin}`
	);
};
const detailsAddress = (id) => {
	return apiClient.get(
		ApiControllers.addressbook + `Withdraw/Favourite/${id}`
	);
};
const favouriteNameCheck = (accountId, name, type, favaddrId) => {
	return apiClient.get(
		ApiControllers.addressbook +
		`Favourite/${favaddrId}/${accountId}/${name}/${type}`
	);
};
const saveAddress = (obj) => {
	return apiClient.post(ApiControllers.addressbook + `Favourite`, obj);
};
const getCoinList = (type) => {
	return apiClient.get(ApiControllers.markets + `Coins/${type}`);
};
const getSelectedCoinDetails = (coin_code, member_id) => {
	return apiClient.get(
		ApiControllers.buySell + `${member_id}/Coins/${coin_code}`
	);
};
const activeInactive = (obj) => {
	return apiClient.put(ApiControllers.master + "useractiveinactive", obj);
};
const getAddress = (addreddId) => {
	return apiClient.get(
		ApiControllers.addressbook + `Withdraw/Favourite/${addreddId}`
	);
};
const getFileURL = (obj) => {
	return apiClient.post(ApiControllers.accounts + `FetchFile`, obj);
};

const getInfoVal = (id, type) => {
	return apiClient.get(
		ApiControllers.deposit + `GetScoreChainInfo/${id}/${type}`
	);
};
const downloadDeclForm=(addr_id)=>{
	return apiClient.get(ApiControllers.depositWithdraw+`DownloadDocument/${addr_id}`);
}

export {
	getCoinList,
	favouriteFiatAddress,
	saveAddress,
	getSelectedCoinDetails,
	detailsAddress,
	favouriteNameCheck,
	activeInactive,
	getAddress,
	getFileURL,
	getInfoVal,
	downloadDeclForm
};
