import React, { Component } from 'react';
import { Typography, Image,Button } from 'antd';
import { connect } from "react-redux";
import success from '../../assets/images/success.svg';
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
        const { Title } = Typography;

        return (
            <>
                <div className="custom-declaraton send-success"> <div className="success-pop text-center declaration-content">
       <Image  preview={false} src={success}  className="confirm-icon" />
       <Title level={2} className="successsubtext cust-heightmbl">Your transaction has been processed successfully</Title>
       
       <Translate content="fiat_transfer_success" className=" cust-cancel-btn" component={Button} size="large" onClick={() => { this.props?.back() }}  />
   </div>
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
