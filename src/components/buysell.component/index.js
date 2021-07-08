import React, { Component } from 'react';
import { Drawer, Typography } from 'antd';
import Translate from 'react-translate-component';
import BuyCrypto from './buyCrypto';
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

const { Title, Paragraph } = Typography
class BuySell extends Component {
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
            buycrypto: <BuyCrypto />,
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
    }
    render() {
        return (<Drawer
            title={[<div className="side-drawer-header"><span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" /><div className="text-center fs-14"><Translate className="mb-0 text-white-30 fw-600 text-upper" content={this.props.buySell.stepTitles[config[this.props.buySell.stepcode]]} component={Paragraph} /><Translate className="text-white-50 mb-0 fw-300" content={this.props.buySell.stepSubTitles[config[this.props.buySell.stepcode]]} component={Paragraph} /></div><span className="icon md search-white c-pointer" /></div>]}
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