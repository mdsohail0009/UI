import React, { Component } from 'react';
import { Drawer, Typography, Input, Button, label } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buyFiatReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import Paragraph from 'antd/lib/skeleton/Paragraph';

class addCard extends Component {
    state = {}
    render() {
        const { Paragraph, Text } = Typography;
        return (
            <>
                <form className="form">
                    <Translate className="input-label" content="name_on_card" component={Text} />
                    <Input className="cust-input" defaultValue="Michael Quiapos" />
                    <div className="p-relative">
                        <Translate className="input-label" content="card_number" component={Text} />
                        <Input className="cust-input" defaultValue="5443 84000 0902 5339" />
                        <Text className="error-text fs-12 text-error">Card type not supported</Text>
                    </div>
                    <div className="d-flex justify-content align-center">
                        <div className="mr-16 ">
                            <Translate className="input-label" content="expiry" component={Text} />
                            <div className="expiry-input">
                                <Input placeholder="MM" maxLength="2" bordered={false} className="fs-16 text-white-30 text-right" />/
                                <Input placeholder="YY" maxLength="2" bordered={false} className="fs-16 text-white-30" />
                            </div>
                        </div>
                        <div className="ml-16">
                            <Translate className="input-label" content="cvv" component={Text} />
                            <Input className="cust-input" defaultValue="544" />
                        </div>
                    </div>
                    <div className="text-center mt-16">
                        <Translate className="text-white fs-16 c-pointer text-underline" content="type_billing_address" component={Link} onClick={() => this.props.changeStep("step6")} />
                    </div>
                </form>
                <Translate content="confirm_btn_text" component={Button} size="large" block className="pop-btn" style={{ marginTop: '180px' }} onClick={() => this.props.changeStep("confirm")} />
                <Translate content="cancel" component={Button} type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block onClick={() => this.props.changeStep("step1")} />
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
export default connect(connectStateToProps, connectDispatchToProps)(addCard);
