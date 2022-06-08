import { apiClient } from "../../api";
import { ApiControllers } from "../../api/config";
const getCryptoWithDrawWallets = ({ memberId }) => {
    return apiClient.get(ApiControllers.wallets + `Crypto/${memberId}`)
}
const withDrawCrypto = (obj) => {
    return apiClient.post(ApiControllers.withdraw + `Withdraw/Crypto`, obj)
}
const getWithdrawmemberCrypto = ({ memberId }) => {
    return apiClient.get(ApiControllers.withdraw + `Withdraw/Crypto/${memberId}`)
}
const handleNewExchangeAPI = ({ memberId, amount, coin, address }) => {
    return apiClient.get(ApiControllers.withdraw + `Withdraw/Crypto/Confirm/${memberId}/${coin}/${amount}/${address}`);
}
const handleFiatConfirm = (obj) => {
    return apiClient.post(ApiControllers.withdraw + `Withdraw/Fiat/Confirm`, obj);
}
const updateSecurity = (obj) => {
    return apiClient.put(ApiControllers.master + "UpdateSecurity", obj);
  };
export { getCryptoWithDrawWallets, withDrawCrypto, getWithdrawmemberCrypto, handleNewExchangeAPI,handleFiatConfirm,updateSecurity }