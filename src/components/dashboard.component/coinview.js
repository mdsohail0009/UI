import React from 'react';
import { connect } from 'react-redux';
import { Typography, Row, Col, Spin, Button, Alert, Form, DatePicker, Modal, Tooltip, Input, Radio } from "antd";
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
import Translate from 'react-translate-component';

import { fetchWithDrawWallets, handleSendFetch, setSelectedWithDrawWallet, setSubTitle } from "../../reducers/sendreceiveReducer";
import { setWithdrawfiatenaable, setWithdrawfiat } from '../../reducers/sendreceiveReducer'
class CoinView extends React.Component {
    state = {
        coinData: null,
        chatData: null,
        type: 'prices',
        buyDrawer: false
    }

    componentDidMount() {
        window.scrollTo(0, 0)
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
        let selectedObj = { ...item };
        // selectedObj.impagePath=this.state.chatData.impagePath;
        // selectedObj.percentage=this.state.chatData.percentage;
        // selectedObj.sellMaxValue=this.state.chatData.sellMaxValue;
        // selectedObj.sellMinValue=this.state.chatData.sellMinValue;
        // selectedObj.swapMaxValue=this.state.chatData.swapMaxValue;
        // selectedObj.swapMinValue=this.state.chatData.swapMinValue;
        // selectedObj.withdrawMaxValue=this.state.chatData.withdrawMaxValue;
        // selectedObj.withdrawMinValue=this.state.chatData.withdrawMinValue;
        // selectedObj.impageWhitePath=this.state.chatData.impageWhitePath;
        // selectedObj.coinValueinNativeCurrency=this.state.chatData.coinValueinNativeCurrency;
        selectedObj.coin = selectedObj.symbol.toUpperCase();
        selectedObj.coinBalance = selectedObj.avilableBalance
        selectedObj.coinFullName = selectedObj.name
        selectedObj.oneCoinValue = selectedObj.current_price;
        selectedObj.id = selectedObj.memberWalletId;
        console.log(selectedObj);
        if (this.props?.userProfile?.isDocsRequested) {
            this.props.history.push("/docnotices");
            return;
        }
        if (!this.props?.userProfile?.isKYC) {
            this.props.history.push("/notkyc");
            return;
        }
        if (key === "buy") {
            this.props.dispatch(fetchSelectedCoinDetails(selectedObj.coin, this.props.userProfile?.id));
            this.props.dispatch(setCoin({ ...selectedObj, toWalletCode: selectedObj.coin, toWalletId: selectedObj.id, toWalletName: selectedObj.coinFullName }));
            convertCurrency({ from: selectedObj.coin, to: "USD", value: 1, isCrypto: false, memId: this.props.userProfile?.id, screenName: null }).then(val => {
                this.props.dispatch(setExchangeValue({ key: selectedObj.coin, value: val }));
            });
            this.props.dispatch(setStep("step2"));
        } else if (key === "sell") {
            this.props.dispatch(setCoin(selectedObj));
            this.props.dispatch(setExchangeValue({ key: selectedObj.coin, value: selectedObj.oneCoinValue }));
            this.props.dispatch(updateCoinDetail(selectedObj))
            this.props.dispatch(setStep("step10"));
        }
        this.setState({
            ...this.state,
            buyDrawer: true
        })
        // this.setState({
        //     valNum: e
        // }, () => {
        //     this.setState({
        //         ...this.state,
        //         buyFiatDrawer: true,
        //         selctedVal: value
        //     })

        // })
    }
    showSendReceiveDrawer = (e, value) => {
        debugger
        let selectedObj = { ...value };
        selectedObj.coin = selectedObj.symbol.toUpperCase();
        selectedObj.coinBalance = selectedObj.avilableBalance
        selectedObj.coinFullName = selectedObj.name
        selectedObj.oneCoinValue = selectedObj.current_price;
        console.log(selectedObj);
        this.props.dispatch(fetchWithDrawWallets({ memberId: this.props?.userProfile?.id }));
        this.props.dispatch(handleSendFetch({ key: "cryptoWithdraw", activeTab: null }));
        this.props.dispatch(setSubTitle(apiCalls.convertLocalLang("selectCurrencyinWallet")));
        // amount: "4320.00"
        // id: "c5707468-c667-4c32-84fe-700a2b5c42a5"
        // imagePath: "https://suissebase.blob.core.windows.net/assets/usd.svg"
        // walletCode: "USD"
        // walletId: "fabc96b7-db27-4e36-a747-76701d76371d"
        let coin = value.symbol.toUpperCase();
        //     if (this.props?.userProfile?.isDocsRequested) {
        //         this.props.history.push("/docnotices");
        //         return;
        //     }
        //     if (!this.props?.userProfile?.isKYC) {
        //         this.props.history.push("/notkyc");
        //         return;
        //     }
        //     // const isDocsRequested = this.props.userProfile.isDocsRequested;
        //     // if (isDocsRequested) {
        //     //     this.showDocsError();
        //     //     return;
        //     // }
        //    // if (e === 2) {
        //         this.props.dispatch(setWithdrawfiatenaable(true))
        //         this.props.dispatch(setWithdrawfiat({ walletCode: coin }))
        //     ////} 
        //     this.setState({
        //         valNum: e
        //     }, () => {
        //         this.setState({
        //             ...this.state,
        //             buyFiatDrawer: true,
        //             selctedVal: coin
        //         })

        //     })
        // this.props.dispatch(setWithdrawcrypto({...obj, toWalletAddress: item.code}))

        this.props.dispatch(setSelectedWithDrawWallet(selectedObj));
        this.props.changeStep('withdraw_crypto_selected');
        this.setState({
            ...this.state,
            buyDrawer: true
        })
        //this.closeDrawer()

        // this.props.dispatch(setStep('withdraw_crypto_selected'));

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
            <div className="mb-36 text-white-50 fs-24"><Link className="icon md leftarrow mr-16 c-pointer" to="/cockpit" />{coinData?.name} ({coinData?.symbol.toUpperCase()})</div>
            <Row gutter={[24, 24]}>
                <Col lg={14} xl={14} xxl={14}>
                    <div className="box p-24 coin-bal">
                        {this.state.coinData ? <><div className="d-flex align-center">
                            <span className={`coin md ${coinData?.symbol.toUpperCase()}`} />
                            <div className="summary-count ml-16">
                                <Paragraph className="text-white-30 fs-36 mb-0 fw-500">{coinData?.avilableBalance}<Text className="fs-24 ml-8 text-white-30 fw-500">{coinData?.symbol.toUpperCase()}</Text></Paragraph>
                                <Text className="text-white-30 fs-16 m-0" style={{ lineHeight: '18px' }}>1{coinData?.symbol.toUpperCase()} = {coinData?.current_price} USD
                                    {coinData?.market_cap_change_percentage_24h > 0 && <>
                                        <Text className="text-green ml-16">{coinData?.market_cap_change_percentage_24h}%</Text>
                                    </>}
                                    {coinData?.market_cap_change_percentage_24h < 0 && <>
                                        <Text className="text-red ml-16">{coinData?.market_cap_change_percentage_24h}%</Text>
                                    </>}
                                </Text>
                            </div>
                        </div>
                            <div className="text-right">
                                <Translate content="buy" component={Button} type="primary" onClick={() => this.showBuyDrawer(coinData, "buy")} className="custom-btn prime" />
                                <Translate content="sell" component={Button} className="custom-btn sec outline ml-16" onClick={() => this.showBuyDrawer(coinData, "sell")} />
                                {/* <Translate content="sell" component={Button} className="custom-btn sec outline ml-16" onClick={() => this.showBuyDrawer("sell")} /> */}
                                {/* <Translate content="withdraw" className="ml-16" component={Radio.Button} onClick={() => this.showSendReceiveDrawer(2, coinData)} value={2} /> */}
                            </div>
                            {/* <div className="crypto_btns">
                                <Translate content="buy" component={Button} type="primary" onClick={() => this.showBuyDrawer(item, "buy")} className="custom-btn prime" />
                                <Translate content="sell" component={Button} className="custom-btn sec outline ml-16" onClick={() => this.showBuyDrawer(item, "sell")} />
                            </div> */}

                            {/* <ul className="m-0">
                                <li onClick={() => this.showBuyDrawer(coinData, "buy")}><div><span className="icon md file" /></div>BUY</li>
                                <li  onClick={() => this.showBuyDrawer(coinData, "sell")}><div><span className="icon md file" /></div>SELL</li>
                                <li><div><span className="icon md file" /></div>WITHDRAW</li>
                            </ul> */}
                        </> : <div className="text-center mt-24"><Spin /></div>}
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

                        {this.state.coinData ? <><Title component={Title} className="fs-24 fw-600 mb-36 text-white-30">{coinData?.symbol.toUpperCase()} Price and Market Stats</Title>
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
                            </div></> : <div className="coin-details-spin"><Spin className="text-center" /></div>}
                    </div>
                </Col>
            </Row>
            <BuySell showDrawer={this.state.buyDrawer} onClose={() => this.closeDrawer()} />
        </div>
    }
}

const connectStateToProps = ({ sendReceive, userConfig }) => {
    return { sendReceive, userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },

        // SelectedAddress: (addressObj) => {
        //     dispatch(setAddress(addressObj));
        // },
        dispatch
    }
}

export default connect(connectStateToProps, connectDispatchToProps)(withRouter(CoinView));