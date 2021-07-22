import React, { Component } from 'react';
import { Layout as AntLayout } from 'antd';
import RoutingComponent from '../config/router.config.component';
import SumSub from '../components/shared/sumsub';
import apiCalls from '../api/apiCalls';
import Content from './content.component';
import Header from '../layout/header.component';
import Footer from './footer.component';
import { userInfo, getmemeberInfo } from '../reducers/configReduser';
import { connect } from 'react-redux';
class OnBoarding extends Component {
  state = {
    isOnboarding: false,
    isGetOnboardingStatus: false,
  };
  componentDidMount() {
    this.getMemberDetails()
  }
  getMemberDetails = async () => {

    this.props.getmemeberInfoa(this.props.user.profile.email)
  }
  render() {
    return <>
      {(!this.props.userConfig && !this.props.user) && <div className="loader">Loading....</div>}
      {(this.props.userConfig && this.props.user) && <>
    {!(this.props.userConfig.isKYC) && <SumSub />}
        {(this.props?.userConfig?.isKYC) && <>
          <AntLayout>
            <Header />
            <Content />
            <Footer />
          </AntLayout>
        </>}</>}
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
    }
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(OnBoarding);