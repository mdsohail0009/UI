import React, { useEffect, useState } from 'react';
import { Button, Input, Form, notification, Typography, Alert, message } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined } from '@ant-design/icons';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import { changePassword } from '../../api/apiServer';
import { getmemeberInfo } from '../../reducers/configReduser';
import apiClient from '../../api/apiCalls';
import apiCalls from '../../api/apiCalls';
import { validateContentRule } from '../../utils/custom.validator'


notification.config({
  placement: "topRight",
  rtl: true
});
const ChangePassword = ({ userConfig, onSubmit, userProfile, getmemeberInfoa, trackAuditLogData }) => {
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
    if (userProfile && userProfile?.isNew) {
      setChangePasswordResponse({ error: false, messsage: "", isLoading: false });
      form.resetFields();
    }
    trakEvet()
  }, [userProfile]);
  const trakEvet = () => {
    apiCalls.trackEvent({ "Type": 'User', "Action": 'Change password page view', "Username": userConfig?.userName, "MemeberId": userConfig?.id, "Feature": 'Change Password', "Remarks": 'Change password page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Change Password' });
  }
  const saveUserPass = async (values) => {
    if (values.CurrentPassword === values.Password) {
      passwordResponce(true, "Current password and New password should not be same", false);
    } else {
      passwordResponce(false, '', false);
      debugger
      initialValues.info = JSON.stringify(trackAuditLogData)
      let obj = Object.assign({},initialValues);
      obj.ConfirmPassword = apiClient.encryptValue(obj.ConfirmPassword,userConfig.sk)
      obj.CurrentPassword = apiClient.encryptValue(obj.CurrentPassword,userConfig.sk)
      obj.Password = apiClient.encryptValue(obj.Password,userConfig.sk)
      obj.Email = apiClient.encryptValue(obj.Email,userConfig.sk)
      obj.info = apiClient.encryptValue(obj.info,userConfig.sk)
      const result = await changePassword(obj);
      if (result.ok) {
        message.success({ content: 'Password changed successfully', className: 'custom-msg' });
        passwordResponce(false, '', false);
        form.resetFields();
        onSubmit()
        getmemeberInfoa(userConfig.userId)
        apiClient.trackEvent({ "Action": 'Save', "Feature": 'Change password', "Remarks": "Password changed", "FullFeatureName": 'Change password', "userName": userConfig.userName, id: userConfig.id });
      } else {
        passwordResponce(true, result.data, false);
      }
    }
  }
  const passwordResponce = (isError, msg, isloading) => {
    setChangePasswordResponse({ error: isError, messsage: msg, isLoading: isloading });
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
            content="current_pass_word"
            component={Text}
          />
          <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}>*</span>
        </div>
        <Form.Item
          className="custom-forminput mb-24"
          name="CurrentPassword"
          required
          rules={[
            {
              required: true, message: apiClient.convertLocalLang('current_pass_word_msg')
            },
            {
              validator: validateContentRule
            }

          ]}
        >

          <Input.Password placeholder={apiClient.convertLocalLang('Type_your_current_pass_word')} value={initialValues.CurrentPassword} className="text-left cust-input mb-8 pr-0 change-space" onChange={(e) => handleChange("CurrentPassword", e)} iconRender={visible => (visible ? <EyeOutlined style={{ color: '#fff' }} /> : <EyeInvisibleOutlined />)} />
        </Form.Item>
        <div className="d-flex">
          <Translate
            className="text-white input-label"
            content="new_pass_word"
            component={Text}
          />
          <span style={{ color: "var(--textWhite30)", paddingLeft: "2px" }}>*</span>
        </div>
        <Form.Item
          name="Password"
          className="custom-forminput mb-24"
          required
          rules={[{
            required: true, message: apiClient.convertLocalLang('new_pass_word_msg')
          },
          {
            pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&_]).{8,15}$/,
            message: 'Password must be at least 8 Characters long one uppercase with one lowercase, one numeric & special character'
          },
          {
            validator: validateContentRule
          }
          ]}
        >

          <Input.Password
            placeholder={apiClient.convertLocalLang('Type_your_new_pass_word')}
            value={initialValues.Password}
            onChange={(e) => handleChange("Password", e)}
            className="text-left cust-input mb-8 pr-0 change-space pass-onhover" iconRender={visible => (visible ? <EyeOutlined style={{ color: '#fff' }} /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>
        <div className="d-flex">
          <Translate
            className="text-white input-label"
            content="confirm_pass_word"
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
              message: apiClient.convertLocalLang('confirm_pass_word_msg'),

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
            {
              validator: validateContentRule
            }
          ]}
        >

          <Input.Password
            placeholder={apiClient.convertLocalLang('Re_type_your_new_pass_word')}
            value={initialValues.ConfirmPassword}
            onChange={(e) => handleChange("ConfirmPassword", e)}
            className="text-left cust-input mb-8 pr-0 change-space" iconRender={visible => (visible ? <EyeOutlined style={{ color: '#fff' }} /> : <EyeInvisibleOutlined />)}
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
            <Translate content="Save_btn_text" />
          </Button>
          <Button
            htmlType="button"
            size="medium"
            block
            className="pwd-popup pop-cancel fs-14"
            onClick={() => onSubmit()}>
            <Translate content="cancel" />
          </Button>
        </div>
      </Form>
    </div>
  </>)
}

const connectStateToProps = ({ buySell, userConfig, userProfile }) => {
  return { buySell, trackAuditLogData: userConfig.trackAuditLogData, userConfig: userConfig.userProfileInfo, userProfile }
}
const connectDispatchToProps = dispatch => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode))
    },
    getmemeberInfoa: (useremail) => {
      dispatch(getmemeberInfo(useremail));
    },
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(ChangePassword);