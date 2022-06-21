import React, { Component } from 'react';
import success from '../../assets/images/success.png';
import { Typography, Space } from 'antd';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import {setStepcode,setTransforObj} from '../../reducers/tranfor.Reducer'
import { connect } from 'react-redux';
import apicalls from '../../api/apiCalls';

class TransforSuccessMsg extends Component {
    componentDidMount() {
        this.EventTrack();
    }
    EventTrack = () => {
        apicalls.trackEvent({ "Type": 'User', "Action": 'Transfor success', "Username": this.props.member.userName, "MemeberId": this.props.member.id, "Feature": 'Transfor', "Remarks": 'Transfor success', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Transfor' });
    }
    render() {
        const { Title, Paragraph, Text } = Typography;
        return (
            <>
                <div className="success-pop text-center pt-24">
                    <img src={success} className="confirm-icon" alt={"success"} />
                    <Translate content="success_msg" component={Title} className="text-white-30 fs-36 fw-200 mb-4" />
                    <Paragraph className="fs-14 text-white-30 fw-200"><Translate content="sucessText1" component={Text} className="fs-14 text-white-30 fw-200" /> {this.props.transforObj?.transferAmount} {this.props.transforObj?.walletCode} <Translate content="sucessText2" className="fs-14 text-white-30 fw-200" component={Text} /></Paragraph>
                    {/* <Translate content="success_decr" component={Paragraph} className="fs-16 text-white-30 fw-200" /> */}
                    <Space direction="vertical" size="large">
                        <Translate content="return_to_transfor" className="f-16 text-white-30 mt-16 text-underline" component={Link} onClick={() => {this.props.changeStep("tranforcoin");this.props.clearData(null)}} />
                    </Space>
                </div>
            </>
        );
    }
}
const connectStateToProps = ({ userConfig, TransforStore }) => {
    return { member: userConfig.userProfileInfo,transforObj:TransforStore.transforObj }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStepcode(stepcode))
        },
        clearData: (stepcode) => {
            dispatch(setTransforObj(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(TransforSuccessMsg);
