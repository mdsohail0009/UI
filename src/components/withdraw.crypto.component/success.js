import React, { Component } from 'react';
import success from '../../assets/images/success.png';
import { Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import connectStateProps from '../../utils/state.connect';
import { handleSendFetch } from '../../reducers/sendreceiveReducer';
class SuccessMsg extends Component {
    render() {
        const { Title, Paragraph } = Typography;
        return (
            <>
                <div className="success-pop text-center">
                    <img src={success} className="confirm-icon" alt={"success"}/>
                    <Translate content="success_msg" component={Title} className="text-white-30 fs-36 fw-200 mb-4" />
                    <Translate content="success_decr" component={Paragraph} className="fs-16 text-white-30 fw-200" />
                    <Space direction="vertical" size="large">
                        <Translate content="crypto_with_draw_success" className="f-16 text-white-30 mt-16 text-underline" component={Link} onClick={() => {this.props.onBackCLick("step1");this.props.dispatch(handleSendFetch({key:"cryptoWithdraw",activeTab:2}))}} />
                    </Space>
                </div>
            </>
        );
    }
}
export default connectStateProps(SuccessMsg);
