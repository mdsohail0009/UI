import { connect } from "react-redux";
import React from 'react';
import { Route, withRouter } from "react-router-dom";
import AccessDenied from "./access.denied";
import { KEY_URL_MAP } from "./config";
class PermissionWrapper extends React.Component {
    getView = () => {
        let view = this.props.featurePermissions[KEY_URL_MAP[this.props.pathname || this.props.history.location.pathname]]?.actions?.filter(permission => permission.permissionName.toLowerCase() === "view");
        return view?.values || false;
    }
    render() {
        const { featurePermissions, component: Component } = this.props;

        return <>

            {this.getView && <Route component={Component} {...this.props} />}

        </>

    }


}
const connectStateToProps = ({ menuItems }) => {

    return { features: menuItems?.features, featurePermissions: menuItems.featurePermissions }
}
export default withRouter(connect(connectStateToProps)(PermissionWrapper));