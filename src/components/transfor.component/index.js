import React, { Component } from 'react';
import { Drawer, Typography } from 'antd';
import Translate from 'react-translate-component';
import ConnectStateProps from '../../utils/state.connect';
import { tranforobj } from './config';
import SwapCoins from './swapCoins';
import TransforSummary from './transforSummary';
import TransforSuccessMsg from './transforSuccess';
import { setTransforObj, setStepcode } from '../../reducers/tranfor.Reducer'
import { setHeaderTab } from "../../reducers/buysellReducer";

const { Paragraph } = Typography
class Transfor extends Component {
    clearValues() {
        if (this.child)
            this.child.clearSwapCoinValues();
    }
    closeBuyDrawer = () => {
        this.props.dispatch(setTransforObj(null))
        this.props.dispatch(setHeaderTab('0'))
        if (this.props.onClose) {
            this.props.onClose();
        }
    }
    renderContent = () => {
        const stepcodes = {
            tranforcoin: <SwapCoins onClose={() => this.closeBuyDrawer()} />,
            tranforsummary: <TransforSummary onClose={() => this.closeBuyDrawer()} />,
            tranforsuccess: <TransforSuccessMsg onClose={() => this.closeBuyDrawer()} />,
        }
        return stepcodes[tranforobj[this.props.TransforStore.stepcode]]
    }
    renderTitle = () => {
        const stepcodes = {
            tranforcoin: <span />,
            tranforsummary: <span onClick={() => this.props.dispatch(setStepcode("tranforcoin"))} className="icon md lftarw-white c-pointer" />,
            tranforsuccess: <span />,
        }
        return stepcodes[tranforobj[this.props.TransforStore.stepcode]]
    }
    renderIcon = () => {
        const stepcodes = {
            tranforcoin: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,
            tranforsummary: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,
            tranforsuccess: <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />,

        }
        return stepcodes[tranforobj[this.props.TransforStore.stepcode]]

    }
    render() {
        return (<Drawer
            title={[<div className="side-drawer-header">
                {this.renderTitle()}
                <div className="text-center">
                    <Translate className="drawer-maintitle" content={this.props.TransforStore.stepTitles[tranforobj[this.props.TransforStore.stepcode]]} component={Paragraph} />
                    <Translate className="text-white-50 mb-0 fw-300 fs-14 swap-subtitlte" content={this.props.TransforStore.stepSubTitles[tranforobj[this.props.TransforStore.stepcode]]} component={Paragraph} /></div>
                {this.renderIcon()}
            </div>]}
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

export default ConnectStateProps(Transfor);