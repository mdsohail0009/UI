import React, { Component } from 'react';
import { Row, Col, Typography } from 'antd';
import graphbtc from '../../assets/images/graph-btc.png';
import grapheth from '../../assets/images/graph-eth.png';
import graphgbp from '../../assets/images/graph-gbp.png';

class Coins extends Component {
    state = {
    }
    render() {
        const { Paragraph } = Typography;
        return (
            <>
                <Row gutter={16}>
                    <Col xs={24} md={24} lg={8} xl={8}>
                        <div className="d-flex align-center p-16">
                            <span className="coin md btc-white" />
                            <Paragraph className="text-white-30 fs-24 m-0 fw-300 ml-12">Bitcoin</Paragraph>
                        </div>
                        <img src={graphbtc} width="100%" className="mb-24" />
                    </Col>
                    <Col xs={24} md={24} lg={8} xl={8}>
                        <div className="d-flex align-center p-16">
                            <span className="coin md eth-white" />
                            <Paragraph className="text-white-30 fs-24 m-0 fw-300 ml-12">ETH</Paragraph>
                        </div>
                        <img src={grapheth} width="100%" className="mb-24" /></Col>
                    <Col xs={24} md={24} lg={8} xl={8}>
                        <div className="d-flex align-center p-16">
                            <span className="coin md usdt-white " />
                            <Paragraph className="text-white-30 fs-24 m-0 fw-300 ml-12">USDT</Paragraph>
                        </div>
                        <img src={graphgbp} width="100%" className="mb-24" />
                    </Col>
                </Row>
            </>
        );
    }
}

export default Coins;