import React, { Component } from 'react';
import { Typography, Button, Tooltip, Input, Checkbox } from 'antd';
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
                    <Translate className="fw-200 text-white-30 mb-0 text-upper fs-16" content="from" component={Text} />
                    <div className="fw-300 fs-24 text-white-30 l-height-normal">Visa ....1453</div>
                </div>
                <div className="mb-24">
                    <Translate className="fw-100 text-upper text-white-30 fs-16" content="to" component={Text} />
                    <Translate className="fw-300 fs-24 text-white-30 l-height-normal mb-0" content="USD_wallet" component={Paragraph} />
                </div>
                <div className="mb-24">
                    <Translate className="fw-100 text-white-30 fs-16" content="current_balance" component={Text} />
                    <div className=" fw-300 fs-24 text-white-30 l-height-normal">USD $5.71,00</div>
                </div>
                <div className="mb-36">
                    <Translate className="fw-100 text-white-30 text-upper fs-16" content="admin_fee" component={Text} />
                    <Translate className="fw-300 fs-24 text-darkgreen l-height-normal" content="free" component={Paragraph} />
                </div>
                <div className="fiat-total">
                    <Translate className="fw-100 text-white mb-0 fs-36" content="total" component={Paragraph} />
                    <Paragraph className="fw-100 text-white mb-0 fs-36">USD 200,00</Paragraph>
                </div>
                <Translate className="fs-14 text-center text-white-30 mt-24" content="summary_hint_text" component={Paragraph} />
                {/* <div className="fs-14 text-center text-white-30 mt-24">Your final amount might be changed with in 10 seconds.</div> */}
                <div className="text-center text-underline my-24"><Link className="text-white"> Refresh</Link></div>
                <div className="d-flex p-16 mt-16 mb-36 agree-check">
                    <label>
                        <input type="checkbox" id="agree-check" />
                        <span for="agree-check" />
                    </label>
                    {/* <Translate className="fs-16 text-white-30 mb-16" content="summary_hint_text" component={Paragraph} />
                        <div className="text-center text-underline my-36"><Link className="text-white"> Refresh</Link></div> */}

                    <Translate content="agree_to_suissebase" with={{ link }} component={Paragraph} className="fs-14 ml-16 text-white-30 mb-0" />

                </div>
                <Translate size="large" block className="pop-btn" content="add_fund" component={Button} onClick={() => this.props.changeStep('step3')} />
                <Translate content="cancel" component={Button} type="text" size="large" onClick={() => this.props.changeStep('step2')} className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block />
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

