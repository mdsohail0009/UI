import React, { useEffect, useState } from 'react';
import { Button, Input, Form, notification, Typography, Alert,message } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined  } from '@ant-design/icons';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import { changePassword } from '../../api/apiServer';
import { getmemeberInfo } from '../../reducers/configReduser';
import apiClient from "../../api/apiCalls";


notification.config({
  placement: "topRight",
  rtl: true
});
const ChangePassword = ({ userConfig,onSubmit,userProfile,getmemeberInfoa}) => {
  const [initialValues, setInitialValues] = useState({
    "Email": userConfig?.email,
    "CurrentPassword": "",
    "Password": "",
    "ConfirmPassword": ""
  })
  const { Text } = Typography;
  const [form] = Form.useForm();
  const [changePasswordResponse, setChangePasswordResponse] = useState({ error: false, messsage: "", isLoading: false });
  useEffect(() => {
    if (userProfile?.isNew) {
      setChangePasswordResponse({ error: false, messsage: "", isLoading: false });
      form.resetFields();
    }
  }, [userProfile])
  useEffect(() => {
    trakEvet()
  }, [])

  const trakEvet = () =>{
    apiClient.trackEvent({"Action": 'Page View', "Feature": 'Change password', "Remarks": "Password page view","FullFeatureName": 'Change password',"userName":userConfig.userName,id:userConfig.id });
  }
  const saveUserPass = async (values) => {
    
    if (values.CurrentPassword === values.Password) {
      setChangePasswordResponse({ error: true, messsage: "Current password and New password should not be same", isLoading: false });
    }
    
    else {
      setChangePasswordResponse({ error: false, messsage: "", isLoading: true });
      const result = await changePassword(initialValues);
      if (result.ok) {
        message.success({content:'Password changed successfully',className: 'custom-msg'});
        setChangePasswordResponse({ error: false, messsage: '', isLoading: false });
        form.resetFields();
        onSubmit()
        getmemeberInfoa(userConfig.userId)
        apiClient.trackEvent({"Action": 'Save', "Feature": 'Change password', "Remarks": "Password changed","FullFeatureName": 'Change password',"userName":userConfig.userName,id:userConfig.id });
      }
      else {
        setChangePasswordResponse({ error: true, messsage: result.data, isLoading: false });
      }
    }
  }
  const handleChange = (prop, val) => {
    let object = { ...initialValues };
    object[prop] = val.currentTarget.value;
    setInitialValues(object);
  }
  return (<>
    <div className="mt-16">
      <Form form={form}
        initialValues={{
          "Email": userConfig?.email,
          "CurrentPassword": "",
          "Password": "",
          "ConfirmPassword": ""
        }} onFinish={(values) => saveUserPass(values)} enableReinitialize>
        {changePasswordResponse.messsage !== "" && (
          <Typography>
            <Alert
              type={changePasswordResponse?.error ? "error" : "success"}
              showIcon
              description={changePasswordResponse.messsage}
            />
          </Typography>
        )}
       
        <div className="d-flex">
          <Translate
            className="text-white input-label"
            content="current_password"
            component={Text}
          />
          <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}>*</span>
        </div>
        <Form.Item
          className="custom-forminput mb-24"
          name="CurrentPassword"
          required
          rules={[
            { required: true, message: "Please enter current password" },
          ]}
        >

          <Input.Password placeholder={apiClient.convertLocalLang('Type_your_current_password')} value={initialValues.CurrentPassword} className="text-left cust-input mb-8 pr-0 change-space" onChange={(e) => handleChange("CurrentPassword", e)} iconRender={visible => (visible ? <EyeInvisibleOutlined /> : <EyeOutlined style={{ color: '#fff' }} />)} />
        </Form.Item>
        <div className="d-flex">
          <Translate
            className="text-white input-label"
            content="new_password"
            component={Text}
          />
          <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}>*</span>
        </div>
        <Form.Item
          name="Password"
          className="custom-forminput mb-24"
          required
          rules={[{ required: true, message: "New password  required" },
           { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&_]).{8,15}$/,
            message: 'Password must be at least 8 Characters long one uppercase with one lowercase, one numeric & special character' },
           ]}
        >
         
            <Input.Password
             placeholder={apiClient.convertLocalLang('Type_your_new_password')}
              value={initialValues.Password}
              onChange={(e) => handleChange("Password", e)}
              className="text-left cust-input mb-8 pr-0 change-space pass-onhover" iconRender={visible => (visible ? <EyeInvisibleOutlined /> : <EyeOutlined style={{ color: '#fff' }} />)}
            />
        </Form.Item>
        <div className="d-flex">
          <Translate
            className="text-white input-label"
            content="confirm_password"
            component={Text}
          />
          <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}>*</span>
        </div>
        <Form.Item
          required
          className="custom-forminput mb-24"
          name="ConfirmPassword"
          dependencies={["password"]}
          //hasFeedback
          rules={[
            {
              required: true,
              message: "Please enter confirm password",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("Password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  "Password does not match"
                );
              },
            }),
          ]}
        >

          <Input.Password
            placeholder={apiClient.convertLocalLang('Re_type_your_new_password')}
            value={initialValues.ConfirmPassword}
            onChange={(e) => handleChange("ConfirmPassword", e)}
            className="text-left cust-input mb-8 pr-0 change-space" iconRender={visible => (visible ? <EyeInvisibleOutlined /> : <EyeOutlined style={{ color: '#fff' }} />)}
          />
        </Form.Item>

        <div style={{ marginTop: '50px' }} className="">
          <Button
            loading={changePasswordResponse.isLoading}
            htmlType="submit"
            size="large"
            block
            className="pop-btn"
          >
            <Translate  content="Save_btn_text" />
          </Button>
          <Button
            htmlType="cancel"
            size="large"
            block
            className="pwd-popup pop-cancel"
            onClick={() => onSubmit()}>
            <Translate  content="cancel" />
          </Button>
        </div>
      </Form>
    </div>
  </>)
}

const connectStateToProps = ({ buySell, userConfig, userProfile }) => {
  return { buySell, userConfig: userConfig.userProfileInfo, userProfile }
}
const connectDispatchToProps = dispatch => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode))
    },
    getmemeberInfoa: (useremail) => {
      dispatch(getmemeberInfo(useremail));
  }
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(ChangePassword);