import { apiClient, ipRegistry } from "../../api";
import { ApiControllers } from "../../api/config"


const gettransforLu = (memID) => {
	return apiClient.get(ApiControllers.common + `PartnerWalletTypesLU`);
};
const getCurrencyLu = (memID) => {
	return apiClient.get(ApiControllers.earn + `ListofCurrencies/0FB1BCCC-B347-4587-BD1A-CE02D6FD1B71` );
};
const getcurrencyBalance = (memID) => {
	return apiClient.get(ApiControllers.earn + `AvailableBalance/0FB1BCCC-B347-4587-BD1A-CE02D6FD1B71/Partner/USD` );
};
const saveTransfor = (obj) => {
	return apiClient.post(ApiControllers.earn + `SaveTransfer`,obj );
};

export {gettransforLu, getCurrencyLu, getcurrencyBalance, saveTransfor}