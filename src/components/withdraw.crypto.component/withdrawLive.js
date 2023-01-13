import React, { useState, useEffect, useRef } from 'react';
import { Alert, Button } from 'antd';
import { setStep, setSubTitle, setWithdrawcrypto, setCryptoFinalRes } from '../../reducers/sendreceiveReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import LiveNessSumsub from '../sumSub.component/liveness'
import { fetchDashboardcalls } from '../../reducers/dashboardReducer';
import { withDrawCrypto } from '../send.component/api';
import { publishBalanceRfresh } from '../../utils/pubsub';

const WithdrawaCryptolLive = ({ userConfig, sendReceive, changeStep, dispatch, trackAuditLogData }) => {
  const [livefacerecognization, setLivefacerecognization] = useState({});
  const [isLoding, setIsLoding] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const divRef = useRef(null);
  useEffect(() => { setLivefacerecognization({}) }, []);
  const saveWithdrwal = async () => {
    setErrorMessage(null);
    setIsLoding(true)
    let saveObj = sendReceive.withdrawCryptoObj;
    saveObj.livefacerecognization = livefacerecognization?.applicantActionid;
    let trackAuditData = trackAuditLogData;
    trackAuditData.Action = 'Save';
    trackAuditData.Remarks = 'Withdraw Crypto save';
    saveObj.info = JSON.stringify(trackAuditData)
    let withdrawal = await withDrawCrypto(saveObj)
    if (withdrawal.ok) {
      dispatch(setCryptoFinalRes(withdrawal.data));
      dispatch(fetchDashboardcalls(userConfig.id))
      dispatch(setWithdrawcrypto(null))
      dispatch(setSubTitle(""));
      changeStep('withdraw_crpto_success');
      publishBalanceRfresh("success");
    } else {
      setErrorMessage(withdrawal.data?.message || withdrawal.data || withdrawal.originalError?.message || "Something went wrong please try after sometime :)");
      divRef.current.scrollIntoView();
    }

  }
  const Cancel = async () => {
    changeStep('withdraw_crpto_summary');
  }
  const confirmFaceLive = (obj) => {
    setLivefacerecognization(obj)
  }
  return (
    <div div="divRef" ref={divRef}>
      {errorMessage != null && <Alert type='error' closable={false} message={errorMessage} showIcon />}
      <LiveNessSumsub onConfirm={confirmFaceLive} />
      {livefacerecognization?.verifed && <Button
        loading={isLoding}
        size="large"
        block
        className="pop-btn"
        onClick={() => saveWithdrwal()}
      >
        <Translate content="confirm_button" />
      </Button>}
      <Translate content="back" component={Button} onClick={() => Cancel()} type="text" size="large" className="cust-cancel-btn back-btn-sumsub" block />
    </div>
  )
}
// }

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
export default connect(connectStateToProps, connectDispatchToProps)(WithdrawaCryptolLive);