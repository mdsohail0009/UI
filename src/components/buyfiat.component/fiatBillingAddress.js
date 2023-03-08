import React, { Component } from 'react';
import { Typography, Button } from 'antd';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';

class FiatBillingAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
   

    render() {
        const { Title, Text, Paragraph } = Typography;
        return (
            <>
                <Translate className="fs-36 text-white-30 fw-200 mb-36" level={3} content="billing_address" component={Title} />
                <div className="billing-address text-white fs-16 fw-200">
                    <Translate className="mb-16 d-block text-white fs-16 fw-200" content="delivery_address" component={Text} />
                    <Translate className="mb-16 text-white fs-16 fw-200" content="buy_sell_address" component={Paragraph} />
                </div>
                <Translate size="large" block className="pop-btn" style={{ marginTop: '190px' }} onClick={() => this.props.changeStep('step3')} content="confirm_billing_address" component={Button} />
                <Translate type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" onClick={() => this.props.changeStep('step1')} block content="cancel" component={Button} />
            </>
        )
    }
}
const connectStateToProps = ({ buySell }) => {
    return { buySell }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(FiatBillingAddress);
