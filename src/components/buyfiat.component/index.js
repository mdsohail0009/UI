import React, { Component } from 'react';
import { Drawer, Typography } from 'antd';
import { buyFiatSteps as config } from './config';
import { setStep } from '../../reducers/buysellReducer';
import connectStateProps from '../../utils/state.connect';
import Translate from 'react-translate-component';
import BuyFiat from './buyFiat';
import SelectFiat from './selectFiat';
import AddCard from '../buysell.component/addCard';

class MassPayment extends Component {
    state = {}
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
            buyfiat: <BuyFiat />,
            addcard: <AddCard handleClick={() => this.onHhandleClick()} />,
            selectfiat: <SelectFiat />,
        }
        return stepcodes[config[this.props.buyFiat.stepcode]]
    }
    render() {
        const { Paragraph } = Typography
        return (
            <Drawer
                title={[
                    <div className="side-drawer-header">
                        <span onClick={this.closeDrawer} className="icon md lftarw-white c-pointer" />
                        <div className="text-center fs-14">
                            <Translate className="mb-0 text-white-30 fw-600 text-upper" content={this.props.buyFiat.stepTitles[config[this.props.buyFiat.stepcode]]} component={Paragraph} />
                            <Translate className="text-white-50 mb-0 fw-300" content={this.props.buyFiat.stepTitles[config[this.props.buyFiat.stepcode]]} component={Paragraph} />
                        </div>
                        <span className="icon md close-white c-pointer" onClick={this.closeDrawer} />
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