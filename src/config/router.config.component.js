import { Switch, Route as ReactRoute } from 'react-router-dom';
import React, { Component } from 'react';
import Route from '../authentication/protected.route'
import TestingPage from '../components/test.pages/testing.page';
import Formvalidations from '../components/test.pages/form.validations'
const Dashboard = React.lazy(() => import('../components/dashboard.component'));
const CallbackPage = React.lazy(() => import('../authentication/callback.component'));
const Login = React.lazy(() => import('../authentication/login.component'));

class RoutingComponent extends Component {
  render() {
    return <Switch>
      <React.Suspense fallback={<div className="loader">Loading...</div>}>
        <Route path="/dashboard" component={Dashboard} />
        <ReactRoute path="/callback" component={CallbackPage} />
        <ReactRoute path="/login" component={Login} />
        <Route path="" component={Dashboard} />
      </React.Suspense>
    </Switch>
  }

}

export default RoutingComponent;