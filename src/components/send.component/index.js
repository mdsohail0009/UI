import React, { Component } from 'react';
import { Drawer, Typography } from 'antd';
import Translate from 'react-translate-component';
import connectStateProps from '../../utils/state.connect';
import { setStep } from '../../reducers/sendreceiveReducer';
import { sendreceiveSteps as config } from './config';
import DepositeCrypto from '../send.component/depositeToggle';
import SelectWithdraw from './selectWithdraw';
import ScanQR from './scan';
import WithdrawAddress from './withdrawAddress'
import SellSummary from '../sell.component/sellSummary';
import VerifyIDentity from './verifyIdentity';
const { Title, Paragraph } = Typography
class SendReceive extends Component {
    state = {

    }
    closeBuyDrawer = () => {
        this.props.dispatch(setStep("step1"))
        if (this.props.onClose) {
            this.props.onClose();
        }
    }
    renderContent = () => {
        const stepcodes = {
            depositecrypto: <DepositeCrypto />,
            withdraw: <SelectWithdraw />,
            scanner: <ScanQR />,
            withdrawaddress: <WithdrawAddress />,
            withdrawsummary: <SellSummary />,
            verifyidentity: <VerifyIDentity />


        }
        return stepcodes[config[this.props.sendReceive.stepcode]]
    }
    render() {
        return (<Drawer
            title={[<div className="side-drawer-header">
                <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />
                <div className="text-center fs-14">
                    <Translate className="mb-0 text-white-30 fw-600 text-upper" content={this.props.sendReceive.stepTitles[config[this.props.sendReceive.stepcode]]} component={Paragraph} />
                    <Translate className="text-white-50 mb-0 fw-300" content={this.props.sendReceive.stepSubTitles[config[this.props.sendReceive.stepcode]]} component={Paragraph} /></div>
                <span className="icon md search-white c-pointer" /></div>]}
            placement="right"
            closable={true}
            visible={this.props.showDrawer}
            closeIcon={null}
            className="side-drawer"
        >
            {this.renderContent()}
            <VerifyIDentity />
        </Drawer>);
    }
}

export default connectStateProps(SendReceive);