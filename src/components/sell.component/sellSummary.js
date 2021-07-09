import React, { Component } from 'react';
import { Typography, Button, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';

class SellSummary extends Component {
    render() {
        const { Paragraph, Text } = Typography;
        return (
            <>
                <div className="fs-36 text-white-30 fw-200 text-center" style={{ lineHeight: '36px' }}>USD $106.79</div>
                <div className="text-white-50 fw-300 text-center fs-14 mb-16">0.00287116 BTC</div>
                <div className="pay-list fs-14">
                    <Translate className="fw-400 text-white" content="exchange_rate" component={Text} />
                    <Text className="fw-300 text-white-30">1 BTC = 41.363.47 USD</Text>
                </div>
                <div className="pay-list fs-14">
                    <Translate className="fw-400 text-white" content="amount" component={Text} />
                    <Text className="fw-300 text-white-30">USD 106.79</Text>
                </div>
                <div className="pay-list fs-14">
                    <Text className="fw-400 text-white">Suissebase Fee<Tooltip title="Suissebase Fee"><span className="icon md info c-pointer ml-4" /></Tooltip></Text>
                    <Text className="text-darkgreen fw-400">USD $2.71</Text>
                </div>
                <div className="pay-list fs-14">
                    <Translate className="fw-400 text-white" content="total" component={Text} />
                    <Text className="fw-300 text-white-30">0.00279935 BTC (USD 104.08)</Text>
                </div>
                <Translate className="fs-12 text-white-30 text-center my-16" content="summary_hint_text" component={Paragraph} />
                <div className="d-flex p-16 mb-36">
                    <span className="icon lg check-ylw" />
                    <Text className="fs-14 text-white-30 ml-16" style={{ flex: 1 }}>
                        I agree to Suissebase’s <Link to="" className="text-white-30"><u>Terms of Service</u></Link> and its return, refund and cancellation policy.
                    </Text>
                </div>
                <Translate size="large" block className="pop-btn" onClick={() => this.props.changeStep('success')} content="confirm_now" component={Button} />
                <Translate type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block content="cancel" component={Button} />
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
export default connect(connectStateToProps, connectDispatchToProps)(SellSummary);

