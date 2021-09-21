import { apiClient } from '../../api';
import { ApiControllers } from '../../api/config';

const favouriteAddress = () => {
    return apiClient.get(ApiControllers.exchange + "RequestFavourite");
}


export { favouriteAddress }