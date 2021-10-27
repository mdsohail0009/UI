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
class CryptoComponent extends Component {
    state = {
        buyDrawer: false,
        crypto: config.tlvCoinsList,
        buyToggle: 'Buy',
        isBuy: false,
        tabKey: 1
    }
    componentDidMount() {
        this.props.dispatch(fetchCoins("All"));
    }
    handleBuySellToggle = e => {
        this.props.dispatch(setTab(e.target.value))
    }
    handleCoinSelection = (selectedCoin) => {
        this.props.getCoinDetails(selectedCoin.walletCode, this.props.member?.id);
        this.props.setSelectedCoin(selectedCoin);
        convertCurrency({ from: selectedCoin.walletCode, to: "USD", value: 1, isCrypto: false ,memId:this.props.member?.id,screenName:null}).then(val => {
            this.props.setExchangeValue({ key: selectedCoin.walletCode, value: val });
        })
        this.props.changeStep("step2");
    }
    render() {
        const { TabPane } = Tabs;
        const { Title, Paragraph,Text } = Typography;
        const { coins: coinListdata } = this.props?.buyInfo;
        return (
            <>
                <div className="text-center">
                    <Radio.Group
                        value={this.props.buySell.tabKey}
                        onChange={this.handleBuySellToggle}
                        className="buysell-toggle">
                        <Translate content="buy" component={Radio.Button} value={1} />
                        <Translate content="sell" component={Radio.Button} value={2} />
                    </Radio.Group>
                </div>
                {this.props.buySell.tabKey === 2 ?
                    <>
                        <Translate content="sell_your_crypto_for_cash" component={Title} className="drawer-title custom-font" />
                        <Translate content="sell_your_crypto_for_cash_text" component={Paragraph} className="text-secondary fw-300 fs-16" />
                        <SellToggle /></>
                    :
                    <>
                        <Translate content="purchase_a_crypto" component={Title} className="drawer-title custom-font" />
                        <Translate content="sell_your_crypto_for_cash_text" component={Paragraph} className="text-secondary fw-300 fs-16" />
                        <Tabs className="crypto-list-tabs" onChange={(key) => {
                            const types = {
                                1: "All", 2: "Gainers", 3: "Losers"
                            };
                            this.props.dispatch(fetchCoins(types[key]));
                        }}>
                            <TabPane tab={<Translate content="tabs_All"  component={Tabs.TabPane.tab} className="custom-font fw-400 fs-16" ></Translate>} key="1">
                                <CryptoList isLoading={coinListdata["All"]?.loading} showSearch={true} coinList={coinListdata["All"]?.data} coinType="All" onCoinSelected={(selectedCoin) => this.handleCoinSelection(selectedCoin)} />
                            </TabPane>
                            <TabPane tab={<Translate content="gainers"  component={Tabs.TabPane.tab} className="custom-font fw-400 fs-16" ></Translate> }key="2">
                                <CryptoList coinType="Gainers" showSearch={true} isLoading={coinListdata["Gainers"]?.loading} coinList={coinListdata["Gainers"]?.data} onCoinSelected={(selectedCoin) => this.handleCoinSelection(selectedCoin)} />
                            </TabPane>
                            <TabPane tab={<Translate content="losers"  component={Tabs.TabPane.tab} className="custom-font fw-400 fs-16" ></Translate> }key="3">
                                <CryptoList coinType="Losers" showSearch={true} isLoading={coinListdata["Losers"]?.loading} coinList={coinListdata["Losers"]?.data} onCoinSelected={(selectedCoin) => this.handleCoinSelection(selectedCoin)} />
                            </TabPane>
                        </Tabs></>
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
        getCoinDetails: (coin, memid) => {
            dispatch(fetchSelectedCoinDetails(coin, memid));
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
