import { connect } from "react-redux";
import { Route } from "react-router-dom"
import { fetchFeaturePermissions } from "../../../reducers/feturesReducer";
import AccessDenied from "./access.denied";
const ProtectedRoute = ({ component: Component, ...rest }) => {
    const { menuItems: { features, featurePermissions }, userProfileInfo } = rest;
    return <Route {...rest} render={(props) => {
        
            const featureId = features.data?.find(feature => feature.key === rest.key)?.id;
            rest.dispatch(fetchFeaturePermissions(featureId, userProfileInfo.id, () => {
                const view = featurePermissions?.actions?.find(permission => permission.permissionName === "view").values;
                if (view) {
                    return <Component {...rest} />
                } else {
                    <AccessDenied />
                }
            }));
       
    }} />
}
const connectStateToProps = ({ menuItems, userConfig }) => {
    return { menuItems, userProfileInfo: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return { dispatch }
}
export default connect(connectStateToProps, connectDispatchToProps)(ProtectedRoute); 