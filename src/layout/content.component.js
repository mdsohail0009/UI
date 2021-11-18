import React, { Component } from 'react';
import { Layout } from 'antd'
import RouteConfig from '../config/router.config.component';
const { Content: AntContent } = Layout;
class Content extends Component {
  state = {
    collapsed: true,
  };
  render() {
    return <AntContent className="sidebar-push">
     
      <RouteConfig />
    </AntContent>
  }
}

export default Content;