import React, { Component } from 'react';
import { Drawer, Typography, Button, Radio, Tabs } from 'antd';
import config from '../../config/config';
import WalletList from '../shared/walletList';
import Translate from 'react-translate-component';
import CryptoList from '../shared/cryptolist';
import { Link } from "react-router-dom";

const depostOptions = [
    { label: 'From Crypto', value: 'From Crypto' },
    { label: 'From Fiat', value: 'From Fiat' },
];
class DepositFiat extends Component {
    state = {
        buyToggle: 'From Fiat'
    }
    handleDepositToggle = e => {
        console.log(this.state);
    }

    render() {
        const { Paragraph } = Typography;
        return (
            <>
                <Radio.Group
                    options={depostOptions}
                    onChange={this.handleDepositToggle}
                    value={this.state.buyToggle}
                    optionType="button"
                    buttonStyle="solid"
                    size="large"
                    className="buysell-toggle"
                />
                <WalletList />
                <Paragraph className="mb-0 mt-36 fs-14 text-white fw-500">WIRE TRANSFER METHOD</Paragraph>
                <div className="d-flex align-center mt-16 c-pointer" onClick={this.wiriTransfer}>
                    <span className="coin btc" />
                    <div className="ml-16"><Paragraph className="mb-0 fs-14 text-white-30 fw-300">Fidor Bank AG</Paragraph>
                        <Paragraph className="mb-0 fs-12 text-white-30 fw-300"> EUR</Paragraph>
                    </div>
                    <div className="recomnd-tag fs-12 text-white-30 fw-300 ml-auto">RECOMMENDED</div>
                </div>
            </>
        )
    }
}


export default DepositFiat;