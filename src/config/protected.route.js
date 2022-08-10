import { connect } from "react-redux";
import { Route } from "react-router-dom";
import Loader from "../Shared/loader";

const ProtectedRoute = ({ component: Component, ...props }) => {

debugger
    if (props.featurePermissions.loading) {
        return <Loader />
    }
    return <Route path={props.path} component={Component} />
}
const connectStateToProps = ({ menuItems }) => {

    return { featurePermissions: menuItems.featurePermissions }
}
export default connect(connectStateToProps)(ProtectedRoute);