import React, { Component } from 'react';
import { Drawer, Typography, Button, Card, Input, Radio } from 'antd';
import WalletList from '../shared/walletList';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';

class SelectFiat extends Component {
    state = {
        withdrow: "true",
    }
    render() {
        const { Text } = Typography;
        return (
            <>
            <Card className="crypto-card fiatcard mb-36" bordered={false}>
                    <span className="d-flex align-center">
                        <span className="coin-circle coin md usdtbg-white" />
                        <Text className="fs-24 text-white crypto-name ml-8">USD</Text>
                    </span>
                    <div className="crypto-details">

                        <div className=" fw-200">
                            <div className="text-white-50 fs-14">Current Balance</div>
                            <div className="fs-24 text-white fw-500">$5,200.00</div>
                        </div>
                    </div>
                </Card>
            <div className="mr-8 enter-val-container">
                <div className="text-center">
                    <Input className="fs-36 fw-100 text-white-30 text-center enter-val p-0"
                        placeholder="$ 0"
                        bordered={false}
                        style={{ maxWidth: 206 }}
                    />
                    <Text className="fs-14 text-white-30 fw-200 text-center d-block mb-36">0.00 BTC</Text>
                </div>
                <span className="mt-24" style={{ marginLeft: 80 }}>
                    <span className="icon sm uparw-o-white d-block c-pointer mb-4" /><span className="icon sm dwnarw-o-white d-block c-pointer" />
                </span>
            </div>
            <Radio.Group defaultValue="min" buttonStyle="solid" className="round-pills">
                <Radio.Button value="min">Min</Radio.Button>
                <Radio.Button value="half">Half</Radio.Button>
                <Radio.Button value="all">ALL</Radio.Button>
            </Radio.Group>
            
            <Button size="large" block className="pop-btn" >PREVIEW</Button>
        </>
        );
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
export default connect(connectStateToProps, connectDispatchToProps)(SelectFiat);
