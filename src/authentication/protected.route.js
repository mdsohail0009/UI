import React from 'react';
import { Route, withRouter } from 'react-router-dom';
import ConnectStateProps from '../utils/state.connect';
const ProtectedRoute = ({ component: Component, ...rest }) => {
   
    return (
        <Route {...rest} render={
            (props) => <Component {...rest} {...props} />
        } />
    )
}

export default ConnectStateProps(withRouter(ProtectedRoute));

