import { fetchFeaturePermissions } from "../../../reducers/feturesReducer";
import { store } from "../../../store"

const getFeatureId = (path) => {
    const { menuItems: { features } } = store.getState();
    const feature = features?.data?.find(item => item.path == path);
    return feature?.id;
}
const getFeatureWithKeyId = (key) => {
    const { menuItems: { features } } = store.getState();
    const feature = features?.data?.find(item => item.key == key);
    return feature?.id;
}
const getFeaturePermissionsByKey = (key,callback) => {
    const {userConfig:{userProfileInfo},menuItems:{featurePermissions}}=store.getState();
    const fid = getFeatureWithKeyId(key);
    if(featurePermissions[key]){
        callback();
    }else{
        store.dispatch(fetchFeaturePermissions(fid,userProfileInfo.id,callback));
    }
}
export { getFeatureId, getFeatureWithKeyId,getFeaturePermissionsByKey };