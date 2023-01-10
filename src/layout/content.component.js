import React, { Component } from 'react';
import { Layout } from 'antd'
import RouteConfig from '../config/router.config.component';
import { Alert } from "antd";
import ConnectStateProps from '../utils/state.connect';

const { Content: AntContent } = Layout;
class Content extends Component {
  state = {
    collapsed: true,
  };
  render() {
    return <AntContent className="sidebar-push">
        {this.props.serviceWReducer?.isUpdateAvailable &&  <div className="main-container"> <Alert showIcon 
        message="New Software Release Available"
        description="New software release! Sign out and Sign in again"
        type="warning"
      /></div>}
      <RouteConfig />
    </AntContent>
  }
}

export default ConnectStateProps(Content);