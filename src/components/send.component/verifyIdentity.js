import React, { Component } from 'react';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';

class VerifyIDentity extends Component {
    state = {}
    render() {
        const { Title, Paragraph } = Typography;
        return (
            <>
                <Title className="text-white-30 fs-36 fw-200 mb-8">Let's get you verified</Title>
                <Paragraph className="fs-16 text-white-30 fw-300">Suissebase.ch would need to confirm your identity a process is powered by our partner.</Paragraph>
                <div className="d-flex mt-36 mb-16">
                    <span className="icon md card mt-4" />
                    <div className="ml-16">
                        <Paragraph className="fs-16 fw-600 text-white-30 mb-0">Prepare a valid document</Paragraph>
                        <Paragraph className="fs-16 fw-300 text-white-30">Make sure it's not expired of physically damaged</Paragraph>
                    </div>
                </div>
                <div className="d-flex mb-36">
                    <span className="icon md phone mt-4" />
                    <div className="ml-16">
                        <Paragraph className="fs-16 fw-600 text-white-30 mb-0">User a smartphone</Paragraph>
                        <Paragraph className="fs-16 fw-300 text-white-30">You need a smartphone in order to continue</Paragraph>
                    </div>
                </div>
                <Paragraph className="fs-16 text-white-30 fw-300 pr-30">Read more about your personal data processing <Link className="text-yellow">Privacy Policy</Link>. Don’t have a smartphone? <Link className="text-white-30"><u>Continue with your current device</u></Link></Paragraph>
            </>
        );
    }
}

export default VerifyIDentity;