import React, { Component } from 'react';
import { Drawer, Typography } from 'antd';
import Translate from 'react-translate-component';
import ConnectStateProps from '../../utils/state.connect';
// import { setStepcode } from '../../reducers/tranfor.Reducer';
import { tranforobj } from './config';
import SwapCoins from './swapCoins';
import TransforSummary from './transforSummary';
import TransforSuccessMsg from './transforSuccess';
import {setTransforObj} from '../../reducers/tranfor.Reducer'

const { Paragraph } = Typography
class Transfor extends Component {
    state = {

    }
    componentDidMount() {
    }
    clearValues() {
        if (this.child)
            this.child.clearSwapCoinValues();
    }
    closeBuyDrawer = () => {
        this.props.dispatch(setTransforObj(null))
        if (this.props.onClose) {
            this.props.onClose();
        }
    }
    renderContent = () => {
        const stepcodes = {
            tranforcoin: <SwapCoins onClose={()=>this.closeBuyDrawer()}/>,
            tranforsummary: <TransforSummary onClose={()=>this.closeBuyDrawer()}/>,
            tranforsuccess: <TransforSuccessMsg onClose={()=>this.closeBuyDrawer()}/>,
        }
        return stepcodes[tranforobj[this.props.TransforStore.stepcode]]
    }
    renderTitle = () => {
        const stepcodes = {
            tranforcoin: <span />,
            tranforsummary: <span />,
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
                <div className="text-center fs-16">
                    <Translate className="text-white-30 fw-600 text-upper mb-4" content={this.props.TransforStore.stepTitles[tranforobj[this.props.TransforStore.stepcode]]} component={Paragraph} />
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