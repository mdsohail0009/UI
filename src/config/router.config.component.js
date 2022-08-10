import { Switch, Route as ReactRoute, withRouter } from 'react-router-dom';
import React, { Component } from 'react';
import Route from '../authentication/protected.route';
import SignInSilent from '../authentication/signinSilent';
import { connect } from 'react-redux';
import { KEY_URL_MAP } from '../components/shared/permissions/config';
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
const AddressFiatView = React.lazy(() => import("../components/addressbook.component/addressFiatView"))
const AddressCryptoView = React.lazy(() => import("../components/addressbook.component/addressCryptoView"))
const RewardCard = React.lazy(() => import("../components/cards.component"));
const AccessDenied = React.lazy(() => import("../components/shared/permissions/access.denied"));
const InternalTransfer=React.lazy(()=>import("../components/internalTransfer.component/internalTransfer"))
class RouteConfig extends Component {
  componentDidMount() {
    this.checkPermissions(window.location.pathname||"/cockpit");
    this.props.history.listen((location)=>{
      this.checkPermissions(location.pathname)
    })
  }
  checkPermissions(pathname){
    if (this.props.menuItems.featurePermissions?.[KEY_URL_MAP[pathname]] && pathname != "/userprofile" && pathname != "/accessdenied") {
      let _permissions = {};
      for (let action of (this.props.menuItems.featurePermissions?.[KEY_URL_MAP[pathname]]?.actions || [])) {
        _permissions[action.permissionName] = action.values;
      }
      if (!_permissions.View && !_permissions.view) {
        this.props.history.push("/accessdenied");
      }
    }
  }
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
        <ReactRoute path="/userprofile/:key?" component={UserProfile} />
        <ReactRoute path='/documents' component={RequestedDocs} />
        <ReactRoute path='/cases' component={CaseDocs} />
        <ReactRoute path='/docnotices' component={DocNotices} />
        <ReactRoute path='/enabletwofactor' component={TwoFactor} />
        <ReactRoute path='/addressFiatView/:id' component={AddressFiatView} />
        <ReactRoute path='/addressCryptoView/:id' component={AddressCryptoView} />
        <Route path='/coindetails/:coinName' component={CoinDetails} />
        <ReactRoute path="/silent_redirect" component={SignInSilent} />
        <ReactRoute path='/cockpitCharts' component={DashboardCharts} />
        <Route path='/cards' component={RewardCard} isRoute={true} />
        <ReactRoute path='/accessdenied' component={AccessDenied} />
        <ReactRoute
          path="/payments"
          render={({ match: { url } }) => (
            <>
              <Route path={`${url}/:code`} component={Payments} exact isRoute={true} />
              <Route path={`${url}/:id/add`} component={PaymentDetails} />
              <Route path={`${url}/:id/:type/:state/edit`} component={PaymentDetails} />
              <Route path={`${url}/:id/view`} component={paymentsView} />
              <Route path={`${url}/newbeneficiary/:id`} component={BeneficiaryDetails} />
            </>
          )}
        />
        <ReactRoute path="/internalTransfer" component={InternalTransfer} exact/>
        <ReactRoute path="/" component={Dashboard} exact />
      </React.Suspense>
    </Switch>
  }

}
const connectStateToProps = ({ menuItems }) => {
  return { menuItems }
}

export default withRouter(connect(connectStateToProps)(RouteConfig));