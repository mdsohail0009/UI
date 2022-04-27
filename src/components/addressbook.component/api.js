import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config';

const favouriteFiatAddress = (member_id, type, coin_code) => {
    return apiClient.get(ApiControllers.depositWithdraw + `Favourite/${member_id}/${type}/${coin_code}`);
}
const detailsAddress = (id) => {
    return apiClient.get(ApiControllers.depositWithdraw + `Withdraw/Favourite/${id}` );
}
const favouriteNameCheck = (member_id, name, type,favaddrId) => {
    return apiClient.get(ApiControllers.depositWithdraw + `Favourite/${favaddrId}/${member_id}/${name}/${type}`);
}
const saveAddress = (obj) => {
    return apiClient.post(ApiControllers.depositWithdraw + `Favourite`, obj);
}
const getCoinList = (type) => {
    return apiClient.get(ApiControllers.markets + `Coins/${type}`);
}
const getSelectedCoinDetails = (coin_code, member_id) => {
    return apiClient.get(ApiControllers.buySell + `${member_id}/Coins/${coin_code}`)
}
const activeInactive = (obj) => {
    return apiClient.put(ApiControllers.master + "useractiveinactive", obj)
}
const getAddress = (addreddId) => {
    return apiClient.get(ApiControllers.depositWithdraw + `Withdraw/Favourite/${addreddId}`)
}
export {getCoinList,favouriteFiatAddress, saveAddress,getSelectedCoinDetails,detailsAddress,favouriteNameCheck,activeInactive,getAddress}
            