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
import { withCookies } from 'react-cookie';
class Layout extends Component {
    state = {
    }
    componentDidMount() {
        if ((!this.props.user || this.props.user.expired) && !window.location.pathname.includes('callback')) {
            localStorage.setItem("__url", window.location.pathname);
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
        let Sid = this.props.cookies.get('SID')
        if ((!this.props.user || this.props.user.expired) && !window.location.pathname.includes('callback')) {
            return <div className="loader">Loading .....</div>
        }else if((!this.props.user || this.props.user.expired) && window.location.pathname.includes('callback')){
            return <CallbackPage />
        }else if(Sid && this.props.user && this.props.user.profile && this.props.user.profile.sub!=Sid){
            userManager.removeUser()
            window.location.reload()
            return <div className="loader">Loading .....</div>
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

export default ConnectStateProps(withCookies(Layout));