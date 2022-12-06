import { apiClient } from "../../api";
import { ApiControllers } from "../../api/config"


const gettransforLu = (customerId) => {
	return apiClient.get(ApiControllers.common + `PartnerWalletTypesLU`);
};
const getCurrencyLu = (customerId) => {
	return apiClient.get(ApiControllers.earn + `ListofCurrencies/${customerId}` );
};
const getcurrencyBalance = (customerId,fromwallet,currency) => {
	return apiClient.get(ApiControllers.earn + `AvailableBalance/${customerId}/${fromwallet}/${currency}` );
};
const saveTransfor = (obj) => {
	return apiClient.post(ApiControllers.earn + `SaveTransfer`,obj );
};

export {gettransforLu, getCurrencyLu, getcurrencyBalance, saveTransfor}