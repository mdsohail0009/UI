import React, { Component } from 'react';
import { Typography, Button, message } from 'antd';
import { setStep, setWalletAddress } from '../../reducers/sendreceiveReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import QRCodeComponent from '../qr.code.component';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import Loader from '../../Shared/loader';
const { Text } = Typography
class QRScan extends Component {
    state = {}
    success = () => {
        message.success('Address was copied!');
    };
    componentWillUnmount(){
        this.props.dispatch(setWalletAddress(null))
    }
    render() {
        const { Paragraph, Text } = Typography;
        if(!this.props?.sendReceive?.depositWallet?.walletAddress){
            return <Loader/>
        }
        return (
            <div>
                <div className="scanner-img">
                    <QRCodeComponent value={this.props?.sendReceive?.depositWallet?.walletAddress} />
                </div>
                <div className="crypto-address mt-36 custom-crypto-address mx-0">
                    <Translate className="mb-0 fw-400 text-secondary" content="address" component={Text} />
                    <div className="mb-0 fs-14 fw-500 text-textDark">{this.props?.sendReceive?.depositWallet?.walletAddress}  <CopyToClipboard text={this.props?.sendReceive?.depositWallet?.walletAddress}>
                        <Text copyable className="fs-20 text-white-30 custom-display"></Text></CopyToClipboard> </div>
                </div>
                {this.props?.sendReceive?.depositWallet?.tag != null && <div className="crypto-address mt-36">
                    <Text className="mb-0 fw-400 text-secondary">Tag</Text>
                    <div className="mb-0 fs-14 fw-500 text-textDark">{this.props?.sendReceive?.depositWallet?.tag}</div>
                </div>}
                <Translate className="text-left f-12 text-white fw-200" content="address_hint_text" component={Paragraph} />
                {/* <Translate size="large" block className="pop-btn" style={{ marginTop: '100px' }} content="copy" component={Button} onClick={this.success} /> */}
                {/* <Translate type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" onClick={() => this.props.changeStep('step1')} block content="share" component={Button} /> */}
            </div>
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
        },dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(QRScan);