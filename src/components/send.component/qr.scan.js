import React, { Component } from 'react';
import { Typography, Button, message } from 'antd';
import { setStep } from '../../reducers/sendreceiveReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import QRCodeComponent from '../qr.code.component';
class QRScan extends Component {
    state = {}
    success = () => {
        message.success('Address was copied!');
    };
    render() {
        const { Paragraph, Text } = Typography;
        return (
            <div>
                <div className="scanner-img">
                    <QRCodeComponent value={this.props?.sendReceive?.depositWallet?.walletAddress} />
                </div>
                <div className="crypto-address mt-36">
                    <Translate className="mb-0 fw-400 text-secondary" content="address" component={Text} />
                    <div className="mb-0 fs-14 fw-500 text-textDark">{this.props?.sendReceive?.depositWallet?.walletAddress}</div>
                </div>
                {this.props?.sendReceive?.depositWallet?.tag!=null&&<div className="crypto-address mt-36">
                    <Text className="mb-0 fw-400 text-secondary">Tag</Text>
                    <div className="mb-0 fs-14 fw-500 text-textDark">{this.props?.sendReceive?.depositWallet?.tag}</div>
                </div>}
                <Translate className="text-center f-12 text-white fw-200" content="address_hint_text" component={Paragraph} />
                <Translate size="large" block className="pop-btn" style={{ marginTop: '100px' }} content="copy" component={Button} onClick={this.success} />
                <Translate type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" onClick={() => this.props.changeStep('step1')} block content="share" component={Button} />
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
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(QRScan);