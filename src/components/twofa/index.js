
import { Typography, Input, Button, Select, Switch, Form, notification, Alert } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import React, { useEffect, useState } from 'react';
import { changePassword } from '../../api/apiServer';
notification.config({
  placement: "topRight",
  rtl: true
});
const Twofa = ({ profile, onSubmit, info }) => {
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState('required');
  const [changePasswordResponse, setChangePasswordResponse] = useState({ error: false, messsage: "", isLoading: false });

  const { Paragraph, Title, Text } = Typography;
  return (<>

     <a href={process.env.REACT_APP_AUTHORITY+ "/account/login?returnUrl=/manage/EnableAuthenticator"}>2FA Enable</a>
     <a href={process.env.REACT_APP_AUTHORITY+ "/account/login?returnUrl=/manage/Disable2faWarning"}>2FA Disable</a> 
  </>
  );
}

const connectStateToProps = ({ buySell, oidc }) => {
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
