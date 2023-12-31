
import React from 'react';
import { connect } from 'react-redux';
import { Typography, Row, Col, Spin, Radio,Tabs,Image,Alert } from "antd";
import { Link, withRouter } from "react-router-dom";
import { getcoinDetails, getCoinChatData } from './api'
import LineChart from './lineChart';
import BuySell from '../buy.component';
import SendReceive from '../send.component'
import { fetchSelectedCoinDetails, setExchangeValue, setCoin } from '../../reducers/buyReducer';
import { setStep, setSellHeaderHide } from '../../reducers/buysellReducer';
import { updateCoinDetail } from '../../reducers/sellReducer'
import { convertCurrency } from '../buy.component/buySellService';
import apiCalls from '../../api/apiCalls';
import { fetchDashboardcalls, fetchMarketCoinData } from '../../reducers/dashboardReducer'
import { fetchWithDrawWallets, handleSendFetch, setSelectedWithDrawWallet, setSubTitle, setWithdrawfiatenaable, setWithdrawfiat, setWalletAddress, setSendCrypto,hideSendCrypto } from "../../reducers/sendreceiveReducer";
import NumberFormat from "react-number-format";
import { coinSubject } from '../../utils/pubsub';
import { createCryptoDeposit } from '../deposit.component/api';
class CoinView extends React.Component {
    refreshSubscribe;
   state = {
    coinData: null,
    chatData: null,
    type: 'prices',
    buyDrawer: false,
    sendDrawer: false,
    coin:"",
    loading:false,
    errorMessage:null
}
    componentDidMount() {
        window.scrollTo(0, 0)
        this.loadCoinDetailData();
        this.refreshSubscribe = coinSubject.subscribe(()=>{

            this.loadCoinDetailData();
        })
    }
componentWillUnmount(){
    this.refreshSubscribe.unsubscribe();
}
    coinViewTrack = () => {
        apiCalls.trackEvent({ "Type": 'User', "Action": 'Coin page view', "Username": this.props.userProfileInfo?.userName, "customerId": this.props.userProfileInfo?.id, "Feature": 'Cockpit', "Remarks": 'Coin page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Cockpit' });
    }
    loadCoinDetailData = async () => {
        this.setState({ ...this.state, loading: true,errorMessage:null})
        this.props.dispatch(fetchMarketCoinData(false))
        const response = await getcoinDetails(this.props.match.params?.coinName);
        if (response.ok) {
            this.setState({ ...this.state, coinData: response.data,errorMessage:null },
                 () => {this.coinChartData(1); }
            )
        }else{
            this.setState({...this.state,errorMessage:apiCalls.isErrorDispaly(response)})

        }
        this.setState({ ...this.state, loading: false})
    }

    coinChartData = async (days) => {
        if (this.state.coinData) {
            const response = await getCoinChatData(this.state.coinData.id, 'usd', days);
            if (response.ok) {
                this.setState({ ...this.state, chatData: { ...response.data, coinType: `USD To ${this.state.coinData?.symbol.toUpperCase()}`,errorMessage:null } })
            }else{
                this.setState({...this.state,errorMessage:apiCalls.isErrorDispaly(response)})
    
            }
        }
    }
    showBuyDrawer = (item, key) => {
        let selectedObj = { ...item };
        selectedObj.coin = selectedObj.symbol.toUpperCase();
        selectedObj.coinBalance = selectedObj.avilableBalance
        selectedObj.coinFullName = selectedObj.name
        selectedObj.oneCoinValue = selectedObj.current_price;
        selectedObj.id = selectedObj.memberWalletId;
        if (!this.props?.userProfile?.isKYC) {
            this.props.history.push("/notkyc");
            return;
        }
        if(!this.props?.twoFA?.isEnabled){
            this.props.history.push("/enabletwofactor");
            return;
        }

        if (this.props?.userProfile?.isDocsRequested) {
            this.props.history.push("/docnotices");
            return;
        }

        if (key === "buy") {
            this.props.dispatch(fetchSelectedCoinDetails(selectedObj.coin));
            this.props.dispatch(setCoin({ ...selectedObj, toWalletCode: selectedObj.coin, toWalletId: selectedObj.id, toWalletName: selectedObj.coinFullName }));
            convertCurrency({ from: selectedObj.coin, to: "USD", value: 1, isCrypto: false, customer_id: this.props.userProfile?.id, screenName: null }).then(val => {
                this.props.dispatch(setExchangeValue({ key: selectedObj.coin, value: val }));
            });
            this.props.dispatch(setSellHeaderHide(false));
            this.props.dispatch(setStep("step2"));
        } else if (key === "sell") {
            this.props.dispatch(setCoin(selectedObj));
            this.props.dispatch(setExchangeValue({ key: selectedObj.coin, value: selectedObj.oneCoinValue }));
            this.props.dispatch(updateCoinDetail(selectedObj))
            this.props.dispatch(setSellHeaderHide(false));
            this.props.dispatch(setStep("step10"));
        }
        this.setState({
            ...this.state,
            buyDrawer: true
        })
    }
    showSendReceiveDrawer = async (e, value) => {
        this.props.dispatch(hideSendCrypto(false));
        let selectedObj = { ...value };
        selectedObj.coin = selectedObj.symbol.toUpperCase();
        selectedObj.coinBalance = selectedObj.avilableBalance
        selectedObj.coinFullName = selectedObj.name
        selectedObj.oneCoinValue = selectedObj.current_price;
        selectedObj.id = selectedObj.memberWalletId;
        selectedObj.withdrawMinValue = selectedObj.withDrawMinValue
        this.props.dispatch(fetchWithDrawWallets({ customerId: this.props?.userProfile?.id }));
        this.props.dispatch(handleSendFetch({ key: "cryptoWithdraw", activeTab: null }));
        this.props.dispatch(setSubTitle(apiCalls.convertLocalLang("wallet_address")));
        let coin = value.symbol.toUpperCase();
        if (!this.props?.userProfile?.isKYC) {
            this.props.history.push("/notkyc");
            return;
        }
        if(!this.props?.twoFA?.isEnabled){
            this.props.history.push("/enabletwofactor");
            return;
        }
        if (this.props?.userProfile?.isDocsRequested) {
            this.props.history.push("/docnotices");
            return;
        }
        if (!this.props?.userProfile?.isKYC) {
            this.props.history.push("/notkyc");
            return;
        }
        const isDocsRequested = this.props.userProfile.isDocsRequested;
        if (isDocsRequested) {
            this.showDocsError();
            return;
        }
        if (e === 2) {
            this.props.dispatch(setWithdrawfiatenaable(true))
            this.props.dispatch(setSendCrypto(true));
            this.props.dispatch(setWithdrawfiat({ walletCode: coin }))
            this.props.dispatch(setSelectedWithDrawWallet(selectedObj));
            this.props.changeStep('withdraw_crypto_selected');

        } else {
            this.props.dispatch(setSendCrypto(false));
            this.props.dispatch(setSelectedWithDrawWallet(selectedObj));
            this.props.dispatch(setSubTitle(`${selectedObj.coinBalance ? selectedObj.coinBalance : '0'} ${selectedObj.coin} + " " + apiCalls.convertLocalLang('available')`));
            this.props.dispatch(setStep("step7"));
            this.props.dispatch(setSubTitle(` ${coin}` + " " + "balance" +" "+ ":" +" "+ `${selectedObj.coinBalance ? selectedObj.coinBalance : '0'}`+`${" "}`+`${coin}`));
             const response = await createCryptoDeposit({ customerId: this.props.userProfile?.id, walletCode: coin, network: selectedObj?.network });
             if (response.ok) {
                this.props.dispatch(setWalletAddress(response.data));
                this.props.dispatch(fetchDashboardcalls(this.props.userProfile?.id));
                this.setState({...this.state,errorMessage:null})
             }else{
                this.setState({...this.state,errorMessage:apiCalls.isErrorDispaly(response)})
    
            }
            this.setState({
                ...this.state,
                sendDrawer: true
            })
        }
        this.setState({
            valNum: e
        }, () => {
            this.setState({
                ...this.state,
                sendDrawer: true,
                selctedVal: coin
            })

        })
    }

    closeDrawer = () => {
        this.setState({
            buyDrawer: false,
            sendDrawer: false
        })
    }

    render() {
        const { Paragraph, Text, Title } = Typography
        const { coinData } = this.state;
        if (this.props.dashboard.isCoinViewChange) {
            this.loadCoinDetailData();
        }
      
        return <div className="main-container">
            <>
            {this.state.errorMessage != null && <Alert
            description={this.state.errorMessage}
            type="error"
            showIcon
            closable={false}
        />}
            <div className="coin-viewstyle"><Link className="icon md leftarrow c-pointer backarrow-mr" to="/cockpit" /><span>{coinData?.name} ({coinData?.symbol.toUpperCase()})</span></div>
            <Row gutter={[24, 24]}>
                <Col lg={14} xl={14} xxl={14}>
                    <div className="box coin-bal coin-details">
                    {this.state.loading&& this.state.coinData ?<Spin className="text-center"/>:<>
                        {this.state.coinData &&
                        <> 
                        <div className="d-flex align-center">
                            <Image preview={false} src={coinData.imagePath} />
                            <div className="summary-count">
                                <Paragraph className="coin-balstyle">
                                    <NumberFormat value={coinData?.avilableBalance} displayType="text" thousandSeparator={true} prefix="" />
                                    <Text className="coin-name">{coinData?.symbol.toUpperCase()}</Text></Paragraph>
                                <Text className="coin-subbalval">1{coinData?.symbol.toUpperCase()} = <NumberFormat value={coinData?.current_price} displayType="text" thousandSeparator={true} /> USD
                                    {coinData?.market_cap_change_percentage_24h > 0 && <>
                                        <Text className="text-green value-up">{coinData?.market_cap_change_percentage_24h}%</Text>
                                    </>}
                                    {coinData?.market_cap_change_percentage_24h < 0 && <>
                                        <Text className="text-red value-down">{coinData?.market_cap_change_percentage_24h}%</Text>
                                    </>}
                                </Text>
                            </div>
                        </div>
                            <ul className="m-0 pl-0">
                                <li><div onClick={() => this.showBuyDrawer(coinData, "buy")} className="c-pointer"><span  className="icon md buy" /></div><span className='coin-fs'>BUY</span></li>
                                <li><div onClick={() => this.showBuyDrawer(coinData, "sell")} className="c-pointer"><span className="icon md sell" /></div><span className='coin-fs'>SELL</span></li>
                                <li><div onClick={() => this.showSendReceiveDrawer(1, coinData)} value={1} className="c-pointer"><span className="icon md withdraw" /></div><span className='coin-fs'>RECEIVE</span></li>
                                <li><div onClick={() => this.showSendReceiveDrawer(2, coinData)} value={2} className="c-pointer"><span className="icon md deposit" /></div><span className='coin-fs'>SEND</span></li>
                            </ul>
                            </> }
                            {!this.state.coinData &&
                            (<div className="text-center"><Spin className="text-center"/></div>)}
                            </>}
                    </div>
                    <Tabs className="cust-tabs-fait coinview-tabs" onChange={(e) => this.setState({ ...this.state, type: e })}>
                                <Tabs.TabPane tab="Price" className="" key={"prices"} ></Tabs.TabPane>
                                <Tabs.TabPane tab="Market Cap" className="" key={"market_caps"}  ></Tabs.TabPane>
                                <Tabs.TabPane tab="Trading View" className="" key={"total_volumes"} ></Tabs.TabPane>
                            </Tabs>
                    <div className="box coin-details">
                        <Title  component={Title} className="coin-titlestyle">{coinData?.name} ({coinData?.symbol.toUpperCase()}) Price Chart</Title>
                        <div className="trade-legends">
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
                        {this.state.chatData ? <LineChart data={this.state.chatData} type={this.state.type} coinType={this.state.chatData.coinType} /> : <div className="coin-details-spin"><Spin className="text-center" /></div>}
                    </div>
                </Col>
                <Col lg={10} xl={10} xxl={10}>
                    <div className="box coin-details right">

                        {this.state.coinData ? <><Title component={Title} className="coin-titlestyle">{coinData?.symbol.toUpperCase()} Price and Market Status</Title>
                            <div className="coin-info">
                                <Text className='profile-label'>{coinData?.symbol.toUpperCase()} Price</Text>
                                <Text className='profile-value'>
                                    <NumberFormat value={coinData?.current_price} displayType="text" thousandSeparator={true} prefix="$" />
                                </Text>
                            </div>
                            <div className="coin-info">
                                <Text className='profile-label'>Market Cap</Text>
                                <Text className='profile-value'>
                                    <NumberFormat value={coinData?.market_cap} displayType="text" thousandSeparator={true} prefix="$" />
                                </Text>
                            </div>
                            <div className="coin-info">
                                <Text className='profile-label'>24 Hour Trading Vol</Text>
                                <Text className='profile-value'>
                                    <NumberFormat value={coinData?.market_cap_change_24h} displayType="text" thousandSeparator={true} prefix="$" />
                                </Text>
                            </div>
                            <div className="coin-info">
                                <Text className='profile-label'>Fully Diluted Valuation</Text>
                                <Text className='profile-value'>
                                    <NumberFormat value={coinData?.fully_diluted_valuation} displayType="text" thousandSeparator={true} prefix="$" />
                                </Text>
                            </div>
                            <div className="coin-info">
                                <Text className='profile-label'>Circulating Supply</Text>
                                <Text className='profile-value'>
                                    <NumberFormat value={coinData?.circulating_supply} displayType="text" thousandSeparator={true} prefix="" />
                                </Text>
                            </div>
                            <div className="coin-info">
                                <Text className='profile-label'>Total Supply</Text>
                                <Text className='profile-value'>
                                    <NumberFormat value={coinData?.total_supply} displayType="text" thousandSeparator={true} prefix="" />
                                </Text>
                            </div>
                            <div className="coin-info">
                                <Text className='profile-label'>Max Supply</Text>
                                <Text className='profile-value'>
                                    <NumberFormat value={coinData?.max_supply} displayType="text" thousandSeparator={true} prefix="" />
                                </Text>
                            </div>
                            <div className="coin-info">
                                <Text className='profile-label'>All-Time High</Text>
                                <div>
                                    <Text className='profile-value'>
                                        <NumberFormat value={coinData?.ath} displayType="text" thousandSeparator={true} prefix="$" />
                                    </Text>
                                    <Text className='profile-value'>
                                        <NumberFormat className="pg-text coin-green-ml" value={coinData?.ath_change_percentage} displayType="text" thousandSeparator={true} prefix="" suffix="%" />
                                    </Text>
                                    <Text className='coin-date'>{new Date(coinData?.ath_date).toLocaleDateString()}</Text>
                                </div>
                            </div>
                            <div className="coin-info">
                                <Text className='profile-label'>All-Time Low</Text>
                                <div>
                                    <Text className='profile-value'>
                                        <NumberFormat value={coinData?.atl} displayType="text" thousandSeparator={true} prefix="$" />
                                    </Text>
                                    <Text className='profile-value'>
                                        <NumberFormat className="pg-text coin-green-ml" value={coinData?.atl_change_percentage} displayType="text" thousandSeparator={true} prefix="" suffix="%" />
                                    </Text>
                                    <div className='coin-date'>{new Date(coinData?.atl_date).toLocaleDateString()}</div>
                                </div>
                            </div></> : <div className="coin-details-spin"><Spin className="text-center" /></div>}
                    </div>
                </Col>
            </Row>
            <BuySell showDrawer={this.state.buyDrawer} onClose={() => this.closeDrawer()} />
            <SendReceive showDrawer={this.state.sendDrawer} onClose={() => this.closeDrawer()} />
            </>
             </div >
    }
}

const connectStateToProps = ({ sendReceive, userConfig, dashboard }) => {
    return { sendReceive, userProfile: userConfig.userProfileInfo, dashboard,twoFA:userConfig.twoFA }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        dispatch
    }
}

export default connect(connectStateToProps, connectDispatchToProps)(withRouter(CoinView));