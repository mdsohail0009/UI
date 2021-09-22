import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config';

const favouriteFiatAddress = (member_id, type) => {
    return apiClient.get(ApiControllers.exchange + `FavouriteLu?memberId=${member_id}&type=${type}`);
}
const detailsAddress = (id) => {
    return apiClient.get(ApiControllers.exchange + `RequestFavourite?id=${id}` );
}
const favouriteNameCheck = (member_id, name) => {
    return apiClient.get(ApiControllers.exchange + `FavouriteNameCheck?memberId=${member_id}&name=${name}`);
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
export {getCoinList,favouriteFiatAddress, saveAddress,getSelectedCoinDetails,detailsAddress,favouriteNameCheck}
