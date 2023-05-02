import React, { useEffect } from 'react';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { rejectWithdrawfiat, setWithdrawfiatenaable ,setClearAmount} from '../../reducers/sendreceiveReducer';
import success from '../../assets/images/success.svg';
import apiCalls from '../../api/apiCalls';

const WithdrawalSuccess = ({ changeStep, dispatch, userProfileInfo, sendReceive,amountReset }) => {
    const { Title, Paragraph, Text } = Typography;
    const { withdrawFinalRes: fd } = sendReceive;
    useEffect(() => {
        successTrack();
    });
    const goBack = async () => {
        dispatch(rejectWithdrawfiat())
        dispatch(setWithdrawfiatenaable(true))
        changeStep('step1');
        amountReset();
    }
   
    const successTrack = () => {
        apiCalls.trackEvent({ "Type": 'User', "Action": 'Withdraw Fiat success page view', "Username": userProfileInfo?.userName, "customerId": userProfileInfo?.id, "Feature": 'Withdraw Fiat', "Remarks": 'Withdraw Fiat success page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Withdraw Fiat' });
    }
    return (
        <>
            <div className="success-pop text-center mb-24">
                <img src={success} className="confirm-icon" alt={"success"} />
                <Translate content="success_msg" component={Title} className="" />
                <Paragraph className="fs-14 text-white-30 fw-200"><Translate content="sucessText1" component={Text} className="fs-14 text-white-30 fw-200" />{" "} {fd.totalValue}{" "} {fd.walletCode} <Translate content="sucessText3" component={Text} className="fs-14 text-white-30 fw-200" /></Paragraph>
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
        amountReset: () => {
            dispatch(setClearAmount())
        },

        dispatch
    }

}
export default connect(connectStateToProps, connectDispatchToProps)(WithdrawalSuccess);