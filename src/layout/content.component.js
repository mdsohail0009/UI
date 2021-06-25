import React, { Component } from 'react';
import { Layout } from 'antd'
import RoutingComponent from '../config/router.config.component';
const { Content: AntContent } = Layout;
class Content extends Component {
  state = {
    collapsed: true,
  };
  render() {
    return <AntContent className="sidebar-push">
     
      <RoutingComponent />
    </AntContent>
  }
}

export default Content;