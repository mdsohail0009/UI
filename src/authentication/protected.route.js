import React, { useEffect } from 'react';
import { Route, withRouter } from 'react-router-dom';
import config from '../config/config';
import { store } from '../store';
import connectStateProps from '../utils/state.connect';
import { userManager } from './';

const ProtectedRoute = ({ component: Component, ...rest }) => {
    const state = store.getState();
    const { user } = state?.oidc;
    window.scrollTo(0, 0)
    useEffect(() => {
        // if (!user || user.expired) {
        //     const { loginMethod } = config;
        //     switch (loginMethod) {
        //         case "self":
        //             rest.history.push("/login")
        //             break;
        //         case "identity":
        //             userManager.signinRedirect();
        //             break;
        //         default:
        //             userManager.signinRedirect();
        //     }

        // }
    }, [])
    return (
        <Route {...rest} render={
            (props) => <Component {...rest} {...props} />
        } />
    )
}

export default connectStateProps(withRouter(ProtectedRoute));

