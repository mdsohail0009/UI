import { Switch, Route as ReactRoute } from 'react-router-dom';
import React, { Component } from 'react';
import Route from '../authentication/protected.route';
import SignInSilent from '../authentication/signinSilent';
const Dashboard = React.lazy(() => import('../components/dashboard.component'));
const CallbackPage = React.lazy(() => import('../authentication/callback.component'));
const Login = React.lazy(() => import('../authentication/login.component'));
const ChangePassword = React.lazy(() => import('../components/changepassword'));
const Twofa = React.lazy(() => import('../components/twofa'));
const SumSub = React.lazy(() => import('../components/sumSub.component/sumsub'));
const NotKyc = React.lazy(() => import('../components/sumSub.component/notKyc'));
const OnBoarding = React.lazy(() => import('../layout/onboard.component'));
const UserProfile = React.lazy(() => import('../components/userProfile.component/userProfile'));
const RequestedDocs = React.lazy(() => import('../components/documents.component/requestedDocs'));
const DocNotices = React.lazy(() => import("../components/shared/doc.notices"));
const TwoFactor = React.lazy(() => import("../components/shared/two.factor"));
const CaseDocs = React.lazy(() => import('../components/case.component/caseView'));
const CoinDetails = React.lazy(() => import("../components/dashboard.component/coinview"));
const DashboardCharts = React.lazy(() => import("../components/dashboard.component/cockpitCharts"));
const Payments = React.lazy(() => import("../components/payments.component"));
const PaymentDetails = React.lazy(() => import("../components/payments.component/paymentDetails"));
const paymentsView = React.lazy(() => import("../components/payments.component/paymentsView"));
const BeneficiaryDetails = React.lazy(() => import("../components/payments.component/beneficiaryDetails"));

class RouteConfig extends Component {
  render() {
    return <Switch>
      <React.Suspense fallback={<div className="loader">Loading...</div>}>
        <Route path="/cockpit" component={Dashboard} />
        <ReactRoute path="/callback" component={CallbackPage} />
        <ReactRoute path="/login" component={Login} />
        <ReactRoute path="/changepassword" component={ChangePassword} />
        <ReactRoute path="/2fa" component={Twofa} />
        <ReactRoute path="/sumsub" component={SumSub} />
        <ReactRoute path="/notkyc" component={NotKyc} />
        <ReactRoute path="/onboading" component={OnBoarding} />
        <ReactRoute path='/userprofile' component={UserProfile} />
        <ReactRoute path='/documents' component={RequestedDocs} />
        <ReactRoute path='/cases' component={CaseDocs} />
        <ReactRoute path='/docnotices' component={DocNotices} />
        <ReactRoute path='/enabletwofactor' component={TwoFactor} />

        <Route path='/coindetails/:coinName' component={CoinDetails} />
        <ReactRoute path="/silent_redirect" component={SignInSilent} />
        <ReactRoute path='/cockpitCharts' component={DashboardCharts} />
        <ReactRoute
          path="/payments"
          render={({ match: { url } }) => (
            <>
              <Route path={`${url}`} component={Payments} exact />
              <Route path={`${url}/:id/add`} component={PaymentDetails} />
              <Route path={`${url}/:id/:type/:state/edit`} component={PaymentDetails} />
              <Route path={`${url}/:id/view`} component={paymentsView} />
              <Route path={`${url}/newbeneficiary/:id`} component={BeneficiaryDetails} />
            </>
          )}
        />
        <ReactRoute path="/" component={Dashboard} exact />
      </React.Suspense>
    </Switch>
  }

}

export default RouteConfig;