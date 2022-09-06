import React, { Component } from 'react';
import { Card, Typography } from 'antd';

class CryptoCard extends Component {
    state = {}
    render() {
        const { Text } = Typography;
        return (
            <Card className="crypto-card mb-36 c-pointer d-flex" bordered={false}>
                <div className='d-flex justify-content'>
                <div>
                    <span className="d-flex align-center mb-4">
                        <span className="coin md eth-white" />
                        <Text className="crypto-percent textc-white">25<sup className="fs-24 text-white" style={{ verticalAlign: 'Middle', marginLeft: 14 }}>%</sup></Text>  
                    </span>
                    <Text className="fs-24 textc-white crypto-name ml-24">Ethereum</Text>
                </div>
                <div className="crypto-details">
                    <div className="fs-16 textc-white fw-200 crypto-amount">
                        <div>1.0147668 ETH</div>
                        <div>$ 41.07</div>
                    </div>
                </div></div>
            </Card>
        );
    }
}

export default CryptoCard;
