import React, { Component } from 'react'
import { Drawer, Typography } from 'antd';
import Translate from 'react-translate-component';
import FiatWallets from './fiatwallets';
import CryptoWallets from './cryptowallets';
import { setHeaderTab } from '../../reducers/buysellReducer';
import ConnectStateProps from '../../utils/state.connect';

class Wallets extends Component {
    closeBuyDrawer = () => {
        this.props.dispatch(setHeaderTab(""))
        if (this.props.onClose) {
            this.props.onClose();
        }
    }
    render() {
        const { Paragraph } = Typography;
        return (<Drawer destroyOnClose={true}
            title={[<div className="side-drawer-header">
                <span />
                <div className="text-center fs-16">
                    <Translate className="mb-0 text-white-30 fw-600" content="menu_wallets" component={Paragraph} />
                </div>
                <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" /></div>]}
            placement="right"
            closable={true}
            visible={this.props.showDrawer}
            closeIcon={null}
            className="side-drawer"
        >
            <div className="markets-panel walletsdrawer mr-0">
                <div className="mb-36">
                    <FiatWallets />
                </div>
                <div className="mb-36">
                <CryptoWallets  onClose={this.props.onClose}/>
                </div>
            </div>
        </Drawer>);
    }
}

export default ConnectStateProps(Wallets);
