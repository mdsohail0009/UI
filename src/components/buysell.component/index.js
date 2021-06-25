import React, { Component } from 'react';
import { Drawer } from 'antd';

class BuySell extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buyDrawer: false,
        }
    }


    showBuyDrawer = () => {
        debugger;
        this.setState({
            buyDrawer: true
        })
    }
    closeBuyDrawer = () => {
        this.setState({
            buyDrawer: false
        })
    }
    render() {
        //const { onShowBuyDrawer } = this.props;
        return (<Drawer
            title={null}
            placement="right"
            closable={true}
            visible={this.state.buyDrawer}
            onShowBuyDrawer={this.showBuyDrawer}
            closeIcon={<span className="icon lg drawer-close" onClick={this.closeBuyDrawer} />}
            className="side-drawer"
        >
            test
        </Drawer>);
    }
}

export default BuySell;