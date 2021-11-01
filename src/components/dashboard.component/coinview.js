import React from 'react';
import { Typography, Radio, Row, Col, Image } from 'antd';
import { Link } from "react-router-dom";
import tradeGraph1 from '../../assets/images/tradegraph.PNG';

class CoinView extends React.Component {
    render() {
        const { Paragraph, Text, Title } = Typography
        return <div className="main-container">
            <div className="mb-36 text-white-50 fs-24"><Link className="icon md leftarrow mr-16 c-pointer" to="/dashboard" />Bitcoin (BTC)</div>
            <Row gutter={[24, 24]}>
                <Col lg={14} xl={14} xxl={14}>
                    <div className="box p-24 coin-bal">
                        <div className="d-flex align-center">
                            <span className="coin lg btc" />
                            <div className="summary-count ml-8">
                                <Paragraph className="text-white-30 fs-36 mb-0 fw-500">1.0147658<Text className="fs-24 ml-8 text-white-30 fw-500">BTC</Text></Paragraph>
                                <Text className="text-white-30 fs-16 m-0" style={{ lineHeight: '18px' }}>1BTC = 60714.20 USD<Text className="text-green ml-16">7.41%</Text></Text>
                            </div>
                        </div>
                        <ul className="m-0">
                            <li><div><span className="icon md file" /></div>BUY</li>
                            <li><div><span className="icon md file" /></div>SELL</li>
                            <li><div><span className="icon md file" /></div>WITHDRAW</li>
                        </ul>
                    </div>
                    <div className="box p-24 coin-details">
                        <Title component={Title} className="fs-24 fw-600 mb-36 text-white-30">Bitcoin (BTC) Price Chart</Title>
                        <div className="trade-legends mb-24">
                            <Radio.Group defaultValue="Price" buttonStyle="outline" className="trade-graph">
                                <Radio.Button value="Price">Price</Radio.Button>
                                <Radio.Button value="Market Cap">Market Cap</Radio.Button>
                                <Radio.Button value="Trading View">Trading View</Radio.Button>
                            </Radio.Group>
                            <Radio.Group defaultValue="24" buttonStyle="outline" className="trade-graph">
                                <Radio.Button value="24">24h</Radio.Button>
                                <Radio.Button value="7">7d</Radio.Button>
                                <Radio.Button value="14">14d</Radio.Button>
                                <Radio.Button value="30">30d</Radio.Button>
                                <Radio.Button value="90">90d</Radio.Button>
                            </Radio.Group>
                        </div>
                        <Image src={tradeGraph1} preview={false} />
                    </div>
                </Col>
                <Col lg={10} xl={10} xxl={10}>
                    <div className="box p-24 coin-details">
                        <Title component={Title} className="fs-24 fw-600 mb-36 text-white-30">BTC Price and Market Stats</Title>
                        <div className="coin-info">
                            <Text>BTC Price</Text>
                            <Text>$61,048.42</Text>
                        </div>
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
                        <div className="coin-info">
                            <Text>All-Time High</Text>
                            <div>
                                <Text>$67,276.79</Text><Text className="fs-14 fw-200 text-green ml-8">-9.5%</Text>
                                <Text className="fs-10 fw-200 text-secondary d-block text-right">Oct 20, 2021 (9 days)</Text>
                            </div>
                        </div>
                        <div className="coin-info">
                            <Text>All-Time Low</Text>
                            <div>
                                <Text>$67.81</Text><Text className="fs-14 fw-200 text-green ml-8">89732.0%</Text>
                                <Text className="fs-10 fw-200 text-secondary d-block text-right">Oct 20, 2021 (9 days)</Text>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    }
}

export default CoinView;