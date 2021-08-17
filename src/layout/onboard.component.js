import React, { Component } from 'react';
import { Layout as AntLayout } from 'antd';
import RoutingComponent from '../config/router.config.component';
import SumSub from '../components/shared/sumsub';
import apiCalls from '../api/apiCalls';
import Content from './content.component';
import Header from '../layout/header.component/header.component';
import Footer from './footer.component';
import { userInfo, getmemeberInfo } from '../reducers/configReduser';
import { connect } from 'react-redux';
import { Redirect, withRouter } from 'react-router-dom';
class OnBoarding extends Component {
  state = {
    isOnboarding: false,
    isGetOnboardingStatus: false,
  };
  componentDidMount() {
    this.getMemberDetails()
  }
  getMemberDetails = async () => {
    if (this.props.user && this.props.user.profile) {
      this.props.getmemeberInfoa(this.props.user.profile.email)
    }
  }
  render() {
    debugger
    if (this.props.user && this.props.user.profile && this.props.userConfig) {
     if(this.props.userConfig.isKYC ){
      if(!window.location.pathname.includes('dashboard'))this.props.history.push("/dashboard")
     }else{
      if(!window.location.pathname.includes('sumsub'))this.props.history.push('/sumsub')
     }
    }
    return <></>
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
    }
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(OnBoarding));