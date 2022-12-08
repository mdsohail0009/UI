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
      {this.props.serviceWReducer?.isUpdateAvailable && <Alert showIcon 
        message="App Update"
        description="New app updates available. Please close all browser tabs & re-open app for seemless experience"
        type="warning"
      // action={
      //   <Space direction="vertical">
      //     <Button size="small" type="primary" className='primary-btn pop-btn' onClick={()=>window.location.reload()}>
      //       Refresh
      //     </Button>
      //   </Space>
      // }
      />}
      <RouteConfig />
    </AntContent>
  }
}

export default ConnectStateProps(Content);