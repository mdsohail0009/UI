import { apiClient } from "../../api";
import { ApiControllers } from "../../api/config";
const getCryptoWithDrawWallets = ({ memberId }) => {
    return apiClient.get(ApiControllers.wallets + `Crypto/${memberId}`)
}
const withDrawCrypto = (obj) => {
    return apiClient.post(ApiControllers.depositWithdraw + `Withdraw/Crypto`, obj)
}
const getWithdrawmemberCrypto = ({ memberId }) => {
    return apiClient.get(ApiControllers.depositWithdraw + `Withdraw/Crypto/${memberId}`)
}
const handleNewExchangeAPI = ({ memberId, amount, coin, address }) => {
    return apiClient.get(ApiControllers.depositWithdraw + `Withdraw/Crypto/Confirm/${memberId}/${coin}/${amount}/${address}`);
}
const handleFiatConfirm = (obj) => {
    return apiClient.post(ApiControllers.depositWithdraw + `Withdraw/Fiat/Confirm`, obj);
}
export { getCryptoWithDrawWallets, withDrawCrypto, getWithdrawmemberCrypto, handleNewExchangeAPI,handleFiatConfirm }