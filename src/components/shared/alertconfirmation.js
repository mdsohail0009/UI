import React, { Component } from 'react';
import { Typography, Card, List, Avatar, Alert } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import success from '../../assets/images/success.png';
import { Link } from 'react-router-dom';

class AlertConfirmation extends Component {
  render() {
    const { title, description, type, showIcon, closable, action } = this.props
    return (
      <>
        <Alert className="notify" message={title} type={type} description={description} showIcon={showIcon} closable={closable} action={action} />
      </>
    )
  }
}
export default AlertConfirmation;