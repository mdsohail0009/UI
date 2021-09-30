import React, { Component } from 'react';
import { Card, Typography, Button, Input, Radio } from 'antd';
import { setStep } from '../../reducers/buyFiatReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';

class SelectWallet extends Component {
    state = {}
    render() {
        const { Text, Paragraph } = Typography
        return (
            <>
                <Card className="crypto-card fiatcard mb-36" bordered={false}>
                    <div className="crypto-card-top">
                        <span className="d-flex align-center">
                            <span className="coin-circle coin md usd" />
                            <Text className="fs-24 text-purewhite ml-8">USD</Text>
                        </span>
                        <span className="icon md c-pointer signal-white" />
                    </div>
                    <div className="crypto-card-bottom">
                        <div>
                            <Translate className="text-purewhite fs-14 fw-200 mb-0" content="current_balance" component={Paragraph} />
                            <div className="fs-24 text-purewhite fw-500">$5,200.00</div>
                        </div>
                        <div className="card-icons">
                            <span className="coin-circle coin md visa-white" />
                            <span className="coin-circle coin md mastercard-white ml-12" />
                        </div>
                    </div>
                </Card>
                <div className="enter-val-container p-relative">
                    <div className="text-center">
                        <Input className="fs-36 fw-100 text-white-30 text-center enter-val p-0"
                            placeholder="0.00"
                            bordered={false}
                            prefix="$"
                            style={{ maxWidth: 120 }}
                            autoFocus
                        />
                        <Text className="fs-14 text-white-30 fw-200 text-center d-block mb-36">0.00 BTC</Text>
                    </div>
                    <span className="mt-16 val-updown c-pointer">
                        <span className="icon sm uparw-o-white d-block c-pointer mb-4" /><span className="icon sm dwnarw-o-white d-block c-pointer" />
                    </span>
                </div>
                <Radio.Group defaultValue="min" buttonStyle="solid" className="round-pills">
                    <Translate value="min" content="min" component={Radio.Button} />
                    <Translate value="half" content="half" component={Radio.Button} />
                    <Translate value="all" content="all" component={Radio.Button} />
                </Radio.Group>
                <Translate content="preview" component={Button} size="large" block className="pop-btn" style={{ marginTop: '100px' }} onClick={() => this.props.changeStep('step5')} />
            </>
        );
    }
}

const connectStateToProps = ({ buyFiat }) => {
    return { buyFiat }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}

export default connect(connectStateToProps, connectDispatchToProps)(SelectWallet);