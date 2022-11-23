import { apiClient, ipRegistry ,bankClient} from "./";
import { ApiControllers } from "./config";
import counterpart from "counterpart";
import CryptoJS from "crypto-js";

const getportfolio = (memID) => {
	return apiClient.get(ApiControllers.wallets + `Crypto/${memID}`);
};
const getCryptos = () => {
	return apiClient.get(ApiControllers.buySell + "Coins");
};
const getMember = (customerid) => {
	return apiClient.get(ApiControllers.customers + `${customerid}/App/Exchange`);
};
const sumsubacesstoken = (userid, flow) => {
return apiClient.get(
		"Sumsub/AccessToken1?applicantId=" + userid + "&levelName=" + flow
	);
};
const sumsublivenessacesstoken = (userid, flow) => {
	return apiClient.get(
		"Sumsub/ExternalAccessToken?userId=" + userid + "&levelName=" + flow
	);
};
const sumsubacesstokennew = (userid) => {
	return apiClient.get("Sumsub/KYBAccessToken?applicantId=" + userid);
};
const updateKyc = (userid) => {
	return apiClient.put(ApiControllers.customers + `${userid}/KYC`);
};
const trackEvent = (obj) => {
	
};

const getIpRegistery = () => {
	return ipRegistry.get("/?key=hb9lsmlhafyn1s1s");
};
const sellMemberCrypto = (memID) => {
	return apiClient.get(ApiControllers.wallets + memID);
};
const convertLocalLang = (key) => {
	return counterpart.translate(key);
};
const getIBANData = (ibannumber) => {
	return apiClient.get(
		ApiControllers.master + `GetIBANAccountDetails?ibanNumber=` + ibannumber
	);
};

const getdshKpis = (customer_id) => {
	return apiClient.get(ApiControllers.dashboard + `KPI/${customer_id}`);
};
const getdshcumulativePnl = (customer_id, days) => {
	return apiClient.get(
		ApiControllers.dashboard + `CumulativePNL/${customer_id}/${days}`
	);
};
const getAssetNetwroth = (customer_id, days) => {
	return apiClient.get(
		ApiControllers.dashboard + `AssetsNetWorth/${customer_id}/${days}`
	);
};
const getAssetAllowcation = (customer_id, days) => {
	return apiClient.get(
		ApiControllers.dashboard + `AssetAllocation/${customer_id}/${days}`
	);
};
const getprofits = (customer_id, days) => {
	return apiClient.get(ApiControllers.dashboard + `Profits/${customer_id}/${days}`);
};
const getdailypnl = (customer_id, days) => {
	return apiClient.get(ApiControllers.dashboard + `DailyPNL/${customer_id}/${days}`);
};

const getCode = (AccountId, isResendOTP) => {
	return apiClient.get(
		ApiControllers.master + `SendOTP/${AccountId}/${isResendOTP}`
	);
};
const getVerification = (AccountId, code) => {
	return apiClient.get(
		ApiControllers.master + `OTPVerification/${AccountId}/${code}`
	);
};

const downloadKyc = (Customerid) => {
	return apiClient.get(ApiControllers.customers + `DownloadFile/${Customerid}`);
};
const updateSecurity = (obj) => {
	return apiClient.put(ApiControllers.master + "UpdateSecurity", obj);
};
const getCustomerBankDetails = (customerId)=>{
    return bankClient.get(ApiControllers.bank + `GetAccountBalanceByCustomerId/${customerId}`);
}
const getAccountDetails=(customerId)=>{
	return bankClient.get(ApiControllers.bank + `AccountDetails/${customerId}`)
  }

const encryptValue = (msg, key) => {
	msg = typeof msg == "string" ? msg : JSON.stringify(msg);
	let salt = CryptoJS.lib.WordArray.random(128 / 8);

	let key1 = CryptoJS.PBKDF2(key, salt, {
		keySize: 256 / 32,
		iterations: 10,
	});

	let iv = CryptoJS.lib.WordArray.random(128 / 8);

	let encrypted = CryptoJS.AES.encrypt(msg, key1, {
		iv: iv,
		padding: CryptoJS.pad.Pkcs7,
		mode: CryptoJS.mode.CBC,
	});
	return salt.toString() + iv.toString() + encrypted.toString();
};
const sendEmail = (AccountId, isResendOTP) => {
	return apiClient.get(
		ApiControllers.master + `SendEmailOTP/${AccountId}/${isResendOTP}`
	);
};

const verifyEmail = (AccountId, code) => {
	return apiClient.get(
		ApiControllers.master + `EmailOTPVerification/${AccountId}/${code}`
	);
};
const getAuthenticator = (Code, customerId) => {
	return apiClient.get(
		ApiControllers.master + `VerifyAuthenticator/${Code}/${customerId}`
	);
};
const getVerificationFields = (customerId) => {
	return apiClient.get(
		ApiControllers.master + `Verificationfields/${customerId}`
	);
};
const twofactor = (id) => {
	return apiClient.get(ApiControllers.customers + `twofactor/${id}`);
};

const getInfoVal = (id, type) => {
	return apiClient.get(
		ApiControllers.deposit + `GetScoreChainInfo/${id}/${type}`
	);
};
const getReferalDetails = (customerId) =>{
	return apiClient.get(ApiControllers.partner + `getReferralDetails/customer/${customerId}`);
}
const getPayeeLu = (customerId,currency) => {
    return apiClient.get(
        ApiControllers.addressbook + `PayeeLu/${customerId}/${currency}`
    );
};
const saveTransferData=(obj)=>{
	return apiClient.post(ApiControllers.addressbook+'payee',obj)
}
const getRecipientData=(customerId,type,addressbookId)=>{
	return apiClient.get(
        ApiControllers.addressbook + `payee/Withdraw/Favourite/${addressbookId}/${customerId}/${type}`
    );
}
const getPayeeCryptoLu = (customerId,currency) => {
	return apiClient.get(
		ApiControllers.addressbook + `PayeeCryptoLu/${customerId}/${currency}`
	);
};
const getPayeeCrypto = (customerId,currency) => {
	return apiClient.get(
		ApiControllers.addressbook + `PayeeCrypto/${customerId}/${currency}`
	);
};
const confirmCryptoTransaction = (obj) => {
    return apiClient.post(ApiControllers.withdraw + `/Crypto/Confirm`, obj);
}
let apicalls = {
	getportfolio,
	getCryptos,
	getMember,
	sumsubacesstoken,
	updateKyc,
	sumsubacesstokennew,
	sumsublivenessacesstoken,
	 trackEvent,
	sellMemberCrypto,
	convertLocalLang,
	getIBANData,
	getdshKpis,
	getdshcumulativePnl,
	getAssetNetwroth,
	getAssetAllowcation,
	getprofits,
	getdailypnl,
	getCode,
	getVerification,
	getIpRegistery,
	encryptValue,
	downloadKyc,
	updateSecurity,
	sendEmail,
	verifyEmail,
	getAuthenticator,
	getVerificationFields,
	twofactor,
	getInfoVal,
	getReferalDetails,getPayeeLu,saveTransferData,getRecipientData,getCustomerBankDetails,getAccountDetails,
	getPayeeCryptoLu,
	getPayeeCrypto,
	confirmCryptoTransaction
};
export default apicalls;
