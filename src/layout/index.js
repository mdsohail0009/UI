import React, { Component } from 'react'
import { Layout as AntLayout } from 'antd';
import './layout.css'
import Content from './content.component';
import Header from '../layout/header.component';
import Footer from './footer.component';
import connectStateProps from '../utils/state.connect';
import { userManager } from '../authentication';
import OnBoarding from './onboard.component';
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
            return <div className="loader">Loading....</div>
        }
        return <>
            {/*<AntLayout>
                <Header />
                <Content />
                <Footer />
            </AntLayout>*/}
            <OnBoarding />
        </>
    }
}

export default connectStateProps(Layout);