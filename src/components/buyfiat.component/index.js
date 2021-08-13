import React, { Component } from 'react';
import { Drawer, Typography, Menu, Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { buyFiatSteps as config } from './config';
import { setStep } from '../../reducers/buysellReducer';
import connectStateProps from '../../utils/state.connect';
import Translate from 'react-translate-component';
import BuyFiat from './buyFiat';
import SelectFiat from './selectFiat';
import AddCard from './addCard';
import SelectWallet from './selectWallet';
import FiatDeposit from './faitDeposit';
import FiatSummary from './buyfiatSummary';
import BillingAddress from './fiatBillingAddress';
import ConfirmMsg from './confirm'
class MassPayment extends Component {
    state = {
        withdraw: false,
    }
    closeDrawer = () => {
        this.props.dispatch(setStep("step1"))
        if (this.props.onClose) {
            this.props.onClose();
        }
    }
    onHhandleClick = () => {
        this.props.changeStep("step3");
    }
    renderContent = () => {
        const stepcodes = {
            fiatdeposit: <FiatDeposit />,
            //buyfiat: <BuyFiat activeTab={this.props.valNum} />,
            selectfiat: <SelectFiat />,
            addcard: <AddCard />,
            selectwallet: <SelectWallet />,
            faitsummary: <FiatSummary />,
            billingaddress: <BillingAddress />,
            confirmation: <ConfirmMsg />
        }
        return stepcodes[config[this.props.buyFiat.stepcode]]
    }
    renderTitle = () => {
        const stepcodes = {
            fiatdeposit: <span />,
            selectfiat: <span onClick={() => this.props.dispatch(setStep("step1"))} className="icon md lftarw-white c-pointer" />,
            addcard: <span onClick={() => this.props.dispatch(setStep("step2"))} className="icon md lftarw-white c-pointer" />,
            selectwallet: <span onClick={() => this.props.dispatch(setStep("step1"))} className="icon md lftarw-white c-pointer" />,
            faitsummary: <span />,
            billingaddress: <span onClick={() => this.props.dispatch(setStep("step3"))} className="icon md lftarw-white c-pointer" />,
            confirmation: <span />,
        }
        return stepcodes[config[this.props.buySell.stepcode]]
    }
    renderIcon = () => {
        const menu = (
            <Menu>
                <ul className="drpdwn-list pl-0">
                    <li onClick={() => this.props.dispatch(setStep("step1"))}><a>Withdraw</a></li>
                    <li onClick={() => this.props.dispatch(setStep("step1"))}><a>Fiat</a></li>
                </ul>
            </Menu>
        );
        const stepcodes = {
            fiatdeposit: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            selectfiat: <span />,
            addcard: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            selectwallet: <Dropdown overlay={menu} overlayClassName="secureDropdown" arrow>
                <a className="pop-drpdwn-toogle" onClick={e => e.preventDefault()}><span className="icon md h-more" /></a>
            </Dropdown>,
            faitsummary: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            billingaddress: <sapn />,
            confirmation: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />
        }
        return stepcodes[config[this.props.buySell.stepcode]]
    }
    render() {
        const { withdraw } = this.state;
        const { Paragraph } = Typography
        return (
            <Drawer
                title={[
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
            </Drawer>
        );
    }
}

export default connectStateProps(MassPayment);