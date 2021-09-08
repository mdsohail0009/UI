import { apiClient } from '../../api'
import { ApiControllers } from '../../api/config'
const createCryptoDeposit = ({ memberId, walletCode }) => {
    return apiClient.get(ApiControllers.exchange + `RequestDepositCrypto?memberId=${memberId}&walletCode=${walletCode}`)
}
const getCurrencywithBank=()=>{
    return apiClient.get(ApiControllers.exchange + `CurrencyWithBank`)
}
const savedepositFiat=(obj)=>{
    return apiClient.post(ApiControllers.exchange + `UserDepositFiat`,obj)
}
export { createCryptoDeposit,getCurrencywithBank ,savedepositFiat}