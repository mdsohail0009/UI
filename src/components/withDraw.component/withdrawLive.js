import React, { Component, useState, useRef, useEffect } from 'react';
import { Drawer, Form, Typography, Input, Button, label, Modal, Row, Col, Alert, Tooltip, Select } from 'antd';
import Currency from '../shared/number.formate';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import SuisseBtn from '../shared/butons';
import Translate from 'react-translate-component';
import LiveNessSumsub from '../sumSub.component/liveness'
import { withdrawSave } from '../../api/apiServer';
import { fetchDashboardcalls } from '../../reducers/dashboardReducer';
import { rejectWithdrawfiat } from '../../reducers/sendreceiveReducer';
import { appInsights } from "../../Shared/appinsights";
import SuccessMsg from '../withdraw.crypto.component/success';


const WithdrawalLive = ({ userConfig, sendReceive, changeStep,dispatch,onConfirm,onCancel }) => {
  const { Paragraph, Title, Text } = Typography;
  const [faceCapture, setFaceCapture] = useState(false);
  const [livefacerecognization, setLivefacerecognization] = useState({});
  const [isWithdrawSuccess, setIsWithdrawSuccess] = useState(false);
  useEffect(() => { setFaceCapture(false) }, []);
  const saveWithdrwal = async() =>{
      let saveObj = sendReceive.withdrawFiatObj;
    saveObj.livefacerecognization = livefacerecognization?.applicantActionid;
    let withdrawal = await withdrawSave(saveObj)
      if (withdrawal.ok) {
        dispatch(fetchDashboardcalls(userConfig.id))
        setIsWithdrawSuccess(true)
        dispatch(rejectWithdrawfiat())
        onConfirm()
        appInsights.trackEvent({
          name: 'WithDraw Fiat', properties: { "Type": 'User', "Action": 'save', "Username": userConfig.email, "MemeberId": userConfig.id, "Feature": 'WithDraw Fiat', "Remarks": (saveObj?.totalValue + ' ' + saveObj.walletCode + ' withdraw.'), "Duration": 1, "Url": window.location.href, "FullFeatureName": 'WithDraw Fiat' }
        });
      }
  }
  const Cancel = async() =>{
    changeStep('step1');
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
              size="large"
              block
              className="pop-btn"
              onClick={() => saveWithdrwal()}
            >
              Confirm
            </Button>}
        <Translate content="back" component={Button} onClick={() => onCancel()} type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block />
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
export default connect(connectStateToProps, connectDispatchToProps)(WithdrawalLive);