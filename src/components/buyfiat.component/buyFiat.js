import React, { Component } from 'react';
import { Radio, Typography } from 'antd';
import { Link } from 'react-router-dom';
import FiatList from '../shared/fiatList';
import Translate from 'react-translate-component';

class BuyFiat extends Component {
    state = {
        buyFiat: false,
    }

    handleBuyFiatToggle = (e) => {
        this.setState({
            buyFiat: e.target.value === 2
        });
    }
    render() {
        const { Paragraph, Title } = Typography;
        const { buyFiat } = this.state
        return (
            <>
                <Radio.Group
                    defaultValue={1}
                    onChange={this.handleBuyFiatToggle}
                    className="buysell-toggle crypto-toggle">
                    <Radio.Button value={1}>Add Fund</Radio.Button>
                    <Radio.Button value={2}>Withdraw</Radio.Button>
                </Radio.Group>
                {buyFiat ? <>
                    <Translate className="mb-0 text-white-30 fw-200 fs-36 mb-16" content="purchase_fiat" component={Title} />
                    <Paragraph className="text-secondary fw-300 fs-16">Your wallet is empty, you don’t have any assets to make transactions. Follow this link and <Link to="" className="text-yellow text-underline">Deposit</Link> some cash.</Paragraph>
                </>
                    : <>
                        <Translate className="mb-0 text-white-30 fw-200 fs-36 mb-16" content="purchase_fiat" component={Title} />
                        <Paragraph className="text-secondary fw-300 fs-16">Your wallet is empty, you don’t have any assets to make transactions. Follow this link and <Link to="" className="text-yellow text-underline">Deposit</Link> some cash.</Paragraph>
                        <div className="markets-panel mt-36">
                            <FiatList />
                        </div>
                    </>}
            </>
        );
    }
}

export default BuyFiat;