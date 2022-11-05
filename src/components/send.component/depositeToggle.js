import React, { Component } from 'react';
import { Radio } from 'antd';
import config from '../../config/config';
import Translate from 'react-translate-component';
import { handleSendFetch, setStep, setSubTitle, setAddress, rejectWithdrawfiat } from '../../reducers/sendreceiveReducer';
import { connect } from 'react-redux';
import CryptoDeposit from '../deposit.component/crypto.deposit';
import WithdrawCrypto from '../withdraw.crypto.component';
import apicalls from '../../api/apiCalls';
import { numberWithCommas } from '../../utils/service';


class DepositeCrypto extends Component {
    state = {
        loading: false,
        initLoading: true,
        buyDrawer: false,
        crypto: config.tlvCoinsList,
        buyToggle: 'Buy',
        activeKey: 1
    }
    componentDidMount() {
        this.setState({ ...this.state, activeKey: this.props?.activeTab ? 2 : ((this.props?.sendReceive?.sendCryptoEnable ? this.props.sendReceive?.cryptoWithdraw?.activeKey : this.state?.activeKey ) || 1), sendReceive: true });
        this.props.dispatch(handleSendFetch({ key: "cryptoWithdraw", activeKey: this.state?.activeKey ? 2 : 1 }));
        this.props.dispatch(setSubTitle(`USD ${numberWithCommas(this.props.dashboard?.totalFiatValue)}` + " " + apicalls.convertLocalLang('total_balance')));
        apicalls.trackEvent({
            "Type": 'User', "Action": 'Deposit Crypto page view', "Username": this.props.userProfile.userName, "customerId": this.props.userProfile.id, "Feature": 'Deposit Crypto', "Remarks": "Deposit Crypto page view", "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Deposit Crypto'
        })
        if (this.props.sendReceive?.cryptoWithdraw?.activeKey == 2) {
            apicalls.trackEvent({
                "Type": 'User', "Action": 'Withdraw Crypto page view', "Username": this.props.userProfile?.userName, "customerId": this.props.userProfile?.id, "Feature": 'Withdraw Crypto', "Remarks": "Withdraw Crypto page view", "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Withdraw Crypto'
            });
        }
    }
    handleBuySellToggle = e => {
        this.setState({
            ...this.state,
            activeKey: e.target.value
        });
        if (e.target.value === 1) {
            this.props.dispatch(setSubTitle(`USD ${this.props.dashboard?.totalFiatValue} Total balance`));
            this.props.dispatch(setAddress(null))
            this.props.dispatch(rejectWithdrawfiat(null))
        } else {
            this.props.dispatch(setSubTitle(`Select a currency in your wallet`));
        }
        this.trackEventLogs(e);
    }
    trackEventLogs = (e) => {
        if (e.target.value == 1) {
            apicalls.trackEvent({
                "Type": 'User', "Action": 'Deposit Crypto page view', "Username": this.props.userProfile.userName, "customerId": this.props.userProfile.id, "Feature": 'Deposit Crypto', "Remarks": "Deposit Crypto page view", "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Deposit Crypto'
            });

        } else if (e.target.value == 2) {
            apicalls.trackEvent({
                "Type": 'User', "Action": 'Withdraw Crypto page view', "Username": this.props.userProfile?.userName, "customerId": this.props.userProfile?.id, "Feature": 'Withdraw Crypto', "Remarks": "Withdraw Crypto page view", "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Withdraw Crypto'
            });
        }
    }
    componentWillUnmount() {
        this.setState({ ...this.state, activeKey: 1 });
    }
    render() {
        const { activeKey } = this.state
        return (
            <>
                {/* <div className="text-center"><Radio.Group value={this.state.activeKey}
                    onChange={this.handleBuySellToggle}
                    className="buysell-toggle crypto-toggle text-upper">
                    <Translate value={1} content="deposit" component={Radio.Button} />
                    <Translate value={2} content="withdraw" component={Radio.Button} />
                </Radio.Group>
                </div> */}
                {activeKey === 2 && <WithdrawCrypto />}
                {activeKey === 1 && <CryptoDeposit />}
            </>
        )
    }
}

const connectStateToProps = ({ sendReceive, dashboard, userConfig }) => {
    return { sendReceive, dashboard: dashboard?.portFolio?.data, userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }, dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(DepositeCrypto);

