import React, { Component } from 'react';
import { Drawer, Typography } from 'antd';
import Translate from 'react-translate-component';
import ConnectStateProps from '../../utils/state.connect';
import { handleSendFetch, setWithdrawcrypto, setStep, setSubTitle, setAddress } from '../../reducers/sendreceiveReducer';
import { sendreceiveSteps as config } from './config';
import DepositeCrypto from '../send.component/depositeToggle';
import CryptoWithDrawWallet from '../withdraw.crypto.component/withdraw.selected.wallet';
import ScanQR from './scan';
import WithdrawAddress from './withdrawAddress'
import VerifyIDentity from './verifyIdentity';
import WithdrawScan from './qr.scan';
import WithdrawSummary from './withdrawSummary';
import SelectCrypto from '../addressbook.component/selectCrypto';
import WithdrawaCryptolLive from '../withdraw.crypto.component/withdrawLive';
import SuccessMsg from '../withdraw.crypto.component/success';
import SelectAddress from '../withdraw.crypto.component/selectAddress';
import SendMoney from '../withdraw.crypto.component/sendMoney';
const { Paragraph } = Typography
class SendReceive extends Component {
    state = {

    }
    closeDrawer = () => {
        //this.props.dispatch(setStep("step1"));
        this.props.dispatch(setSubTitle(""))
        if (this.props.onClose) {
            this.props.onClose();
        }
        this.props.dispatch(setWithdrawcrypto(null))
        this.props.dispatch(handleSendFetch({ key: "cryptoWithdraw", activeKey: 1 }));
        this.props.dispatch(setAddress(null))


    }
    componentWillUnmount() {
        this.props.dispatch(setStep("step1"));
        this.props.dispatch(handleSendFetch({ key: "cryptoWithdraw", activeKey: 1 }));
    }
    selectCrypto = () => {
        this.props.dispatch(setStep("step9"));
    }
    renderContent = () => {
        const stepcodes = {
            depositecrypto: <DepositeCrypto activeTab={this.props?.isSendTab ? this.props?.isSendTab : this.props.valNum} />,
            withdraw: <CryptoWithDrawWallet onDrawerClose={this.closeDrawer} />,
            scanner: <ScanQR />,
            withdrawaddress: <WithdrawAddress />,
            verifyidentity: <VerifyIDentity />,
            withdrawsummary: <WithdrawSummary />,
            withdrawscan: <WithdrawScan />,
            selectAddress: <SelectAddress />,
            selectCrypto: <SelectCrypto />,
            withdraw_crypto_liveness: <WithdrawaCryptolLive />,
            withdraw_crpto_summary: <WithdrawSummary onClose={() => this.closeDrawer()} onBackCLick={() => this.props.dispatch(setStep("step1"))} />,
            withdraw_crpto_success: <SuccessMsg onBackCLick={() => this.props.dispatch(setStep("step1"))} />,
            sendMoney: <SendMoney />

        }
        return stepcodes[config[this.props.sendReceive.stepcode]]
    }
    renderTitle = () => {
        const stepcodes = {
            depositecrypto: <span />,
            // withdraw: <span onClick={() => { this.props.dispatch(setStep("step1")); this.props.dispatch(setWithdrawcrypto(null)); this.props.dispatch(setAddress(null)) }} className="icon md lftarw-white c-pointer" />,
            // scanner: <span onClick={() => this.props.dispatch(setStep("step4"))} className="icon md lftarw-white c-pointer" />,
            // withdrawscan: <span onClick={() => this.props.dispatch(setStep("step1"))} className="icon md lftarw-white c-pointer" />,
            // withdrawaddress: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            // verifyidentity: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            // withdrawsummary: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            // selectAddress: <span onClick={() => this.props.dispatch(setStep("withdraw_crypto_selected"))} className="icon md lftarw-white c-pointer" />,
            // selectCrypto: <span onClick={() => this.props.dispatch(setStep("step8"))} className="icon md lftarw-white c-pointer" />,
            // withdraw_crypto_liveness: <span onClick={() => this.props.dispatch(setStep("withdraw_crpto_summary"))} className="icon md lftarw-white c-pointer" />,
            // // withdraw_crpto_summary: <span onClick={() => this.props.dispatch(setStep("withdraw_crypto_selected"))} className="icon md lftarw-white c-pointer" />,
            // withdraw_crpto_summary: <span onClick={() => this.props.dispatch(setStep("step10"))} className="icon md lftarw-white c-pointer" />,
            // withdraw_crpto_success: null,
            // sendMoney: <span onClick={() => this.props.dispatch(setStep("withdraw_crypto_selected"))} className="icon md lftarw-white c-pointer" />,
            withdraw: <span  />,
            scanner: <span />,
            withdrawscan: <span  />,
            withdrawaddress: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            verifyidentity: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            withdrawsummary: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            selectAddress: <span />,
            selectCrypto: <span  />,
            withdraw_crypto_liveness: <span  />,
            withdraw_crpto_summary: <span  />,
            withdraw_crpto_success: null,
            sendMoney: <span />
        }
        return stepcodes[config[this.props.sendReceive.stepcode]]
    }
    renderIcon = () => {
        const stepcodes = {
            depositecrypto: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            withdraw: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            scanner: <span />,
            withdrawscan: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            withdrawaddress: <span />,
            verifyidentity: <span />,
            withdrawsummary: <span />,
            selectAddress: <span />,
            selectCrypto: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            withdraw_crypto_liveness: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            withdraw_crpto_summary: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            withdraw_crpto_success: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            sendMoney:<span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,

        }
        return stepcodes[config[this.props.sendReceive.stepcode]]
    }
    render() {
        return (<Drawer destroyOnClose={true}
            title={[<div className="side-drawer-header">
                {this.renderTitle()}
                <div className="text-center fs-16">
                    <Translate className="mb-0 text-white-30 fw-600 text-upper" content={(this.props?.isSendTab || this.props?.sendReceive?.sendCryptoEnable) ? this.props.sendReceive.stepcode == "withdraw_crpto_summary" ?  this.props.sendReceive.stepTitles[config[this.props.sendReceive.stepcode]] :"send_crypto" :  this.props.sendReceive.stepTitles[config[this.props.sendReceive.stepcode]]} component={Paragraph} />
                    <Paragraph className="text-white-50 mb-0 fs-14 fw-300 px-8" >{this.props.sendReceive?.subTitle} {this.props.sendReceive?.selectedCoin?.coin} </Paragraph>
                    {/* {this.props.sendReceive?.subTitle && <Paragraph className="text-white-50 mb-0 fs-14 fw-300 px-8" >USD 997394.5 Total balance
                        </Paragraph>} */}
                    </div> 
                {this.renderIcon()}
            </div>]}
            placement="right"
            closable={true}
            visible={this.props.showDrawer}
            closeIcon={null}
            className="side-drawer w-50p"
            style={{width:"50%"}}
        >
            {this.renderContent()}
        </Drawer>);
    }
}

export default ConnectStateProps(SendReceive);