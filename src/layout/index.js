import React, { useEffect,useState } from 'react'
import { Layout as AntLayout } from 'antd';
import './layout.css'
import Content from './content.component';
import Header from '../layout/header.component';
import Footer from './footer.component';
import OnBoarding from './onboard.component';
import { profileSuccess, setToken } from "../reducers/authReducer";
import { withCookies } from 'react-cookie';
import { useAuth0 } from "@auth0/auth0-react";
import { connect } from 'react-redux';
import { userLogout } from "../reducers/authReducer";

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
            props.updateProfile(user);
        } catch (error) {
        }
    };
    useEffect(() => {
        if (!isAuthenticated) {
            props.dispatch(userLogout());
            loginWithRedirect();
        } else {
            callApi();
        }
    }, []);
    const redirect = () => {

        //userManager.removeUser()
        window.open(process.env.REACT_APP_ADMIN_URL, "_self")
    }
    if (!isAuthenticated || !props?.oidc?.profile || !props?.oidc?.deviceToken) {
        return <div className="loader">Loading .....</div>
    } else if (props?.oidc?.profile && !props?.userProfile) {
        return <OnBoarding />
    } else if (props?.userProfile && props?.userProfile?.role === 'Admin') {
        return <>{redirect()}</>
    } else if (props?.twoFA?.loading) {
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
        acctoken: (data) => { dispatch(setToken(data)) },
        dispatch
    }

}

export default connect(mapStateToProps, mapDispatchToProps)(withCookies(Layout));