import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config';

const favouriteFiatAddress = (member_id, type, coin_code) => {
    return apiClient.get(ApiControllers.exchange + `FavouriteLu?memberId=${member_id}&type=${type}&coin=${coin_code}`);
}
const detailsAddress = (id) => {
    return apiClient.get(ApiControllers.exchange + `RequestFavourite?id=${id}` );
}
const favouriteNameCheck = (member_id, name, type,) => {
    return apiClient.get(ApiControllers.exchange + `FavouriteNameCheck?memberId=${member_id}&name=${name}&type=${type}`);
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
const activeInactive = (obj) => {
    return apiClient.post(ApiControllers.exchange + "activeinactive", obj)
}
const getAddress = (addreddId, type) => {
    return apiClient.get(ApiControllers.exchange + `CreateAddressFavourite?addrId=${addreddId}&type=${type}`)
}
export {getCoinList,favouriteFiatAddress, saveAddress,getSelectedCoinDetails,detailsAddress,favouriteNameCheck,activeInactive,getAddress}
