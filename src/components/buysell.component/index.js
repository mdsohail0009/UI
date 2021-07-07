import React, { Component } from 'react';
import { Drawer, Typography } from 'antd';
import Translate from 'react-translate-component';
import BuyCrypto from './buyComponent';
import connectStateProps from '../../utils/state.connect';
import Summary from './summary';
import { setStep } from '../../reducers/buysellReducer';
import { processSteps as config } from './config';
import WireTransfer from './wireTransfer';

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
            summary: <Summary />
        }
        return stepcodes[config[this.props.buySell.stepcode]]
    }
    render() {
        return (<Drawer
            title={[<div className="side-drawer-header"><span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" /><div className="text-center fs-14"><Translate className="mb-0 text-white-30 fw-600 text-upper" content={this.props.buySell.stepTitles[config[this.props.buySell.stepcode]]} component={Paragraph} /><Translate className="text-white-50 mb-0 fw-300" content="past_hours" component={Paragraph} /></div><span className="icon md search-white c-pointer" /></div>]}
            placement="right"
            closable={true}
            visible={this.props.showDrawer}
            closeIcon={null}
            className="side-drawer"
        >
            {this.renderContent()}
            {/* <WireTransfer /> */}
        </Drawer>);
    }
}

export default connectStateProps(BuySell);