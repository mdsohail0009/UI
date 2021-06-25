import React, { Component } from 'react'
import { Layout as AntLayout } from 'antd';
import './layout.css'
import Content from './content.component';
import { store } from '../store';
import Header from '../layout/header.component';
class Layout extends Component {
    state = {
        user: null
    }
    componentDidMount() {
        const { user } = store.getState().oidc;
        this.setState({ user })
    }
    render() {
        return <>
            <AntLayout>
              <Header/>
                <Content />
            </AntLayout>
        </>
    }
}

export default Layout;