import { apiClient } from '../../api'
import { ApiControllers } from '../../api/config'
const createCryptoDeposit = ({ memberId, walletCode }) => {
    return apiClient.get(ApiControllers.deposit + `Deposit/Crypto/${memberId}/${walletCode}`)
}
const getCurrencywithBank=()=>{
    return apiClient.get(ApiControllers.withdraw + `Withdraw/CurrencyWithBank`)
}
const savedepositFiat=(obj)=>{
    return apiClient.post(ApiControllers.deposit + `Deposit/Fiat`,obj)
}
const requestDepositFiat=(bankId,memId)=>{
    return apiClient.get(ApiControllers.deposit + `Deposit/Fiat/`+memId+'/'+bankId)
}
export { createCryptoDeposit,getCurrencywithBank ,savedepositFiat,requestDepositFiat}