import React, { Component } from 'react';
import { Drawer, Typography, Button, Radio, Tabs } from 'antd';
import config from '../../config/config';
import WalletList from '../shared/walletList';
import CryptoList from '../shared/cryptolist';
import { Link } from "react-router-dom";
import Translate from 'react-translate-component';

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
        const { Paragraph, Text } = Typography;
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
                <Translate className="mb-0 mt-36 fs-14 text-white fw-500 text-upper" content="wire_transfer_mthd" component={Paragraph} />
                <div className="d-flex align-center mt-16 c-pointer" onClick={this.wiriTransfer}>
                    <span className="coin btc" />
                    <div className="ml-16"><Paragraph className="mb-0 fs-14 text-white-30 fw-300">Fidor Bank AG</Paragraph>
                        <Paragraph className="mb-0 fs-12 text-white-30 fw-300">EUR</Paragraph>
                    </div>
                    <Translate className="recomnd-tag fs-12 text-white-30 fw-300 ml-auto" content="recommended" component={Text} />
                </div>
            </>
        )
    }
}


export default DepositFiat;