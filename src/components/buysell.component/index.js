import React, { Component } from 'react';
import { Drawer, Typography } from 'antd';
import Translate from 'react-translate-component';
import BuyCrypto from './buyCrypto';
import connectStateProps from '../../utils/state.connect';
import Summary from './summary'
import BillType from './billType';
import SelectCrypto from './selectCrypto';
import { setStep } from '../../reducers/buysellReducer';
import { processSteps as config } from './config';
import DepositFiat from './depositFiat'
import WireTransfer from './wireTransfer';
import payOption from './payOption';
import AddCard from './addCard';
import DepositCrypto from './depositCrypto';

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
            summary: <Summary />,
            billtype: <BillType />,
            addcard: <AddCard />,
            depositcrypto: <DepositCrypto />,
            selectcrypto: <SelectCrypto />,
<<<<<<< HEAD
            summary: <Summary />,
            payoption: <payOption />,
=======

>>>>>>> 6001708e7a465fa91f37c965febf3def8bccb7d3
        }
        return stepcodes[config[this.props.buySell.stepcode]]
    }
    render() {
        return (<Drawer
<<<<<<< HEAD
            title={[<div className="side-drawer-header"><span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" /><div className="text-center fs-14"><Translate className="mb-0 text-white-30 fw-600 text-upper" content={this.props.buySell.stepTitles[config[this.props.buySell.stepcode]]} component={Paragraph} /><Translate className="text-white-50 mb-0 fw-300" content={this.props.buySell.stepSubTitles[config[this.props.buySell.stepcode]]} component={Paragraph} /></div><span className="icon md search-white c-pointer" /></div>]}
=======
            title={[<div className="side-drawer-header"><span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />
            <div className="text-center fs-14">
            <Translate className="mb-0 text-white-30 fw-600 text-upper" content={this.props.buySell.stepTitles[config[this.props.buySell.stepcode]]} component={Paragraph} />
            <Translate className="text-white-50 mb-0 fw-300" content="past_hours" component={Paragraph} />
            </div><span className="icon md search-white c-pointer" /></div>]}
>>>>>>> 6001708e7a465fa91f37c965febf3def8bccb7d3
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