import React, { Component } from 'react';
import success from '../../assets/images/success.svg';
import { Typography,Button } from 'antd';
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
        this.props.onBackCLick("step1");
         this.props.dispatch(handleSendFetch({ key: "cryptoWithdraw", activeTab: 2 }))
    }
    render() {
        const { Title, Paragraph, Text } = Typography;
        const { cryptoFinalRes: cd } = this.props.sendReceive;

        return (
            <>
                <div className="success-pop text-center sell-success">
                    <img src={success} className="confirm-icon" alt={"success"} />
                    <Translate content="success_msg" component={Title} className="success-title" />
                    <Paragraph className="successsubtext cust-heightmbl"><Translate content="sucessText1" component={Text} className="successsubtext" />{" "} {cd.totalValue}{" "} {cd.walletCode} <Translate content="sucessText3" component={Text} className="successsubtext" /></Paragraph>
                  <Translate content="crypto_with_draw_success" className=" cust-cancel-btn crypto-btn-mobile" component={Button} size="large" onClick={() => { this.onBackSend() }} />
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
