import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { setStep,setSubTitle,setWithdrawcrypto } from '../../reducers/sendreceiveReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import LiveNessSumsub from '../sumSub.component/liveness'
import { fetchDashboardcalls } from '../../reducers/dashboardReducer';
import { withDrawCrypto } from '../send.component/api';

const WithdrawaCryptolLive = ({ userConfig, sendReceive, changeStep,dispatch }) => {
  const [faceCapture, setFaceCapture] = useState(false);
  const [livefacerecognization, setLivefacerecognization] = useState({});
  const [isLoding, setIsLoding] = useState(false);
  useEffect(() => { setFaceCapture(false) }, []);
  const saveWithdrwal = async() =>{
    setIsLoding(true)
      let saveObj = sendReceive.withdrawCryptoObj;
    saveObj.livefacerecognization = livefacerecognization?.applicantActionid;
    this.props.trackAuditLogData.Action='Save';
    this.props.trackAuditLogData.Remarks='Withdraw crypto save';
    saveObj.info=JSON.stringify(this.props.trackAuditLogData)
    let withdrawal = await withDrawCrypto(saveObj)
      if (withdrawal.ok) {
        dispatch(fetchDashboardcalls(userConfig.id))
        dispatch(setWithdrawcrypto(null))
        dispatch(setSubTitle(""));
        changeStep('withdraw_crpto_success');
      }
      
  }
  const Cancel = async() =>{
    changeStep('withdraw_crpto_summary');
  }
  const confirmFaceLive = (obj)=>{
    setFaceCapture(true)
    setLivefacerecognization(obj)
  }
    return (
        <div>
        <LiveNessSumsub onConfirm = {confirmFaceLive}/>
        {faceCapture && <Button
        disabled={isLoding}
              size="large"
              block
              className="pop-btn"
              onClick={() => saveWithdrwal()}
            >
             <Translate content="confirm_button" />
            </Button>}
        <Translate content="back" component={Button} onClick={() => Cancel()} type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block />
      </div>
    )}
// }

const connectStateToProps = ({ userConfig, sendReceive }) => {
  return { userConfig: userConfig.userProfileInfo,sendReceive, trackAuditLogData: userConfig.trackAuditLogData}
}
const connectDispatchToProps = dispatch => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode))
    },
    dispatch
  }

}
export default connect(connectStateToProps, connectDispatchToProps)(WithdrawaCryptolLive);