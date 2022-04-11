import React, { useState, useEffect } from "react";
import { Typography, Button, Form, message, Input, Alert, Tooltip } from "antd";
import Currency from "../shared/number.formate";
import { setStep } from "../../reducers/buysellReducer";
import { connect } from "react-redux";
import Translate from "react-translate-component";
import apiCalls from "../../api/apiCalls";
import { withdrawSave } from "../../api/apiServer";
import { fetchDashboardcalls } from "../../reducers/dashboardReducer";
import {
  setWithdrawfiat,
  rejectWithdrawfiat,
  setWithdrawfiatenaable,
  setWithdrawFinalRes
} from "../../reducers/sendreceiveReducer";
import { success, warning, error } from "../../utils/messages";

const WithdrawalFiatSummary = ({
  sendReceive,
  userConfig,
  changeStep,
  dispatch,
  trackAuditLogData
}) => {
  const { Text } = Typography;
  const [isLoding, setIsLoding] = useState(false);
  const [form] = Form.useForm();
  const [otp, setOtp] = useState(false);
  const useOtpRef = React.useRef(null);
  const [buttonText, setButtonText] = useState("get_otp");
  const [verificationText, setVerificationText] = useState("");
  const [isResend, setIsResend] = useState(true);
  const [invalidcode, setInvalidCode] = useState("");
  const [verifyData, setVerifyData] = useState({});
  const [disable, setDisable] = useState(false);
  const [inputDisable, setInputDisable] = useState(true);
  const [errorMsg, setMsg] = useState(false);
  const [type, setType] = useState("Send");
  const [textDisable, setTextDisable] = useState(false);
  const [emailText, setEmailText] = useState("get_email");
  const [emailDisable, setEmailDisable] = useState(true);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [tooltipEmail, setTooltipEmail] = useState(false);
  const [emailVerificationText, setEmailVerificationText] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [verifyOtpText, setVerifyOtpText] = useState("");
  const [verifyEmailText,setVerifyEmailText]=useState("")
  const [seconds, setSeconds] = useState(120);
  const [emailOtp, setEmailOtp] = useState("");
  const [invalidData,setInvalidData]=useState(false);
  const [validData,setValidData]=useState(false)
  const[verify,setVerify]=useState(false);
  const [emailCode, setEmailCode] = useState("");
  const [disableSave, setDisableSave] = useState(false)
  

  const btnList = {
    get_otp: (
      <Translate className="pl-0 ml-0 text-yellow-50" content="get_code" />
    ),
    resendotp: (
      <Translate
        className="pl-0 ml-0 text-yellow-50"
        content="resend_code"
        //with={{ counter: `${disable ? "(" + seconds + ")" : ""}` }}
      />
    ),
    sentVerify: (
      <Translate
        className={`pl-0 ml-0 text-yellow-50 ${
          textDisable ? "c-notallowed" : ""
        }`}
        content="sent_verification"
      />
    )
  };
  const verifyOtp = {
    verifyOtpBtn: (
      <Translate
        className={`pl-0 ml-0 text-yellow-50 `}
        content="verify_button"
      />
    )
  };
  const emailBtn = {
    get_email: (
      <Translate className={`pl-0 ml-0 text-yellow-50 `} content="get_email" />
    ),
    resendEmail: (
      <Translate
        className={`pl-0 ml-0 text-yellow-50 `}
        content="resend_email"
        // with={{ counter: `${disable ? "(" + seconds + ")" : ""}` }}
      />
    ),
    sentVerification: (
      <Translate
        className={`pl-0 ml-0 text-yellow-50 ${
          textDisable ? "c-notallowed" : ""
        }`}
        content="sent_verification"
      />
    )
  };
  const verifyText = {
    verifyTextBtn: (
      <Translate className={`pl-0 ml-0 text-yellow-50 `} content="verify_btn" />
    )
  };

  useEffect(() => {
    withdrawSummayTrack();
    getVerifyData();
  }, []);

  useEffect(() => {
    const timer =
    seconds > 0 && setInterval(() => setSeconds(seconds - 1), 1000);
    return () => clearInterval(timer);
  }, [seconds]);

  const withdrawSummayTrack = () => {
    apiCalls.trackEvent({
      Type: "User",
      Action: "Withdraw Fiat summary page view",
      Username: userConfig?.userName,
      MemeberId: userConfig?.id,
      Feature: "Withdraw Fiat",
      Remarks: "Withdraw Fiat summary page view",
      Duration: 1,
      Url: window.location.href,
      FullFeatureName: "Withdraw Fiat"
    });
  };
 

  const saveWithdrwal = async (values) => {
    setIsLoding(true);
    let Obj = Object.assign({}, sendReceive.withdrawFiatObj);
    Obj.accountNumber = apiCalls.encryptValue(
      Obj.accountNumber,
      userConfig?.sk
    );
    Obj.bankName = apiCalls.encryptValue(Obj.bankName, userConfig?.sk);
    Obj.routingNumber = apiCalls.encryptValue(
      Obj.routingNumber,
      userConfig?.sk
    );
    Obj.bankAddress = apiCalls.encryptValue(Obj.bankAddress, userConfig?.sk);
    Obj.beneficiaryAccountAddress = apiCalls.encryptValue(
      Obj.beneficiaryAccountAddress,
      userConfig?.sk
    );
    Obj.beneficiaryAccountName = apiCalls.encryptValue(
      Obj.beneficiaryAccountName,
      userConfig?.sk
    );
    Obj.info = JSON.stringify(trackAuditLogData);
    let withdrawal = await withdrawSave(Obj);
    if(invalidData==false){
      setDisableSave(true)

      if (withdrawal.ok) {
        setDisableSave(false)
        dispatch(setWithdrawFinalRes(withdrawal.data));
        dispatch(fetchDashboardcalls(userConfig.id));
        dispatch(rejectWithdrawfiat());
        changeStep("step7");
      } else if(setVerifyOtpText("") || setVerifyOtpText(null)){
        setMsg("Please enter valid codes")
      }
      else {
        
        setMsg(withdrawal.data);
        useOtpRef.current.scrollIntoView();
      }
    }
    
  };
  const onCancel = () => {
    changeStep("step1");
    dispatch(setWithdrawfiatenaable(true));
    dispatch(rejectWithdrawfiat());

  };
  const fullNumber = userConfig.phoneNumber;
  const last4Digits = fullNumber.slice(-4);
  const maskedNumber = last4Digits.padStart(fullNumber.length, "*");

  const getVerifyData = async () => {
    let response = await apiCalls.getVerificationFields(userConfig.id);
    if (response.ok) {
      setVerifyData(response.data);
    }
  };

  const getEmail = async (val) => {
    debugger
    let response = await apiCalls.sendEmail(userConfig.id, type);
    if (response.ok) {
      setEmailText("sentVerification");
      setEmailDisable(false);
      setTextDisable(true);
      setTooltipEmail(true);
      setEmailVerificationText(
        apiCalls.convertLocalLang("digit_code") + " " + "your Email Id "
      );
      setTimeout(() => {
        setEmailText("resendEmail"); setTooltipEmail(false)
      }, 120000);
     setTimeout(() => {
      setVerifyEmailText(null)
     }, 120000);
      //timer();
      } else {
      setMsg(apiCalls.convertLocalLang("request_fail"));
      
    }
  };
  const getEmailVerification = async (values) => {
    debugger
    setValidData(true)
    let response = await apiCalls.verifyEmail(userConfig.id, emailCode);
    if (response.ok) {
      success("Email  verified successfully");
    } else if(response.data==null){
      useOtpRef.current.scrollIntoView();
        setMsg("Please enter email verification code") }
    else {
      setMsg(apiCalls.convertLocalLang("email_invalid_code"));
      setTimeout(() => {
        setMsg(null)
      }, 5000);
      setInvalidData(true)

    }
  };

  const handleSendOtp = (val) => {
    setEmailOtp(val.emailCode);
    setVerifyEmailText("verifyTextBtn");
    setTooltipEmail(false);
    setEmailText(null);
    setVerify(true);
    setDisableSave(false)

    
  };
  const handleEmailChange=(e)=>{
    setEmailCode(e.target.value);
  }
  const getOTP = async (val) => {
    let response = await apiCalls.getCode(userConfig.id, type);
    if (response.ok) {
      setTooltipVisible(true);
      setButtonText("sentVerify");
      setInputDisable(false);
      setDisable(true);
      setVerificationText(
        apiCalls.convertLocalLang("digit_code") + " " + maskedNumber
      );

      setTimeout(() => {
        setButtonText("resendotp");
      }, 120000);
      setTimeout(() => {
        setTooltipVisible(false);
      }, 120000);
      setTimeout(() => {
        setVerifyOtpText(null)
      }, 120000);
    } else {
      setMsg(apiCalls.convertLocalLang("request_fail"));
    }
  };

  const getOtpVerification = async () => {
    setValidData(true)
    let response = await apiCalls.getVerification(userConfig.id, otpCode);
    if (response.ok) {
      success("OTP verified successfully");
    } else if(response.data==null){
      useOtpRef.current.scrollIntoView();
        setMsg("Please enter phone verification code") }
    else {
      useOtpRef.current.scrollIntoView();

      setMsg(apiCalls.convertLocalLang("phone_invalid_code"));
      setTimeout(() => {
        setMsg(null)
      }, 5000);
      setInvalidData(true)

    }
  };
  const handleChange = (e) => {
    setOtpCode(e.target.value);
  };
  
  const handleOtp = (val) => {
    setOtp(val.code);
    setVerifyOtpText("verifyOtpBtn");
    setTooltipVisible(false);
     setButtonText(null);
    setDisableSave(false)
    
  };
  const getAuthenticator = async () => {
    debugger
    setValidData(true)
    let response = await apiCalls.getAuthenticator(authCode, userConfig.userId);
    if (response.ok) {  
      console.log(response.data)
      success("Authenticator verified successfully");
    } else if(response.data==null){
      useOtpRef.current.scrollIntoView();
        setMsg("Please enter authenticator verification code")      
    }
    else {
      useOtpRef.current.scrollIntoView();
      setMsg(apiCalls.convertLocalLang("twofa_invalid_code"));
      setTimeout(() => {
        setMsg(null)
      }, 5000);
      setInvalidData(true)

    }
  };
  const handleAuthenticator = (e) => {
    setAuthCode(e.target.value);
  };

 

  return (
    <div className="mt-16">
      {" "}
      <div ref={useOtpRef}></div>
      {errorMsg && (
        <Alert
          showIcon
          type="info"
          message={apiCalls.convertLocalLang("withdrawFiat")}
          description={errorMsg}
          closable={false}
        />
      )}
      <Text className="fs-14 text-white-50 fw-200">
        <Translate
          content="you_are_sending"
          component={Text}
          className="fs-14 text-white-50 fw-200"
        />
      </Text>
      <Currency
        className="fs-20 text-white-30 mb-36"
        prefix={""}
        defaultValue={sendReceive.withdrawFiatObj?.requestedAmount}
        suffixText={sendReceive.withdrawFiatObj?.walletCode}
      />
      <Text className="fs-14 text-white-50 fw-200">
        <Translate
          content="fees"
          component={Text}
          className="fs-14 text-white-50 fw-200"
        />
      </Text>
      <Currency
        className="fs-20 text-white-30 mb-36"
        prefix={""}
        defaultValue={sendReceive.withdrawFiatObj?.comission}
        suffixText={sendReceive.withdrawFiatObj?.walletCode}
      />
      <Text className="fs-14 text-white-50 fw-200">
        <Translate
          content="you_receive"
          component={Text}
          className="fs-14 text-white-50 fw-200"
        />
      </Text>
      <Currency
        className="fs-20 text-white-30 mb-36"
        prefix={""}
        defaultValue={sendReceive.withdrawFiatObj?.totalValue}
        suffixText={sendReceive.withdrawFiatObj?.walletCode}
      />
      <Text className="fs-14 text-white-50 fw-200">
        {" "}
        <Translate
          content="Bank_account"
          component={Text}
          className="fs-14 text-white-50 fw-200"
        />
      </Text>
      <Text className="fs-20 text-white-30 d-block mb-36">
        {sendReceive.withdrawFiatObj?.accountNumber}
      </Text>
      <Text className="fs-14 text-white-50 fw-200">
        <Translate
          content="BIC_SWIFT_routing_number"
          component={Text}
          className="fs-14 text-white-50 fw-200"
        />
      </Text>
      <Text className="fs-20 text-white-30 d-block mb-36">
        {sendReceive.withdrawFiatObj?.routingNumber}
      </Text>
      <Text className="fs-14 text-white-50 fw-200">
        <Translate
          content="Bank_name"
          component={Text}
          className="fs-14 text-white-50 fw-200"
        />
      </Text>
      <Text className="fs-20 text-white-30 d-block mb-36">
        {sendReceive.withdrawFiatObj?.bankName}
      </Text>
      {/* <Text className="fs-14 text-white-50 fw-200">
        <Translate
          content="Recipient_full_name"
          component={Text}
          className="fs-14 text-white-50 fw-200"
        />
      </Text> */}
      {/* <Text className="fs-20 text-white-30 d-block mb-36">
        {sendReceive.withdrawFiatObj?.beneficiaryAccountName}
      </Text> */}
      <ul className="pl-0 ml-16 text-white-50 my-36">
        <li>
          <Translate
            className="pl-0 ml-0 text-white-50"
            content="account_details"
            component={Text}
          />{" "}
        </li>
        <li>
          <Translate
            className="pl-0 ml-0 text-white-50"
            content="Cancel_select"
            component={Text}
          />
        </li>
      </ul>
      <Form
        className="mt-36"
        name="advanced_search"
        form={form}
        //onFinish={saveWithdrwal}
        onFinish={validData==true && saveWithdrwal}
        autoComplete="off"
      >

{verifyData.twoFactorEnabled == true && (
          <Text className="fs-14 mb-8 text-white d-block fw-200">
            2FA verification code *
          </Text>
        )}
        {verifyData.twoFactorEnabled == true && (
          <Form.Item
            name="authenticator"
            className="input-label otp-verify"
            extra={
              <div>
                <Text
                  className="fs-12 text-red fw-200"
                  style={{ float: "right", color: "var(--textRed)" }}
                >
                  {invalidcode}
                </Text>
              </div>
            }
            rules={[
              {
                validator: (rule, value, callback) => {
                  var regx = new RegExp(/^[0-9]+$/);
                  if (value) {
                    if (!regx.test(value)) {
                      callback("Invalid 2fa code");
                    } else if (regx.test(value)) {
                      callback();
                    }
                  } else {
                    callback();
                  }
                }
              },
              {
                required: true,
                message: apiCalls.convertLocalLang("is_required")
              }
            ]}
            label={
              <>
                <Button type="text" onClick={getAuthenticator}>
                  VERIFY
                </Button>
              </>
            }
          >
            <Input
              type="text"
              className="cust-input text-left"
              placeholder={"Enter code"}
              maxLength={6}
              onChange={(e) => handleAuthenticator(e, "authenticator")}
              style={{ width: "100%" }}
              // disabled={inputDisable}
            />
          </Form.Item>
        )}
        {verifyData.isPhoneVerified == true && (
          <Text className="fs-14 mb-8 text-white d-block fw-200">
            Phone verification code *
          </Text>
        )}
        {verifyData.isPhoneVerified == true && (
          <Form.Item
            name="code"
            className="input-label otp-verify"
            extra={
              <div>
                <Text className="fs-12 text-white-30 fw-200">
                  {verificationText}
                </Text>
                <Text
                  className="fs-12 text-red fw-200"
                  style={{ float: "right", color: "var(--textRed)" }}
                >
                  {invalidcode}
                </Text>
              </div>
            }
            //rules={[{ required: true, message: "Is required" }]}
            rules={[
              {
                required: true,
                message: apiCalls.convertLocalLang("is_required")
              }
            ]}
            label={
              <>
                <Button type="text" onClick={getOTP} disabled={disable}>
                  {btnList[buttonText]}
                </Button>
                {tooltipVisible == true && (
                  <Tooltip
                    placement="topRight"
                    title={`Haven\'t receive code? Request new code in ${seconds}. The code will expire after 30mins.`}
                  >
                    <span className="icon md info mr-8" />
                  </Tooltip>
                )}
                <Button type="text" onClick={getOtpVerification}>
                  {verifyOtp[verifyOtpText]}
                  
                </Button>
              </>
            }
          >
            <Input
              type="text"
              className="cust-input text-left"
              placeholder={"Enter code"}
              maxLength={6}
              onKeyDown={(event) => {
                if (
                  event.currentTarget.value.length >= 6 &&
                  !(event.key == "Backspace" || event.key == "Delete")
                ) {
                  event.preventDefault();
                } else if (/^\d+$/.test(event.key)) {
                  handleOtp(event.currentTarget.value);
                } else if (event.key == "Backspace" || event.key == "Delete") {
                } else {
                  event.preventDefault();
                }
              }}
              style={{ width: "100%" }}
              onChange={(e) => handleChange(e, "code")}
               disabled={inputDisable}
            />
          </Form.Item>
        )}
        {verifyData.isEmailVerification == true && (
          <Text className="fs-14 mb-8 text-white d-block fw-200">
            Email verification code *
          </Text>
        )}
        {verifyData.isEmailVerification == true && (
          <Form.Item
            name="emailCode"
            className="input-label otp-verify"
            extra={
              <div>
                <Text className="fs-12 text-white-30 fw-200">
                  {emailVerificationText}
                </Text>
                <Text
                  className="fs-12 text-red fw-200"
                  style={{ float: "right", color: "var(--textRed)" }}
                >
                  {invalidcode}
                </Text>
              </div>
            }
            rules={[
              {
                required: true,
                message: apiCalls.convertLocalLang("is_required")
              }
            ]}
            label={
              <>
                <Button type="text" onClick={getEmail}>
                  {isResend && emailBtn[emailText]}
                </Button>
                {tooltipEmail == true && (
                  <Tooltip
                    placement="topRight"
                    title={`Haven\'t receive code? Request new code in ${seconds}. The code will expire after 30mins.`}
                  >
                    <span className="icon md info mr-8" />
                  </Tooltip>
                 
                )}
                {verify == true &&
                <Button type="text" disabled onClick={(e) => getEmailVerification(e)}>
                  {verifyText[verifyEmailText]}
                  {/* VERIFY */}
                </Button>}
              </>
            }
            
          >
            <Input
              type="text"
              className="cust-input text-left"
              placeholder={"Enter code"}
              maxLength={6}
              onKeyDown={(event) => {
                if (
                  event.currentTarget.value.length > 5 &&
                  !(event.key == "Backspace" || event.key == "Delete")
                ) {
                  event.preventDefault();
                } else if (/^\d+$/.test(event.key)) {
                  handleSendOtp(event.currentTarget.value);
                } else if (event.key == "Backspace" || event.key == "Delete") {
                } else {
                  event.preventDefault();
                }
              }}
              style={{ width: "100%" }}
              disabled={emailDisable}
              onChange={(e) => handleEmailChange(e, "Emailcode")}

            />
          </Form.Item>
        )}
      

        <Button size="large" block className="pop-btn" htmlType="submit">
          <Translate content="with_draw" component={Text} />
        </Button>
      </Form>
      <div className="text-center">
        <Translate
          content="back"
          component={Button}
          onClick={() => onCancel()}
          type="text"
          size="large"
          className="text-center text-white-30 pop-cancel fw-400 fs-16 text-center"
        />
      </div>
    </div>
  );
};

const connectStateToProps = ({ userConfig, sendReceive }) => {
  return {
    userConfig: userConfig.userProfileInfo,
    sendReceive,
    trackAuditLogData: userConfig.trackAuditLogData
  };
};
const connectDispatchToProps = (dispatch) => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode));
    },
    dispatch
  };
};
export default connect(
  connectStateToProps,
  connectDispatchToProps
)(WithdrawalFiatSummary);
