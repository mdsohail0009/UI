import { apiClient } from "../../api";
import { ApiControllers } from "../../api/config"


const gettransforLu = () => {
	return apiClient.get(ApiControllers.common + `PartnerWalletTypesLU`);
};
const getCurrencyLu = () => {
	return apiClient.get(ApiControllers.earn + 'ListofCurrencies' );
};
const getcurrencyBalance = (fromwallet,currency) => {
	return apiClient.get(ApiControllers.earn + `AvailableBalance/${fromwallet}/${currency}` );
};
const saveTransfor = (obj) => {
	return apiClient.post(ApiControllers.earn + `SaveTransfer`,obj );
};

export {gettransforLu, getCurrencyLu, getcurrencyBalance, saveTransfor}