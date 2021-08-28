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
        sendreceive: false
    }

    handleBuySellToggle = e => {
        // console.log(this.state);
        this.setState({
            sendreceive: e.target.value === 2
        });
    }

    render() {
        const { Title, Paragraph, Text } = Typography;
        const { sendreceive } = this.state
        return (
            <>
                <Radio.Group
                    defaultValue={this.props.activeTab || 1}
                    onChange={this.handleBuySellToggle}
                    className="buysell-toggle crypto-toggle text-upper">
                    <Translate value={1} content="deposit" component={Radio.Button} />
                    <Translate value={2} content="withdraw" component={Radio.Button} />
                </Radio.Group>
                {sendreceive ? <WithdrawCrypto /> :<CryptoDeposit />}
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

