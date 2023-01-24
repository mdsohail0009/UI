import React, { Component } from 'react';
import { Drawer, Typography } from 'antd';
import Translate from 'react-translate-component';
import ConnectStateProps from '../../utils/state.connect';
import { setStep } from '../../reducers/swapReducer';
import { swapobj as config } from './config';
import SwapCoins from './swapCoins';
import SwapSummary from './swapSummary'
import SelectCrypto from './selectcrypto';
import SuccessMessage from './success';
import { setHeaderTab } from '../../reducers/buysellReducer';

const { Paragraph } = Typography
class SwapCrypto extends Component {
    state = {

    }
    componentDidMount() {
        this.props.dispatch(setStep("swapcoins"));
        this.props.swapRef(this);
    }
    clearValues() {
        if (this.child)
            this.child.clearSwapCoinValues();
    }
    closeBuyDrawer = () => {
        this.props.dispatch(setHeaderTab(""))
        if (this.props.onClose) {
            this.props.onClose();
        }
    }
    renderContent = () => {
        const stepcodes = {
            swapcoins: <SwapCoins swapCoinsRef={(cd) => this.child = cd} />,
            swapsummary: <SwapSummary />,
            selectcrypto: <SelectCrypto swapfrom={true} />,
            toreceive: <SelectCrypto swapfrom={false} />,
            confirmation: <SuccessMessage />


        }
        return stepcodes[config[this.props.swapStore.stepcode]]
    }
    renderTitle = () => {
        const stepcodes = {
            swapcoins: <span />,
            swapsummary: <span onClick={() => this.props.dispatch(setStep("swapcoins"))} className="icon md lftarw-white c-pointer" />,
            selectcrypto: <span onClick={() => this.props.dispatch(setStep("swapcoins"))} className="icon md lftarw-white c-pointer" />,
            toreceive: <span onClick={() => this.props.dispatch(setStep("swapcoins"))} className="icon md lftarw-white c-pointer" />,
            confirmation: <span />,
        }
        return stepcodes[config[this.props.swapStore.stepcode]]
    }
    renderIcon = () => {
        const stepcodes = {
            swapcoins: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,
            swapsummary: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,
            selectcrypto: <span />,
            toreceive: <span />,
            confirmation: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,

        }
        return stepcodes[config[this.props.swapStore.stepcode]]
    }
    render() {
        return (<Drawer
            title={[<div className="side-drawer-header">
                {this.renderTitle()}
                <div className="text-center">
                    <Translate className="drawer-maintitle" content={this.props.swapStore.stepTitles[config[this.props.swapStore.stepcode]]} component={Paragraph} />
                    <Translate className="text-white-50 mb-0 fw-300 fs-14 swap-subtitlte" content={this.props.swapStore.stepSubTitles[config[this.props.swapStore.stepcode]]} component={Paragraph} /></div>
                {this.renderIcon()}</div>]}
            placement="right"
            closable={true}
            visible={this.props.showDrawer}
            closeIcon={null}
            className="side-drawer"
            destroyOnClose={true}
        >
            {this.renderContent()}
        </Drawer>);
    }
}

export default ConnectStateProps(SwapCrypto);