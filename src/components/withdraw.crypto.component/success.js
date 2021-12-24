import React, { Component } from 'react';
import success from '../../assets/images/success.png';
import { Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
//import ConnectStateProps from '../../utils/state.connect';
import { connect } from "react-redux";
import { handleSendFetch, } from '../../reducers/sendreceiveReducer';
import apiCalls from '../../api/apiCalls';
class SuccessMsg extends Component {
    componentDidMount() {
        this.successTrack();
    }
    successTrack = () => {
        apiCalls.trackEvent({ "Type": 'User', "Action": 'Withdraw Crypto success page view', "Username": this.props.userProfileInfo?.userName, "MemeberId": this.props.userProfileInfo?.id, "Feature": 'Withdraw Crypto', "Remarks": 'Withdraw Crypto success page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Withdraw Crypto' });
    }
    render() {
        const { Title, Paragraph } = Typography;
        const { cryptoFinalRes: cd } = this.props.sendReceive;

        return (
            <>
                <div className="success-pop text-center">
                    <img src={success} className="confirm-icon" alt={"success"} />
                    <Translate content="success_msg" component={Title} className="text-white-30 fs-36 fw-200 mb-4" />
                    <Paragraph className="fs-14 text-white-30 fw-200">Your order has been placed successfully, {cd.totalValue} {cd.walletCode} amount will be debited from your wallet.</Paragraph>
                    {/* <Translate content="success_msg" component={Title} className="text-white-30 fs-36 fw-200 mb-4" />
                    <Translate content="success_decr" component={Paragraph} className="fs-16 text-white-30 fw-200" /> */}
                    <Space direction="vertical" size="large">
                        <Translate content="crypto_with_draw_success" className="f-16 text-white-30 mt-16 text-underline" component={Link} onClick={() => { this.props.onBackCLick("step1"); this.props.dispatch(handleSendFetch({ key: "cryptoWithdraw", activeTab: 2 })) }} />
                    </Space>
                </div>
            </>
        );
    }
}
const connectStateToProps = ({ sendReceive, userConfig }) => {
    return {
        sendReceive,
        userProfile: userConfig.userProfileInfo,
        trackAuditLogData: userConfig.trackAuditLogData
    };
};
export default connect(connectStateToProps, null)(SuccessMsg);
