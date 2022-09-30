import React, { Component } from 'react';
import { Typography, Radio, Tabs } from 'antd';
import config from '../../config/config';
import Translate from 'react-translate-component';
import CryptoList from '../shared/cryptolist';
import SellToggle from '../sell.component/sellCrypto'
import { setStep, setTab } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import { fetchCoins, fetchSelectedCoinDetails, setCoin, setExchangeValue } from '../../reducers/buyReducer';
import { convertCurrency } from './buySellService';
import apiClient from "../../api/apiCalls";

class CryptoComponent extends Component {
    ref = React.createRef();
    constructor(props) {
        super(props)
        this.state = {
            buyDrawer: false,
            crypto: config.tlvCoinsList,
            buyToggle: 'Buy',
            isBuy: false,
            tabKey: props.isTab ? 2 : 1
        }
        this.buySellEventTracks = this.buySellEventTracks.bind(this);
    }

    componentDidMount() {
        this.props.dispatch(fetchCoins("All"));
        if (this.props.buySell.tabKey == 1) {
            apiClient.trackEvent({ "Type": 'User', "Action": 'Buy page view', "Feature": 'Buy', "Remarks": "Buy coin selection", "FullFeatureName": 'Buy Crypto', "userName": this.props.member?.userName, id: this.props.member?.id });
            apiClient.trackEvent({ "Type": 'User', "Action": `Buy All coins page view`, "Username": this.props.member?.userName, "customerId": this.props.member?.id, "Feature": 'Buy', "Remarks": `Buy All coins page view`, "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Buy Crypto' });
        } else if (this.props.buySell.tabKey == 2) {
            apiClient.trackEvent({ "Type": 'User', "Action": 'Sell page view', "Feature": 'Sell', "Remarks": "Sell coin selection", "FullFeatureName": 'Sell Crypto', "userName": this.props.member?.userName, id: this.props.member?.id });
        }
    }
    buySellEventTracks = (e) => {
        if (e.target.value == 1) {
            apiClient.trackEvent({ "Type": 'User', "Action": 'Buy page view', "Feature": 'Buy', "Remarks": "Buy coin selection", "FullFeatureName": 'Buy Crypto', "userName": this.props.member?.userName, id: this.props.member?.id });
        } else if (e.target.value == 2) {
            apiClient.trackEvent({ "Type": 'User', "Action": 'Sell page view', "Feature": 'Sell', "Remarks": "Sell coin selection", "FullFeatureName": 'Sell Crypto', "userName": this.props.member?.userName, id: this.props.member?.id });
        }
    }
    handleBuySellToggle = e => {
        this.props.dispatch(setTab(e.target.value));
        this.buySellEventTracks(e);
    }
    handleCoinSelection = (selectedCoin) => {
        this.props.getCoinDetails(selectedCoin.walletCode, this.props.member?.id);
        this.props.setSelectedCoin(selectedCoin);
        convertCurrency({ from: selectedCoin.walletCode, to: "USD", value: 1, isCrypto: false, customer_id: this.props.member?.id, screenName: null }).then(val => {
            this.props.setExchangeValue({ key: selectedCoin.walletCode, value: val });
        })
        this.props.changeStep("step2");
    }
    render() {
        const { TabPane } = Tabs;
        const { Paragraph } = Typography;
        const { coins: coinListdata } = this.props?.buyInfo;
        return (
            <>
                {/* <div className="text-center">
                    <Radio.Group
                        value={this.props.buySell.tabKey}
                        onChange={this.handleBuySellToggle}
                        className="buysell-toggle">
                        <Translate content="buy" component={Radio.Button} value={1} />
                        <Translate content="sell" component={Radio.Button} value={2} />
                    </Radio.Group>
                </div> */}
                {this.props.buySell.tabKey === 1 && !this.props.isTab ? <>
                    <Translate content="buy_your_crypto_for_cash_text" component={Paragraph} className="text-white-30 fw-300 fs-16 mt-16 text-center" />
                    {/* <Tabs className="crypto-list-tabs" onChange={(key) => {
                        const types = {
                            1: "All", 2: "Gainers", 3: "Losers"
                        };
                        apiClient.trackEvent({ "Type": 'User', "Action": `Buy ${types[key]} coins page view`, "Username": this.props.member?.userName, "customerId": this.props.member?.id, "Feature": 'Buy', "Remarks": `Buy ${types[key]} coins page view`, "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Buy Crypto' });
                        this.props.dispatch(fetchCoins(types[key]));
                        this.ref.current.clearSearch();
                    }}>
                        <TabPane tab={<Translate content="tabs_All" component={Tabs.TabPane.tab} className="custom-font fw-400 fs-16" ></Translate>} key="1">
                            <CryptoList ref={this.ref} isLoading={coinListdata["All"]?.loading} showSearch={true} coinList={coinListdata["All"]?.data} coinType="All" onCoinSelected={(selectedCoin) => this.handleCoinSelection(selectedCoin)} />
                        </TabPane>
                        <TabPane tab={<Translate content="gainers" component={Tabs.TabPane.tab} className="custom-font fw-400 fs-16" ></Translate>} key="2">
                            <CryptoList ref={this.ref} coinType="Gainers" showSearch={true} isLoading={coinListdata["Gainers"]?.loading} coinList={coinListdata["Gainers"]?.data} onCoinSelected={(selectedCoin) => this.handleCoinSelection(selectedCoin)} />
                        </TabPane>
                        <TabPane tab={<Translate content="losers" component={Tabs.TabPane.tab} className="custom-font fw-400 fs-16" ></Translate>} key="3">
                            <CryptoList ref={this.ref} coinType="Losers" showSearch={true} isLoading={coinListdata["Losers"]?.loading} coinList={coinListdata["Losers"]?.data} onCoinSelected={(selectedCoin) => this.handleCoinSelection(selectedCoin)} />
                        </TabPane>
                    </Tabs> */}
                    <CryptoList ref={this.ref} isLoading={coinListdata["All"]?.loading} showSearch={true} coinList={coinListdata["All"]?.data} coinType="All" onCoinSelected={(selectedCoin) => this.handleCoinSelection(selectedCoin)} />
                    </> : <>
                    <Translate content="sell_your_crypto_for_cash_text" component={Paragraph} className="text-white-30 fw-300 fs-16 mt-16 text-center" />
                    <SellToggle /></>
                }
            </>
        )
    }
}
const connectStateToProps = ({ buySell, userConfig, buyInfo }) => {
    return { buySell, member: userConfig.userProfileInfo, buyInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        getCoinDetails: (coin, customer_id) => {
            dispatch(fetchSelectedCoinDetails(coin, customer_id));
        },
        setSelectedCoin: (coinWallet) => {
            dispatch(setCoin(coinWallet));
        },
        setExchangeValue: ({ key, value }) => {
            dispatch(setExchangeValue({ key, value }))
        },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(CryptoComponent);
