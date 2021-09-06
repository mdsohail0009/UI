import React, { useEffect } from 'react';
import { Route, withRouter } from 'react-router-dom';
import connectStateProps from '../utils/state.connect';
const ProtectedRoute = ({ component: Component, ...rest }) => {
    useEffect(() => {
    }, [])
    return (
        <Route {...rest} render={
            (props) => <Component {...rest} {...props} />
        } />
    )
}

export default connectStateProps(withRouter(ProtectedRoute));

