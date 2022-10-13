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
        apicalls.trackEvent({ "Type": 'User', "Action": 'Sell Crypto success', "Username": this.props.member.userName, "customerId": this.props.member.id, "Feature": 'Sell', "Remarks": 'Sell Crypto success', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Sell Crypto' });
    }
    render() {
        const { Title, Paragraph, Text } = Typography;
        const { sellFinalRes: sd } = this.props.sellInfo;
        return (
            <>
                <div className="success-pop text-center">
                    <img src={success} className="confirm-icon" alt={"success"} />
                    <Translate content="success_msg" component={Title} className="text-white-30 fs-36 fw-200 mb-4" />
                    <Paragraph className="fs-14 text-white-30 fw-200"><Translate content="sucessText1" component={Text} className="fs-14 text-white-30 fw-200" /> {sd.tovalue} {sd.toWalletCode} <Translate content="sucessText2" component={Text} className="fs-14 text-white-30 fw-200" /></Paragraph>
                    {/* <Translate content="success_decr" component={Paragraph} className="fs-16 text-white-30 fw-200" /> */}
                    <Space direction="vertical" size="large">
                        <Translate content="return_to_sell" className="ant-btn mt-36 pop-cancel" style="width:150px; height:46px"component={Link} onClick={() => this.props.changeStep("step1")} />
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
