import React from 'react';
import { Typography } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { rejectWithdrawfiat, setWithdrawfiatenaable } from '../../reducers/sendreceiveReducer';
import success from '../../assets/images/success.png';
import apicalls from '../../api/apiCalls';  

const WithdrawalSuccess = ({ changeStep, dispatch }) => {
    const { Title } = Typography;
    const goBack = async () => {
        dispatch(rejectWithdrawfiat())
        dispatch(setWithdrawfiatenaable(true))
        changeStep('step1');
    }

    return (
        <>
            <div className="success-pop text-center mb-24">
                <img src={success} className="confirm-icon" alt={"success"}/>
                <Translate className="fs-30 mb-4 d-block text-white-30" content="withdrawal_success" component={Title} />
                <Link onClick={() => goBack()} className="f-16 mt-16 text-underline text-green">{apicalls.convertLocalLang('Back_to_Withdraw')}<span className="icon md diag-arrow ml-4" /></Link>
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