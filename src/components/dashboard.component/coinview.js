import React from 'react';
import { Typography, Radio, Row, Col, Spin } from 'antd';
import { Link, withRouter } from "react-router-dom";
import { getcoinDetails, getCoinChatData } from './api'
import ConnectStateProps from '../../utils/state.connect';
import LineChart from './line.graph.component';
import BuySell from '../buy.component';
import { fetchSelectedCoinDetails, setExchangeValue, setCoin } from '../../reducers/buyReducer';
import { setStep } from '../../reducers/buysellReducer';
import { updateCoinDetail } from '../../reducers/sellReducer'
import { convertCurrency } from '../buy.component/buySellService';
import apiCalls from '../../api/apiCalls';

class CoinView extends React.Component {
    state = {
        coinData: null,
        chatData: null,
        type: 'prices',
        buyDrawer: false
    }

    componentDidMount() {
        this.loadCoinDetailData();
        this.coinViewTrack();
    }
    coinViewTrack = () => {
        apiCalls.trackEvent({ "Type": 'User', "Action": 'Coin page view', "Username": this.props.userProfileInfo?.userName, "MemeberId": this.props.userProfileInfo?.id, "Feature": 'Cockpit', "Remarks": 'Coin page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Cockpit' });
    }
    loadCoinDetailData = async () => {
        const response = await getcoinDetails(this.props.userProfile.id, this.props.match.params.coinName);
        if (response.ok) {
            this.setState({ ...this.state, coinData: response.data }, () => {
                this.coinChartData(1);
            })
        }
    }
    coinChartData = async (days) => {
        if (this.state.coinData) {
            const response = await getCoinChatData(this.state.coinData.id, 'usd', days);
            if (response.ok) {
                this.setState({ ...this.state, chatData: response.data })
            }
        }
    }
    showBuyDrawer = (item, key) => {
        if (this.props?.userProfile?.isDocsRequested) {
            this.props.history.push("/docnotices");
            return;
        }
        if (!this.props?.userProfile?.isKYC) {
            this.props.history.push("/notkyc");
            return;
        }
        if (key === "buy") {
            if (this.props.dashboard.marketSelectedCoin) {
                this.props.dispatch(fetchSelectedCoinDetails(item.coin, this.props.userProfile?.id));
                this.props.dispatch(setCoin({ ...item, toWalletCode: item.coin, toWalletId: item.id, toWalletName: item.coinFullName }));
                convertCurrency({ from: item.coin, to: "USD", value: 1, isCrypto: false, memId: this.props.userProfile?.id, screenName: null }).then(val => {
                    this.props.dispatch(setExchangeValue({ key: item.coin, value: val }));
                });
                this.props.dispatch(setStep("step2"));
            } else {
                this.props.dispatch(fetchSelectedCoinDetails(item.symbol, this.props.userProfile?.id));
                this.props.dispatch(setCoin({ ...item, toWalletCode: item.symbol, toWalletId: item.id, toWalletName: item.name }));
                convertCurrency({ from: item.symbol, to: "USD", value: 1, isCrypto: false, memId: this.props.userProfile?.id, screenName: null }).then(val => {
                    this.props.dispatch(setExchangeValue({ key: item.symbol, value: val }));
                });
                this.props.dispatch(setStep("step2"));
            }
        } else if (key === "sell") {
            this.props.dispatch(setCoin(item));
            this.props.dispatch(setExchangeValue({ key: item.symbol, value: item.current_price }));
            this.props.dispatch(updateCoinDetail(item))
            this.props.dispatch(setStep("step10"));
        }
        this.setState({
            buyDrawer: true
        })
    }
    closeDrawer = () => {
        this.setState({
            buyDrawer: false,
        })
    }
    render() {
        const { Paragraph, Text, Title } = Typography
        const { coinData } = this.state;
        return <div className="main-container">
            <div className="mb-36 text-white-50 fs-24"><Link className="icon md leftarrow mr-16 c-pointer" to="/dashboard" />{coinData?.name} ({coinData?.symbol.toUpperCase()})</div>
            <Row gutter={[24, 24]}>
                <Col lg={14} xl={14} xxl={14}>
                    <div className="box p-24 coin-bal">
                        <div className="d-flex align-center">
                            <span className="coin lg btc" />
                            <div className="summary-count ml-8">
                                <Paragraph className="text-white-30 fs-36 mb-0 fw-500">{coinData?.avilableBalance}<Text className="fs-24 ml-8 text-white-30 fw-500">{coinData?.symbol.toUpperCase()}</Text></Paragraph>
                                <Text className="text-white-30 fs-16 m-0" style={{ lineHeight: '18px' }}>1{coinData?.symbol.toUpperCase()} = {coinData?.btC_Price} USD<Text className="text-green ml-16">7.41%</Text></Text>
                            </div>
                        </div>
                        <ul className="m-0">
                            {/* <li onClick={() => this.showBuyDrawer(coinData, "buy")}><div><span className="icon md file" /></div>BUY</li> */}
                            {/* <li  onClick={() => this.showBuyDrawer(coinData, "sell")}><div><span className="icon md file" /></div>SELL</li> */}
                            {/* <li><div><span className="icon md file" /></div>WITHDRAW</li> */}
                        </ul>
                    </div>
                    <div className="box p-24 coin-details">
                        <Title component={Title} className="fs-24 fw-600 mb-36 text-white-30">{coinData?.name} ({coinData?.symbol.toUpperCase()}) Price Chart</Title>
                        <div className="trade-legends mb-24">
                            <Radio.Group defaultValue="prices" buttonStyle="outline" className="trade-graph" onChange={(e) => this.setState({ ...this.state, type: e.target.value })}>
                                <Radio.Button value="prices">Price</Radio.Button>
                                <Radio.Button value="market_caps">Market Cap</Radio.Button>
                                <Radio.Button value="total_volumes">Trading View</Radio.Button>
                            </Radio.Group>
                            <Radio.Group defaultValue="1" buttonStyle="outline" className="trade-graph" onChange={(e) => this.coinChartData(e.target.value)}>
                                <Radio.Button value="1">24h</Radio.Button>
                                <Radio.Button value="7">7d</Radio.Button>
                                <Radio.Button value="14">14d</Radio.Button>
                                <Radio.Button value="30">30d</Radio.Button>
                                <Radio.Button value="90">90d</Radio.Button>
                            </Radio.Group>
                        </div>
                        {this.state.chatData ? <LineChart data={this.state.chatData} type={this.state.type} /> : <div className="coin-details-spin"><Spin className="text-center" /></div>}
                    </div>
                </Col>
                <Col lg={10} xl={10} xxl={10}>
                    <div className="box p-24 coin-details right">
                        <Title component={Title} className="fs-24 fw-600 mb-36 text-white-30">{coinData?.symbol.toUpperCase()} Price and Market Stats</Title>
                        <div className="coin-info">
                            <Text>{coinData?.symbol.toUpperCase()} Price</Text>
                            <Text>${coinData?.current_price}</Text>
                        </div>
                        <div className="coin-info">
                            <Text>Market Cap</Text>
                            <Text>${coinData?.market_cap}</Text>
                        </div>
                        <div className="coin-info">
                            <Text>24 Hour Trading Vol</Text>
                            <Text>${coinData?.market_cap_change_24h}</Text>
                        </div>
                        <div className="coin-info">
                            <Text>Fully Diluted Valuation</Text>
                            <Text>${coinData?.fully_diluted_valuation}</Text>
                        </div>
                        <div className="coin-info">
                            <Text>Circulating Supply</Text>
                            <Text>{coinData?.circulating_supply}</Text>
                        </div>
                        <div className="coin-info">
                            <Text>Total Supply</Text>
                            <Text>{coinData?.total_supply}</Text>
                        </div>
                        <div className="coin-info">
                            <Text>Max Supply</Text>
                            <Text>{coinData?.max_supply}</Text>
                        </div>
                        <div className="coin-info">
                            <Text>All-Time High</Text>
                            <div>
                                <Text>${coinData?.ath}</Text><Text className="fs-14 fw-200 text-green ml-8">{coinData?.ath_change_percentage}%</Text>
                                <Text className="fs-10 fw-200 text-secondary d-block text-right">{coinData?.ath_date}</Text>
                            </div>
                        </div>
                        <div className="coin-info">
                            <Text>All-Time Low</Text>
                            <div>
                                <Text>${coinData?.atl}</Text><Text className="fs-14 fw-200 text-green ml-8">{coinData?.atl_change_percentage}%</Text>
                                <Text className="fs-10 fw-200 text-secondary d-block text-right">{coinData?.atl_date}</Text>
                            </div>
                        </div>
                    </div>
                </Col>
            </Row>
            <BuySell showDrawer={this.state.buyDrawer} onClose={() => this.closeDrawer()} />
        </div>
    }
}

export default ConnectStateProps(withRouter(CoinView));