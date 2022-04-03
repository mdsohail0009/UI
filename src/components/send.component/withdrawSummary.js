import React, { Component } from "react";

import { Typography, Button, Alert, message, Form, Input, Tooltip } from "antd";
import { connect } from "react-redux";
import Translate from "react-translate-component";
import Loader from "../../Shared/loader";
import Currency from "../shared/number.formate";
import { handleNewExchangeAPI, withDrawCrypto } from "../send.component/api";
import { fetchDashboardcalls } from "../../reducers/dashboardReducer";
import { setCryptoFinalRes } from "../../reducers/sendreceiveReducer";

import {
  setStep,
  setSubTitle,
  setWithdrawcrypto
} from "../../reducers/sendreceiveReducer";
import apiCalls from "../../api/apiCalls";
import { publishBalanceRfresh } from "../../utils/pubsub";
import {success,warning,error} from "../../utils/message";

class WithdrawSummary extends Component {
  state = {
    onTermsChange: false,
    isButtonLoad: false,
    usdAmount: 0,
    OneusdAmount: 0,
    errorMsg: false,
    buttonText: "get_otp",
    type: "Send",
    verificationText: "",
    otp: "",
    code: "",
    isResend: false,
    invalidcode: "",
    validationText: "",
    disable: false,
    inputDisable: true,
    showtext: true,
    timeInterval: "",
    count: 120,
    loading: false,
    comission: null,
    emailText: "get_email",
    tooltipVisible: false,
    tooltipEmail: false,
    emailVerificationText: "",
    emailDisable: true,
    textDisable: false,
    verifyVisible: false,
    emailOtp: "",
    emailCode: "",
    verifyText: "",
    verifyOtpText: "",
    otpCode: "",
    authCode: "",
    verifyData: "",
    minutes: 2,
    seconds: 0,
    inValidData:false,
  };

  useDivRef = React.createRef();
  componentDidMount() {
    this.trackEvent();
    this.props.dispatch(setSubTitle(""));
    this.handleNewExchangeRate();
    this.getVerifyData();

    this.myInterval = setInterval(() => {
      const { seconds, minutes } = this.state;

      if (seconds > 0) {
        this.setState(({ seconds }) => ({
          seconds: seconds - 1
        }));
      }
      if (seconds === 0) {
        if (minutes === 0) {
          clearInterval(this.myInterval);
        } else {
          this.setState(({ minutes }) => ({
            minutes: minutes - 1,
            seconds: 120
          }));
        }
      }
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.myInterval);
  }
  trackEvent = () => {
    apiCalls.trackEvent({
      Type: "User",
      Action: "Withdraw Crypto summary page view",
      Username: this.props.userProfile.userName,
      MemeberId: this.props.userProfile.id,
      Feature: "Withdraw Crypto",
      Remarks: "Withdraw Crypto summary page view",
      Duration: 1,
      Url: window.location.href,
      FullFeatureName: "Withdraw Crypto"
    });
  };

  onRefresh = () => {
    this.loadOneCoinData();
    this.loadData();
  };
  onCancel = () => {
    this.props.dispatch(setWithdrawcrypto(null));
    this.props.changeStep("step1");
  };
  handleNewExchangeRate = async () => {
    this.setState({ ...this.state, loading: true });
    const { totalValue, walletCode, toWalletAddress } =
      this.props.sendReceive.withdrawCryptoObj;
    let _obj = { ...this.props.sendReceive.withdrawCryptoObj };
    const response = await handleNewExchangeAPI({
      memberId: this.props?.userProfile?.id,
      amount: totalValue,
      address: toWalletAddress,
      coin: walletCode
    });
    if (response.ok) {
      _obj["comission"] = response.data?.comission;
      _obj.totalValue = response?.data?.amount;
      this.props?.dispatch(setWithdrawcrypto(_obj));
      this.setState({
        ...this.state,
        usdAmount: response.data?.amountInUsd,
        OneusdAmount: response?.data?.exchangeRate,
        loading: false,
        comission: response?.data?.comission
      });
    } else {
      this.setState({ ...this.state, loading: false });
    }
  };

  getVerifyData = async () => {
    let response = await apiCalls.getVerificationFields(
      this.props.userProfile.id
    );
    if (response.ok) {
      this.setState({ ...this.state, verifyData: response.data });
    }
  };
  getOTP = async (val) => {
    let response = await apiCalls.getCode(
      this.props.userProfile.id,
      this.state.type
    );
    if (response.ok) {
      this.setState({
        ...this.state,
        tooltipVisible: true,
        buttonText: "sentVerify",
        inputDisable: false,
        disable: true,
        verificationText:
          apiCalls.convertLocalLang("digit_code") + " " + this.maskedNumber
      });

      setTimeout(() => {
        this.setState({ buttonText: "resendotp", tooltipVisible: false });
      }, 120000);
    } else {
      this.setState({
        ...this.state,
        errorMsg: apiCalls.convertLocalLang("request_fail")
      });
    }
  };

  getEmail = async (val) => {
    let response = await apiCalls.sendEmail(
      this.props.userProfile.id,
      this.state.type
    );
    if (response.ok) {
      this.setState({
        ...this.state,
        emailText: "sentVerification",
        emailDisable: false,
        textDisable: true,
        tooltipEmail: true,
        emailVerificationText:
          apiCalls.convertLocalLang("digit_code") + " " + "your Email Id "
      });
      setTimeout(() => {
        this.setState({ emailText: "resendEmail", tooltipEmail: false });
      }, 120000);
    } else {
      this.setState({
        ...this.state,
        errorMsg: apiCalls.convertLocalLang("request_fail")
      });
    }
  };

  getEmailVerification = async (values) => {
    let response = await apiCalls.verifyEmail(
      this.props.userProfile.id,
      values.code
    );
    if (response.ok) {
      success("Email Verified successfully") 
    }
    else{error(response.data)
      setTimeout(() => {
        this.setState({ errorMsg: null });
      }, 5000);
     this.setState({...this.state,inValidData:true})
    }

    
  };

  getOtpVerification = async () => {
    let response = await apiCalls.getVerification(
      this.props.userProfile.id,
      this.state.otpCode
    );
    if (response.ok) {
      success("OTP Verified successfully") 
    } else {
      this.useDivRef.current.scrollIntoView();
      this.setState({
        ...this.state,
        errorMsg: apiCalls.convertLocalLang("invalid_code")
        
      });
      setTimeout(() => {
        this.setState({ errorMsg: null });
      }, 5000);
     this.setState({...this.state,inValidData:true})
    }
  };
  handleOtp = (val) => {
    this.setState({
      ...this.state,
      otp: val.code,
      verifyOtpText: "verifyOtpBtn",
      tooltipVisible: false,
      buttonText: ""
    });
  };

  handleSendOtp = (val) => {
    this.setState({
      ...this.state,
      emailOtp: val.emailCode,
      verifyText: "verifyBtn",
      tooltipEmail: false,
      emailText: ""
    });
  };

  getAuthenticator = async () => {
    debugger
    let response = await apiCalls.getAuthenticator(
      this.state.authCode,
      this.props.userProfile.userId
    );
    if (response.ok) {
      success("Authenticator Verified successfully") 
    } else {
      this.useDivRef.current.scrollIntoView();
      this.setState({
        ...this.state,
        errorMsg: apiCalls.convertLocalLang("invalid_code")
      });
      setTimeout(() => {
        this.setState({ errorMsg: null });
      }, 5000);
     this.setState({...this.state,inValidData:true})
    }
  };
  handleChange = (e) => {
    this.setState({ ...this.state, otpCode: e.target.value });
  };
  handleAuthenticator = (e) => {
    this.setState({ ...this.state, authCode: e.target.value });
  };
  saveWithdrwal = async (values) => {
    debugger
    if (this.state.onTermsChange) {
      let response = await apiCalls.getVerification(
        this.props.userProfile.id,
        values.code
      );

      if (response.ok) {
        message.destroy();
        message.success({
          content: "OTP verified successfully",
          className: "custom-msg",
          duration: 0.5
        });
        if (this.props.userProfile.isBusiness) {
          let saveObj = this.props.sendReceive.withdrawCryptoObj;
          let trackAuditLogData = this.props.trackAuditLogData;
          trackAuditLogData.Action = 'Save';
          trackAuditLogData.Remarks = 'Withdraw Crypto save';
          saveObj.info = JSON.stringify(trackAuditLogData)
          let resp = await withDrawCrypto(saveObj);
          if (resp.ok) {
            this.props.dispatch(setCryptoFinalRes(resp.data));
            this.props.dispatch(fetchDashboardcalls(this.props.userProfile.id));
            this.props.dispatch(setWithdrawcrypto(null));
            this.props.dispatch(setSubTitle(""));
            this.props.changeStep("withdraw_crpto_success");
            publishBalanceRfresh("success");
          }
          else{
             console.log(resp.data)
            this.setState({ ...this.state, errorMsg: resp.data });
          }
        }
        else {
          this.props.dispatch(
            setSubTitle(apiCalls.convertLocalLang("Withdraw_liveness"))
          );
          this.props.changeStep("withdraw_crypto_liveness");
        }
      } else {
        this.useDivRef.current.scrollIntoView();
        this.setState({ ...this.state, errorMsg: apiCalls.convertLocalLang("invalid_code") });
      }
    } else {
      this.setState({
        ...this.state,
        errorMsg: apiCalls.convertLocalLang("agree_termsofservice")
      });
      this.useDivRef.current.scrollIntoView();
    }
  };

  fullNumber = this.props.userProfile?.phoneNumber;
  last4Digits = this.fullNumber.slice(-4);
  maskedNumber = this.last4Digits.padStart(this.fullNumber.length, "*");

  address = this.props.sendReceive.withdrawCryptoObj?.toWalletAddress;
  firstAddress = this.address.slice(0, 4);
  lastAddress = this.address.slice(-4);

  render() {
    const { Paragraph, Text } = Typography;
    const { seconds, disable, textDisable, minutes } = this.state;
    const btnList = {
      get_otp: (
        <Translate
          className={`pl-0 ml-0 text-yellow-50 ${
            disable ? "c-notallowed" : ""
          }`}
          content="get_code"
        />
      ),
      resendotp: (
        <Translate
          className={`pl-0 ml-0 text-yellow-50 `}
          content="resend_code"
        />
      ),
      sentVerify: (
        <Translate
          className={`pl-0 ml-0 text-yellow-50 
          `}
          content="sent_verification"
          with={{ counter: `${textDisable ? "(" + seconds + ")" : ""}` }}
        />
      )
    };
    const verifyOtpText = {
      verifyOtpBtn: (
        <Translate
          className={`pl-0 ml-0 text-yellow-50 `}
          content="verify_button"
        />
      )
    };
    const emailBtn = {
      get_email: (
        <Translate
          className={`pl-0 ml-0 text-yellow-50 `}
          content="get_email"
        />
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
        <Translate
          className={`pl-0 ml-0 text-yellow-50 `}
          content="verify_btn"
        />
      )
    };

    const tooltipTimer = seconds < 10 ? `0${seconds}` : seconds;
    const tooltipValue =
      "Haven't receive code? Request new code in " +
      tooltipTimer +
      " seconds. The code will expire after 30mins.";

    if (this.state.loading) {
      return <Loader />;
    }
    return (
      <>
        <div ref={this.useDivRef}></div>
        {this.state.errorMsg && (
          <Alert
            showIcon
            type="info"
            message={apiCalls.convertLocalLang("withdraw_crypto")}
            description={this.state.errorMsg}
            closable={false}
          />
        )}
        <div className="auto-scroll">
          <div
            className="fs-36 text-white-30 fw-200 text-center"
            style={{ lineHeight: "36px" }}
          >
            <Currency
              prefix={""}
              decimalPlaces={8}
              defaultValue={
                this.props.sendReceive.withdrawCryptoObj?.totalValue
              }
              suffixText={this.props.sendReceive.withdrawCryptoObj?.walletCode}
            />{" "}
          </div>
          <div className="text-white-50 fw-400 text-center fs-14 mb-16">
            <Currency
              defaultValue={this.state.usdAmount}
              prefix={""}
              decimalPlaces={8}
              type={"text"}
              suffixText={"USD"}
            />
          </div>
          <div className="pay-list fs-14">
            <Translate
              className="fw-400 text-white"
              content="exchange_rate"
              component={Text}
            />
            <Currency
              defaultValue={this.state.OneusdAmount}
              decimalPlaces={8}
              prefix={""}
              className="fw-400 text-white-30"
              prefixText={`1 ${
                this.props.sendReceive.withdrawCryptoObj?.walletCode
              } = ${"USD"}`}
            />
          </div>
          <div className="pay-list fs-14">
            <Translate
              className="fw-400 text-white"
              content="amount"
              component={Text}
            />
            <Currency
              prefix={""}
              className={"text-white"}
              decimalPlaces={8}
              defaultValue={
                this.props.sendReceive.withdrawCryptoObj?.totalValue
              }
              suffixText={this.props.sendReceive.withdrawCryptoObj?.walletCode}
            />
          </div>
          <div className="pay-list fs-14">
            <Translate
              className="fw-400 text-white"
              content="comssion"
              component={Text}
            />
            <Text
              className="fw-400 text-white"
              style={{
                width: "250px",
                textOverflow: "ellipsis",
                overflow: "hidden",
                whiteSpace: "nowrap",
                textAlign: "end"
              }}
            >
              {this.state?.comission}
            </Text>
          </div>
          <div className="pay-list fs-14">
            <Translate
              className="fw-400 text-white"
              content="address"
              component={Text}
            />
            <Text className="fw-400 text-white">
              {this.firstAddress + "................" + this.lastAddress}
            </Text>
          </div>
          <Form
            className="mt-36"
            name="advanced_search"
            autoComplete="off"
            form={this.form}
            onFinish={this.saveWithdrwal}
          >

{this.state.verifyData.twoFactorEnabled == true && (
              <Text className="fs-14 mb-8 text-white d-block fw-200">
               2FA verification code *
              </Text>
            )}
            {this.state.verifyData.twoFactorEnabled == true && (
              <Form.Item
                name="authenticator"
                className="input-label otp-verify"
                extra={
                  <div>
                    <Text
                      className="fs-12 text-red fw-200"
                      style={{ float: "right", color: "var(--textRed)" }}
                    >
                      {this.state.invalidcode}
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
                      message: apiCalls.convertLocalLang('is_required')
                  }
                 
                ]}                
                label={
                  <>
                    <Button type="text" onClick={this.getAuthenticator}>
                      VERIFY
                    </Button>
                  </>
                }
              >
                <Input
                  type="text"
                  className="cust-input text-left"
                  //placeholder={apiCalls.convertLocalLang("verification_code")}
                  maxLength={6}
                  onChange={(e) => this.handleAuthenticator(e, "authenticator")}
                  style={{ width: "100%" }}
                />
              </Form.Item>
            )}

            {this.state.verifyData.isPhoneVerified == true && (
              <Text className="fs-14 mb-8 text-white d-block fw-200">
                Phone verification code *
              </Text>
            )}
            {this.state.verifyData.isPhoneVerified == true && (
              <Form.Item
                name="code"
                className="input-label otp-verify"
                extra={
                  <div>
                    <Text className="fs-12 text-white-30 fw-200">
                      {this.state.verificationText}
                    </Text>
                    <Text
                      className="fs-12 text-red fw-200"
                      style={{ float: "right", color: "var(--textRed)" }}
                    >
                      {this.state.invalidcode}
                    </Text>
                  </div>
                }
                rules={[{ required: true, message: "Is required" }]}
                label={
                  <>
                    <Button
                      type="text"
                      onClick={this.getOTP}
                      disabled={this.state.disable}
                    >
                      {btnList[this.state.buttonText]}
                    </Button>
                    {this.state.tooltipVisible == true && (
                      <Tooltip placement="topRight" title={tooltipValue}>
                        <span className="icon md info mr-8" />
                      </Tooltip>
                    )}
                    <Button type="text" onClick={this.getOtpVerification}>
                      {verifyOtpText[this.state.verifyOtpText]}
                    </Button>
                  </>
                }
              >
                <Input
                  type="text"
                  className="cust-input text-left"
                  //placeholder={apiCalls.convertLocalLang("verification_code")}
                  maxLength={6}
                  onKeyDown={(event) => {
                    if (
                      event.currentTarget.value.length >= 6 &&
                      !(event.key == "Backspace" || event.key == "Delete")
                    ) {
                      event.preventDefault();
                    } else if (/^\d+$/.test(event.key)) {
                      this.handleOtp(event.currentTarget.value);
                    } else if (
                      event.key == "Backspace" ||
                      event.key == "Delete"
                    ) {
                    } else {
                      event.preventDefault();
                    }
                  }}
                  style={{ width: "100%" }}
                  onChange={(e) => this.handleChange(e, "code")}
                />
              </Form.Item>
            )}
            {this.state.verifyData.isEmailVerification == true && (
              <Text className="fs-14 mb-8 text-white d-block fw-200">
                Email verification code *
              </Text>
            )}
            {this.state.verifyData.isEmailVerification == true && (
              <Form.Item
                name="emailCode"
                className="input-label otp-verify"
                extra={
                  <div>
                    <Text className="fs-12 text-white-30 fw-200">
                      {this.state.emailVerificationText}
                    </Text>
                    <Text
                      className="fs-12 text-red fw-200"
                      style={{ float: "right", color: "var(--textRed)" }}
                    >
                      {this.state.invalidcode}
                    </Text>
                  </div>
                }
                rules={[{ required: true, message: "Is required" }]}
                label={
                  <>
                    <Button type="text" onClick={this.getEmail}>
                      {emailBtn[this.state.emailText]}
                    </Button>
                    {this.state.tooltipEmail == true && (
                      <Tooltip placement="topRight" title={tooltipValue}>
                        <span className="icon md info mr-8" />
                      </Tooltip>
                    )}
                    {/* {this.state.tooltipEmail==true &&(

                    )} */}
                    {/* {this.state.verifyVisible == true && ( */}

                    <Button
                      type="text"
                      onClick={(e) => this.getEmailVerification(e)}
                    >
                      {verifyText[this.state.verifyText]}
                    </Button>

                    {/* )}  */}
                  </>
                }
              >
                <Input
                  type="text"
                  className="cust-input text-left"
                  //placeholder={apiCalls.convertLocalLang("verification_code")}
                  maxLength={6}
                  onKeyDown={(event) => {
                    if (
                      event.currentTarget.value.length > 5 &&
                      !(event.key == "Backspace" || event.key == "Delete")
                    ) {
                      event.preventDefault();
                    } else if (/^\d+$/.test(event.key)) {
                      this.handleSendOtp(event.currentTarget.value);
                    } else if (
                      event.key == "Backspace" ||
                      event.key == "Delete"
                    ) {
                    } else {
                      event.preventDefault();
                    }
                  }}
                  style={{ width: "100%" }}
                  // disabled={this.state.emailDisable}
                />
              </Form.Item>
            )}
        
            <div className="d-flex p-16 mb-36 agree-check">
              <label>
                <input
                  type="checkbox"
                  id="agree-check"
                  checked={this.state.onTermsChange}
                  onChange={({ currentTarget: { checked } }) => {
                    this.setState({ onTermsChange: checked ? true : false });
                  }}
                />
                <span for="agree-check" />
              </label>

              <Paragraph
                className="fs-14 text-white-30 ml-16 mb-0"
                style={{ flex: 1 }}
              >
                <Translate content="agree_sell" component="Paragraph" />{" "}
                <a
                  className="textpure-yellow"
                  href="https://www.iubenda.com/terms-and-conditions/42856099"
                  target="_blank"
                >
                  <Translate content="terms" component="Text" />
                </a>{" "}
                <Translate content="refund_cancellation" component="Text" />
              </Paragraph>
            </div>

            <Button size="large" block className="pop-btn" htmlType="submit">
              <Translate content="with_draw" component={Text} />
            </Button>
          </Form>
          <div className="text-center mt-16">
            <Translate
              content="cancel"
              component={Button}
              onClick={() => this.onCancel()}
              type="text"
              size="large"
              className="text-white-30 pop-cancel fw-400"
            />
          </div>
        </div>
      </>
    );
  }
}

const connectStateToProps = ({ sendReceive, userConfig }) => {
  return {
    sendReceive,
    userProfile: userConfig.userProfileInfo,
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
)(WithdrawSummary);
