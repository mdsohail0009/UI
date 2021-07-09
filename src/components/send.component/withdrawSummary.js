import React, { Component } from 'react';
import { Typography, Button, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';

const LinkValue = (props) => {
    return (
      <Translate className="text-yellow text-underline c-pointer"
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
                <div className="fs-36 text-white-30 fw-200 text-center" style={{ lineHeight: '36px' }}>0.00249745 BTC</div>
                <div className="text-white-50 fw-300 text-center fs-14 mb-16">USD 100.00</div>
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
                <div className="p-16 mt-16 mb-0 text-center">
                <Translate className="fs-16 text-white-30 text-center mb-0" content="withdraw_to" component={Paragraph} />
                <Translate className="fs-16 text-white-30 text-center mb-0" content="btc_address" component={Paragraph} />
                <Paragraph className="fs-16 text-white-30 text-center mb-0">
                1CTEjSuGFv1DwpkGWxfC5qcK1iHAcW
                </Paragraph>
                </div>
                <div className="d-flex p-16 mb-36">
                    <span className="icon lg check-ylw" />
                    <Translate content="agree_to_suissebase" with={{link}} component={Paragraph} className="fs-14 text-white-30 ml-16" style={{ flex: 1 }} />
                </div>
                <Translate size="large" block className="pop-btn" onClick={() => this.props.changeStep('step6')} content="confirm_now" component={Button} />
                <Translate type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block content="cancel" component={Button} />
            </>
        )
    }
}

const connectStateToProps = ({ sendReceive, oidc }) => {
    return { sendReceive }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)( WithdrawSummary);

