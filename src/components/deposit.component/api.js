import { apiClient } from '../../api'
import { ApiControllers } from '../../api/config'
const createCryptoDeposit = ({ walletCode, network }) => {
    return apiClient.get(ApiControllers.deposit + `Deposit/Crypto/${walletCode}/${network}`)
}
const getCurrencywithBank=()=>{
    return apiClient.get(ApiControllers.withdraw + `Withdraw/CurrencyWithBank`)
}
const savedepositFiat=(obj)=>{
    return apiClient.post(ApiControllers.deposit + `Deposit/Fiat`,obj)
}
const requestDepositFiat=(bankId)=>{
    return apiClient.get(ApiControllers.deposit + `Deposit/Fiat/`+bankId)
}
export { createCryptoDeposit,getCurrencywithBank ,savedepositFiat,requestDepositFiat}