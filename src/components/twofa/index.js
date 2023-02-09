
import { notification } from 'antd';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import React from 'react';
import AppConfig from '../../utils/app_config';
notification.config({
  placement: "topRight",
  rtl: true
});
const Twofa = () => {

  return (<>

     <a href={AppConfig.REACT_APP_AUTHORITY+ "/account/login?returnUrl=/manage/EnableAuthenticator"}>2FA Enable</a>
     <a href={AppConfig.REACT_APP_AUTHORITY+ "/account/login?returnUrl=/manage/Disable2faWarning"}>2FA Disable</a> 
  </>
  );
}

const connectStateToProps = ({ buySell }) => {
  return { buySell }
}
const connectDispatchToProps = dispatch => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode))
    }
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(Twofa);
