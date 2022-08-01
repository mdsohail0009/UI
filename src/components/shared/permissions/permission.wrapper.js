import { useState } from "react"
import { connect } from "react-redux"
import { withRouter } from "react-router-dom"
import AccessDenied from "./access.denied"
import { KEY_URL_MAP } from "./config"

const PermissionWrapper = ({ component: Component, ...props }) => {
    const getView = () => {
        let view = props.featurePermissions[KEY_URL_MAP[props.pathname || props.history.pathname]]?.actions?.filter(permission => permission.permissionName.toLowerCase() === "view");
        return view?.values || false;

    }
    if (!props.featurePermissions.loading && !getView()) {
        return <AccessDenied />
    }
    else
        return <Component />
}
const connectStateToProps = ({ menuItems }) => {

    return { features: menuItems?.features, featurePermissions: menuItems.featurePermissions }
}
export default withRouter(connect(connectStateToProps)(PermissionWrapper));