import React, { Component } from 'react';
import { Card, Typography } from 'antd';

class CryptoCard extends Component {
    state = {}
    render() {
        const { Text } = Typography;
        return (
            <Card className="crypto-card mb-36 c-pointer" bordered={false}>
                <span className="d-flex">
                    <span className="coin md eth-white" />
                    <Text className="fs-24 text-white crypto-name ml-24">Ethereum</Text>
                </span>
                <div className="crypto-details">
                    <Text className="crypto-percent text-white fw-700">25<sup className="fs-24 text-white fw-700" style={{ verticalAlign: 'Middle', marginLeft: 14 }}>%</sup></Text>
                    <div className="fs-16 text-white-30 fw-200 crypto-amount">
                        <div>1.0147668 ETH</div>
                        <div>$ 41.07</div>
                    </div>
                </div>
            </Card>
        );
    }
}

export default CryptoCard;
