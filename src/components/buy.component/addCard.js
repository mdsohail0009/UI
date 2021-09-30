import React, { Component } from 'react';
import { Typography, Input, Button } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';

class addCard extends Component {
    state = {}
    render() {
        const { Text } = Typography;
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
                        <Translate className="text-underline text-white fs-16 fw-200" onClick={() => this.props.changeStep('step7')} content="type_billing_address" component={Link} />
                    </div>
                </form>
                <Translate content="confirm_btn_text" component={Button} size="large" block className="pop-btn" style={{ marginTop: '180px' }} onClick={() => this.props.changeStep('success')} />
            </>
        );
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
export default connect(connectStateToProps, connectDispatchToProps)(addCard);
