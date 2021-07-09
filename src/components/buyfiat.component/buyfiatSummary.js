import React, { Component } from 'react';
import { Typography, Button, Tooltip, Input } from 'antd';
import Translate from 'react-translate-component';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buyFiatReducer';
import { connect } from 'react-redux';

const LinkValue = (props) => {
    return (
      <Translate className="text-yellow text-underline c-pointer"
        content={props.content}
        component={Link}
        to="./#"
      />
    )
  }

class FiatSummary extends Component {
    render() {
        const { Paragraph, Text } = Typography;
        const link = <LinkValue content="terms_service" />;
        return (
            <>
                <div className="mb-24">
                    <Text className="fw-200 text-white-30 mb-0 text-upper fs-16">From</Text>
                    {/* <Translate className="fw-100 text-white mb-0 fs-16" content="exchange_rate" component={Paragraph} /> */}
                    <div className="fw-300 fs-24 text-white-30 l-height-normal">Visa ....1453</div>
                </div>
                <div className="mb-24">
                    {/* <Translate className="fw-100 text-white mb-0 fs-16" content="amount" component={Paragraph} /> */}
                    <Text className="fw-100 text-upper text-white-30 fs-16">To</Text>
                    <div className="fw-300 fs-24 text-white-30 l-height-normal">USD Wallet</div>
                </div>
                <div className="mb-24">
                    {/* <Translate className="fw-100 text-white mb-0 fs-16" content="suissebase_fee" component={Paragraph} ><Tooltip title="Suissebase Fee"><span className="icon md info c-pointer ml-4" /></Tooltip></Translate> */}
                    <Text className="fw-100 text-white-30 fs-16">Current Balance</Text>
                    <div className=" fw-300 fs-24 text-white-30 l-height-normal">USD $5.71,00</div>
                </div>
                <div className="mb-36">
                    {/* <Translate className="fw-100 text-white mb-0 fs-16" content="total" component={Paragraph} /> */}
                    <Text className="fw-100 text-white-30 text-upper fs-16">Admin Fee</Text>
                    <div className="fw-300 fs-24 text-darkgreen l-height-normal">Free</div>
                </div>
                <Text className="fw-100 text-white mb-0 fs-36">Total</Text>
                <Text className="fw-100 text-white mb-0 fs-36" style={{ marginLeft: '80px' }}>USD $200,00</Text>


                <div className="d-flex p-16 mb-36 align-end">
                    <span className="icon lg check-ylw mb-16" />
                    <span className="ml-16" style={{ flex: 1 }}>
                        <Translate className="fs-16 text-white-30 mb-16" content="summary_hint_text" component={Paragraph} />
                        <Translate content="agree_to_suissebase" with={{link}} component={Paragraph} className="fs-14 text-white-30" />
                    </span>
                </div>
                <Translate size="large" block className="pop-btn" content="add_fund" component={Button} onClick={() => this.props.changeStep('step3')} />
                <Translate content="cancel" component={Button} type="text" size="large"  onClick={() => this.props.changeStep('step2')} className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block />
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

