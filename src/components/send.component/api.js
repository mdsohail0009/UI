import { apiClient } from "../../api";
import { ApiControllers } from "../../api/config";
const getCryptoWithDrawWallets = ({ memberId }) => {
    return apiClient.get(ApiControllers.member + `MemberCrypto?memberId=${memberId}`)
}
const withDrawCrypto = (obj)=>{
    return apiClient.post(ApiControllers.depositWithdraw+`WithdrawCrypto`,obj)
}
const getWithdrawmemberCrypto = ({ memberId }) => {
    return apiClient.get(ApiControllers.depositWithdraw + `WithDrawMemberCrypto?memberId=${memberId}`)
}
export { getCryptoWithDrawWallets,withDrawCrypto,getWithdrawmemberCrypto }