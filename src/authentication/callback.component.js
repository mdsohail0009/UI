import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { useEffect } from "react";
import { connect } from "react-redux";
import { checkCustomerState } from "../utils/service";

const CallbackPage = (props) => {
    const { isLoading, error, isAuthenticated } = useAuth0()
    const handleSuccess = (user) => {
        handleRedirect(user)
    }
    useEffect(() => {
        handleRedirect();
    }, []);
    const handleRedirect = (user) => {
        const url = localStorage.getItem("__url");
        if(checkCustomerState(props.userProfile)){
            props.history.push("/cockpit")
        }else{
            props.history.push("/sumsub")
        }
        localStorage.removeItem("__url");
    
    }

    return (
        // <CallbackComponent
        //     userManager={userManager}
        //     successCallback={(user) => this.handleSuccess(user)}
        //     errorCallback={error => {
        //         if(error.message === "No matching state found in storage"){
        //             window.location.replace(window.location.origin)
        //         }else{
        //             console.error(error.message);
        //         }
        //     }}
        // >
        <div className="loader">Loading ....</div>
        // </CallbackComponent>
    );

}
const connectStateToProps = ({ userConfig, menuItems }) => {
    return { userProfile: userConfig.userProfileInfo, menuItems }
}
export default connect(connectStateToProps)(CallbackPage);