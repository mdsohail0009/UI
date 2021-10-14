import { apiClient } from '../../api'
import { ApiControllers } from '../../api/config'
const createCryptoDeposit = ({ memberId, walletCode }) => {
    return apiClient.get(ApiControllers.depositWithdraw + `RequestDepositCrypto?memberId=${memberId}&walletCode=${walletCode}`)
}
const getCurrencywithBank=()=>{
    return apiClient.get(ApiControllers.admin + `CommissionCurrencyWithBank`)
}
const savedepositFiat=(obj)=>{
    return apiClient.post(ApiControllers.exchange + `UserDepositFiat`,obj)
}
const requestDepositFiat=(bankId,memId)=>{
    return apiClient.get(ApiControllers.exchange + `RequestDepositFiat?memberId=`+memId+'&bankId='+bankId)
}
export { createCryptoDeposit,getCurrencywithBank ,savedepositFiat,requestDepositFiat}