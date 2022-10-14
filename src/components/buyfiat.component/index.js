import React, { Component } from 'react';
import { Drawer, Typography, Menu, Dropdown } from 'antd';
import { buyFiatSteps as config } from './config';
import { setStep } from '../../reducers/buysellReducer';
import { rejectWithdrawfiat, setWithdrawfiatenaable,setClearAmount } from '../../reducers/sendreceiveReducer';
import ConnectStateProps from '../../utils/state.connect';
import Translate from 'react-translate-component';
import AddBuyFiatCard from './addCard';
import SelectWallet from './selectWallet';
import FiatDeposit from '../../components/deposit.component/faitDeposit';
import BillingAddress from './fiatBillingAddress';
import FaitDepositSummary from './faitdepositSummary';
import FiatSummary from './buyfiatSummary';
import NewFiatAddress from '../addressbook.component/addFiatAddressbook';
import WithdrawalSummary from '../withDraw.component/withdrawalSummary';
import WithdrawalLive from '../withDraw.component/withdrawLive';
import WithdrawalSuccess from '../withDraw.component/withdrwSuccess';
import ConfirmMsg from './confirmMsg';

class MassPayment extends Component {
    state = {
        withdraw: false,
    }
    closeDrawer = () => {
        this.props.dispatch(setWithdrawfiatenaable(false))
        this.props.dispatch(rejectWithdrawfiat())
        if (this.props.onClose) {
            this.props.onClose();
        }
        if (this.child)
            this.child.clearfiatValues();
            this.props.dispatch(setClearAmount())

    }
    onHhandleClick = () => {
        this.props.changeStep("step3");
    }
    onAddressClick = () => {
        this.props.dispatch(setWithdrawfiatenaable(true))
        this.props.dispatch(setStep("step1"))
    }
withdrawFiatSummaryBack = () => {
    this.props.dispatch(setStep("step1"));
    this.props.dispatch(setWithdrawfiatenaable(true));
    this.props.dispatch(rejectWithdrawfiat());
}
    renderContent = () => {
        const stepcodes = {
            fiatdeposit: <FiatDeposit tab={this.props.tabData} fiatRef={(cd) => this.child = cd}  oncloseClick={this.closeDrawer} />,
            faitsummary: <FiatSummary />,
            fiatdepositsummary: <FaitDepositSummary />,
            addcard: <AddBuyFiatCard />,
            selectwallet: <SelectWallet />,
            billingaddress: <BillingAddress />,
            confirmation: <ConfirmMsg />,
            addAddress: <NewFiatAddress onCancel={() => this.onAddressClick()} />,
            withdrwalfiatsummary: < WithdrawalSummary />,
            withdrwlive: < WithdrawalLive />,
            withdrwsuccess: < WithdrawalSuccess />,
            withdrawfaitsummary:<WithdrawalSummary />
        }
        return stepcodes[config[this.props.buyFiat.stepcode]]
    }
    renderTitle = () => {
        const stepcodes = {
            fiatdeposit: <span />,
            faitsummary: <span onClick={() => this.props.dispatch(setStep("step1"))} className="icon md lftarw-white c-pointer" />,
            fiatdepositsummary: <span />,
            addcard: <span onClick={() => this.props.dispatch(setStep("step2"))} className="icon md lftarw-white c-pointer" />,
            selectwallet: <span onClick={() => this.props.dispatch(setStep("step1"))} className="icon md lftarw-white c-pointer" />,
            billingaddress: <span onClick={() => this.props.dispatch(setStep("step3"))} className="icon md lftarw-white c-pointer" />,
            confirmation: <span />,
            addAddress: <span onClick={() => this.onAddressClick()} className="icon md lftarw-white c-pointer" />,
            withdrwalfiatsummary: <span onClick={() => this.props.dispatch(setStep("step1"))} className="icon md lftarw-white c-pointer" />,
            withdrwlive: <span onClick={() => this.props.dispatch(setStep("step5"))} className="icon md lftarw-white c-pointer" />,
            withdrwsuccess: null,
            withdrawfaitsummary:<span onClick={this.withdrawFiatSummaryBack} className="icon md lftarw-white c-pointer" />,
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
            faitsummary: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            fiatdepositsummary: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            addcard: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            selectwallet: <Dropdown overlay={menu} overlayClassName="secureDropdown" arrow>
                <a className="pop-drpdwn-toogle" onClick={e => e.preventDefault()}><span className="icon md h-more" /></a>
            </Dropdown>,

            billingaddress: <sapn />,
            confirmation: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            addAddress: <span />,
            withdrwalfiatsummary: <span />,
            withdrwlive: <span />,
            withdrwsuccess: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            withdrawfaitsummary:<span onClick={this.closeDrawer} className="icon md close-white c-pointer" />
        }
        return stepcodes[config[this.props.buySell.stepcode]]
    }
    render() {
        const { Paragraph } = Typography
        return (
            <Drawer
                title={[
                    <div className="side-drawer-header">
                        {this.renderTitle()}
                        <div className="text-center fs-24">
                            {this.props.buyFiat?.receiveFiatHeader && <>
                               <Translate className="mb-0 text-white-30 fw-600" content="DepositandFiat"  component={Paragraph} />
                               <Translate className="text-white-50 mb-0 fs-14 fw-300" content={this.props.buyFiat.stepSubTitles[config[this.props.buyFiat.stepcode]]} component={Paragraph} />
                               </>
                            }
                            {!this.props.buyFiat?.receiveFiatHeader && <>
                            <Translate className="mb-0 text-white-30 fw-600" content={this.props.buyFiat.stepTitles[config[this.props.buyFiat.stepcode]]} component={Paragraph} />
                            <Translate className="text-white-50 mb-0 fs-14 fw-300" content={this.props.buyFiat.stepSubTitles[config[this.props.buyFiat.stepcode]]} component={Paragraph} />
                            </>
                            }
                            </div>
                        {this.renderIcon()}
                    </div>
                ]}
                placement="right"
                closable={true}
                visible={this.props.showDrawer}
                closeIcon={null}
                className="side-drawer custom-fait-sidedrawer"
                destroyOnClose={true}
            >
                {this.renderContent()}
            </Drawer>
        );
    }
}

 export default ConnectStateProps(MassPayment);