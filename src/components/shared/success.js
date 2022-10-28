import React, { Component } from 'react';
import success from '../../assets/images/success.png';
import { Typography, Space, Button } from 'antd';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import apicalls from '../../api/apiCalls';
import PickerButton from 'antd/lib/date-picker/PickerButton';

class SuccessMsg extends Component {
    componentDidMount() {
        this.EventTrack();
    }
    EventTrack = () => {
        apicalls.trackEvent({ "Type": 'User', "Action": 'Buy Crypto success', "Username": this.props.member.userName, "customerId": this.props.member.id, "Feature": 'Buy', "Remarks": 'Buy Crypto success', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Buy Crypto' });
    }
    render() {
        const { Title, Paragraph, Text } = Typography;
        const { buyFinalRes: bd } = this.props.buyInfo;
        return (
            <>
                <div className="success-pop text-center">
                    <img src={success} className="confirm-icon" alt={"success"} />
                    <Translate content="success_msg" component={Title} className="text-white-30 fs-36 fw-200 mb-4" />
                    <Paragraph className="fs-14 text-white-30 fw-200"><Translate content="sucessText1" component={Text} className="fs-14 text-white-30 fw-200" /> {bd.tovalue} {bd.toWalletCode} <Translate content="sucessText2" className="fs-14 text-white-30 fw-200" component={Text} /></Paragraph>
                    {/* <Translate content="success_decr" component={Paragraph} className="fs-16 text-white-30 fw-200" /> */}
                    <Space direction="vertical" size="large" className='custom-back-btn '>
                        <Button content="return_to_buy" className="mt-36 pop-cancel" style={{width: "150px", height: "46px"}} component={Link} onClick={() => this.props.changeStep("step1")} />
                    </Space>
                </div>
            </>
        );
    }
}
const connectStateToProps = ({ buySell, userConfig, buyInfo }) => {
    return { buySell, member: userConfig.userProfileInfo, buyInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SuccessMsg);
