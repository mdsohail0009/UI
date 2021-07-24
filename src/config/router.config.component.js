import { Switch, Route as ReactRoute, Redirect } from 'react-router-dom';
import React, { Component } from 'react';
import Route from '../authentication/protected.route';
const Dashboard = React.lazy(() => import('../components/dashboard.component'));
const CallbackPage = React.lazy(() => import('../authentication/callback.component'));
const Login = React.lazy(() => import('../authentication/login.component'));
const ChangePassword = React.lazy(() => import('../components/changepassword'));
class RoutingComponent extends Component {
  render() {
    return <Switch>
      <React.Suspense fallback={<div className="loader">Loading...</div>}>
        <Route path="/dashboard" component={Dashboard} />
        <ReactRoute path="/callback" component={CallbackPage} />
        <ReactRoute path="/login" component={Login} />
        <ReactRoute path="/changepassword" component={ChangePassword} />
        <Redirect to="/dashboard" path="/" exact/>
      </React.Suspense>
    </Switch>
  }

}

export default RoutingComponent;