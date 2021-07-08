import React, { Component } from 'react';
import success from '../../assets/images/success.png';
import { Drawer, Typography, Button, Card, Input, Tooltip, Space } from 'antd';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';

class SuccessMsg extends Component {
    render() {
        const { Title, Paragraph, Text } = Typography;
        return (
            <>
                <div className="success-pop text-center">
                    <img src={success} className="confirm-icon" />
                    <Translate content="success_msg" component={Title} className="text-white-30 fs-36 fw-200 mb-4" />
                    <Translate content="success_decr" component={Paragraph} className="fs-16 text-white-30 fw-200" />
                    <Space direction="vertical" size="large">
                        <Link className="f-16 text-white-30 mt-16 text-underline">Return to Buy/Sell</Link>
                    </Space>
                </div>
            </>
        );
    }
}

export default SuccessMsg;