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
import SuccessMessage from './success';
import ToReceive from './toReceive';

const { Title, Paragraph } = Typography
class SwapCrypto extends Component {
    state = {

    }
    componentDidMount() {
        this.props.swapRef(this)
    }
    clearValues(){
        this.child.clearSwapCoinValues();
    }
    closeBuyDrawer = () => {
        this.props.dispatch(setStep("step1"))
        if (this.props.onClose) {
            this.props.onClose();
        }
    }
    renderContent = () => {
        const stepcodes = {
            swapcoins: <SwapCoins swapCoinsRef={(cd) => this.child = cd}/>,
            swapsummary: <SwapSummary />,
            selectcrypto: <SelectCrypto swapfrom="true" />,
            toreceive: <ToReceive />,
            confirmation: <SuccessMessage />


        }
        return stepcodes[config[this.props.swapStore.stepcode]]
    }
    renderTitle = () => {
        const stepcodes = {
            swapcoins: <span />,
            swapsummary: <span onClick={() => this.props.dispatch(setStep("step1"))} className="icon md lftarw-white c-pointer" />,
            selectcrypto: <span onClick={() => this.props.dispatch(setStep("step1"))} className="icon md lftarw-white c-pointer" />,
            toreceive: <span onClick={() => this.props.dispatch(setStep("step1"))} className="icon md lftarw-white c-pointer" />,
            confirmation: <span />,
        }
        return stepcodes[config[this.props.buySell.stepcode]]
    }
    renderIcon = () => {
        const stepcodes = {
            swapcoins: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,
            swapsummary: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,
            selectcrypto: <span />,
            toreceive: <span />,
            confirmation: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,

        }
        return stepcodes[config[this.props.buySell.stepcode]]
    }
    render() {
        return (<Drawer
            title={[<div className="side-drawer-header">
                {this.renderTitle()}
                <div className="text-center fs-14 px-16">
                    <Translate className="mb-0 text-white-30 fw-600 text-upper" content={this.props.swapStore.stepTitles[config[this.props.swapStore.stepcode]]} component={Paragraph} />
                    <Translate className="text-white-50 mb-0 fw-300 swap-subtitlte" content={this.props.swapStore.stepSubTitles[config[this.props.swapStore.stepcode]]} component={Paragraph} /></div>
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

export default connectStateProps(SwapCrypto);