import React, { Component } from 'react';
import { Drawer, Typography,Button ,Radio, Tabs} from 'antd';
import config from '../../config/config';
import WalletList from '../shared/walletList';
import Translate from 'react-translate-component';
import CryptoList from '../shared/cryptolist';

const options = [
    { label: 'Buy', value: 'Buy' },
    { label: 'Sell', value: 'Sell' },
];
const depostOptions = [
    { label: 'From Crypto', value: 'From Crypto' },
    { label: 'From Fiat', value: 'From Fiat' },
]; 
class FromCrypto extends Component {
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
                        options={depostOptions}
                        onChange={this.handleDepositToggle}
                        value={this.state.depositToggle}
                        optionType="button"
                        buttonStyle="solid"
                        size="large"
                        className="buysell-toggle crypto-toggle mx-12"
                    />
                    {/* <List onClick={this.depositScanner}
                        itemLayout="horizontal"
                        dataSource={config.tlvCoinsList}
                        className="wallet-list"
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<span className={`coin ${item.coin} mr-4`} />}
                                    title={<div className="fs-16 fw-600 text-upper text-white-30 mb-0 mt-12">{item.coin}</div>}
                                />
                            </List.Item>
                        )}
                    /> */}
                    <WalletList isArrow={true} />
                    <Paragraph className="mb-0 fs-14 text-white fw-400">WIRE TRANSFER METHOD</Paragraph>
                    <div className="d-flex align-center justify-content">
                    <div className="d-flex align-center mb-24 mt-16 c-pointer" onClick={this.wiriTransfer}>
                        <span className="coin btc" />
                        <div className="ml-24"><Paragraph className="mb-0 fs-14 text-white-30 fw-300">Fidor Bank AG</Paragraph>
                            <Paragraph className="mb-0 fs-12 text-white-30 fw-300"> EUR</Paragraph>
                        </div>

                    </div>
                    <div className="recomoned-bg"><Link className="recomoned-bg">RECOMMENDED</Link></div>
                    </div>
               </>
        )
    }
}

export default BuyToggle;