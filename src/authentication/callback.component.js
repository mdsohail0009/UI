import { useAuth0 } from "@auth0/auth0-react";
import React from "react";
import { useEffect } from "react";

const CallbackPage = () => {
    const { isLoading, error, isAuthenticated } = useAuth0()
    const handleSuccess = (user) => {
        this.handleRedirect(user)
    }
    const handleRedirect = (user) => {
        this.props.updateProfile(user)
        const url = localStorage.getItem("__url");
        localStorage.removeItem("__url");
        this.props.history.push(url && url !== "/callback" ? url : "/onboading")
        this.props.cookies.set('SID', user.profile.sub, { path: '/', domain: process.env.REACT_APP_SUBDOMAIN || window.location.hostname })
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
export default CallbackPage;