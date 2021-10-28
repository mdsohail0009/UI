import React from 'react';
import { Typography, Button, Row, Col, Badge } from 'antd';
import { Link } from "react-router-dom";

class CoinView extends React.Component {
    render() {
        const { Paragraph, Text, Title } = Typography
        return <div className="main-container">
            <div className="mb-36 text-white-50 fs-24"><Link className="icon md leftarrow mr-16 c-pointer" to="/dashboard" />Bitcoin (BTC)</div>
            <div className="d-flex align-center">
                <span className="coin lg btc" />
                <Text className="text-white-30 fs-24 ml-8 fw-500">Bitcoin (BTC)</Text>
            </div>
            <div className="summary-count mr-16">
                <Paragraph className="text-white-30 fs-40 mb-0 fw-600" style={{ lineHeight: '54px' }}>$60,000.00</Paragraph>
                <Text className="text-white-30 fs-16 m-0" style={{ lineHeight: '18px' }}>1.147658 BTC<Text className="text-green ml-16">7.41%</Text></Text>
            </div>
            <Button type="primary" className="trade-btn mt-16" size="small">7.41%<span className="icon sm downarrow-white ml-4" /></Button>
            <Row gutter={[16, 16]}>
                <Col lg={16} xl={16} xxl={16}>
                    col
                </Col>
                <Col lg={8} xl={8} xxl={8}>
                    <div className="box p-24">
                        <Title content="suissebase_title" component={Title} className="fs-24 fw-600 mb-36 text-white-30">Coin Info</Title>
                        <div className="mb-16">
                            <Text className="fs-14 fw-200 text-white-50 d-block mb-8">Website</Text>
                            <Text className="coininfo-badge">bitcoin.org</Text>
                        </div>
                        <div className="mb-16">
                            <Text className="fs-14 fw-200 text-white-50 d-block mb-8">Explorers</Text>
                            <Text className="coininfo-badge">Blockchain</Text>
                            <Text className="coininfo-badge">BTC</Text>
                            <Text className="coininfo-badge">Tocken View</Text>
                        </div>
                        <div className="mb-16">
                            <Text className="fs-14 fw-200 text-white-50 d-block mb-8">Wallets</Text>
                            <Text className="coininfo-badge">Defi-Wallet</Text>
                            <Text className="coininfo-badge">Ledger</Text>
                            <Text className="coininfo-badge">Trezer</Text>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    }
}

export default CoinView;