import React, { Component } from 'react';
import { Typography, Image,Button } from 'antd';
import { connect } from "react-redux";
import alertIcon from '../../assets/images/pending.png';
import Translate from 'react-translate-component';
import { handleSendFetch,hideSendCrypto,setSendCrypto} from '../../reducers/sendreceiveReducer';
import apiCalls from '../../api/apiCalls';
class DelcarationForm extends Component {
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
        const { Title, Text } = Typography;

        return (
            <>
                 <div className="custom-declaraton"> <div className="success-pop text-center declaration-content">
                <Image preview={false} src={alertIcon} className="confirm-icon" />
                <Title level={2} className="success-title">Declaration form sent successfully</Title>
                <Text className="successsubtext">{`Declaration form has been sent to ${this.props.userProfile?.email}. 
                Please review and sign the document in your email to whitelist your address.
                Please note that your withdrawal will only be processed once the address has been approved by compliance. `}</Text>
                
                <div className="thank-you-btn">
                    
                <Translate content="crypto_with_draw_success" className=" cust-cancel-btn" component={Button} size="large" onClick={() => { this.onBackSend() }} />
                    </div>
            </div></div>
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
export default connect(connectStateToProps, null)(DelcarationForm);
