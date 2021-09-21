import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config';

const favouriteAddress = () => {
    return apiClient.get(ApiControllers.exchange + "RequestFavourite");
}

const getCoinList = (member_id) => {
    return apiClient.get(ApiControllers.exchange+`MemberCoins?memberId=${member_id}`);
}
export {getCoinList,favouriteAddress}
