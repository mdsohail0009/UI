import React, { Component } from 'react';
import { List, Skeleton, Row, Col, Typography } from 'antd';
import Translate from 'react-translate-component';
import chart from '../../assets/images/chart.png';

class Coins extends Component {
    state = {
    }
    render() {
        const { Title, Paragraph, Text } = Typography;
        return (
            <>
                <Row gutter={16}>
                    <Col  xs={24} md={8} xl={8}>
                        <div className="d-flex align-center">
                            <span className="coin md btc-white" />
                            <Paragraph className="text-white-30 fs-20 mb-0 fw-400 ml-12">Bitcoin</Paragraph>
                        </div>
                        <img src={chart} width="100%" className="mb-16" />
                    </Col>
                    <Col xs={24} md={8} xl={8}>
                        <div className="d-flex align-center">
                            <span className="coin md eth-white" />
                            <Paragraph className="text-white-30 fs-20 mb-0 fw-400 ml-12">ETH</Paragraph>
                        </div>
                        <img src={chart} width="100%" className="mb-16" /></Col>
                    <Col xs={24} md={8} xl={8}>
                        <div className="d-flex align-center">
                            <span className="coin md usdt-white" />
                            <Paragraph className="text-white-30 fs-20 mb-0 fw-400 ml-12">USDT</Paragraph>
                        </div>
                        <img src={chart} width="100%" className="mb-16" />
                    </Col>
                </Row>
            </>
        );
    }
}

export default Coins;