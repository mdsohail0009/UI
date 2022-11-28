import React, { Component } from 'react';
import { userInfo, getmemeberInfo, getIpRegisteryData } from '../reducers/configReduser';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
class OnBoarding extends Component {
  state = {
    isOnboarding: false,
    isGetOnboardingStatus: false,
  };
  componentDidMount() {
    this.getCustomerDetails()
  }
  getCustomerDetails = async () => {
    if (this.props.user && this.props.user.profile) {
      await this.props.trackauditlogs()
      this.props.getmemeberInfoa(this.props.user.profile.sub);

    }
  }
  render() {
    if (this.props.user && this.props.user.profile && this.props.userConfig) {
      if (this.props.userConfig.isKYC && this.props.userConfig?.customerState === "Approved") {
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
  return { userConfig: userConfig.userProfileInfo, user: oidc.user }
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