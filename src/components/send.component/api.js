import { apiClient } from "../../api";
import { ApiControllers } from "../../api/config";
const getCryptoWithDrawWallets = ({ memberId }) => {
    return apiClient.get(ApiControllers.exchange + `MemberCrypto?memberId=${memberId}`)
}

export { getCryptoWithDrawWallets }