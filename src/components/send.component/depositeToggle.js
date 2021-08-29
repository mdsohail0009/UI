import React, { Component } from 'react';
import { Typography, Radio, Card, List, Skeleton } from 'antd';
import config from '../../config/config';
import Translate from 'react-translate-component';
import { setStep } from '../../reducers/sendreceiveReducer';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import CryptoDeposit from '../deposit.component/crypto.deposit';
import WithdrawCrypto from '../withdraw.crypto.component';


class DepositeCrypto extends Component {
    state = {
        loading: false,
        initLoading: true,
        buyDrawer: false,
        crypto: config.tlvCoinsList,
        buyToggle: 'Buy',
        activeKey: 1
    }

    handleBuySellToggle = e => {
        this.setState({
            ...this.state,
            activeKey: e.target.value
        });
    }
    componentDidMount() {
        this.setState({ ...this.state, activeKey: this.props.sendReceive?.cryptoWithdraw?.activeTab || 1, sendReceive: true })
    }
    componentWillUnmount() {
        this.setState({ ...this.state, activeKey: 1 })
    }
    render() {
        const { activeKey } = this.state
        return (
            <>
                <Radio.Group value={this.state.activeKey}
                    onChange={this.handleBuySellToggle}
                    className="buysell-toggle crypto-toggle text-upper">
                    <Translate value={1} content="deposit" component={Radio.Button} />
                    <Translate value={2} content="withdraw" component={Radio.Button} />
                </Radio.Group>
                {activeKey==2 ? <WithdrawCrypto /> : <CryptoDeposit />}
            </>
        )
    }
}

const connectStateToProps = ({ sendReceive, oidc }) => {
    return { sendReceive }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(DepositeCrypto);

