import React, { Component } from 'react';
import confirm from '../../assets/images/confirm.png';
import { Drawer, Typography, Button, Card, Input, Tooltip, Space } from 'antd';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';

class ConfirmMsg extends Component {
    render() {
        const { Title, Paragraph, Text } = Typography;
        return (
            <>
                <div className="success-pop text-center">
                    <img src={confirm} className="confirm-icon" />
                    <Translate content="confirm_msg" component={Title} className="text-white-30 fs-36 fw-200 mb-4" />
                    <Translate content="confirm_text" component={Paragraph} className="fs-16 text-white-30 fw-200" />
                </div>
            </>
        );
    }
}

export default ConfirmMsg;