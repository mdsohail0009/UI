import { Route } from "react-router-dom"
import { fetchFeaturePermissions } from "../../../reducers/feturesReducer";
import { store } from "../../../store"
import AccessDenied from "./access.denied";
import { KEY_URL_MAP } from "./config";

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { menuItems: { features, featurePermissions }, userConfig: { userProfileInfo } } = store.getState();
    return <Route {...rest} render={(props) => {
        if (featurePermissions[KEY_URL_MAP][props.path]) {

        } else {
            const featureId = features.data?.find(feature => feature.key === rest.key)?.id;
            store.dispatch(fetchFeaturePermissions(featureId, userProfileInfo.id, () => {
                const view = featurePermissions?.actions?.find(permission => permission.permissionName === "view").values;
                if (view) {
                    return <Component {...rest} />
                } else {
                    <AccessDenied />
                }
            }));
        }
    }} />
}

export default ProtectedRoute; 