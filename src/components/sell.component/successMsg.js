import React, { Component } from 'react';
import success from '../../assets/images/success.svg';
import { Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import { setStep, setSellHeaderHide, setSelectedSellCoin } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import apicalls from '../../api/apiCalls';

class SuccessMsg extends Component {
    componentDidMount() {
        this.EventTrack();
    }
    EventTrack = () => {
        apicalls.trackEvent({ "Type": 'User', "Action": 'Sell Crypto success', "Username": this.props.member.userName, "customerId": this.props.member.id, "Feature": 'Sell', "Remarks": 'Sell Crypto success', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Sell Crypto' });
    }
    onSellCancel = () => {
        this.props.dispatch(setSellHeaderHide(true));
        this.props.dispatch(setSelectedSellCoin(false));
        this.props.changeStep("step1");
    }
    render() {
        const { Title, Paragraph, Text } = Typography;
        const { sellFinalRes: sd } = this.props.sellInfo;
        return (
            <>
                <div className="success-pop text-center">
                    <img src={success} className="confirm-icon" alt={"success"} />
                    <Translate content="success_msg" component={Title} className="" />
                    <Paragraph className="fs-14 text-white-30 fw-200"><Translate content="sucessText1" component={Text} className="fs-14 text-white-30 fw-200" /> {sd.tovalue} {sd.toWalletCode} <Translate content="sucessText2" component={Text} className="fs-14 text-white-30 fw-200" /></Paragraph>
                    {/* <Translate content="success_decr" component={Paragraph} className="fs-16 text-white-30 fw-200" /> */}
                    <Space direction="vertical" size="large">
                        <Translate content="return_to_sell" className="f-16 text-white-30 mt-16 text-underline" component={Link} onClick={() => this.onSellCancel()} />
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
        },
        dispatch,
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SuccessMsg);
