import React, { Component } from 'react';
import { Drawer, Typography } from 'antd';
import Translate from 'react-translate-component';
import CryptoComponent from './crypto';
import connectStateProps from '../../utils/state.connect';
import Summary from './cryptoSummary';
import BillType from './payOption';
import SelectCrypto from './selectCrypto';
import { setStep } from '../../reducers/buysellReducer';
import { processSteps as config } from './config';
import DepositFiat from './depositFiat'
import WireTransfer from './wireTransfer';
import AddCard from './addCard';
import DepositCrypto from './depositCrypto';
import BillingAddress from './billAddress';
import AddressScanner from './addressScanner';
import SellSummary from '../sell.component/sellSummary';
import SelectSellCrypto from '../sell.component/selectCrypto'
import SuccessMsg from '../shared/success';
const { Paragraph } = Typography
class BuySell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            //search: false,
        }
        //this.openSearch = this.openSearch.bind(this);
    }
    closeBuyDrawer = () => {
        this.props.dispatch(setStep("step1"))
        if (this.props.onClose) {
            this.props.onClose();
        }
    }
    // openSearch = () => {
    //     debugger
    //     this.setState({ search: !this.state.search })
    // }

    renderContent = () => {
        const stepcodes = {
            buycrypto: <CryptoComponent />,
            selectcrypto: <SelectCrypto />,
            billtype: <BillType />,
            addcard: <AddCard />,
            depositcrypto: <DepositCrypto />,
            selectcrypto: <SelectCrypto />,
            summary: <Summary />,
            billingaddress: <BillingAddress />,
            addressscanner: <AddressScanner />,
            depositfiat: <DepositFiat />,
            selectedcrypto: <SelectSellCrypto />,
            sellsummary: <SellSummary />,
            successmsg: <SuccessMsg />,
            wiretransfor: <WireTransfer />
        }
        return stepcodes[config[this.props.buySell.stepcode]]
    };
    renderTitle = () => {
        const titles = {
            buycrypto: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,
            selectcrypto: <span onClick={() => this.props.dispatch(setStep("step1"))} className="icon md lftarw-white c-pointer" />,
            billtype: <span onClick={() => this.props.dispatch(setStep("step3"))} className="icon md close-white c-pointer" />,
            addcard: <span onClick={() => this.props.dispatch(setStep("step4"))} className="icon md lftarw-white c-pointer" />,
            depositcrypto: <span onClick={() => this.props.dispatch(setStep("step4"))} className="icon md lftarw-white c-pointer" />,
            selectcrypto: <span onClick={() => this.props.dispatch(setStep("step1"))} className="icon md lftarw-white c-pointer" />,
            summary: <span onClick={() => this.props.dispatch(setStep("step2"))} className="icon md lftarw-white c-pointer" />,
            billingaddress: <span onClick={() => this.props.dispatch(setStep("step5"))} className="icon md lftarw-white c-pointer" />,
            addressscanner: <span onClick={() => this.props.dispatch(setStep("step6"))} className="icon md lftarw-white c-pointer" />,
            depositfiat: <span onClick={() => this.props.dispatch(setStep("step5"))} className="icon md lftarw-white c-pointer" />,
            selectedcrypto: <span onClick={() => this.props.dispatch(setStep("step1"))} className="icon md lftarw-white c-pointer" />,
            sellsummary: <span onClick={() => this.props.dispatch(setStep("step10"))} className="icon md lftarw-white c-pointer" />,
            successmsg: null,
            wiretransfor: <span onClick={() => this.props.dispatch(setStep("step1"))} className="icon md lftarw-white c-pointer" />
        }
        return titles[config[this.props.buySell.stepcode]]
    }
    renderIcon = () => {
        const stepcodes = {
            buycrypto: <span />,
            selectcrypto: <span />,
            billtype: <span />,
            addcard: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,
            depositcrypto: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,
            selectcrypto: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,
            summary: <span />,
            billingaddress: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,
            addressscanner: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,
            depositfiat: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,
            selectedcrypto: <span />,
            sellsummary: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,
            successmsg: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,
            wiretransfor: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,
        }
        return stepcodes[config[this.props.buySell.stepcode]]
    }
    render() {
        return (<Drawer
            title={[<div className="side-drawer-header">
                {this.renderTitle()}
                <div className="text-center fs-14">
                    <Translate with={{ coin: this.props.sellData?.coinWallet?.walletCode||this.props.sellData?.coinWallet?.coin }} className="mb-0 text-white-30 fw-600 text-upper" content={this.props.buySell.stepTitles[config[this.props.buySell.stepcode]]} component={Paragraph} />
                    <Translate with={{ coin: this.props.sellData?.coinWallet?.walletCode||this.props.sellData?.coinWallet?.coin, value: this.props.sellData?.exchangeValues[this.props.sellData?.coinWallet?.walletCode||this.props.sellData?.coinWallet?.coin] }} className="text-white-50 mb-0 fw-300" content={this.props.buySell.stepSubTitles[config[this.props.buySell.stepcode]]} component={Paragraph} />
                </div>
                {this.renderIcon()}</div>]}
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


export default connectStateProps(BuySell);
