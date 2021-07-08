import React, { Component } from 'react';
import { Drawer, Typography, Button, Card, Input, Radio } from 'antd';
import WalletList from '../shared/walletList';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';

class SelectSellCrypto extends Component {

    render() {
        const { Text } = Typography;
        return (
            <>
                <Card className="crypto-card select mb-36" bordered={false}>
                    <span className="d-flex align-center">
                        <span className="coin lg btc-white" />
                        <Text className="fs-24 text-white crypto-name ml-8">Bitcoin</Text>
                    </span>
                    <div className="crypto-details">
                        <Text className="crypto-percent text-white fw-700">65<sup className="fs-24 text-white fw-700" style={{ verticalAlign: 'Middle', marginLeft: 14 }}>%</sup></Text>
                        <div className="fs-16 text-white-30 fw-200 text-right">
                            <div className="text-yellow">1.0147668 <Text className="text-secondary">ETH</Text></div>
                            <div className="text-yellow"><Text className="text-secondary">$</Text> 41.07</div>
                        </div>
                    </div>
                </Card>
                <div className="enter-val-container">
                    <div className="text-center">
                        <Input className="fs-36 fw-100 text-white-30 text-center enter-val p-0"
                            placeholder="106.79"
                            bordered={false}
                            prefix="USD"
                            style={{ maxWidth: 206 }}
                        />
                        <Text className="fs-14 text-white-30 fw-200 text-center d-block mb-36">0.00287116 BTC</Text>
                    </div>
                    <span className="mt-8 val-updown">
                        <span className="icon sm uparw-o-white d-block c-pointer mb-4" /><span className="icon sm dwnarw-o-white d-block c-pointer" />
                    </span>
                </div>
                <Radio.Group defaultValue="min" buttonStyle="solid" className="round-pills">
                    <Radio.Button value="min">Min</Radio.Button>
                    <Radio.Button value="half">Half</Radio.Button>
                    <Radio.Button value="all">ALL</Radio.Button>
                </Radio.Group>
                <WalletList />
                <Button size="large" block className="pop-btn" onClick={() => this.props.changeStep('step11')}>PREVIEW</Button>
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
export default connect(connectStateToProps, connectDispatchToProps)(SelectSellCrypto);
