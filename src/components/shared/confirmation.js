import React, { Component } from 'react';
import confirm from '../../assets/images/confirm.png';
import success from '../../assets/images/success.png';
import { Drawer, Typography, Button, Card, Input, Tooltip, Space } from 'antd';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import SuccessMsg from './success';
const { Title, Paragraph, Text } = Typography;
class ConfirmMsg extends Component {
    state={
        success:false,
    }
     componentDidMount() {
        setTimeout(() => {
          this.setState({success:true})
        }, 4000)
      }
    render() {
        return (
            <> 
            {!this.state.success ? <div className="success-pop text-center confitm-pop">
                    <img src={confirm} className="confirm-icon" />
                    <Translate content="confirm_msg" component={Title} className="text-white-30 fs-36 fw-200 mb-4" />
                    <Translate content="confirm_text" component={Paragraph} className="fs-16 text-white-30 fw-200" />
                </div> : 
                <SuccessMsg/>
                 }
            </>
        );
    }
}

export default ConfirmMsg;