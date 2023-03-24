import React, { Component } from 'react';
import { Typography, Image,Button } from 'antd';
import { connect } from "react-redux";
import alertIcon from '../../assets/images/pending.png';
import Translate from 'react-translate-component';
import apiCalls from '../../api/apiCalls';
class DelcarationForm extends Component {
    componentDidMount() {
        console.log(this.props)
        this.successTrack();
    }
    successTrack = () => {
        apiCalls.trackEvent({ "Type": 'User', "Action": 'Withdraw Crypto success page view', "Username": this.props.userProfileInfo?.userName, "customerId": this.props.userProfileInfo?.id, "Feature": 'Withdraw Crypto', "Remarks": 'Withdraw Crypto success page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Withdraw Crypto' });
    }
    render() {
        const { Title, Text } = Typography;

        return (
            <>
                 <div className="custom-declaraton"> <div className="success-pop text-center declaration-content">
                <Image preview={false} src={alertIcon} className="confirm-icon" />
                <Title level={2} className="success-title">Declaration form sent successfully</Title>
                <Text className="successsubtext">{`Declaration form has been sent to ${this.props.userProfile?.email}. 
               Please sign using link received in email to whitelist your address. Please note that any transactions regarding this whitelist will only be processed once your whitelisted address has been approved. `}</Text>
                
                <div className="thank-you-btn">
                    
                <Translate content="fiat_transfer_success" className=" cust-cancel-btn" component={Button} size="large" onClick={() => { this.props?.back() }} />
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
