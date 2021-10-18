import React, { Component } from 'react';
import { Radio } from 'antd';
import config from '../../config/config';
import Translate from 'react-translate-component';
import { handleSendFetch, setStep, setSubTitle ,setWithdrawcrypto, setAddress,rejectWithdrawfiat} from '../../reducers/sendreceiveReducer';
import { connect } from 'react-redux';
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
        if(e.target.value === 1 ){
            this.props.dispatch(setSubTitle(`USD ${this.props.dashboard?.totalFiatValue} Total balance`));
            this.props.dispatch(setAddress(null))
            this.props.dispatch(rejectWithdrawfiat(null))
        }  else{
            this.props.dispatch(setSubTitle(`Select a currency in your wallet`));
        }
    
    }
    componentDidMount() {
        this.setState({ ...this.state, activeKey: this.props.sendReceive?.cryptoWithdraw?.activeKey || 1, sendReceive: true });
        this.props.dispatch(handleSendFetch({ key: "cryptoWithdraw", activeKey: 1 }));
        this.props.dispatch(setSubTitle(`USD ${this.props.dashboard?.totalFiatValue} Total balance`));
    }
    componentWillUnmount() {
        this.setState({ ...this.state, activeKey: 1 });
    }
    render() {
        const { activeKey } = this.state
        return (
            <>
                <div className="text-center"><Radio.Group value={this.state.activeKey}
                    onChange={this.handleBuySellToggle}
                    className="buysell-toggle crypto-toggle text-upper">
                    <Translate value={1} content="deposit" component={Radio.Button} />
                    <Translate value={2} content="withdraw" component={Radio.Button} />
                </Radio.Group>
                </div>
                {activeKey === 2 && <WithdrawCrypto />}
                {activeKey === 1 &&<CryptoDeposit />}
            </>
        )
    }
}

const connectStateToProps = ({ sendReceive, dashboard }) => {
    return { sendReceive, dashboard: dashboard?.portFolio?.data }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }, dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(DepositeCrypto);

