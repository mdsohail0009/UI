import React, { Component } from 'react';
import { Drawer, Typography } from 'antd';
import Translate from 'react-translate-component';
import connectStateProps from '../../utils/state.connect';
import { setStep } from '../../reducers/sendreceiveReducer';
import { sendreceiveSteps as config } from './config';
import DepositeCrypto from '../send.component/depositeToggle';
import CryptoWithDrawWallet from '../withdraw.crypto.component/withdraw.selected.wallet';
import ScanQR from './scan';
import WithdrawAddress from './withdrawAddress'
import VerifyIDentity from './verifyIdentity';
import WithdrawScan from './qr.scan';
import WithdrawSummary from './withdrawSummary';
const { Paragraph } = Typography
class SendReceive extends Component {
    state = {

    }
    closeDrawer = () => {
        this.props.dispatch(setStep("step1"))
        if (this.props.onClose) {
            this.props.onClose();
        }
    }
    componentWillUnmount() {
        this.props.dispatch(setStep("step1"))
    }
    renderContent = () => {
        const stepcodes = {
            depositecrypto: <DepositeCrypto activeTab={this.props.valNum} />,
            withdraw: <CryptoWithDrawWallet />,
            scanner: <ScanQR />,
            withdrawaddress: <WithdrawAddress />,
            verifyidentity: <VerifyIDentity />,
            withdrawsummary: <WithdrawSummary />,
            withdrawscan: <WithdrawScan />

        }
        return stepcodes[config[this.props.sendReceive.stepcode]]
    }
    renderTitle = () => {
        const stepcodes = {
            depositecrypto: <span />,
            withdraw: <span onClick={() => this.props.dispatch(setStep("step1"))} className="icon md lftarw-white c-pointer" />,
            scanner: <span onClick={() => this.props.dispatch(setStep("step4"))} className="icon md lftarw-white c-pointer" />,
            withdrawscan: <span onClick={() => this.props.dispatch(setStep("step1"))} className="icon md lftarw-white c-pointer" />,
            withdrawaddress: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            verifyidentity: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            withdrawsummary: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
        }
        return stepcodes[config[this.props.buySell.stepcode]]
    }
    renderIcon = () => {
        const stepcodes = {
            depositecrypto: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            withdraw: <span />,
            scanner: <span />,
            withdrawscan: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            withdrawaddress: <span />,
            verifyidentity: <span />,
            withdrawsummary: <span />,
        }
        return stepcodes[config[this.props.buySell.stepcode]]
    }
    render() {
        return (<Drawer
            title={[<div className="side-drawer-header">
                {this.renderTitle()}
                <div className="text-center fs-20">
                    <Translate className="mb-0 text-white-30 fw-600 text-upper" content={this.props.sendReceive.stepTitles[config[this.props.sendReceive.stepcode]]} component={Paragraph} />
                    <Translate className="text-white-50 mb-0 fw-300" content={this.props.sendReceive.stepSubTitles[config[this.props.sendReceive.stepcode]]} component={Paragraph} /></div>
                {this.renderIcon()}
            </div>]}
            placement="right"
            closable={true}
            visible={this.props.showDrawer}
            closeIcon={null}
            className="side-drawer"
        >
            {this.renderContent()}
        </Drawer>);
    }
}

export default connectStateProps(SendReceive);