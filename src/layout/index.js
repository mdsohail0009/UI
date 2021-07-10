import React, { Component } from 'react'
import { Layout as AntLayout } from 'antd';
import './layout.css'
import Content from './content.component';
import { store } from '../store';
import Header from '../layout/header.component';
import Footer from './footer.component';
import connectStateProps from '../utils/state.connect';
import { userManager } from '../authentication';


class Layout extends Component {
    state = {
        user: null
    }
    componentDidMount() {
        const { user } = store.getState().oidc;
        this.setState({ user });
        // if (!this.props.user || this.props.user.expired) {
        //     userManager.signinRedirect();
        // }
    }
    render() {
        // if (!this.props.user || this.props.user.expired) {
        //     return <div>Loading....</div>
        // }
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