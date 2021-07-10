import React, { Component } from 'react';
import { Drawer, Typography, Button, Card, Input, Radio } from 'antd';
import config from '../../config/config';
import WalletList from '../shared/walletList';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';

const options = [
    { label: 'Buy', value: 'Buy' },
    { label: 'Sell', value: 'Sell' },
];
class SellToggle extends Component {
    handleBuySellToggle = e => {
        this.setState({
            buyToggle: e.target.value,
        });
    };
    render() {
        const { Title, Paragraph, Text } = Typography;
        return (
            <>
                <div className="sellcrypto-container auto-scroll">
                    <Card className="crypto-card select mb-16 c-pointer" bordered={false} onClick={() => this.props.changeStep('step10')} >
                        <span className="d-flex align-center">
                            <span className="coin lg btc-white" />
                            <Text className="fs-24 text-white crypto-name ml-8">Bitcoin</Text>
                        </span>
                        <div className="crypto-details">
                            <Text className="crypto-percent text-white fw-700">65<sup className="fs-24 text-white fw-700" style={{ verticalAlign: 'Middle', marginLeft: 14 }}>%</sup></Text>
                            <div className="fs-16 text-white-30 fw-200 crypto-amount">
                                <div className="text-yellow">1.0147668 <Text className="text-secondary">ETH</Text></div>
                                <div className="text-yellow"><Text className="text-secondary">$</Text> 41.07</div>
                            </div>
                        </div>
                    </Card>
                    <Card className="crypto-card normal-card mb-16 c-pointer" bordered={false}>
                        <span className="d-flex align-center">
                            <span className="coin lg eth-white" />
                            <Text className="fs-24 text-white crypto-name ml-8">Ethereum</Text>
                        </span>
                        <div className="crypto-details">
                            <Text className="crypto-percent text-white fw-700">25<sup className="fs-24 text-white fw-700" style={{ verticalAlign: 'Middle', marginLeft: 14 }}>%</sup></Text>
                            <div className="fs-16 text-white-30 fw-200 crypto-amount">
                                <div className="text-yellow">1.0147668 <Text className="text-secondary">ETH</Text></div>
                                <div className="text-yellow"><Text className="text-secondary">$</Text> 41.07</div>
                            </div>
                        </div>
                    </Card>
                </div>
            </>
        )
    }
}
const connectStateToProps = ({ buySell, oidc }) => {
    return { buySell }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SellToggle);
