import { Switch, Route as ReactRoute, Redirect } from 'react-router-dom';
import React, { Component } from 'react';
import Route from '../authentication/protected.route';
const Dashboard = React.lazy(() => import('../components/dashboard.component'));
const CallbackPage = React.lazy(() => import('../authentication/callback.component'));
const Login = React.lazy(() => import('../authentication/login.component'));
const ChangePassword = React.lazy(() => import('../components/changepassword'));
const Twofa = React.lazy(() => import('../components/twofa'));
const SumSub = React.lazy(() => import('../components/sumSub.component/sumsub'));
const NotKyc = React.lazy(() => import('../components/sumSub.component/notKyc'));
const OnBoarding = React.lazy(() => import('../layout/onboard.component'));
class RoutingComponent extends Component {
  render() {
    return <Switch>
      <React.Suspense fallback={<div className="loader">Loading...</div>}>
        <Route path="/dashboard" component={Dashboard} />
        <ReactRoute path="/callback" component={CallbackPage} />
        <ReactRoute path="/login" component={Login} />
        <ReactRoute path="/changepassword" component={ChangePassword} />
        <ReactRoute path="/2fa" component={Twofa} />
        <ReactRoute path="/sumsub" component={SumSub} />
        <ReactRoute path="/notkyc" component={NotKyc} />
        <ReactRoute path="/onboading" component={OnBoarding} />
        <Redirect to="/onboading" path="/" exact/>
      </React.Suspense>
    </Switch>
  }

}

export default RoutingComponent;