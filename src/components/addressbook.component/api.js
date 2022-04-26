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
// https://apitst.suissebase.ch/api/v1/DepositeWithdraw/CreateAddressFavourite?addrId=cd0599b9-9745-4e50-8f15-ea31dcd631e3&type=fiat
// https://apitst.suissebase.ch/api/v1/DepositeWithdraw/CreateAddressFavourite?addrId=e7269eeb-c967-404b-a757-c249e5327d5c&type=crypto
const getAddress = (addreddId) => {
    return apiClient.get(ApiControllers.depositWithdraw + `Withdraw/Favourite/${addreddId}`)
}
export {getCoinList,favouriteFiatAddress, saveAddress,getSelectedCoinDetails,detailsAddress,favouriteNameCheck,activeInactive,getAddress}
            