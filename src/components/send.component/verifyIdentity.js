import React, { Component } from 'react';
import { Typography } from 'antd';

class VerifyIDentity extends Component {
    state = {}
    render() {
        const { Title, Paragraph } = Typography;
        return (
            <>
                <Title className="text-white-30 fs-36 fw-200 mb-8">Let's get you verified</Title>
                <Paragraph className="fs-16 text-secondary">Suissebase.ch would need to confirm your identity a process is powered by our partner.</Paragraph>
                <div>
                    <span className="icon lg settings" />
                    <div>
                        <Paragraph>Prepare a valid document</Paragraph>
                        <Paragraph>Make sure it's not expired of physically damaged</Paragraph>
                    </div>
                </div>
            </>
        );
    }
}

export default VerifyIDentity;