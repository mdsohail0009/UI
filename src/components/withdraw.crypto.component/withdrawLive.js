import React, { useState, useEffect } from 'react';
import { Button } from 'antd';
import { setStep,setSubTitle } from '../../reducers/sendreceiveReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import LiveNessSumsub from '../sumSub.component/liveness'
import { fetchDashboardcalls } from '../../reducers/dashboardReducer';
import { setWithdrawcrypto } from '../../reducers/sendreceiveReducer';
import { appInsights } from "../../Shared/appinsights";
import SuccessMsg from '../withdraw.crypto.component/success';
import { withDrawCrypto } from '../send.component/api';

const WithdrawaCryptolLive = ({ userConfig, sendReceive, changeStep,dispatch }) => {
  const [faceCapture, setFaceCapture] = useState(false);
  const [livefacerecognization, setLivefacerecognization] = useState({});
  const [isWithdrawSuccess, setIsWithdrawSuccess] = useState(false);
  const [isLoding, setIsLoding] = useState(false);
  useEffect(() => { setFaceCapture(false) }, []);
  const saveWithdrwal = async() =>{
    setIsLoding(true)
      let saveObj = sendReceive.withdrawCryptoObj;
    saveObj.livefacerecognization = livefacerecognization?.applicantActionid;
    let withdrawal = await withDrawCrypto(saveObj)
      if (withdrawal.ok) {
        dispatch(fetchDashboardcalls(userConfig.id))
        setIsWithdrawSuccess(true)
        dispatch(setWithdrawcrypto(null))
        dispatch(setSubTitle("Withdraw crypto Success"));
        appInsights.trackEvent({
          name: 'WithDraw Crypto', properties: { "Type": 'User', "Action": 'save', "Username": userConfig.userName, "MemeberId": userConfig.id, "Feature": 'WithDraw Crypto', "Remarks": 'WithDraw crypto save', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'WithDraw Crypto' }
        });
      }
      
  }
  const Cancel = async() =>{
    changeStep('withdraw_crypto_selected');
  }
  const confirmFaceLive = (obj)=>{
    setFaceCapture(true)
    setLivefacerecognization(obj)
  }
    if (isWithdrawSuccess) {
        return <SuccessMsg onBackCLick={() => changeStep('step1')} />
    }else{
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
              Confirm
            </Button>}
        <Translate content="back" component={Button} onClick={() => Cancel()} type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block />
      </div>
    )}
}

const connectStateToProps = ({ userConfig, sendReceive }) => {
  return { userConfig: userConfig.userProfileInfo,sendReceive }
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