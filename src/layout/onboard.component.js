import React, { Component } from 'react';
import { userInfo, getmemeberInfo, getIpRegisteryData } from '../reducers/configReduser';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { checkCustomerState } from '../utils/service';
class OnBoarding extends Component {
  state = {
    isOnboarding: false,
    isGetOnboardingStatus: false,
  };
  componentDidMount() {
    this.getCustomerDetails()
  }
  getCustomerDetails = async () => {
    if (this.props.user && this.props.user) {
      await this.props.trackauditlogs()
      this.props.getmemeberInfoa(this.props.user.sub.split('|')[1]);
    }
  }
  render() {
    if (this.props.user && this.props.user.profile && this.props.userConfig) {
      if (this.props.userConfig.isKYC && checkCustomerState(this.props.userConfig)) {
        if (!window.location.pathname.includes('cockpit')) this.props.history.push("/cockpit")
      } else {
        if (!window.location.pathname.includes('sumsub')) this.props.history.push('/sumsub')
      }
    }
    return <>
      <div className="loader">Loading .....</div>
    </>
  }
}
const connectStateToProps = ({ userConfig, oidc }) => {
  return { userConfig: userConfig.userProfileInfo, user: oidc.profile }
}
const connectDispatchToProps = dispatch => {
  return {
    userInformation: (stepcode) => {
      dispatch(userInfo(stepcode))
    },
    getmemeberInfoa: (useremail) => {
      dispatch(getmemeberInfo(useremail));
    },
    trackauditlogs: () => {
      dispatch(getIpRegisteryData());
    }
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(OnBoarding));