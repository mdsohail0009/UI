import { apiClient } from "../../api";
import { ApiControllers } from "../../api/config";
const getCryptoWithDrawWallets = () => {
    return apiClient.get(ApiControllers.wallets + `Crypto`)
}
const withDrawCrypto = (obj) => {
    return apiClient.post(ApiControllers.withdraw + `Withdraw/Crypto`, obj)
}
const getWithdrawmemberCrypto = () => {
    return apiClient.get(ApiControllers.withdraw + `Withdraw/Crypto`)
}
const handleNewExchangeAPI = (obj) => {
    return apiClient.post(ApiControllers.withdraw + `Crypto/Confirm`, obj);
 }
const handleFiatConfirm = (obj) => {
    return apiClient.post(ApiControllers.withdraw + `Withdraw/Fiat/Confirm`, obj);
}
const updateSecurity = (obj) => {
    return apiClient.put(ApiControllers.master + "UpdateSecurity", obj);
};
const getNetworkLu = (wallet) => {
    return apiClient.get(ApiControllers.common + `NetWorkLU/${wallet}`);
}
export { getCryptoWithDrawWallets, withDrawCrypto, getWithdrawmemberCrypto, handleNewExchangeAPI, handleFiatConfirm, updateSecurity, getNetworkLu }