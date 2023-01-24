import React, { Component } from 'react';
import { Drawer, Typography } from 'antd';
import { buyFiatSteps as config } from './config';
import Translate from 'react-translate-component';
import ConnectStateProps from '../../utils/state.connect';
import FaitDeposit from '../../components/deposit.component/faitDeposit';
import FaitdepositSummary from './faitdepositSummary';
import SelectCurrency from './selectCurrency';
import WithdrawalSummary from '../withDraw.component/withdrawalSummary';

class SuissebaseFiat extends Component {
    state = {}
    closeDrawer = () => {
        if (this.props.onClose) {
            this.props.onClose();
        }
        if (this.child) {
            this.child.clearfiatValues();
        }
    }
    renderTitle = () => {
        const stepcodes = {
            fiatdeposit: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            faitsummary: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
            withdrwalfiatsummary: <span onClick={this.closeDrawer} className="icon md close-white c-pointer" />,
        }
        return stepcodes[config[this.props.buySell.stepcode]]
    }
    renderContent = () => {
        const stepcodes = {
            fiatdeposit: <FaitDeposit fiatRef={(cd) => this.child = cd} onClosePopup={this.closeDrawer}/>,
            faitsummary: < FaitdepositSummary />,
            selectcurrency: < SelectCurrency />,
            withdrwalfiatsummary: < WithdrawalSummary />,

        }
        return stepcodes[config[this.props.buyFiat.stepcode]]
    }
    renderIcon = () => {
        const stepcodes = {
            fiatdeposit: <span />,
            faitsummary: <span />,
            withdrwalfiatsummary: <span />,
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
                            <div className="text-center">
                                <Translate className="drawer-maintitle" content={this.props.buyFiat.stepTitles[config[this.props.buyFiat.stepcode]]} component={Paragraph} />
                                <Translate className="text-white-50 mb-0 fw-300" content={this.props.buyFiat.stepSubTitles[config[this.props.buyFiat.stepcode]]} component={Paragraph} />
                            </div>
                            {this.renderIcon()}
                        </div>
                    ]}
                placement="right"
                closable={true}
                visible={this.props.showDrawer}
                closeIcon={null}
                className="side-drawer"
                destroyOnClose={true}
            >
                {this.renderContent()}
            </Drawer >
        );
    }
}

export default ConnectStateProps(SuissebaseFiat);