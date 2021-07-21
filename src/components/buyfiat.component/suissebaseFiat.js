import React, { Component } from 'react';
import { Drawer, Typography, Dropdown,Radio } from 'antd';
import { buyFiatSteps as config } from './config';
import Translate from 'react-translate-component';
import { setStep } from '../../reducers/buysellReducer';
import connectStateProps from '../../utils/state.connect';
import FaitDeposit from './faitDeposit';
import FaitdepositSummary from './faitdepositSummary';

class SuissebaseFiat extends Component {
    state = {}
    closeDrawer = () => {
        this.props.dispatch(setStep("step1"))
        if (this.props.onClose) {
            this.props.onClose();
        }
    }
    renderTitle = () => {
        const stepcodes = {
            buyfiat: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            selectfiat: <span onClick={() => this.props.dispatch(setStep("step1"))} className="icon md lftarw-white c-pointer" />,
            addcard: <span onClick={() => this.props.dispatch(setStep("step2"))} className="icon md lftarw-white c-pointer" />,
            selectwallet: <span onClick={() => this.props.dispatch(setStep("step1"))} className="icon md lftarw-white c-pointer" />,
            faitsummary: <span />,
            billingaddress: <span onClick={() => this.props.dispatch(setStep("step3"))} className="icon md lftarw-white c-pointer" />,
            confirmation: <span />,
        }
        return stepcodes[config[this.props.buySell.stepcode]]
    }
    renderContent = () => {
        const stepcodes = {
            buyfiat: <FaitDeposit />,
            faitsummary:< FaitdepositSummary />,

        }
        return stepcodes[config[this.props.buyFiat.stepcode]]
    }
    renderIcon = () => {
        const stepcodes = {
            buyfiat: <span />,
            selectfiat: <span />,
            addcard: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            faitsummary: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            billingaddress: <sapn />,
            confirmation: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />
        }
        return stepcodes[config[this.props.buySell.stepcode]]
    }
    render() {
        const { Paragraph } = Typography;
        return (
            <Drawer
                title={
                    [
                        <div className="side-drawer-header">
                            {this.renderTitle()}
                            <div className="text-center fs-14">
                                <Translate className="mb-0 text-white-30 fw-600 text-upper" content={this.props.buyFiat.stepTitles[config[this.props.buyFiat.stepcode]]} component={Paragraph} />
                                <Translate className="text-white-50 mb-0 fw-300" content={this.props.buyFiat.stepSubTitles[config[this.props.buyFiat.stepcode]]} component={Paragraph} />
                            </div>
                            {this.renderIcon()}
                            {/* <Dropdown overlay={menu} overlayClassName="secureDropdown" arrow>
                            <a className="pop-drpdwn-toogle" onClick={e => e.preventDefault()}><span className="icon md h-more" /></a>
                        </Dropdown> */}
                        </div>
                    ]}
                placement="right"
                closable={true}
                visible={this.props.showDrawer}
                closeIcon={null}
                className="side-drawer"
            >
                {this.renderContent()}
                {/* <Radio.Group
                    defaultValue={1}
                    onChange={this.handleBuyFiatToggle}
                    className="buysell-toggle crypto-toggle">
                    <Translate content="add_fund" component={Radio.Button} value={1} />
                    <Translate content="withdraw" component={Radio.Button} value={2} />
                </Radio.Group> */}
            </Drawer >
        );
    }
}

export default connectStateProps(SuissebaseFiat);