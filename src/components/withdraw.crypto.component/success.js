import React, { Component } from 'react';
import success from '../../assets/images/success.png';
import { Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import { connect } from "react-redux";
import { handleSendFetch,hideSendCrypto,setSendCrypto} from '../../reducers/sendreceiveReducer';
import apiCalls from '../../api/apiCalls';
class SuccessMsg extends Component {
    componentDidMount() {
        this.successTrack();
    }
    successTrack = () => {
        apiCalls.trackEvent({ "Type": 'User', "Action": 'Withdraw Crypto success page view', "Username": this.props.userProfileInfo?.userName, "customerId": this.props.userProfileInfo?.id, "Feature": 'Withdraw Crypto', "Remarks": 'Withdraw Crypto success page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Withdraw Crypto' });
    }
    onBackSend = () => {
        this.props.dispatch(hideSendCrypto(false));
        this.props.dispatch(setSendCrypto(true));
        //this.props.dispatch(setWithdrawfiatenaable(true));
        this.props.onBackCLick("step1");
         this.props.dispatch(handleSendFetch({ key: "cryptoWithdraw", activeTab: 2 }))
    }
    render() {
        const { Title, Paragraph, Text } = Typography;
        const { cryptoFinalRes: cd } = this.props.sendReceive;

        return (
            <>
                <div className="success-pop text-center mt-36">
                    <img src={success} className="confirm-icon" alt={"success"} />
                    <Translate content="success_msg" component={Title} className="text-white-30 fs-36 fw-200 mb-4" />
                    <Paragraph className="fs-14 text-white-30 fw-200"><Translate content="sucessText1" component={Text} className="fs-14 text-white-30 fw-200" /> {cd.totalValue} {cd.walletCode} <Translate content="sucessText3" component={Text} className="fs-14 text-white-30 fw-200" /></Paragraph>
                    <Space direction="vertical" size="large">
                        <Translate content="crypto_with_draw_success" className="f-16 text-white-30 mt-16 text-underline" component={Link} onClick={() => { this.onBackSend() }} />
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
