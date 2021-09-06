import React, { Component } from 'react';
import { Typography, Button, Tooltip, Checkbox } from 'antd';
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

class FaitdepositSummary extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    showPayCardDrawer = () => {
        console.log(this.state);
    }

    render() {
        const { Title, Paragraph, Text } = Typography;
        const link = <LinkValue content="terms_service" />;
        return (
            <>
                <div className="fs-14">
                    <Translate className="fw-200 text-white-50" content="amount" component={Text} />
                    <Text className="fw-500 fs-24 text-white-30 d-block">0.00</Text>
                </div>
                <div className="fs-14 mt-24">
                    <Text className="fw-200 text-white-50">Bank Account Number</Text>
                    <Text className="fw-500 fs-24 text-white-30 d-block">1406121651</Text>
                </div>
                <div className="fs-14 mt-24">
                    <Text className="fw-200 text-white-50">Bank BIC/SWIFT/Routing Number</Text>
                    <Text className="fw-500 fs-24 text-white-30 d-block">wf-135135</Text>
                </div>
                <div className="fs-14 mt-24">
                    <Text className="fw-200 text-white-50">Bank Name</Text>
                    <Text className="fw-500 fs-24 text-white-30 d-block">Singet</Text>
                </div>
                <div className="fs-14  mt-24">
                    <Text className="fw-200 text-white-50">Recipient Full Name</Text>
                    <Text className="fw-500 fs-24 text-white-30 d-block">John Doe</Text>
                </div>
                <ul className="fs-14 mt-24 text-white-30 pl-0 ml-16">
                    <li>Ensure that the account details are correct</li>
                    <li>Transaction can't be cancelled</li>
                </ul>
                <div className="d-flex my-36 agree-check">
                    <label>
                        <input type="checkbox" id="agree-check" />
                        <span for="agree-check" />
                    </label>
                    <Translate content="agree_to_suissebase" with={{ link }} component={Paragraph} className="fs-14 text-white-30 ml-16" style={{ flex: 1 }} />
                </div>
                <Translate content="confirm_btn_text" component={Button} size="large" block className="pop-btn mt-24" onClick={() => this.props.changeStep('step3')} />
                <Translate type="text" content="cancel" component={Button} size="large" block className="text-white-30 pop-cancel fw-400" onClick={() => this.props.changeStep('step1')} />
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
export default connect(connectStateToProps, connectDispatchToProps)(FaitdepositSummary);