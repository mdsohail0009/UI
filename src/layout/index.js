import React, { Component } from 'react'
import { Layout as AntLayout } from 'antd';
import './layout.css'
import Content from './content.component';
import Header from '../layout/header.component';
import Footer from './footer.component';
import ConnectStateProps from '../utils/state.connect';
import { userManager } from '../authentication';
import OnBoarding from './onboard.component';
import CallbackPage from '../authentication/callback.component';
import { clearUserInfo } from '../reducers/configReduser';
class Layout extends Component {
    state = {
    }
    componentDidMount() {
        if ((!this.props.user || this.props.user.expired) && !window.location.pathname.includes('callback')) {
            userManager.clearStaleState().then(()=>{
                this.props.dispatch(clearUserInfo());
                userManager.signinRedirect();
            });
        }
    }
    redirect = () =>{
        userManager.removeUser()
        window.open(process.env.REACT_APP_ADMIN_URL,"_self")
    }
    render() {
        if ((!this.props.user || this.props.user.expired) && !window.location.pathname.includes('callback')) {
            return <div className="loader">Loading .....</div>
        }else if((!this.props.user || this.props.user.expired) && window.location.pathname.includes('callback')){
            return <CallbackPage />
        }else if(this.props.user && !this.props.userProfile){
            return <OnBoarding />
        }else if( this.props.userProfile && this.props.userProfile?.role==='Admin'){
            return <>{this.redirect()}</>
        }else if(this.props.twoFA?.loading){
            return <div className="loader">Loading .....</div>
        }else{
        return <>
            <AntLayout>
            <Header />
            <Content />
            <Footer />
          </AntLayout>
        </>
        }
        
    }
}

export default ConnectStateProps(Layout);