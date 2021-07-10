import React, { Component } from 'react';
import { Card, Typography, Button, Input } from 'antd';
import SavedCards from '../shared/savedCards';
import { setStep } from '../../reducers/buyFiatReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';

class SelectFiat extends Component {
    state = {
        withdrow: "true",
    }
    render() {
        const { Text, Paragraph } = Typography
        return (
            <>
                <Card className="crypto-card fiatcard mb-36" bordered={false}>
                    <div className="crypto-card-top">
                        <span className="d-flex align-center">
                            <span className="coin-circle coin md usd" />
                            <Text className="fs-24 text-white crypto-name ml-8">USD</Text>
                        </span>
                        <span className="icon md signal-white mt-8" />
                    </div>
                    <div className="crypto-card-bottom">
                        <div>
                            <Translate className="text-white-50 fs-14 fw-200 mb-0" content="current_balance" component={Paragraph} />
                            <div className="fs-24 text-white fw-500">$5,200.00</div>
                        </div>
                        <div className="card-icons">
                            <span className="coin-circle coin md visa-white" />
                            <span className="coin-circle coin md mastercard-white ml-12" />
                        </div>
                    </div>
                </Card>
                <Translate className="fs-16 text-white fw-300 mb-8 d-block" content="fund_with_card" component={Text} />
                <SavedCards />
                <Translate className="fs-16 text-white fw-300 mt-36 d-block" content="fund_with_card_text" component={Text} />
                <Input className="fs-36 fw-100 text-white-30 text-left enter-val p-0"
                    placeholder="0.00"
                    bordered={false}
                    prefix="USD"
                />
                <Translate size="large" block className="pop-btn" style={{ marginTop: '55px' }} onClick={() => this.props.changeStep("step5")} content="preview_swap" component={Button} />
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
