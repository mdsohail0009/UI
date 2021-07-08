import React, { Component } from 'react';
import { Drawer, Typography, Button, Radio, Tabs } from 'antd';
import config from '../../config/config';
import WalletList from '../shared/walletList';
import Translate from 'react-translate-component';
import CryptoList from '../shared/cryptolist';
import CurrencyDestination from '../sell.component/selectCrypto'
import SellToggle from '../sell.component/sellCrypto'
import { Link } from 'react-router-dom';


class BuyCrypto extends Component {
    state = {
        buyDrawer: false,
        crypto: config.tlvCoinsList,
        buyToggle: 'Buy',
        buysell: false
    }
    handleBuySellToggle = e => {
        this.setState({
            buysell: e.target.value === 2
        });
    }

    render() {
        const { TabPane } = Tabs;
        const { Title, Paragraph, Text } = Typography;
        const { buysell } = this.state
        return (
            <>
                <Radio.Group
                    defaultValue={1}
                    onChange={this.handleBuySellToggle}
                    className="buysell-toggle">
                    <Translate content="buy" component={Radio.Button} value={1} />
                    <Translate content="sell" component={Radio.Button} value={2} />
                </Radio.Group>
                {buysell ?
                <>
                 {/* <Paragraph className="mb-0 text-white-30 fw-200 fs-36">Sell your Crypto for Cash</Paragraph> */}
                 <Translate content="sell_your_crypto_for_cash" component={Paragraph} className="mb-0 text-white-30 fw-200 fs-36" />
                 <Translate content="sell_your_crypto_for_cash_text" component={Paragraph} className="text-secondary fw-300 fs-16" />
                    <SellToggle /></> 
                    :
                    <>
                        <Translate content="purchase_a_crypto" component={Title} className="text-white-30 fs-36 fw-200 mb-16" />
                        <Paragraph className="fs-16 text-secondary">Your wallet is empty, you don’t have any assets to make transactions. Follow this link and <Link to="" className="text-yellow text-underline">Deposit</Link> some cash.</Paragraph>
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