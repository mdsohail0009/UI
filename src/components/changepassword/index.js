import React, { useEffect, useState } from 'react';
import { Button, Input, Form, notification, Typography, Alert, message,Spin } from 'antd';
import { EyeInvisibleOutlined, EyeOutlined,LoadingOutlined } from '@ant-design/icons';
import { setStep } from '../../reducers/buysellReducer';
import Translate from 'react-translate-component';
import { connect } from 'react-redux';
import { changePassword } from '../../api/apiServer';
import { getmemeberInfo } from '../../reducers/configReduser';
import apiClient from '../../api/apiCalls';
import apiCalls from '../../api/apiCalls';
import { validateContentRule, validateContent } from '../../utils/custom.validator'

notification.config({
  placement: "topRight",
  rtl: true
});
const ChangePassword = ({ userConfig, onSubmit, userProfile, getmemeberInfoa, trackAuditLogData }) => {
  const [btnDisabled, setBtnDisabled] = useState(false);
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
  }, [userProfile]);// eslint-disable-line react-hooks/exhaustive-deps
  const trakEvet = () => {
    apiCalls.trackEvent({ "Type": 'User', "Action": 'Change password page view', "Username": userConfig?.userName, "customerId": userConfig?.id, "Feature": 'Change Password', "Remarks": 'Change password page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Change Password' });
  }
  const saveUserPass = async (values) => {
    setBtnDisabled(true);
    if (values.CurrentPassword === values.Password) {
      setBtnDisabled(false)
      setChangePasswordResponse({ error: false, messsage: "", isLoading: false });
      passwordResponce(true, "Current password and New password should not be same", false);
    } else {
      setBtnDisabled(true);
      passwordResponce(false, '', false);
      initialValues.info = JSON.stringify(trackAuditLogData)
      let obj = Object.assign({}, initialValues);
      obj.ConfirmPassword = apiClient.encryptValue(obj.ConfirmPassword, userConfig.sk)
      obj.CurrentPassword = apiClient.encryptValue(obj.CurrentPassword, userConfig.sk)
      obj.Password = apiClient.encryptValue(obj.Password, userConfig.sk)
      obj.Email = apiClient.encryptValue(obj.Email, userConfig.sk)
      obj.info = apiClient.encryptValue(obj.info, userConfig.sk)
      const result = await changePassword(obj);
      setChangePasswordResponse({ error: false, messsage: "", isLoading: false });
      if (result.ok) {
        setBtnDisabled(false);
        message.success({ content: 'Password changed successfully', className: 'custom-msg',duration:3 });
        passwordResponce(false, '', false);
        form.resetFields();
        
        onSubmit()
        getmemeberInfoa(userConfig.userId)
        apiClient.trackEvent({ "Action": 'Save', "Feature": 'Change password', "Remarks": "Password changed", "FullFeatureName": 'Change password', "userName": userConfig.userName, id: userConfig.id });
      } else {
        setBtnDisabled(false);
        setChangePasswordResponse({ error: false, messsage: "", isLoading: false });
        passwordResponce(true, isErrorDispaly(result), false);
      }
    }
  }
  const isErrorDispaly = (objValue) => {
		if (objValue.data && typeof objValue.data === "string") {
		  return objValue.data;
		} else if (objValue.originalError &&typeof objValue.originalError.message === "string"
		) {
		  return objValue.originalError.message;
		} else {
		  return "Something went wrong please try again!";
		}
	  };

  const passwordResponce = (isError, msg, isloading) => {
    setChangePasswordResponse({ error: isError, messsage: msg, isLoading: isloading });
  }
  const handleChange = (prop, val) => {
    let object = { ...initialValues };
    object[prop] = val.currentTarget.value;
    setInitialValues(object);
  }
 const antIcon = (
    <LoadingOutlined
        style={{ fontSize: 18, color: "#fff", marginRight: "16px" }}
        spin
    />
  );
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
          rules={[
            {
              validator(rule, value) {
                if (!value) {
                  return Promise.reject(
                    apiClient.convertLocalLang('new_pass_word_msg')
                  )
                } else if (!value || !(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$^+=!*()@%&_]).{8,15}$/.test(value))) {
                  return Promise.reject(
                    "Password must have at least 8 characters and cannot contain common words or patterns. Try adding numbers, symbols, or characters to make your password longer and unique."

                  )
                } else if (!validateContent(value)) {
                  return Promise.reject(
                    "Please enter valid content"
                  )
                } else {
                  return Promise.resolve();

                }
              },
            },
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
            })
          ]}
        >

          <Input.Password
            placeholder={apiClient.convertLocalLang('Re_type_your_new_pass_word')}
            value={initialValues.ConfirmPassword}
            onChange={(e) => handleChange("ConfirmPassword", e)}
            className="text-left cust-input mb-8 pr-0 change-space" iconRender={visible => (visible ? <EyeOutlined style={{ color: '#fff' }} /> : <EyeInvisibleOutlined />)}
          />
        </Form.Item>

        <div style={{ marginTop: '' }} className="changepwd-btn align-center btn-content btn-container">
          <div classname="text-center mt-16 cust-pop-up-btn sell-btc-btn">
          <Button
            htmlType="button"
            size="medium"
            block
            className="pwdbtn-cancel text-white-30 fw-400 pop-btn custom-send  cancel-btn mr-8 ml-0 primary-btn pop-cancel"
            onClick={() => onSubmit()}>
            <Translate content="cancel" />
          </Button>
          </div>
          <div classname="sell-btc-btn">
          <Button
            // loading={changePasswordResponse.isLoading}
            htmlType="submit"
            size="large"
            block
            className="pwdbtn-submit pop-btn custom-send sell-btc-btn"
            loading={btnDisabled}
          >{changePasswordResponse.isLoading && <Spin indicator={antIcon} />}{" "}
            <Translate content="Save_btn_text" />
          </Button>
          </div>
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