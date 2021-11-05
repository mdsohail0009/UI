import { apiClient } from '../../api'
import { ApiControllers } from '../../api/config'
const createCryptoDeposit = ({ memberId, walletCode }) => {
    return apiClient.get(ApiControllers.depositWithdraw + `RequestDepositCrypto?memberId=${memberId}&walletCode=${walletCode}`)
}
const getCurrencywithBank=()=>{
    return apiClient.get(ApiControllers.depositWithdraw + `Withdraw/CurrencyWithBank`)
}
const savedepositFiat=(obj)=>{
    return apiClient.post(ApiControllers.depositWithdraw + `Deposit/Fiat`,obj)
}
const requestDepositFiat=(bankId,memId)=>{
    return apiClient.get(ApiControllers.depositWithdraw + `Deposit/Fiat/`+memId+'/'+bankId)
}
export { createCryptoDeposit,getCurrencywithBank ,savedepositFiat,requestDepositFiat}