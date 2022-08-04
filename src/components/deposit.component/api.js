import { apiClient } from '../../api'
import { ApiControllers } from '../../api/config'
const createCryptoDeposit = ({ customerId, walletCode }) => {
    return apiClient.get(ApiControllers.deposit + `Deposit/Crypto/${customerId}/${walletCode}`)
}
const getCurrencywithBank=()=>{
    return apiClient.get(ApiControllers.withdraw + `Withdraw/CurrencyWithBank`)
}
const savedepositFiat=(obj)=>{
    return apiClient.post(ApiControllers.deposit + `Deposit/Fiat`,obj)
}
const requestDepositFiat=(bankId,customerId)=>{
    return apiClient.get(ApiControllers.deposit + `Deposit/Fiat/`+customerId+'/'+bankId)
}
export { createCryptoDeposit,getCurrencywithBank ,savedepositFiat,requestDepositFiat}