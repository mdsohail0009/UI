import { apiClient, ipRegistry } from "../../api";
import { ApiControllers } from "../../api/config"


const gettransforLu = (memID) => {
	return apiClient.get(ApiControllers.common + `PartnerWalletTypesLU`);
};
const getCurrencyLu = (memID) => {
	return apiClient.get(ApiControllers.earn + `ListofCurrencies/${memID}` );
};
const getcurrencyBalance = (memID,fromwallet,currency) => {
	return apiClient.get(ApiControllers.earn + `AvailableBalance/${memID}/${fromwallet}/${currency}` );
};
const saveTransfor = (obj) => {
	return apiClient.post(ApiControllers.earn + `SaveTransfer`,obj );
};

export {gettransforLu, getCurrencyLu, getcurrencyBalance, saveTransfor}