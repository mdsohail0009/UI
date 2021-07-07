import React, { Component } from 'react';
import { Drawer, Typography, Button, Radio, Tabs } from 'antd';
import config from '../../config/config';
import WalletList from '../shared/walletList';
import Translate from 'react-translate-component';
import CryptoList from '../shared/cryptolist';
import CurrencyDestination from '../sell.component/selectCrypto'
import SellToggle from '../sell.component/sellCrypto'


class BuyCrypto extends Component {
    state = {
        buyDrawer: false,
        crypto: config.tlvCoinsList,
        buyToggle: 'Buy',
        buysell: false
    }

    handleBuySellToggle = e => {
        // console.log(this.state);
        debugger;
        this.setState({
            buysell: e.target.value === 2
        });
    }

    render() {
        const { TabPane } = Tabs;
        const { Title, Paragraph, Text } = Typography;
        const {buysell} = this.state
        return (
            <>
                <Radio.Group
                    defaultValue={1}
                    onChange={this.handleBuySellToggle}
                    className="buysell-toggle">
                    <Radio.Button value={1}>Buy</Radio.Button>
                    <Radio.Button value={2}>Sell</Radio.Button>
                </Radio.Group>
                {buysell ?
                <>
                 <Paragraph className="mb-0 text-white-30 fw-200 fs-36">Sell your Crypto for Cash</Paragraph>
                 <Paragraph className="text-secondary fw-300 fs-16">Easily buy and sell Crypto straight from your Wallet.</Paragraph>
                    <SellToggle /></> 
                    :
                    <>
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
                        </Tabs></>
                }
            </>
        )
    }
}

export default BuyCrypto;