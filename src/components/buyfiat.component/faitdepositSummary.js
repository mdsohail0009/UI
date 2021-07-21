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
                <div className="pay-list fs-14 mt-36">
                    <Translate className="fw-400 text-white" content="EUR_amount" component={Text} />
                    <Text className="fw-300 text-white-30">0.00</Text>
                </div>
                <div className="pay-list fs-14">
                    <Translate className="fw-400 text-white" content="Fee" component={Text} />
                    <Text className="fw-300 text-white-30">0.00 EUR</Text>
                </div>
                <div className="pay-list fs-14">
                    <Translate className="fw-400 text-white" content="Amount_to_pay" component={Text} />
                    <Text className="fw-300 text-white-30">0.00 EUR</Text>
                </div>
                <div className="d-flex my-36 agree-check">
                    <label>
                        <input type="checkbox" id="agree-check" />
                        <span for="agree-check" />
                    </label>
                    <Translate content="agree_to_suissebase" with={{ link }} component={Paragraph} className="fs-14 text-white-30 ml-16" style={{ flex: 1 }} />
                </div>
                <Translate content="place_an_order" component={Button} size="large" block className="pop-btn mt-36" onClick={() => this.props.changeStep('step1')} />
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