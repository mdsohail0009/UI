import React, { Component } from 'react';
import { Card, Typography, Button, Input } from 'antd';
import SavedCards from '../shared/savedCards';
import { setStep } from '../../reducers/buyFiatReducer';
import { connect } from 'react-redux';

class SelectFiat extends Component {
    state = {
        withdrow: "true",
    }
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
                        <span className="icon md signal-white mt-8" />
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
                <Text className="fs-16 text-white fw-300 mb-8 d-block">Fund with card</Text>
                <SavedCards />
                <Text className="fs-16 text-white fw-300 mt-36 d-block">How much would you like to add?</Text>
                <Input className="fs-36 fw-100 text-white-30 text-left enter-val p-0"
                    placeholder="0.00"
                    bordered={false}
                    prefix="USD"
                />
                <Button size="large" block className="pop-btn" style={{ marginTop: '55px' }} onClick={() => this.props.changeStep("step5")}>Preview Swap</Button>
            </>
        );
    }
}


const connectStateToProps = ({ buyFiat, oidc }) => {
    return { buyFiat }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SelectFiat);
