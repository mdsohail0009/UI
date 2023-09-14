import React, { Component } from 'react';
import { Typography, Image,Button } from 'antd';
import { connect } from "react-redux";
import alertIcon from '../../assets/images/pending.png';
import Translate from 'react-translate-component';
import { handleSendFetch,hideSendCrypto,setSendCrypto} from '../../reducers/sendreceiveReducer';
import apiCalls from '../../api/apiCalls';
import success from '../../assets/images/success.svg'
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
                 <div className="custom-declaraton"> 
                {process.env.REACT_APP_ISDOCUSIGN == "false" &&<div className="success-pop text-center declaration-content">
                <Image preview={false} src={alertIcon} className="confirm-icon" />
                <Title level={2} className="success-title">Declaration form sent successfully</Title>
                <Text className="successsubtext">{`Declaration form has been sent to ${this.props.userProfile?.email}. 
               Please sign using link received in email to whitelist your address. Please note that any transactions regarding this whitelist will only be processed once your whitelisted address has been approved. `}</Text>
                
                <div className="thank-you-btn">
                    
                <Translate content="crypto_with_draw_success" className=" cust-cancel-btn" component={Button} size="large" onClick={() => { this.onBackSend() }} />
                    </div>
                 </div> || <div className="success-pop text-center declaration-content">
            <Image src={success} className="confirm-icon" alt={"success"} preview={false} />
            <Title level={2} className="success-title">Address saved successfully</Title>
            <p className="text-white">Please note that any transactions regarding this whitelist will only be processed once your whitelisted address has been approved</p>
		    <div className="send-cypto-summary"> <Translate content="crypto_with_draw_success" className="cust-cancel-btn send-crypto-btn" component={Button} onClick={this.onBackSend} /></div>
            </div>}
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
export default connect(connectStateToProps, null)(DelcarationForm);
