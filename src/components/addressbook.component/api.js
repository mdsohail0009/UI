import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config';

const favouriteFiatAddress = () => {
    return apiClient.get(ApiControllers.exchange + "RequestFavourite");
}
const saveAddress = (obj) => {
    return apiClient.post(ApiControllers.exchange + `AddFavourite`, obj);
}
const getCoinList = (member_id) => {
    return apiClient.get(ApiControllers.exchange+`MemberCoins?memberId=${member_id}`);
}
const getSelectedCoinDetails = (coin_code, member_id) => {
    return apiClient.get(ApiControllers.exchange + `MemberCoinDetail?memberId=${member_id}&coin=${coin_code}`)
}
export {getCoinList,favouriteFiatAddress, saveAddress,getSelectedCoinDetails}
