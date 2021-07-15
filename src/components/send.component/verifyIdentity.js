import React, { Component } from 'react';
import { Typography, Input, Button, Select } from 'antd';
import { Link } from 'react-router-dom';
import sacnner from '../../assets/images/sacnner.png';
import Translate from 'react-translate-component';
import connectStateProps from '../../utils/state.connect';
import { setStep } from '../../reducers/sendreceiveReducer';

const { Option } = Select;
class VerifyIDentity extends Component {
    state = {}
    render() {
        const { Title, Paragraph, Text } = Typography;
        return (
            <div className="verify-container auto-scroll">
                <Translate content="lets_verified" component={Title} className="text-white-30 fs-36 fw-200 mb-8" />
                <Translate content="confirm_your_identity" component={Paragraph} className="fs-16 text-white-30 fw-300" />
                <div className="d-flex mt-36 mb-16">
                    <span className="icon md card mt-4" />
                    <div className="ml-16">
                        <Translate content="prepare_valid" component={Paragraph} className="fs-16 fw-600 text-white-30 mb-0" />
                        <Translate content="make_sure" component={Paragraph} className="fs-16 fw-300 text-white-30" />
                    </div>
                </div>
                <div className="d-flex">
                    <span className="icon md phone mt-4" />
                    <div className="ml-16">
                        <Translate content="user_smartphone" component={Paragraph} className="fs-16 fw-600 text-white-30 mb-0" />
                        <Translate content="you_need_smartphone" component={Paragraph} className="fs-16 fw-300 text-white-30" />
                    </div>
                </div>
                <div className="verify-options mb-36">
                    <Translate content="qption1" component={Paragraph} className="fs-16 fw-600 text-white-30 mb-0" />
                    <Translate content="qption1_answer" component={Paragraph} className="fs-16 fw-300 text-white-30" />
                    <div className="text-center">
                        <img src={sacnner} alt="" className="confirm-icon" />
                    </div>
                    <Paragraph className="fs-16 fw-600 text-white-30 mb-0">Option 2: Send link via SMS</Paragraph>
                    <Paragraph className="fs-16 fw-300 text-white-30">We’ll text a secure link to your mobile at no extra cost.</Paragraph>
                    <form className="form">
                        <Select defaultValue="philippines" className="cust-input" style={{ width: '100%' }} bordered={false} showArrow={false} suffixIcon={<span className="icon md uparrow" />}>
                            <Option value="philippines">Philippines(+63)</Option>
                            <Option value="india">India(+91)</Option>
                        </Select> 
                        <Input className="cust-input" placeholder="Your phone number" />
                        <Button size="large" block className="pop-btn" onClick={() => this.props.dispatch(setStep("step1"))}>Next</Button>
                    </form>
                </div>
                <Paragraph className="fs-16 text-white-30 fw-300 pr-30">Read more about your personal data processing <Link className="text-defaultylw text-underline">Privacy Policy</Link>. Don’t have a smartphone? <Link className="text-white-30"><u>Continue with your current device</u></Link></Paragraph>
            </div>
        );
    }
}

export default connectStateProps(VerifyIDentity);