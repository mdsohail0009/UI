import React, { Component } from 'react';
import { Typography } from 'antd';
import config from '../../config/config';
import Translate from 'react-translate-component';
import CryptoList from '../shared/cryptolist';
import SellToggle from '../sell.component/sellCrypto'
import { setStep, setTab } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import { fetchCoins, fetchSelectedCoinDetails, setCoin, setExchangeValue } from '../../reducers/buyReducer';
import { convertCurrency } from './buySellService';
import apiClient from "../../api/apiCalls";
import Loader from '../../Shared/loader'

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
        if (this.props.buySell.tabKey === 1) {
            apiClient.trackEvent({ "Type": 'User', "Action": 'Buy page view', "Feature": 'Buy', "Remarks": "Buy coin selection", "FullFeatureName": 'Buy Crypto', "userName": this.props.member?.userName, id: this.props.member?.id });
            apiClient.trackEvent({ "Type": 'User', "Action": `Buy All coins page view`, "Username": this.props.member?.userName, "customerId": this.props.member?.id, "Feature": 'Buy', "Remarks": `Buy All coins page view`, "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Buy Crypto' });
        } else if (this.props.buySell.tabKey === 2) {
            apiClient.trackEvent({ "Type": 'User', "Action": 'Sell page view', "Feature": 'Sell', "Remarks": "Sell coin selection", "FullFeatureName": 'Sell Crypto', "userName": this.props.member?.userName, id: this.props.member?.id });
        }
    }
    buySellEventTracks = (e) => {
        if (e.target.value === 1) {
            apiClient.trackEvent({ "Type": 'User', "Action": 'Buy page view', "Feature": 'Buy', "Remarks": "Buy coin selection", "FullFeatureName": 'Buy Crypto', "userName": this.props.member?.userName, id: this.props.member?.id });
        } else if (e.target.value === 2) {
            apiClient.trackEvent({ "Type": 'User', "Action": 'Sell page view', "Feature": 'Sell', "Remarks": "Sell coin selection", "FullFeatureName": 'Sell Crypto', "userName": this.props.member?.userName, id: this.props.member?.id });
        }
    }
    handleBuySellToggle = e => {
        this.props.dispatch(setTab(e.target.value));
        this.buySellEventTracks(e);
    }
    handleCoinSelection = (selectedCoin) => {
        this.props.getCoinDetails(selectedCoin.walletCode);
        this.props.setSelectedCoin(selectedCoin);
        convertCurrency({ from: selectedCoin.walletCode, to: "USD", value: 1, isCrypto: false, customer_id: this.props.member?.id, screenName: null }).then(val => {
            this.props.setExchangeValue({ key: selectedCoin.walletCode, value: val });
        })
        this.props.changeStep("step2");
    }
    render() {
        const { Paragraph,Title } = Typography;
        const { coins: coinListdata } = this.props?.buyInfo;
        if (coinListdata["All"]?.loading) { return <Loader /> }
        return (
            <>      
                {this.props.buySell.tabKey === 1 && !this.props.isTab ? <>
                    <Translate content="buy_your_crypto_for_cash_text" component={Paragraph} className="label-style" />
                    
                    <CryptoList ref={this.ref} isLoading={coinListdata["All"]?.loading} showSearch={true} coinList={coinListdata["All"]?.data} coinType="All" onCoinSelected={(selectedCoin) => this.handleCoinSelection(selectedCoin)} />
                    </> : <>
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
        getCoinDetails: (coin) => {
            dispatch(fetchSelectedCoinDetails(coin));
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