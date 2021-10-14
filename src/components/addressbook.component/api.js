import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config';

const favouriteFiatAddress = (member_id, type, coin_code) => {
    return apiClient.get(ApiControllers.depositWithdraw + `FavouriteLu?memberId=${member_id}&type=${type}&coin=${coin_code}`);
}
const detailsAddress = (id) => {
    return apiClient.get(ApiControllers.depositWithdraw + `RequestFavourite?id=${id}` );
}
const favouriteNameCheck = (member_id, name, type,favaddrId) => {
    return apiClient.get(ApiControllers.depositWithdraw + `FavouriteNameCheck?memberId=${member_id}&name=${name}&type=${type}&favaddrId=${favaddrId}`);
}
const saveAddress = (obj) => {
    return apiClient.post(ApiControllers.depositWithdraw + `AddFavourite`, obj);
}
const getCoinList = (member_id) => {
    return apiClient.get(ApiControllers.swap+`MemberCoins?memberId=${member_id}`);
}
const getSelectedCoinDetails = (coin_code, member_id) => {
    return apiClient.get(ApiControllers.buySell + `MemberCoinDetail?memberId=${member_id}&coin=${coin_code}`)
}
const activeInactive = (obj) => {
    return apiClient.post(ApiControllers.admin + "useractiveinactive", obj)
}
const getAddress = (addreddId, type) => {
    return apiClient.get(ApiControllers.depositWithdraw + `CreateAddressFavourite?addrId=${addreddId}&type=${type}`)
}
export {getCoinList,favouriteFiatAddress, saveAddress,getSelectedCoinDetails,detailsAddress,favouriteNameCheck,activeInactive,getAddress}
