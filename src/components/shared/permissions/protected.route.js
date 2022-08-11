import { Route } from "react-router-dom"
import { fetchFeaturePermissions } from "../../../reducers/feturesReducer";
import { store } from "../../../store"
import AccessDenied from "./access.denied";
const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { menuItems: { features, featurePermissions }, userConfig: { userProfileInfo } } = store.getState();
    return <Route {...rest} render={(props) => {
        if (featurePermissions[rest.key]) {

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