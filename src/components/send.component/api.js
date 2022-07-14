import { apiClient } from "../../api";
import { ApiControllers } from "../../api/config";
const getCryptoWithDrawWallets = ({ customerId }) => {
    return apiClient.get(ApiControllers.wallets + `Crypto/${customerId}`)
}
const withDrawCrypto = (obj) => {
    return apiClient.post(ApiControllers.withdraw + `Withdraw/Crypto`, obj)
}
const getWithdrawmemberCrypto = ({customerId }) => {
    return apiClient.get(ApiControllers.withdraw + `Withdraw/Crypto/${customerId}`)
}
const handleNewExchangeAPI = ({ customerId, amount, coin, address }) => {
    return apiClient.get(ApiControllers.withdraw + `Withdraw/Crypto/Confirm/${customerId}/${coin}/${amount}/${address}`);
}
const handleFiatConfirm = (obj) => {
    return apiClient.post(ApiControllers.withdraw + `Withdraw/Fiat/Confirm`, obj);
}
const updateSecurity = (obj) => {
    return apiClient.put(ApiControllers.master + "UpdateSecurity", obj);
  };
export { getCryptoWithDrawWallets, withDrawCrypto, getWithdrawmemberCrypto, handleNewExchangeAPI,handleFiatConfirm,updateSecurity }