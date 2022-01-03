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
        apicalls.trackEvent({ "Type": 'User', "Action": 'Sell Crypto success', "Username": this.props.member.userName, "MemeberId": this.props.member.id, "Feature": 'Sell', "Remarks": 'Sell Crypto success', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Sell Crypto' });
    }
    render() {
        const { Title, Paragraph } = Typography;
        const { sellFinalRes: sd } = this.props.sellInfo;
        return (
            <>
                <div className="success-pop text-center">
                    <img src={success} className="confirm-icon" alt={"success"} />
                    <Translate content="success_msg" component={Title} className="text-white-30 fs-36 fw-200 mb-4" />
                    <Paragraph className="fs-14 text-white-30 fw-200">Your order has been placed successfully, {sd.tovalue} {sd.toWalletCode} has been added into your wallet. </Paragraph>
                    {/* <Translate content="success_decr" component={Paragraph} className="fs-16 text-white-30 fw-200" /> */}
                    <Space direction="vertical" size="large">
                        <Translate content="return_to_sell" className="f-16 text-white-30 mt-16 text-underline" component={Link} onClick={() => this.props.changeStep("step1")} />
                    </Space>
                </div>
            </>
        );
    }
}
const connectStateToProps = ({ buySell, userConfig, sellInfo }) => {
    return { buySell, member: userConfig.userProfileInfo, sellInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SuccessMsg);