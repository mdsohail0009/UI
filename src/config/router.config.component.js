import { Switch, Route as ReactRoute } from 'react-router-dom';
import React, { Component } from 'react';
import Route from '../authentication/protected.route'
import TestingPage from '../components/test.pages/testing.page';
const Dashboard = React.lazy(() => import('../components/dashboard.component'));
const CallbackPage = React.lazy(() => import('../authentication/callback.component'));
const Login = React.lazy(() => import('../authentication/login.component'));
class RoutingComponent extends Component {
  render() {
    return <Switch>
      <React.Suspense fallback={<p>Loading...</p>}>
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/callback" component={CallbackPage} />
        <Route path="/test" component={TestingPage} />
        <ReactRoute path="/login" component={Login} />
      </React.Suspense>
    </Switch>
  }

}

export default RoutingComponent;