import React, { Component } from 'react';
import { Typography, Button, Tooltip, Input } from 'antd';
import Translate from 'react-translate-component';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buyFiatReducer';
import { connect } from 'react-redux';

class FiatSummary extends Component {
    render() {
        const { Paragraph, Text } = Typography;
        return (
            <>
                <div className="mb-16">
                    <Paragraph className="fw-200 text-white mb-0 text-upper fs-16 ">From</Paragraph>
                    {/* <Translate className="fw-100 text-white mb-0 fs-16" content="exchange_rate" component={Paragraph} /> */}
                    <Text className="fw-300 fs-20 text-white-30">Visa ....1453</Text>
                </div>
                <div className="mb-16">
                    {/* <Translate className="fw-100 text-white mb-0 fs-16" content="amount" component={Paragraph} /> */}
                    <Paragraph className="fw-100 text-white mb-0 text-upper fs-16">To</Paragraph>
                    <Text className="fw-300 fs-20 text-white-30  mb-0">USD Wallet</Text>
                </div>
                <div className="mb-16">
                    {/* <Translate className="fw-100 text-white mb-0 fs-16" content="suissebase_fee" component={Paragraph} ><Tooltip title="Suissebase Fee"><span className="icon md info c-pointer ml-4" /></Tooltip></Translate> */}
                    <Paragraph className="fw-100 text-white mb-0 fs-16">Current Balance</Paragraph>
                    <Text className=" fw-300 fs-20  text-white-30">USD $5.71,00</Text>
                </div>
                <div className="mb-16">
                    {/* <Translate className="fw-100 text-white mb-0 fs-16" content="total" component={Paragraph} /> */}
                    <Paragraph className="fw-100 text-white mb-0 text-upper fs-16">Admin Fee</Paragraph>
                    <Text className="fw-300 fs-20 text-darkgreen">Free</Text>
                </div>
                <div className="d-flex justify-content align-center">
                <Paragraph className="fw-100 text-white mb-0 fs-36">Total</Paragraph>
                <Paragraph className="fw-100 text-white mb-0 fs-36 pr-16">USD $200,00</Paragraph>
                </div>
                <Translate className="fs-16 text-white-30 text-center mt-16" content="summary_hint_text" component={Paragraph} />
                <div className="d-flex p-16 mb-36">
                    <span className="icon lg check-ylw" />
                    <Text className="fs-14 text-white-30 ml-16" style={{ flex: 1 }}>
                        I agree to Suissebase’s <Link to="" className="text-white-30"><u>Terms of Service</u></Link> and its return, refund and cancellation policy.
                    </Text>
                </div>
                <Translate size="large" block className="pop-btn"  content="confirm_swap" component={Button} />
            </>
        )
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
export default connect(connectStateToProps, connectDispatchToProps)(FiatSummary);

