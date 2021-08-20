import React, { Component } from 'react'
import { Layout as AntLayout } from 'antd';
import './layout.css'
import Content from './content.component';
import Header from '../layout/header.component';
import Footer from './footer.component';
import connectStateProps from '../utils/state.connect';
import { userManager } from '../authentication';
import OnBoarding from './onboard.component';
import CallbackPage from '../authentication/callback.component';
class Layout extends Component {
    state = {
    }
    componentDidMount() {
        if ((!this.props.user || this.props.user.expired) && !window.location.pathname.includes('callback')) {
            userManager.signinRedirect();
        }
    }
    render() {
        if ((!this.props.user || this.props.user.expired) && !window.location.pathname.includes('callback')) {
            return <div className="loader">Loading .....</div>
        }else if((!this.props.user || this.props.user.expired) && window.location.pathname.includes('callback')){
            return <CallbackPage />
        }else if(this.props.user && !this.props.userProfile){
            return <OnBoarding />
        }
        return <>
            <AntLayout>
            <Header />
            <Content />
            <Footer />
          </AntLayout>
        </>
        
        
    }
}

export default connectStateProps(Layout);