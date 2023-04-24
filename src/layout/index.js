import React, { Component } from 'react'
import { Layout as AntLayout } from 'antd';
import './layout.css'
import Content from './content.component';
import Header from '../layout/header.component';
import Footer from './footer.component';
import ConnectStateProps from '../utils/state.connect';
import { userManager } from '../authentication';
import OnBoarding from './onboard.component';
import CallbackPage from '../authentication/callback.component';
import { clearUserInfo } from '../reducers/configReduser';
import { profileSuccess, setToken } from "../reducers/authReducer";
import { withCookies } from 'react-cookie';
import { useAuth0 } from "@auth0/auth0-react";
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useState } from 'react';

const Layout = (props) => {
    const [state, setState] = useState({
        showResult: false,
        apiMessage: "",
        error: null,
    });
    const { isAuthenticated, loginWithRedirect, user, getAccessTokenSilently, isLoading, error } = useAuth0();

    const callApi = async () => {
        try {
            const token = await getAccessTokenSilently();
            props.acctoken(token)
        } catch (error) {
        }
    };
    useEffect(() => {
        if (!isAuthenticated) {
            loginWithRedirect();
        } else {
            callApi();
            props.updateProfile(user);
        }
    }, []);
    const redirect = () => {

        userManager.removeUser()
        window.open(process.env.REACT_APP_ADMIN_URL, "_self")
    }
    if (!isAuthenticated || !props.oidc.profile || !props.oidc.deviceToken) {
        return <div className="loader">Loading .....</div>
    } else if (props.oidc.profile && !props.userProfile) {
        return <OnBoarding />
    } else if (props.userProfile && props.userProfile?.role === 'Admin') {
        return <>{redirect()}</>
    } else if (props.twoFA?.loading) {
        return <div className="loader">Loading .....</div>
    }

    if (error) {
        return <div>Oops... {error.message}</div>;
    }
    if (isLoading) {
        return <div className="loader">Loading .....</div>
    }

    return (
        <>
            <AntLayout>
                <Header />
                <Content />
                <Footer />
            </AntLayout>
        </>
    )

}
const mapStateToProps = ({ oidc, userConfig }) => {
    return { oidc, userProfile: userConfig.userProfileInfo }

}
const mapDispatchToProps = dispatch => {
    return {
        updateProfile: (info) => { dispatch(profileSuccess(info)) },
        acctoken: (data) => { dispatch(setToken(data)) }
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(Layout));