import React, { Component } from 'react';
import { Radio, Typography } from 'antd';
import { Link } from 'react-router-dom';

class BuyFiat extends Component {
    state = {}
    handleBuyFiatToggle = () => {

    }
    render() {
        const { Paragraph } = Typography;
        return (
            <>
                <Radio.Group
                    defaultValue={1}
                    onChange={this.handleBuyFiatToggle}
                    className="buysell-toggle crypto-toggle">
                    <Radio.Button value={1}>Add Fund</Radio.Button>
                    <Radio.Button value={2}>Withdraw</Radio.Button>
                </Radio.Group>
                <Paragraph className="mb-0 text-white-30 fw-200 fs-36">Purchase a Fiat</Paragraph>
                <Paragraph className="text-secondary fw-300 fs-16">Your wallet is empty, you don’t have any assets to make transactions. Follow this link and <Link to="" className="text-yellow">Deposit</Link> some cash.</Paragraph>
            </>
        );
    }
}

export default BuyFiat;