import React, { Component } from 'react';
import success from '../../assets/images/success.png';
import { Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import apicalls from '../../api/apiCalls';

class SuccessMsg extends Component {
    componentDidMount() {
        this.EventTrack();
    }
    EventTrack = () => {
        apicalls.trackEvent({ "Type": 'User', "Action": 'Buy Crypto success', "Username": this.props.member.userName, "MemeberId": this.props.member.id, "Feature": 'Buy', "Remarks": 'Buy Crypto success', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Buy Crypto' });
    }
    render() {
        const { Title, Paragraph } = Typography;
        return (
            <>
                <div className="success-pop text-center">
                    <img src={success} className="confirm-icon" alt={"success"} />
                    <Translate content="success_msg" component={Title} className="text-white-30 fs-36 fw-200 mb-4" />
                    <Translate content="success_decr" component={Paragraph} className="fs-16 text-white-30 fw-200" />
                    <Space direction="vertical" size="large">
                        <Translate content="return_to_buy_sell" className="f-16 text-white-30 mt-16 text-underline" component={Link} onClick={() => this.props.changeStep("step1")} />
                    </Space>
                </div>
            </>
        );
    }
}
const connectStateToProps = ({ buySell, userConfig }) => {
    return { buySell, member: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SuccessMsg);
