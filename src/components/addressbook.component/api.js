import { apiClient } from "../../api";
import { ApiControllers } from "../../api/config";
const crypto = require("crypto");
const uuidv4 = () => {
    let randumnumberval
    let buf = crypto.randomBytes(16)
    randumnumberval = buf.toString('hex')
    return (randumnumberval.substr(0, 8) + "-" + randumnumberval.substr(8, 4) + "-" + randumnumberval.substr(12, 4) + "-" + randumnumberval.substr(16, 4) + "-" + randumnumberval.substr(20, 12))
}
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

const savePayee = (obj) => {
	return apiClient.post(ApiControllers.addressbook + `Payee`, obj);
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
const getPayee = ({payeeId}) => {
	return apiClient.get(
		ApiControllers.addressbook + `payee/Withdraw/Favourite/${{payeeId}}`
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
const getPayeeLu = (accountId, type) => {

    return apiClient.get(

        ApiControllers.addressbook + `PayeeLu/${accountId}/${type}`

    );

};



const getFavData = (payeeId,membershipId) => {

    return apiClient.get(

        ApiControllers.addressbook + `payee/Withdraw/Favourite/${payeeId}/${membershipId}`

    );
};
const saveAddressBook = (obj) => {
	return apiClient.post(ApiControllers.addressbook + `payee`, obj);
};
const getNewAddress = (payeeId) => {
	return apiClient.get(
		ApiControllers.addressbook + `payee/Withdraw/Favourite/${payeeId}`
	);
};
const getBankDetailLu = (payeeId,membershipId) => {
    return apiClient.get(
        ApiControllers.addressbook + `PayeeAccountLu/${payeeId}/${membershipId}`
    );
};
const getBankDetails = (payeeAccountId) => {
	return apiClient.get(
		ApiControllers.addressbook + `payeeAccount/${payeeAccountId}`
	);
};

const getViewData = (payeeId,membershipId) => {
    return apiClient.get(
        ApiControllers.addressbook + `payee/Withdraw/Favourite/${payeeId}/${membershipId}`
    );
};


export {
	getPayeeLu,
	getViewData,
	getBankDetails,
	getBankDetailLu,
	getNewAddress,
	saveAddressBook,
	getFavData,
	getCoinList,
	favouriteFiatAddress,
	saveAddress,
	uuidv4,
	getSelectedCoinDetails,
	detailsAddress,
	favouriteNameCheck,
	activeInactive,
	getAddress,
	getFileURL,
	savePayee,
	getInfoVal,
	downloadDeclForm
};
