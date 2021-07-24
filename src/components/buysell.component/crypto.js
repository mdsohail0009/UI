import React, { Component } from 'react';
import { Typography, Radio, Tabs, Input } from 'antd';
import config from '../../config/config';
import Translate from 'react-translate-component';
import CryptoList from '../shared/cryptolist';
import SellToggle from '../sell.component/sellCrypto'
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import { fetchSelectedCoinDetails, setCoinWallet, setExchangeValue } from './crypto.reducer';
import { convertCurrency } from './buySellService';

const LinkValue = (props) => {
    return (
        <Translate className="text-yellow text-underline c-pointer"
            content={props.content}
            component={Link}
            to="./#"
        />
    )
}
class CryptoComponent extends Component {
    state = {
        buyDrawer: false,
        crypto: config.tlvCoinsList,
        buyToggle: 'Buy',
        isBuy: false
    }
    handleBuySellToggle = e => {
        this.setState({
            isBuy: e.target.value === 2
        });
    }
    handleCoinSelection = (selectedCoin) => {
        this.props.getCoinDetails(selectedCoin.walletCode, this.props.member?.id);
        this.props.setSelectedCoin(selectedCoin);
        convertCurrency({ from: selectedCoin.walletCode, to: "USD", value: 1, isCrypto: false }).then(val => {
            this.props.setExchangeValue({ key: selectedCoin.walletCode, value: val });
        })
        this.props.changeStep("step2");
    }
    render() {
        const { TabPane } = Tabs;
        const link = <LinkValue content="deposit" />;
        const { Title, Paragraph } = Typography;
        const { isBuy } = this.state;
        const { Search } = Input;
        return (
            <>
                <Radio.Group
                    defaultValue={1}
                    onChange={this.handleBuySellToggle}
                    className="buysell-toggle">
                    <Translate content="buy" component={Radio.Button} value={1} />
                    <Translate content="sell" component={Radio.Button} value={2} />
                </Radio.Group>
                {isBuy ?
                    <>
                        {/* <Paragraph className="mb-0 text-white-30 fw-200 fs-36">Sell your Crypto for Cash</Paragraph> */}
                        <Translate content="sell_your_crypto_for_cash" component={Title} className="drawer-title" />
                        <Translate content="sell_your_crypto_for_cash_text" component={Paragraph} className="text-secondary fw-300 fs-16" />
                        <SellToggle /></>
                    :
                    <>
                        <Translate content="purchase_a_crypto" component={Title} className="drawer-title" />
                        <Translate content="deposit_link" with={{ link }} component={Paragraph} className="fs-16 text-secondary" />
                        <Tabs className="crypto-list-tabs">
                            <TabPane tab="All" key="1">
                                <CryptoList showSearch={this.props.showSearch} coinType="All" onCoinSelected={(selectedCoin) => this.handleCoinSelection(selectedCoin)} />
                            </TabPane>
                            <TabPane tab="Gainers" key="2">
                                <CryptoList coinType="Gainers" onCoinSelected={(selectedCoin) => this.handleCoinSelection(selectedCoin)} />
                            </TabPane>
                            <TabPane tab="Losers" key="3">
                                <CryptoList coinType="Losers" onCoinSelected={(selectedCoin) => this.handleCoinSelection(selectedCoin)} />
                            </TabPane>
                        </Tabs></>
                }
            </>
        )
    }
}
const connectStateToProps = ({ buySell, oidc, userConfig }) => {
    return { buySell, member: userConfig.userProfileInfo }
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
            dispatch(setCoinWallet(coinWallet));
        },
        setExchangeValue: ({ key, value }) => {
            dispatch(setExchangeValue({ key, value }))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(CryptoComponent);
