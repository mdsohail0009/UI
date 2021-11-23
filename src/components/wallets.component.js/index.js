import React, { Component } from 'react'
import { Drawer, Typography } from 'antd';
import Translate from 'react-translate-component';
import FiatWallets from '../dashboard.component/wallets.component';
import CryptoWallets from '../dashboard.component/yourportfolio.component';

class Wallets extends Component {
    closeBuyDrawer = () => {
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
                    <Translate className="mb-0 text-white-30 fw-600 text-upper" content="menu_wallets" component={Paragraph} />
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
                <div className="pt-16">
                    <CryptoWallets />
                </div>
            </div>
        </Drawer>);
    }
}

export default Wallets;
