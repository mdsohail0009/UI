import React, { Component } from 'react';
import confirm from '../../assets/images/confirm.png';
import { Drawer, Typography, Button, Card, Input, Tooltip,Space } from 'antd';
import { Link } from 'react-router-dom';

class ConfirmMsg extends Component {
    render() {
        const { Title, Paragraph, Text } = Typography;
        return(
            <>
            <div className="success-pop text-center">
                    <img src={confirm} className="mb-16" />
                    <Translate content="confirm_msg" component={Title} className="text-white-30 fs-36 fw-200 mb-16" />
                    <Translate content="confirm_decr" component={Paragraph} className="fs-16 text-white-30" />
                </div>
            </>
        );
    }
}

export default ConfirmMsg;