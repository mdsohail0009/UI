import { apiClient } from "../../api";
import { ApiControllers } from "../../api/config";
const getCryptoWithDrawWallets = ({ memberId }) => {
    return apiClient.get(ApiControllers.exchange + `MemberCrypto?memberId=${memberId}`)
}
const withDrawCrypto = (obj)=>{
    return apiClient.post(ApiControllers.exchange+`WithdrawCrypto`,obj)
}
const getWithdrawmemberCrypto = ({ memberId }) => {
    return apiClient.get(ApiControllers.exchange + `WithDrawMemberCrypto?memberId=${memberId}`)
}
export { getCryptoWithDrawWallets,withDrawCrypto,getWithdrawmemberCrypto }