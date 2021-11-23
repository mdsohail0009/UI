import React, { Component } from 'react'
import { Drawer, Typography } from 'antd';
import Translate from 'react-translate-component';

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
            Wallets
        >
            Wallets
        </Drawer>);
    }
}

export default Wallets;
