import React, { Component, useEffect, useState } from 'react';
import { Button, Input, Form, Divider, Row, Col, notification, Typography, Alert,message } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined  } from '@ant-design/icons';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
//import connectStateProps from '../../shared/stateConnect';
//import notify from '../../shared/components/notification';
import { changePassword } from '../../api/apiServer';
import { Link } from 'react-router-dom';
import { getmemeberInfo } from '../../reducers/configReduser';
import apiClient from "../../api/apiCalls"

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
  const { Paragraph, Title, Text } = Typography;
  const [form] = Form.useForm();
  const [requiredMark, setRequiredMarkType] = useState('required');
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
  const onFinishFailed = (error) => {

  }
  const saveUserPass = async (values) => {
    let pwdregEx=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&_]).{8,15}$/;
    let minLength=/^.{8,}$/
    if (values.CurrentPassword === values.Password) {
      //notify({ message: "Error", type: "error", description: "New password and re entered password must same" });
      setChangePasswordResponse({ error: true, messsage: "Current password and New password should not be same", isLoading: false });
    }
    //  else if (!minLength.test(values.Password)) {
    //   setChangePasswordResponse({ error: true, messsage: "Password should be atleast 8 characters", isLoading: false });
    // }
    //  else if (!pwdregEx.test(values.Password)) {
    //   setChangePasswordResponse({ error: true, messsage: "Passwords must have at least one non alphanumeric character. Passwords must have at least one lowercase ('a'-'z'). Passwords must have at least one uppercase ('A'-'Z').", isLoading: false });
    // }
    else {
      setChangePasswordResponse({ error: false, messsage: "", isLoading: true });
      const result = await changePassword(initialValues);
      if (result.ok) {
        message.success({content:'Password changed successfully',className: 'custom-msg'});
        setChangePasswordResponse({ error: false, messsage: '', isLoading: false });
        form.resetFields();
        onSubmit()
        getmemeberInfoa(userConfig.email)
        apiClient.trackEvent({"Action": 'Save', "Feature": 'Change password', "Remarks": "Password changed","FullFeatureName": 'Change password',"userName":userConfig.userName,id:userConfig.id });
      }
      else {
        setChangePasswordResponse({ error: true, messsage: result.data, isLoading: false });
      }
    }
  }
  const clearValues = () => {
    form.resetFields();

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
        }} onFinishFailed={onFinishFailed} onFinish={(values) => saveUserPass(values)} enableReinitialize>
        {changePasswordResponse.messsage !== "" && (
          <Typography>
            <Alert
              type={changePasswordResponse?.error ? "error" : "success"}
              showIcon
              //message="Change Password"
              description={changePasswordResponse.messsage}
            />
          </Typography>
        )}
        {/* <Translate
          content="Change_password"
          component={Title}
          className="mb-0 fs-24 text-white-30 fw-400"
        />
        <Translate
          content="Choose_a_unique_password_to_protect_your_account"
          component={Paragraph}
          className="mt-36 mb-24 fs-14 text-white-30 fw-400"
        /> */}
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

          <Input.Password placeholder="Type your current password" value={initialValues.CurrentPassword} className="text-left cust-input mb-8 pr-0 change-space" onChange={(e) => handleChange("CurrentPassword", e)} iconRender={visible => (visible ? <EyeInvisibleOutlined /> : <EyeOutlined style={{ color: '#fff' }} />)} />
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
          //  { min: 8, message: "password  atleast 8 characters" },
           { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&_]).{8,15}$/,
            message: 'Password must be at least 8 Characters long one uppercase with one lowercase, one numeric & special character' },
           ]}
        >
         
            <Input.Password
              placeholder="Type your new password"
              value={initialValues.Password}
              onChange={(e) => handleChange("Password", e)}
              className="text-left cust-input mb-8 pr-0 change-space pass-onhover" iconRender={visible => (visible ? <EyeInvisibleOutlined /> : <EyeOutlined style={{ color: '#fff' }} />)}
            />
          {/* <div class="hover-passlwngth">
                                <span>At least:</span>
                                <span>8 characters</span>
                                <span>1 uppercase</span>
                                <span>1 lowercase</span>
                                <span>1 number</span>
                                <span>1 special character</span>
                            </div> */}
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
            placeholder="Re-type your new password"
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
            Save
          </Button>
          <Button
            htmlType="cancel"
            size="large"
            block
            className="pwd-popup pop-cancel"
            onClick={() => onSubmit()}>
            Cancel
          </Button>
        </div>
      </Form>
    </div>
  </>)
}

const connectStateToProps = ({ buySell, oidc, userConfig, userProfile }) => {
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