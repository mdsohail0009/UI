import React, { Component } from 'react';
import { Card, Typography, Button } from 'antd';
import SavedCards from '../shared/savedCards';

class SelectFiat extends Component {
    state = {}
    render() {
        const { Text } = Typography
        return (
            <>
                <Card className="crypto-card fiatcard mb-36" bordered={false}>
                    <div className="crypto-card-top">
                        <span className="d-flex align-center">
                            <span className="coin-circle coin md usdtbg-white" />
                            <Text className="fs-24 text-white crypto-name ml-8">USD</Text>
                        </span>
                        <span className="icon md c-pointer signal-white" />
                    </div>
                    <div className="crypto-card-bottom">
                        <div>
                            <div className="text-white-50 fs-14 fw-200">Current Balance</div>
                            <div className="fs-24 text-white fw-500">$5,200.00</div>
                        </div>
                        <div>
                            <span className="coin-circle coin md visa-white" />
                            <span className="coin-circle coin md mastercard-white ml-12" />
                        </div>
                    </div>
                </Card>
                <Text className="fs-16 text-white fw-300">Fund with card</Text>
                <SavedCards />
                <Text className="fs-16 text-white fw-300 mt-36 d-block">How much would you like to add?</Text>
                <div className="fs-36 fw-200 text-white">USD $0.00</div>

                <Button size="large" block className="pop-btn" style={{ marginTop: '55px' }} onClick={this.billingAddress}>Preview Swap</Button>
            </>
        );
    }
}

export default SelectFiat;