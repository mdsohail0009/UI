import React, { useEffect } from 'react';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { rejectWithdrawfiat, setWithdrawfiatenaable } from '../../reducers/sendreceiveReducer';
import success from '../../assets/images/success.png';
import apiCalls from '../../api/apiCalls';  

const WithdrawalSuccess = ({ changeStep, dispatch,userProfileInfo }) => {
    const { Title } = Typography;
    useEffect(() => {
        successTrack();
      });
    const goBack = async () => {
        dispatch(rejectWithdrawfiat())
        dispatch(setWithdrawfiatenaable(true))
        changeStep('step1');
        
    }
    const successTrack = () => {
        apiCalls.trackEvent({ "Type": 'User', "Action": 'Withdraw Fiat success page view', "Username":userProfileInfo?.userName, "MemeberId": userProfileInfo?.id, "Feature": 'Withdraw Fiat', "Remarks": 'Withdraw Fiat success page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Withdraw Fiat' });
    }
    return (
        <>
            <div className="success-pop text-center mb-24">
                <img src={success} className="confirm-icon" alt={"success"}/>
                <Translate className="fs-30 mb-4 d-block text-white-30" content="withdrawal_success" component={Title} />
                <Link onClick={() => goBack()} className="f-16 mt-16 text-underline text-green">{apiCalls.convertLocalLang('Back_to_Withdraw')}<span className="icon md diag-arrow ml-4" /></Link>
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