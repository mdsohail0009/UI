import React, { Component } from 'react';
import { Drawer, Typography } from 'antd';
import Translate from 'react-translate-component';
import connectStateProps from '../../utils/state.connect';
import { setStep } from '../../reducers/swapReducer';
import { swapobj as config } from './config';
import SwapCoins from './swapCoins';
import SwapSummary from './swapSummary'

const { Title, Paragraph } = Typography
class SwapCrypto extends Component {
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
            swapcoins:<SwapSummary />

        }
        return stepcodes[config[this.props.swapStore.stepcode]]
    }
    render() {
        return (<Drawer
            title={[<div className="side-drawer-header">
                <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />
                <div className="text-center fs-14">
                    <Translate className="mb-0 text-white-30 fw-600 text-upper" content={this.props.swapStore.stepTitles[config[this.props.swapStore.stepcode]]} component={Paragraph} />
                    <Translate className="text-white-50 mb-0 fw-300" content={this.props.swapStore.stepSubTitles[config[this.props.swapStore.stepcode]]} component={Paragraph} /></div>
                <span className="icon md search-white c-pointer" /></div>]}
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

export default connectStateProps(SwapCrypto);