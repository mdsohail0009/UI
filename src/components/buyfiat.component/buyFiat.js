import React, { Component } from 'react';
import { Radio, Typography, Card } from 'antd';
import { Link } from 'react-router-dom';

class BuyFiat extends Component {
    state = {}
    handleBuyFiatToggle = () => {

    }
    render() {
        const { Paragraph,Text } = Typography;
        return (
            <>
                <Radio.Group
                    defaultValue={1}
                    onChange={this.handleBuyFiatToggle}
                    className="buysell-toggle crypto-toggle"> 
                    <Radio.Button value={1}>Add Fund</Radio.Button>
                    <Radio.Button value={2}>Withdraw</Radio.Button>
                </Radio.Group>
                {/* <Paragraph className="mb-0 text-white-30 fw-200 fs-36">Purchase a Fiat</Paragraph>
                <Paragraph className="text-secondary fw-300 fs-16">Your wallet is empty, you don’t have any assets to make transactions. Follow this link and <Link to="" className="text-yellow">Deposit</Link> some cash.</Paragraph> */}



                <Paragraph className="mb-0 text-white-30 fw-200 fs-36">Sell your Fiat for Cash</Paragraph>
                <Paragraph className="text-secondary fw-300 fs-16 mb-36">Need to replenish your wallet? Follow this link and  <Link to="" className="text-yellow">Deposit</Link> some cash.</Paragraph>

                <Card className="crypto-card fiatcard mb-36" bordered={false}>
                    <span className="d-flex align-center">
                        <span className="bg-circle coin md usdtmd-white" />
                        <Text className="fs-24 text-white crypto-name ml-8">USD</Text>
                    </span>
                    <div className="crypto-details">
                       
                        <div className=" fw-200">
                            <div className="text-white-50 fs-14">Current Balance</div>
                            <div className="fs-24 text-white fw-500">$5,200.00</div>
                        </div>
                    </div>
                </Card>
                <Card className="crypto-card select mb-36" bordered={false}>
                    <span className="d-flex align-center">
                        <span className="bg-circle coin md usdtmd-white" />
                        <Text className="fs-24 text-white crypto-name ml-8">USD</Text>
                    </span>
                    <div className="crypto-details">
                       
                        <div className=" fw-200">
                            <div className="text-white-50 fs-14">Current Balance</div>
                            <div className="fs-24 text-white fw-500">$5,200.00</div>
                        </div>
                    </div>
                </Card>
            </>
        );
    }
}

export default BuyFiat;