import React, { Component, useEffect, useState } from 'react';
import { Button, Input, Form, Divider, Row, Col, notification, Typography, Alert } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined  } from '@ant-design/icons';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
//import connectStateProps from '../../shared/stateConnect';
//import notify from '../../shared/components/notification';
import { changePassword } from '../../api/apiServer';
import { Link } from 'react-router-dom';
notification.config({
  placement: "topRight",
  rtl: true
});
const ChangePassword = ({ userConfig,onSubmit }) => {
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
  const onFinishFailed = (error) => {

  }
  const saveUserPass = async (values) => {
    let pwdregEx=/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&_]).{8,15}$/;
    let minLength=/^.{8,}$/
    if (values.CurrentPassword === values.Password) {
      //notify({ message: "Error", type: "error", description: "New password and re entered password must same" });
      setChangePasswordResponse({ error: true, messsage: "Current & New passwords should not be same!", isLoading: false });

    }else if(!minLength.test(values.Password)){
      setChangePasswordResponse({ error: true, messsage: "Password should be atleast 8 characters", isLoading: false });
    }
    else if(!pwdregEx.test(values.Password)){
      setChangePasswordResponse({ error: true, messsage: "Passwords must have at least one non alphanumeric character. Passwords must have at least one lowercase ('a'-'z'). Passwords must have at least one uppercase ('A'-'Z').", isLoading: false });
    }
    else {
      setChangePasswordResponse({ error: false, messsage: "", isLoading: true });
      const result = await changePassword(initialValues);
      if (result.ok) {
        setChangePasswordResponse({ error: false, messsage: 'Password changed successfully', isLoading: false });
        form.resetFields();
        onSubmit()
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
          className="mt-36 mb-16 fs-14 text-white-30 fw-400"
        /> */}
        <div className="d-flex">
          <Translate
            className="text-white input-label mb-0"
            content="current_password"
            component={Text}
          />
          <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span>
        </div>
        <Form.Item
          className="custom-forminput mb-16"
          name="CurrentPassword"
          required
          rules={[
            { required: true, message: "Please enter current password" },
          ]}
        >

            <Input.Password placeholder="Current Password" value={initialValues.CurrentPassword} className="text-left cust-input mb-8" onChange={(e) => handleChange("CurrentPassword", e)} iconRender={visible => (visible ?  <EyeOutlined style={{ color:'#fff'}}/> : <EyeInvisibleOutlined /> )} />
        </Form.Item>
        <div className="d-flex"> 
            <Translate
              className="text-white input-label mb-0"
              content="new_password"
              component={Text}
            />
            <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span>
          </div>
        <Form.Item
          name="Password"
          className="custom-forminput mb-16"
          required
          rules={[
            { required: true, message: "Please enter new password" },
          ]}
        >

          <Input.Password
            placeholder="New Password"
            value={initialValues.Password}
            onChange={(e) => handleChange("Password", e)}
            className="text-left cust-input mb-8" iconRender={visible => (visible ?  <EyeOutlined style={{ color:'#fff'}}/> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>
        <div className="d-flex">
            <Translate
              className="text-white input-label mb-0"
              content="confirm_password"
              component={Text}
            />
            <span style={{ color: "#fafcfe", paddingLeft: "2px" }}>*</span>
          </div>
        <Form.Item
          required
          className="custom-forminput mb-16"
          name="ConfirmPassword"
          dependencies={["password"]}
          //hasFeedback
          rules={[
            {
              required: true,
              message: "Please enter confirm password!",
            },
            ({ getFieldValue }) => ({
              validator(rule, value) {
                if (!value || getFieldValue("Password") === value) {
                  return Promise.resolve();
                }
                return Promise.reject(
                  "Password does not match!"
                );
              },
            }),
          ]}
        >
          
          <Input.Password
            placeholder="Confirm Password"
            value={initialValues.ConfirmPassword}
            onChange={(e) => handleChange("ConfirmPassword", e)}
            className="text-left cust-input mb-8" iconRender={visible => (visible ?  <EyeOutlined style={{ color:'#fff'}}/> : <EyeInvisibleOutlined /> )}
          />
        </Form.Item>

        <div style={{marginTop:'50px'}}>
          <Button
            loading={changePasswordResponse.isLoading}
            htmlType="submit"
            size="large"
            block
            className="pop-btn"
          >
            Submit
          </Button>
          <div className="text-center fs-20 mt-16"><Link to="/dashboard" className="fs-16 mt-16 text-white text-underline">Back to Dashboard</Link></div>
        </div>
      </Form>
    </div>
  </>)
}

const connectStateToProps = ({ buySell, oidc, userConfig }) => {
  return { buySell, userConfig: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode))
    }
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(ChangePassword);