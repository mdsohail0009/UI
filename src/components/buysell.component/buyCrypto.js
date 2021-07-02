import React, { Component } from 'react';
import { Drawer, Typography, Button, Radio, Tabs } from 'antd';
import config from '../../config/config';
import WalletList from '../shared/walletList';
import Translate from 'react-translate-component';
import CryptoList from '../shared/cryptolist';

const options = [
    { label: 'Buy', value: 'Buy' },
    { label: 'Sell', value: 'Sell' },
];

class BuyCrypto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buyDrawer: false,
            crypto: config.tlvCoinsList,
            buyToggle: 'Buy',
        }
    }
    handleBuySellToggle = e => {
        console.log(this.state);
    }

    render() {
        const { TabPane } = Tabs;
        const { Title, Paragraph, Text } = Typography;
        return (
            <>
                <Radio.Group
                    options={options}
                    onChange={this.handleBuySellToggle}
                    value={this.state.buyToggle}
                    optionType="button"
                    buttonStyle="solid"
                    size="large"
                    className="buysell-toggle"
                />
                <Translate content="purchase_a_crypto" component={Title} className="text-white-30 fs-36 fw-200 mb-16" />
                <Translate content="purchase_a_cryto_txt" component={Paragraph} className="fs-16 text-secondary" />
                <Tabs className="crypto-list-tabs">
                    <TabPane tab="All" key="1">
                        <CryptoList />
                    </TabPane>
                    <TabPane tab="Gainers" key="2">
                        <CryptoList />
                    </TabPane>
                    <TabPane tab="Losers" key="3">
                        <CryptoList />
                    </TabPane>
                </Tabs>
            </>
        )
    }
}

export default BuyCrypto;