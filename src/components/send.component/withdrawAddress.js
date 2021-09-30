import React, { Component } from 'react';
import { Typography, Input, Button, Radio } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';

class WithdrawAddress extends Component {
    state = {}
    render() {
        const { Paragraph, Text } = Typography;
        return (
            <>
                <div className="d-flex justify-content align-center">
                    <Radio.Group defaultValue="half" buttonStyle="outline" className=" default-radio" >
                        <Translate value="min" content="assets" className="fs-16 fw-400" component={Radio.Button} onClick={() => this.props.changeStep('step2')} />
                        <Translate value="half" content="address" className="fs-16 fw-400" component={Radio.Button} />
                    </Radio.Group>
                    <div className="icon-delete c-pointer">
                        <DeleteOutlined />
                    </div>
                </div>
                <form className="form">
                    <label className="input-label text-secondary">To</label>
                    <Input className="cust-input text-white-50 fw-300" placeholder="Mobile,email or address" suffix={<span className="icon md qrcode c-pointer" onClick={() => this.props.changeStep('step3')} />} />
                    <div className="p-relative">
                        <Translate content="note" className="input-label text-secondary" component={Paragraph} />
                        <Input className="cust-input text-white-50  fw-300" placeholder="Add an optional Note" />
                        <Translate content="card_supported" className="fs-12 error-text" component={Text} />
                    </div>

                </form>
                <Translate content="confirm_now" component={Button} size="large" block className="pop-btn" style={{ marginTop: '180px' }} onClick={() => this.props.changeStep('step5')} />
                <Translate type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block content="cancel" onClick={() => this.props.changeStep('step1')} component={Button} />
            </>
        );
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
export default connect(connectStateToProps, connectDispatchToProps)(WithdrawAddress);
