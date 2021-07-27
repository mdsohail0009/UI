import React, { Component } from 'react';
import success from '../../assets/images/success.png';
import { Typography } from 'antd';
import Translate from 'react-translate-component';
import connectStateProps from '../../utils/state.connect';

class SuccessMessage extends Component {
    render() {
        const { Title, Paragraph, Text } = Typography;
        return (
            <>
                <div className="success-pop text-center">
                    <img src={success} className="confirm-icon" />
                    <Translate className="text-white-30 fs-36 fw-200 mb-4" content="transaction_submitted" component={Title} />
                    {/* <Translate component={Paragraph} className="fs-16 text-white-30 fw-200 mb-36" content="swapped_btc" /> */}
                    {/* <Space direction="vertical" size="large">
                        <Link onClick={() => this.props.dispatch(setStep("step1"))} className="f-16 text-white-30 mt-16 text-underline">View on BscScan<span className="icon md diag-arrow ml-4" /></Link>
                    </Space> */}
                </div>
            </>
        );
    }
}

export default connectStateProps(SuccessMessage);