import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import LiveNessSumsub from '../sumSub.component/liveness'
import { withdrawSave } from '../../api/apiServer';
import { fetchDashboardcalls } from '../../reducers/dashboardReducer';
import { rejectWithdrawfiat } from '../../reducers/sendreceiveReducer';
import SuccessMsg from '../withdraw.crypto.component/success';

const WithdrawalLive = ({ userConfig, sendReceive, changeStep, dispatch, onCancel }) => {
  const [faceCapture, setFaceCapture] = useState(false);
  const [livefacerecognization, setLivefacerecognization] = useState({});
  const [isWithdrawSuccess, setIsWithdrawSuccess] = useState(false);
  const [isLoding, setIsLoding] = useState(false);
  useEffect(() => { setFaceCapture(false) }, []);
  const saveWithdrwal = async () => {
    setIsLoding(true)
    let saveObj = sendReceive.withdrawFiatObj;
    saveObj.livefacerecognization = livefacerecognization?.applicantActionid;
    this.props.trackAuditLogData.Action = 'Save';
    this.props.trackAuditLogData.Remarks = (saveObj?.totalValue + ' ' + saveObj.walletCode + ' withdraw.')
    saveObj.info = JSON.stringify(this.props.trackAuditLogData)
    let withdrawal = await withdrawSave(saveObj)
    if (withdrawal.ok) {
      dispatch(fetchDashboardcalls(userConfig.id))
      setIsWithdrawSuccess(true)
      dispatch(rejectWithdrawfiat())
      changeStep("step7")
    }
  }
  const confirmFaceLive = (obj) => {
    if(obj?.verifed){
    setFaceCapture(true)
    }else {
      setFaceCapture(false)
    }
    setLivefacerecognization(obj)
  }
  if (isWithdrawSuccess) {
    return <SuccessMsg onBackCLick={() => changeStep('step1')} />
  } else {
    return (
      <div>
        <LiveNessSumsub onConfirm={confirmFaceLive} />
        {faceCapture && <Button
          disabled={isLoding}
          size="large"
          block
          className="pop-btn"
          onClick={() => saveWithdrwal()}
        >
          Confirm
        </Button>}
        <Translate content="back" component={Button} onClick={() => onCancel()} type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block />
      </div>
    )
  }
}

const connectStateToProps = ({ userConfig, sendReceive }) => {
  return { userConfig: userConfig.userProfileInfo, sendReceive, trackAuditLogData: userConfig.trackAuditLogData }
}
const connectDispatchToProps = dispatch => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode))
    },
    dispatch
  }

}
export default connect(connectStateToProps, connectDispatchToProps)(WithdrawalLive);