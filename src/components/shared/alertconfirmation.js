import React, { Component } from 'react';
import { Alert } from 'antd';

class AlertConfirmation extends Component {
  render() {
    const { title, description, type, showIcon, closable, action } = this.props
    return (
      <>
        <Alert className="notify mb-0" message={title} type={type} description={description} showIcon={showIcon} closable={closable} action={action} />
      </>
    )
  }
}
export default AlertConfirmation;