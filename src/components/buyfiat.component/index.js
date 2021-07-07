import React, { Component } from 'react';
import { Drawer, Typography, Menu, Dropdown } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import { buyFiatSteps as config } from './config';
import { setStep } from '../../reducers/buysellReducer';
import connectStateProps from '../../utils/state.connect';
import Translate from 'react-translate-component';
import BuyFiat from './buyFiat';
import SelectFiat from './selectFiat';
import AddCard from '../buysell.component/addCard';
import SelectWallet from './selectWallet';

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
            buyfiat: <BuyFiat />,
            selectfiat: <SelectFiat />,
            addcard: <AddCard />,
            selectwallet: <SelectWallet />,
        }
        return stepcodes[config[this.props.buyFiat.stepcode]]
    }
    render() {
        const menu = (
            <Menu onClick={this.handleMenuClick}>
                <Menu.Item key="1">Withdraw</Menu.Item>
                <Menu.Item key="2">Fait</Menu.Item>
            </Menu>
        );
        const { withdraw } = this.state;
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
                        <Dropdown overlay={menu} onVisibleChange={this.handleVisibleChange}
                            visible={this.state.visible} >
                            <a className="text-white pop-drpdwn-toogle" onClick={e => e.preventDefault()}><span className="icon md settings" onClick={e => e.preventDefault()} /></a>
                        </Dropdown>

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