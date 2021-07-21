import React, { Component } from 'react';
import { Layout as AntLayout } from 'antd';
import RoutingComponent from '../config/router.config.component';
import SumSub from '../components/shared/sumsub';
import apiCalls from '../api/apiCalls';
import Content from './content.component';
import Header from '../layout/header.component';
import Footer from './footer.component';
import { userInfo } from '../reducers/configReduser';
import { connect } from 'react-redux';
class OnBoarding extends Component {
  state = {
    isOnboarding: false,
    isGetOnboardingStatus:false,
  };
  componentDidMount(){
    this.getMemberDetails()
  }
  getMemberDetails=async()=>{
    
    apiCalls.getMember().then((res)=>{
        this.setState({isGetOnboardingStatus:true,isOnboarding:res.data.isKYC})
        this.props.userInformation(res.data);
    })
  }
renderdata= async()=>{
    
    if(this.state.isGetOnboardingStatus){
        return <div className="loader">Loading....</div>
    }else if(this.state.isOnboarding){
        return <SumSub />
    }else{
        return <><AntLayout><Header /><Content /><Footer /></AntLayout></>
    }
}
  render() {
    return <>
    {!this.state.isGetOnboardingStatus && <div className="loader">Loading....</div>}
    {!this.state.isOnboarding && <SumSub />}
    {this.state.isOnboarding && <>
        <AntLayout>
        <Header />
        <Content />
        <Footer />
        </AntLayout>
        </>}
    </>
  }
}
const connectStateToProps = ({ userConfig }) => {
    return { userConfig }
}
const connectDispatchToProps = dispatch => {
    return {
        userInformation: (stepcode) => {
            dispatch(userInfo(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(OnBoarding);