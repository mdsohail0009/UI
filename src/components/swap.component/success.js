import React, { Component } from 'react';
import success from '../../assets/images/success.png';
import { Drawer, Typography, Button, Card, Input, Tooltip, Space } from 'antd';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';

class SuccessMessage extends Component {
    render() {
        const { Title, Paragraph, Text } = Typography;
        return (
            <>
                <div className="success-pop text-center">
                    <img src={success} className="confirm-icon" />
                    <Translate className="text-white-30 fs-36 fw-200 mb-4" content="transaction_submitted" component={Title} />
                    <Translate component={Paragraph} className="fs-16 text-white-30 fw-200" content="swapped_btc" />
                    <Paragraph content="success_decr" component={Paragraph} className="fs-16 text-white-30 fw-200">Swapped 0.00549635 BTC for 0.10183318 ETH</Paragraph>
                    <Space direction="vertical" size="large">
                        <Link className="f-16 text-white-30 mt-16 text-underline">Return to Buy/Sell<span className="icon md diag-arrow ml-4" /></Link>
                    </Space>
                </div>
            </>
        );
    }
}

export default SuccessMessage;