import React, { Component } from 'react';
import { Typography, Button, Input } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
const LinkValue = (props) => {
    return (
        <Translate className="text-defaultylw text-underline c-pointer"
            content={props.content}
            component={Link}
            to="./#"
        />
    )
}
class WithdrawSummary extends Component {
    render() {
        const { Paragraph, Text } = Typography;
        const link = <LinkValue content="terms_service" />;
        return (
            <>
                <div className="enter-val-container mr-0  p-relative">
                    <div className="text-center">
                        <Input className="enter-val p-0 fs-36 text-white-30 fw-200"
                            bordered={false}
                            suffix="BTC"
                            placeholder="0.002497"
                            style={{ maxWidth: 240, lineHeight: '0.1' }}
                        />
                        <Text className="fs-14 text-white-30 fw-200 text-center d-block mb-36">USD 200.00</Text>
                    </div>
                    <span className="mt-8 val-updown">
                        <span className="icon sm uparw-o-white d-block c-pointer mb-4" /><span className="icon sm dwnarw-o-white d-block c-pointer" />
                    </span>
                </div>
                <div className="pay-list fs-16">
                    <Translate className="fw-400 text-white" content="exchange_rate" component={Text} />
                    <Text className="fw-300 text-white-30">1 BTC = 41,363.47 USD</Text>
                </div>
                <div className="pay-list fs-16">
                    <Translate className="fw-400 text-white" content="amount" component={Text} />
                    <Text className="fw-300 text-white-30">USD 106.79</Text>
                </div>
                <div className="pay-list fs-16">
                    <Translate className="fw-400 text-white" content="total" component={Text} />
                    <Text className="fw-300 text-white-30">0.00279935 BTC (USD 104.08)</Text>
                </div>
                <Translate className="fs-14 text-white-30 text-center my-16 fw-200" content="summary_hint_text" component={Paragraph} />
                <div className="p-16 mt-16 mb-0 text-center">
                    <Translate className="fs-16 text-white-30 text-center mb-0" content="withdraw_to" component={Paragraph} />
                    <Translate className="fs-16 text-white-30 text-center mb-0" content="btc_address" component={Paragraph} />
                    <Paragraph className="fs-16 text-white-30 text-center mb-0">
                        1CTEjSuGFv1DwpkGWxfC5qcK1iHAcW
                    </Paragraph>
                </div>
                <div className="d-flex p-16 mb-36 agree-check">
                    <label>
                        <input type="checkbox" id="agree-check" />
                        <span for="agree-check" />
                    </label><Translate content="agree_to_suissebase" with={{ link }} component={Paragraph} className="fs-14 text-white-30 ml-16" style={{ flex: 1 }} />
                </div>
                <Translate size="large" block className="pop-btn" onClick={() => this.props.changeStep('step6')} content="confirm_now" component={Button} />
                <Translate type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block content="cancel" onClick={() => this.props.changeStep('step1')} component={Button} />
            </>
        )
    }
}

const connectStateToProps = ({ sendReceive }) => {
    return { sendReceive }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(WithdrawSummary);

