import { apiClient, ipRegistry ,bankClient} from "./";
import { ApiControllers } from "./config";
import counterpart from "counterpart";
import CryptoJS from "crypto-js";

const getportfolio = () => {
	return apiClient.get(ApiControllers.wallets + `Crypto`);
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

const getdshKpis = () => {
	return apiClient.get(ApiControllers.dashboard + `KPI/User`);
};
const getdshcumulativePnl = (Days) => {
	return apiClient.get(
		ApiControllers.dashboard + `CumulativePNL/User/${Days}`
	);
};
const getAssetNetwroth = (Days) => {
	return apiClient.get(
		ApiControllers.dashboard + `AssetsNetWorth/User/${Days}`
	);
};
const getAssetAllowcation = (Days) => {
	return apiClient.get(
		ApiControllers.dashboard + `AssetAllocation/User/${Days}`
	);
};
const getprofits = (Days) => {
	return apiClient.get(ApiControllers.dashboard + `Profits/User/${Days}`);
};
const getdailypnl = (Days) => {
	return apiClient.get(ApiControllers.dashboard + `DailyPNL/User/${Days}`);
};

const getCode = ( isResendOTP) => {
	return apiClient.get(
		ApiControllers.master + `SendOTP/${isResendOTP}`
	);
};
const getVerification = ( code) => {
	return apiClient.get(
		ApiControllers.master + `OTPVerification/${code}`
	);
};

const downloadKyc = () => {
	return apiClient.get(ApiControllers.customers + `DownloadFile`);
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
const sendEmail = (isResendOTP) => {
	return apiClient.get(
		ApiControllers.master + `SendEmailOTP/${isResendOTP}`
	);
};

const verifyEmail = ( code) => {
	return apiClient.get(
		ApiControllers.master + `EmailOTPVerification/${code}`
	);
};
const getAuthenticator = (Code, customerId) => {
	return apiClient.get(
		ApiControllers.master + `VerifyAuthenticator/${Code}/${customerId}`
	);
};
const getVerificationFields = () => {
	return apiClient.get(
		ApiControllers.master + `Verificationfields`
	);
};
const twofactor = () => {
	return apiClient.get(ApiControllers.customers + `twofactor`);
};

const getInfoVal = (id, type) => {
	return apiClient.get(
		ApiControllers.deposit + `GetScoreChainInfo/${id}/${type}`
	);
};
const getReferalDetails = () =>{
	return apiClient.get(ApiControllers.partner + `getReferralDetails/customer`);
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
const getPayeeCryptoLu = (currency) => {
	return apiClient.get(
		ApiControllers.addressbook + `PayeeCryptoLu/${currency}`
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
const convertUTCToLocalTime = (dateString) => {
	let date = new Date(dateString);
	const milliseconds = Date.UTC(
		date.getFullYear(),
		date.getMonth(),
		date.getDate(),
		date.getHours(),
		date.getMinutes(),
		date.getSeconds()
	);
	const localTime = new Date(milliseconds);
	return ;
};
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
	confirmCryptoTransaction,
	convertUTCToLocalTime
};
export default apicalls;
