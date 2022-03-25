import React, { useState, useEffect } from "react";
import {
  Typography,
  Button,
  Form,
  message,
  In,
  Input,
  Alert,
  Tooltip
} from "antd";
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
  //const [seconds, setSeconds] = useState("02:00");
  const [invalidcode, setInvalidCode] = useState("");
  const [verifyData, setVerifyData] = useState({});
  const [validationText, setValidationText] = useState("");
  const [disable, setDisable] = useState(false);
  const [inputDisable, setInputDisable] = useState(true);
  const [showtext, setShowTimer] = useState(true);
  const [resendDisable, setResendDisable] = useState(false);
  const [errorMsg, setMsg] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const [type, setType] = useState("Send");
  const [textDisable, setTextDisable] = useState(false);
  const [emailText, setEmailText] = useState("get_email");
  const [emailDisable, setEmailDisable] = useState(true);
  const [tooltipVisible, setTooltipVisible] = useState(false);
  const [emailVerificationText, setEmailVerificationText] = useState("");
  const [authCode, setAuthCode] = useState("");
  const [otpCode, setOtpCode] = useState("");
  const [verifyOtpText, setVerifyOtpText] = useState("");
  const [seconds, setSeconds] = useState(0);
  const [minutes, setMinutes] = useState(2);
  const btnList = {
    get_otp: (
      <Translate className="pl-0 ml-0 text-yellow-50" content="get_code" />
    ),
    resendotp: (
      <Translate
        className="pl-0 ml-0 text-yellow-50"
        content="resend_code"
        with={{ counter: `${disable ? "(" + seconds + ")" : ""}` }}
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
    verifyBtn: (
      <Translate className={`pl-0 ml-0 text-yellow-50 `} content="verify_btn" />
    )
  };

  useEffect(() => {
    withdrawSummayTrack();
    getVerifyData();

    let myInterval
    myInterval = setInterval(() => {
      debugger
      //const { seconds, minutes }=useState

      if (seconds > 0) {
        setSeconds(seconds-1)
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(myInterval);
        } 
        else {
          setMinutes(minutes-1)
          setSeconds(119)
        }
        console.log(seconds)
      }
    }, 1000);
   

  }, []);

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

  // let timeInterval;
  // let count = 120;
  // const startTimer = () => {
  //   debugger;
  //   let timer = count;
  //   let minutes, seconds;
  //   timeInterval = setInterval(function () {
  //     minutes = parseInt(timer / 60, 10);
  //     seconds = parseInt(timer % 60, 10);
  //     minutes = minutes < 10 ? "0" + minutes : minutes;
  //     seconds = seconds < 10 ? "0" + seconds : seconds;
  //     setSeconds(minutes + ":" + seconds);
  //     if (--timer < 0) {
  //       timer = count;
  //       clearInterval(timeInterval);
  //       setDisable(false);
  //       setType("Resend");
  //     }
  //   }, 1000);
  // };

  const saveWithdrwal = async (values) => {
    debugger;
    // let response = await apiCalls.getVerification(userConfig?.id, values.code);
    //if (response.ok) {
    // message.destroy();
    // message.success({
    //   content: "OTP verified successfully",
    //   className: "custom-msg",
    //   duration: 0.5
    // });
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
    if (withdrawal.ok) {
      dispatch(setWithdrawFinalRes(withdrawal.data));
      dispatch(fetchDashboardcalls(userConfig.id));
      dispatch(rejectWithdrawfiat());
      changeStep("step7");
    } else {
      setMsg(withdrawal.data);
      useOtpRef.current.scrollIntoView();
    }
    // }
    //  else {
    //   useOtpRef.current.scrollIntoView();
    //   setMsg(apiCalls.convertLocalLang("invalid_code"));
    // }
  };
  const onCancel = () => {
    changeStep("step1");
    dispatch(setWithdrawfiatenaable(true));
  };
  const fullNumber = userConfig.phoneNumber;
  const last4Digits = fullNumber.slice(-4);
  const maskedNumber = last4Digits.padStart(fullNumber.length, "*");

  const getVerifyData = async () => {
    debugger;
    let response = await apiCalls.getVerificationFields(userConfig.id);
    if (response.ok) {
      console.log(response.data);
      setVerifyData(response.data);
      console.log(verifyData);
    }
  };

  const getEmail = async (val) => {
    debugger;
    let response = await apiCalls.sendEmail(userConfig.id, type);
    if (response.ok) {
      console.log(response);
      setEmailText("sentVerification");
      setEmailDisable(false);
      setTextDisable(true);
      setTooltipVisible(true);
      setEmailVerificationText(
        apiCalls.convertLocalLang("digit_code") + " " + "your Email Id "
      );
      setTimeout(() => {
        setEmailText("resendEmail");
      }, 8000);
      setTimeout(() => {
        setTooltipVisible(false);
      }, 8000);
    } else {
      setMsg(apiCalls.convertLocalLang("request_fail"));
    }
  };
  const getEmailVerification = async (values) => {
    debugger;
    let response = await apiCalls.verifyEmail(userConfig.id, values.code);
    if (response.ok) {
      message.destroy();
      message.success({
        content: "Email verified successfully",
        className: "custom-msg",
        duration: 0.5
      });
    }
  };
  setTimeout(() => console.log(verifyData), 5000);
  // const getOTP = async (val) => {
  //   debugger
  //   let response = await apiCalls.getCode(userConfig.id, type);
  //   if (response.ok) {
  //     setButtonText("resendotp");
  //     setDisable(true);
  //     setInputDisable(false);
  //     setSeconds("02:00");
  //     setVerificationText(
  //       apiCalls.convertLocalLang("digit_code") + " " + maskedNumber
  //     );
  //     startTimer();
  //   } else {
  //     useOtpRef.current.scrollIntoView();
  //     setMsg(apiCalls.convertLocalLang("request_fail"));
  //   }
  // };

  const getOTP = async (val) => {
    let response = await apiCalls.getCode(userConfig.id, type);
    if (response.ok) {
      console.log(response);

      setTooltipVisible(true);
      setButtonText("sentVerify");
      setInputDisable(false);
      setDisable(true);
      setVerificationText(
        apiCalls.convertLocalLang("digit_code") + " " + maskedNumber
      );

      setTimeout(() => {
        setButtonText("resendotp");
      }, 8000);
      setTimeout(() => {
        setTooltipVisible(false);
      }, 8000);
    } else {
      setMsg(apiCalls.convertLocalLang("request_fail"));
    }
  };

  const getOtpVerification = async () => {
    let response = await apiCalls.getVerification(userConfig.id, otpCode);
    if (response.ok) {
      message.destroy();
      message.success({
        content: "OTP verified successfully",
        className: "custom-msg",
        duration: 0.5
      });
    } else {
      useOtpRef.current.scrollIntoView();

      setMsg(apiCalls.convertLocalLang("invalid_code"));
    }
  };
  const handleChange = (e) => {
    setOtpCode(e.target.value);
  };
  const handleOtp = (val) => {
    setOtp(val.code);
    setVerifyOtpText("verifyOtpBtn");
    setTooltipVisible(false);
    setButtonText("");
  };
  const getAuthenticator = async () => {
    let response = await apiCalls.getAuthenticator(authCode, userConfig.userId);
    if (response.ok) {
      message.destroy();
      message.success({
        content: "Authenticator verified successfully",
        className: "custom-msg",
        duration: 0.5
      });
    } else {
      useOtpRef.current.scrollIntoView();

      setMsg(apiCalls.convertLocalLang("invalid_code"));
    }
  };
  const handleAuthenticator = (e) => {
    setAuthCode(e.target.value);
  };

  const tooltipTimer = seconds < 10 ? `0${seconds}` : seconds;
  console.log(tooltipTimer);
  const tooltipValue =
    "Haven't receive code?Request new code in " +
    tooltipTimer +
    " seconds. The code will expire after 30mins.";

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
      <Text className="fs-14 text-white-50 fw-200">
        <Translate
          content="Recipient_full_name"
          component={Text}
          className="fs-14 text-white-50 fw-200"
        />
      </Text>
      <Text className="fs-20 text-white-30 d-block mb-36">
        {sendReceive.withdrawFiatObj?.beneficiaryAccountName}
      </Text>
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
        onFinish={saveWithdrwal}
        autoComplete="off"
      >
        {/* <Form.Item
          name="code"
          className="input-label otp-verify mt-36"
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
          rules={[{ required: true, message: "Is required" }]}
          label={
            <Button type="text" onClick={getOTP} disabled={disable}>
              {isResend && btnList[buttonText]}
            </Button>
          }
        >
          <Input
            type="text"
            className="cust-input text-left"
            placeholder={apiCalls.convertLocalLang("verification_code")}
            maxLength={6}
            onKeyDown={(event) => {
              if (
                event.currentTarget.value.length > 5 &&
                !(event.key == "Backspace" || event.key == "Delete")
              ) {
                event.preventDefault();
              } else if (/^\d+$/.test(event.key)) {
                setOtp(event.currentTarget.value);
              } else if (event.key == "Backspace" || event.key == "Delete") {
              } else {
                event.preventDefault();
              }
            }}
            style={{ width: "100%" }}
            disabled={inputDisable}
          />
        </Form.Item> */}
        {verifyData.isPhoneVerified == true && (
          <Text className="fs-14 mb-4 text-white d-block fw-200">
            Phone verification code *
          </Text>
        )}
        {verifyData.isPhoneVerified == true && (
          <Form.Item
            name="code"
            className="input-label otp-verify my-36"
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
            rules={[{ required: true, message: "Is required" }]}
            label={
              <>
                <Button type="text" onClick={getOTP} disabled={disable}>
                  {btnList[buttonText]}
                </Button>
                {tooltipVisible == true && (
                  <Tooltip
                    placement="topRight"
                    // title="Haven't receive code?Request new code in 44 seconds. The code will expire after 30mins."
                    title={tooltipValue}
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
              placeholder={apiCalls.convertLocalLang("verification_code")}
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
              // disabled={this.state.inputDisable}
            />
          </Form.Item>
        )}
        {verifyData.isEmailVerification == true && (
          <Text className="fs-14 mb-4 text-white d-block fw-200">
            Email verification code *
          </Text>
        )}
        {/* {verifyData.isEmailVerification == true && ( */}
        <Form.Item
          name="emailCode"
          className="input-label otp-verify my-36"
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
          rules={[{ required: true, message: "Is required" }]}
          label={
            <>
              <Button type="text" onClick={getEmail}>
                {isResend && emailBtn[emailText]}
                {/* {isResend && btnList[buttonText]} */}
              </Button>
              {tooltipVisible == true && (
                <Tooltip
                  placement="topRight"
                  // title={`Haven\'t receive code?Request new code in 120 seconds. The code will expire after 30mins.`}
                  title={tooltipValue}
                >
                  <span className="icon md info mr-8" />
                </Tooltip>
              )}
              {/* {this.state.verifyVisible == true && ( */}
              <Button type="text" onClick={(e) => getEmailVerification(e)}>
                {verifyText[verifyText]}
              </Button>
              {/* )}  */}
            </>
          }

          //   className="input-label otp-verify"
          //   rules={[{ required: true, message: "Is required" }]}
          //   help={<Text className="fs-12 text-white-30 fw-200">
          //   Enter the 6 digit sent to 905***9290
          // </Text>}
        >
          <Input
            type="text"
            className="cust-input text-left"
            placeholder={apiCalls.convertLocalLang("verification_code")}
            maxLength={6}
            onKeyDown={(event) => {
              if (
                event.currentTarget.value.length > 5 &&
                !(event.key == "Backspace" || event.key == "Delete")
              ) {
                event.preventDefault();
              } else if (/^\d+$/.test(event.key)) {
                this.handleSendOtp(event.currentTarget.value);
              } else if (event.key == "Backspace" || event.key == "Delete") {
              } else {
                event.preventDefault();
              }
            }}
            style={{ width: "100%" }}
            // disabled={this.state.emailDisable}
          />
        </Form.Item>
        {/* )} */}
        {verifyData.twoFactorEnabled == true && (
          <Text className="fs-14 mb-4 text-white d-block fw-200">
            Email verification code *
          </Text>
        )}
        {verifyData.twoFactorEnabled == true && (
          <Form.Item
            name="authenticator"
            className="input-label otp-verify my-36"
            extra={
              <div>
                {/* <Text className="fs-12 text-white-30 fw-200">
                    {this.state.emailVerificationText}
                  </Text> */}
                <Text
                  className="fs-12 text-red fw-200"
                  style={{ float: "right", color: "var(--textRed)" }}
                >
                  {invalidcode}
                </Text>
              </div>
            }
            rules={[{ required: true, message: "Is required" }]}
            label={
              <>
                <Button type="text" onClick={getAuthenticator}>
                  Verify
                </Button>
              </>
            }
          >
            <Input
              type="text"
              className="cust-input text-left"
              placeholder={apiCalls.convertLocalLang("verification_code")}
              maxLength={6}
              onChange={(e) => handleAuthenticator(e, "authenticator")}
              style={{ width: "100%" }}
            />
          </Form.Item>
        )}
        <h1>Time Remaining: {seconds < 10 ? `0${seconds}` : seconds}</h1>

        <Button
          //disabled={isLoding}
          size="large"
          block
          className="pop-btn"
          htmlType="submit"
        >
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
