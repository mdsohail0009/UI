import React, { Component } from 'react';
import { Drawer, Typography, Input, Button, label, Radio } from 'antd';
import { DeleteOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import Paragraph from 'antd/lib/skeleton/Paragraph';
import sacnner from '../../assets/images/sacnner.png';

class WithdrawAddress extends Component {
    state = {}
    render() {
        const { Paragraph, Text } = Typography;
        return (
            <>
                <div className="d-flex justify-content align-center">
                    <Radio.Group defaultValue="half" buttonStyle="outline" className="default-radio" >
                        <Radio.Button value="min" className="fs-16 fw-400">Assets</Radio.Button>
                        <Radio.Button value="half" className="fs-16 fw-400">Address</Radio.Button>
                    </Radio.Group>
                    <div className="icon-delete c-pointer">
                        <DeleteOutlined />
                    </div>
                </div>
                <form className="form">
                    <label className="input-label text-secondary">To</label>
                    <Input className="cust-input text-white-50 fw-300" defaultValue="Mobile,email or address" suffix={<img src={sacnner} className="c-pointer" style={{ width: '20px' }} onClick={() => this.props.changeStep('step7')} />} />
                    <label className="input-label  text-secondary">Note</label>
                    <Input className="cust-input text-white-50  fw-300" defaultValue="Add an optional Note" />

                </form>
                <Translate content="confirm_btn_text" component={Button} size="large" block className="pop-btn" style={{ marginTop: '180px' }} onClick={() => this.props.changeStep('step5')} />
                <Translate type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block content="cancel" onClick={() => this.props.changeStep('step1')} component={Button} />
            </>
        );
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
export default connect(connectStateToProps, connectDispatchToProps)(WithdrawAddress);
