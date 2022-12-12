import { apiClient } from "../../api";
import { ApiControllers } from "../../api/config";
const crypto = require("crypto");
const uuidv4 = () => {
    let randumnumberval
    let buf = crypto.randomBytes(16)
    randumnumberval = buf.toString('hex')
    return (randumnumberval.substr(0, 8) + "-" + randumnumberval.substr(8, 4) + "-" + randumnumberval.substr(12, 4) + "-" + randumnumberval.substr(16, 4) + "-" + randumnumberval.substr(20, 12))
}
const favouriteFiatAddress = ( type, coin) => {
	return apiClient.get(
		ApiControllers.addressbook +
		`Favourite/${type}/${coin}`
	);
};
const detailsAddress = (id) => {
	return apiClient.get(
		ApiControllers.addressbook + `Withdraw/Favourite/${id}`
	);
};
const favouriteNameCheck = (customerId, name, type, favaddrId) => {
	return apiClient.get(
		ApiControllers.addressbook +
		`Favourite/${favaddrId}/${customerId}/${name}/${type}`
	);
};
const saveAddress = (obj) => {
	return apiClient.post(ApiControllers.addressbook + `Favourite`, obj);
};

const savePayee = (obj) => {
	return apiClient.post(ApiControllers.addressbook + `Payee`, obj);
};
const getCoinList = (type) => {
	return apiClient.get(ApiControllers.markets + `Coins`);
};

const getSelectedCoinDetails = (coin_code) => {
	return apiClient.get(
		ApiControllers.buySell + `Coins/${coin_code}`
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
// const getPayee = ({payeeId}) => {
// 	return apiClient.get(
// 		ApiControllers.addressbook + `payee/Withdraw/Favourite/${{payeeId}}`
// 	);
// };
const getFileURL = (obj) => {
	return apiClient.post(ApiControllers.customers + `FetchFile`, obj);
};

const getInfoVal = (id, type) => {
	return apiClient.get(
		ApiControllers.deposit + `GetScoreChainInfo/${id}/${type}`
	);
};
const downloadDeclForm=(addr_id)=>{
	return apiClient.get(ApiControllers.addressbook+`DownloadDocument/${addr_id}`);
}
const getPayeeLu = (type,is1stParty) => {
    return apiClient.get(
        ApiControllers.addressbook + `PayeeLu/${type}/${is1stParty}`
    );
};



const getFavData = (payeeId,customerId) => {

    return apiClient.get(

        ApiControllers.addressbook + `payee/Withdraw/Favourite/${payeeId}/${customerId}/1stparty`

    );
};
const saveAddressBook = (obj,bilPay) => {
	if(bilPay==="Fiat"){
		return apiClient.post(ApiControllers.addressbook + `BillPaymentPayee`, obj);
	}else{
		return apiClient.post(ApiControllers.addressbook + `payee`, obj);
	}
	
};
const getNewAddress = (payeeId) => {
	return apiClient.get(
		ApiControllers.addressbook + `payee/Withdraw/Favourite/${payeeId}`
	);
};
const getBankDetailLu = (payeeId) => {
    return apiClient.get(
        ApiControllers.addressbook + `PayeeAccountLu/${payeeId}`
    );
};
const getBankDetails = (payeeAccountId) => {
	return apiClient.get(
		ApiControllers.addressbook + `payeeAccount/${payeeAccountId}`
	);
};

const getViewData = (payeeId,type) => {
    return apiClient.get(
        ApiControllers.addressbook + `payee/Withdraw/Favorite/${payeeId}/${type||'myself'}`
    );
};
const emailCheck = (email,type) => {
    if(type==='user'){
        return apiClient.get(ApiControllers.customers + 'IsExist/'+email+'/UserName');
    }else{
        return apiClient.get(ApiControllers.customers +'IsExist/'+email+'/Email');
    }
}

const getCryptoData = (id) => {
	return apiClient.get(
		ApiControllers.addressbook + `Crypto/${id}`
	);
};

const saveCryptoData = (obj) => {
	return apiClient.post(ApiControllers.addressbook + `Crypto`, obj);
};
const networkLu = (coinName) => {
    return apiClient.get(
        ApiControllers.common + `NetWorkLU/${coinName}`
    );
};

export {
	emailCheck,
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
	downloadDeclForm,
	getCryptoData,
	saveCryptoData,
	networkLu
};


////https://devapi.suissebase.io/api/v1/addressbook/Crypto/{id}/{customerId}
//https://devapi.suissebase.io/api/v1/Common/NetWorkLU/BTC