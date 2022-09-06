import { fetchFeaturePermissions } from "../../../reducers/feturesReducer";
import { store } from "../../../store"

const getFeatureId = (path) => {
    const { menuItems: { features } } = store.getState();
    const feature = features?.data?.find(item => item.path == path);
    return feature?.id;
}
const getFeatureWithKeyId = (key) => {
    const { menuItems: { features:{originalData} } } = store.getState();
    const feature = originalData?.find(item => item.key == key);
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
const getFeaturePermissionsByKeyName = (key) => {
    const {userConfig:{userProfileInfo},menuItems:{featurePermissions}}=store.getState();
    const fid = getFeatureWithKeyId(key);
    if(!featurePermissions[key]){
        store.dispatch(fetchFeaturePermissions(fid,userProfileInfo.id));
    }
}
export { getFeatureId, getFeatureWithKeyId,getFeaturePermissionsByKey, getFeaturePermissionsByKeyName };