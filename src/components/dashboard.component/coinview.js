import React from 'react';
import { Typography, Button, Row, Col, Image } from 'antd';
import { Link } from "react-router-dom";
import tradeGraph1 from '../../assets/images/tradegraph.PNG';

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
            <Row gutter={[36, 36]} className="mt-24">
                <Col lg={16} xl={16} xxl={16}>
                    <div className="coin-info">
                        <Text>Market Cap</Text>
                        <Text>$1,152,252,696,454</Text>
                    </div>
                    <div className="coin-info">
                        <Text>24 Hour Trading Vol</Text>
                        <Text>$36,844,445,206</Text>
                    </div>
                    <div className="coin-info">
                        <Text>Fully Diluted Valuation</Text>
                        <Text>$1,283,867,928,000</Text>
                    </div>
                    <div className="coin-info">
                        <Text>Circulating Supply</Text>
                        <Text>18,847,193</Text>
                    </div>
                    <div className="coin-info">
                        <Text>Total Supply</Text>
                        <Text>21,000,000</Text>
                    </div>
                    <div className="coin-info">
                        <Text>Max Supply</Text>
                        <Text>21,000,000</Text>
                    </div>
                </Col>
                <Col lg={8} xl={8} xxl={8}>
                    <div className="box p-24">
                        <Title component={Title} className="fs-24 fw-600 mb-36 text-white-30">Coin Info</Title>
                        <div className="mb-16">
                            <Text className="fs-14 fw-200 text-white-50 d-block mb-8">Website</Text>
                            <Text className="coininfo-badge">bitcoin.org</Text>
                        </div>
                        <div className="mb-16">
                            <Text className="fs-14 fw-200 text-white-50 d-block mb-8">Explorers</Text>
                            <Text className="coininfo-badge">Blockchain</Text>
                            <Text className="coininfo-badge">BTC</Text>
                            <Text className="coininfo-badge">Tocken View</Text>
                            <Text className="coininfo-badge">BTC</Text>
                        </div>
                        <div className="mb-16">
                            <Text className="fs-14 fw-200 text-white-50 d-block mb-8">Wallets</Text>
                            <Text className="coininfo-badge">Defi-Wallet</Text>
                            <Text className="coininfo-badge">Ledger</Text>
                            <Text className="coininfo-badge">Trezer</Text>
                            <Text className="coininfo-badge">Electrum</Text>
                        </div>
                    </div>
                </Col>
            </Row>
            <Row gutter={[36, 36]}>
                <Col lg={16} xl={16} xxl={16}>
                    <div className="box p-24">
                        <Title component={Title} className="fs-24 fw-600 mb-36 text-white-30">Bitcoin (BTC) Price Chart</Title>
                        <Image src={tradeGraph1} preview={false} />
                    </div>
                </Col>
                <Col lg={8} xl={8} xxl={8}>
                    <div className="box p-24">
                        <Title component={Title} className="fs-24 fw-600 mb-36 text-white-30">BTC Portfolio</Title>
                        <div className="coin-info">
                            <Text>BTC Price</Text>
                            <Text>$62,468.35</Text>
                        </div>
                        <div className="coin-info">
                            <Text>Market Cap</Text>
                            <Text>$1,152,252,696,454</Text>
                        </div>
                        <div className="coin-info">
                            <Text>Trading Volume</Text>
                            <Text>$1,152,252,696,454</Text>
                        </div>
                        <div className="coin-info">
                            <Text>Volume / Market Cap</Text>
                            <Text>0.0351</Text>
                        </div>
                        <div className="coin-info">
                            <Text>Total Supply</Text>
                            <Text>21,000,000</Text>
                        </div>
                        <div className="coin-info">
                            <Text>Max Supply</Text>
                            <Text>25,000,000</Text>
                        </div>
                        <div className="coin-actions mt-36">
                            <Button size="large" type="text" icon={<i className="icon md file" />}>BUY</Button>
                            <Button size="large" type="text" icon={<i className="icon md file" />}>SELL</Button>
                            <Button size="large" type="text" icon={<i className="icon md file" />}>SWAP</Button>
                            <Button size="large" type="text" icon={<i className="icon md file" />}>DEPOSIT</Button>
                            <Button size="large" type="text" icon={<i className="icon md file" />}>WITHDRAW</Button>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    }
}

export default CoinView;