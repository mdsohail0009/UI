import React, { Component } from 'react';
import { Drawer, Typography } from 'antd';
import Translate from 'react-translate-component';
import connectStateProps from '../../utils/state.connect';
import { setStep } from '../../reducers/swapReducer';
import { swapobj as config } from './config';
import SwapCoins from './swapCoins';
import SwapSummary from './swapSummary'
import SelectCrypto from './selectcrypto';
import Success from './success';

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
            swapcoins: <SwapCoins />,
            swapsummary: <SwapSummary />,
            selectcrypto: <SelectCrypto swapfrom="true" />,
            confirmation: <Success />


        }
        return stepcodes[config[this.props.swapStore.stepcode]]
    }
    render() {
        return (<Drawer
            title={[<div className="side-drawer-header">
                <span onClick={this.closeDrawer} className="icon md lftarw-white c-pointer" />
                <div className="text-center fs-14 px-16">
                    <Translate className="mb-0 text-white-30 fw-600 text-upper" content={this.props.swapStore.stepTitles[config[this.props.swapStore.stepcode]]} component={Paragraph} />
                    <Translate className="text-white-50 mb-0 fw-300 swap-subtitlte" content={this.props.swapStore.stepSubTitles[config[this.props.swapStore.stepcode]]} component={Paragraph} /></div>
                <span className="icon md close-white c-pointer" onClick={this.closeBuyDrawer} /></div>]}
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