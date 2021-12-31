import React, { useEffect } from 'react';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { rejectWithdrawfiat, setWithdrawfiatenaable } from '../../reducers/sendreceiveReducer';
import success from '../../assets/images/success.png';
import apiCalls from '../../api/apiCalls';

const WithdrawalSuccess = ({ changeStep, dispatch, userProfileInfo, sendReceive }) => {
    const { Title, Paragraph } = Typography;
    const { withdrawFinalRes: fd } = sendReceive;
    useEffect(() => {
        successTrack();
    });
    const goBack = async () => {
        dispatch(rejectWithdrawfiat())
        dispatch(setWithdrawfiatenaable(true))
        changeStep('step1');

    }
    const successTrack = () => {
        apiCalls.trackEvent({ "Type": 'User', "Action": 'Withdraw Fiat success page view', "Username": userProfileInfo?.userName, "MemeberId": userProfileInfo?.id, "Feature": 'Withdraw Fiat', "Remarks": 'Withdraw Fiat success page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Withdraw Fiat' });
    }
    return (
        <>
            <div className="success-pop text-center mb-24">
                <img src={success} className="confirm-icon" alt={"success"} />
                <Translate content="success_msg" component={Title} className="text-white-30 fs-36 fw-200 mb-4" />
                <Paragraph className="fs-14 text-white-30 fw-200"><Translate content="sucessText1" component={Text} className="fs-14 text-white-30 fw-200" /> {fd.totalValue} {fd.walletCode} <Translate content="sucessText3" component={Text} className="fs-14 text-white-30 fw-200" /></Paragraph>
                {/* <Translate className="fs-30 mb-4 d-block text-white-30" content="withdrawal_success" component={Title} /> */}
                <Link onClick={() => goBack()} className="f-16 mt-16 text-underline text-white-30">{apiCalls.convertLocalLang('Back_to_Withdrawfiat')}</Link>
            </div>
        </>
    )
}

const connectStateToProps = ({ userConfig, sendReceive }) => {
    return { userConfig: userConfig.userProfileInfo, sendReceive }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        dispatch
    }

}
export default connect(connectStateToProps, connectDispatchToProps)(WithdrawalSuccess);