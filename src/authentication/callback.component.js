import React from "react";
import { connect } from "react-redux";
import { CallbackComponent } from "redux-oidc";
import { profileSuccess } from "../reducers/authReducer";
import { userManager } from "./index";
class CallbackPage extends React.Component {
    handleSuccess = (user) => {
        debugger
        this.handleRedirect(user)
    }
    handleRedirect = (user) => {
        this.props.updateProfile(user)
        const url = localStorage.getItem("__url");
        localStorage.removeItem("__url");
        this.props.history.push(url && url !== "/callback" ? url : "/")
    }
    render() {
        return (
            <CallbackComponent
                userManager={userManager}
                successCallback={(user) => this.handleSuccess(user)}
                errorCallback={error => {
                    debugger
                    console.error(error);
                }}
            >
                <div>Loading .....</div>
            </CallbackComponent>
        );
    }
}
const mapStateToProps = ({ oidc }) => {
    return { oidc }
}
const mapDispatchToProps = dispatch => {
    return { updateProfile: (info) => { dispatch(profileSuccess(info)) } }
}
export default connect(mapStateToProps, mapDispatchToProps)(CallbackPage);