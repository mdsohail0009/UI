import React from 'react';
import { Typography, Radio, Row, Col, Image } from 'antd';
import { Link } from "react-router-dom";
import tradeGraph1 from '../../assets/images/tradegraph.PNG';
import {getcoinDetails} from './api'
import connectStateProps from '../../utils/state.connect';
import { withRouter } from 'react-router-dom';
import TradingViewChart from './tradingview';

class CoinView extends React.Component {
    state = {
        coinData:null
    }

    componentDidMount(){
        this.loadCoinDetailData();
    }
    loadCoinDetailData = async() =>{
        const response = await getcoinDetails(this.props.userProfile.id,this.props.dashboard?.marketSelectedCoin?.id);
        if (response.ok) {
            this.setState({coinData:response.data})
        } else {
        }
    }
    render() {
        const { Paragraph, Text, Title } = Typography
        const {coinData} = this.state;
        const {marketSelectedCoin} = this.props.dashboard;
        return <div className="main-container">
            <div className="mb-36 text-white-50 fs-24"><Link className="icon md leftarrow mr-16 c-pointer" to="/dashboard" />{marketSelectedCoin?.name} ({marketSelectedCoin?.symbol.toUpperCase()})</div>
            <Row gutter={[24, 24]}>
                <Col lg={14} xl={14} xxl={14}>
                    <div className="box p-24 coin-bal">
                        <div className="d-flex align-center">
                            <span className="coin lg btc" />
                            <div className="summary-count ml-8">
                                <Paragraph className="text-white-30 fs-36 mb-0 fw-500">{coinData?.avilableBalance}<Text className="fs-24 ml-8 text-white-30 fw-500">{marketSelectedCoin?.symbol.toUpperCase()}</Text></Paragraph>
                                <Text className="text-white-30 fs-16 m-0" style={{ lineHeight: '18px' }}>1{marketSelectedCoin?.symbol.toUpperCase()} = {coinData?.btC_Price} USD<Text className="text-green ml-16">7.41%</Text></Text>
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
                        <TradingViewChart />
                    </div>
                </Col>
                <Col lg={10} xl={10} xxl={10}>
                    <div className="box p-24 coin-details">
                        <Title component={Title} className="fs-24 fw-600 mb-36 text-white-30">{marketSelectedCoin?.symbol.toUpperCase()} Price and Market Stats</Title>
                        <div className="coin-info">
                            <Text>BTC Price</Text>
                            <Text>${marketSelectedCoin?.current_price}</Text>
                        </div>
                        <div className="coin-info">
                            <Text>Market Cap</Text>
                            <Text>${marketSelectedCoin?.market_cap}</Text>
                        </div>
                        <div className="coin-info">
                            <Text>24 Hour Trading Vol</Text>
                            <Text>${marketSelectedCoin?.market_cap_change_24h}</Text>
                        </div>
                        <div className="coin-info">
                            <Text>Fully Diluted Valuation</Text>
                            <Text>${marketSelectedCoin?.fully_diluted_valuation}</Text>
                        </div>
                        <div className="coin-info">
                            <Text>Circulating Supply</Text>
                            <Text>{marketSelectedCoin?.circulating_supply}</Text>
                        </div>
                        <div className="coin-info">
                            <Text>Total Supply</Text>
                            <Text>{marketSelectedCoin?.total_supply}</Text>
                        </div>
                        <div className="coin-info">
                            <Text>Max Supply</Text>
                            <Text>{marketSelectedCoin?.max_supply}</Text>
                        </div>
                        <div className="coin-info">
                            <Text>All-Time High</Text>
                            <div>
                                <Text>${marketSelectedCoin?.ath}</Text><Text className="fs-14 fw-200 text-green ml-8">{marketSelectedCoin?.ath_change_percentage}%</Text>
                                <Text className="fs-10 fw-200 text-secondary d-block text-right">{marketSelectedCoin?.ath_date}</Text>
                            </div>
                        </div>
                        <div className="coin-info">
                            <Text>All-Time Low</Text>
                            <div>
                                <Text>${marketSelectedCoin?.atl}</Text><Text className="fs-14 fw-200 text-green ml-8">{marketSelectedCoin?.atl_change_percentage}%</Text>
                                <Text className="fs-10 fw-200 text-secondary d-block text-right">{marketSelectedCoin?.atl_date}</Text>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
        </div>
    }
}

export default connectStateProps(withRouter(CoinView));