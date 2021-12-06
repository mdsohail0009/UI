import React, { Component } from "react";
import { Typography, Button, Alert, message, Form } from "antd";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import Translate from "react-translate-component";
import Loader from "../../Shared/loader";
import SuisseBtn from "../shared/butons";
import Currency from "../shared/number.formate";
import { convertCurrency } from "../buy.component/buySellService";
import NumberFormat from "react-number-format";
import { withDrawCrypto } from "../send.component/api";
import { fetchDashboardcalls } from "../../reducers/dashboardReducer";

import {
  setStep,
  setSubTitle,
  setWithdrawcrypto
} from "../../reducers/sendreceiveReducer";
import apiCalls from "../../api/apiCalls";
const LinkValue = (props) => {
  return (
    <Translate
      className="text-defaultylw textpure-yellow text-underline c-pointer"
      content={props.content}
      component={Link}
      onClick={() =>
        window.open(
          "https://www.iubenda.com/terms-and-conditions/42856099",
          "_blank"
        )
      }
    />
  );
};
class WithdrawSummary extends Component {
  state = {
    onTermsChange: false,
    isButtonLoad: false,
    usdAmount: 0,
    OneusdAmount: 0,
    errorMsg: false,
    usdLoading: false,
    oneUsdLoading: false,
    buttonText: (
      <Translate className="pl-0 ml-0 text-yellow-50" content="get_code" />
    ),
    verificationText: "",
    otp: "",
    code: "",
    isResend: false,
    invalidcode: "",
    validationText: "",
    disable: false
  };
  useDivRef = React.createRef();
  componentDidMount() {
    this.loadOneCoinData();
    this.loadData();
    this.trackEvent();
    this.props.dispatch(
      setSubTitle(apiCalls.convertLocalLang("withdrawSummary"))
    );
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
  loadData = async () => {
    this.setState({ ...this.state, usdLoading: true });
    const value = await convertCurrency({
      from: this.props.sendReceive.withdrawCryptoObj?.walletCode,
      to: "USD",
      value: this.props.sendReceive.withdrawCryptoObj?.totalValue,
      isCrypto: false,
      memId: this.props.userProfile.id,
      screenName: "withdrawcrypto"
    });
    this.setState({ ...this.state, usdAmount: value, usdLoading: false });
  };
  loadOneCoinData = async () => {
    this.setState({ ...this.state, oneUsdLoading: true });
    const value = await convertCurrency({
      from: this.props.sendReceive.withdrawCryptoObj?.walletCode,
      to: "USD",
      value: 1,
      isCrypto: false,
      memId: this.props.userProfile.id,
      screenName: ""
    });
    this.setState({ ...this.state, OneusdAmount: value, oneUsdLoading: false });
  };
  onRefresh = () => {
    this.loadOneCoinData();
    this.loadData();
  };
  onCancel = () => {
    this.props.dispatch(setWithdrawcrypto(null));
    this.props.changeStep("step1");
  };

  getOTP = async (val) => {
    this.setState({ disable: true });

    let response = await apiCalls.getCode(
      this.props.userProfile.id,
      this.state.isResend
    );
    if (response.ok) {
      console.log(response);
    }

    setTimeout(() => {
      this.setState({ buttonText: apiCalls.convertLocalLang("resend_code") });
      this.setState({ isResend: true });
      this.setState({ disable: false });
    }, 120000);
    this.setState({
      verificationText:
        apiCalls.convertLocalLang("digit_code") + " " + this.maskedNumber
    });
    this.setState({ validationText: apiCalls.convertLocalLang("resend_text") });
  };
  handleOtp = (val) => {
    this.setState({ ...this.state, otp: val });
  };

  onClick = async () => {
    if (this.state.onTermsChange) {
      let response = await apiCalls.getVerification(
        this.props.userProfile.id,
        this.state.otp
      );

      if (response.ok) {
        message.destroy();
        message.success({
          content: "OTP Verified Successfully",
          className: "custom-msg",
          duration: 0.5
        });

        let saveObj = this.props.sendReceive.withdrawCryptoObj;
        this.props.trackAuditLogData.Action = "Save";
        this.props.trackAuditLogData.Remarks = "Withdraw Crypto save";
        saveObj.info = JSON.stringify(this.props.trackAuditLogData);
        let withdrawal = await withDrawCrypto(saveObj);
        if (withdrawal.ok) {
          this.props.dispatch(fetchDashboardcalls(this.props.userProfile.id));
          //setIsWithdrawSuccess(true)
          this.props.dispatch(setWithdrawcrypto(null));
          this.props.dispatch(setSubTitle(""));
          this.props.changeStep("withdraw_crpto_success");
        }

        // this.props.dispatch(
        //   setSubTitle(apiCalls.convertLocalLang("Withdraw_liveness"))
        // );
        // this.props.changeStep("withdraw_crypto_liveness");
      } else {
        message.destroy();
        message.error({
          content: this.setState({
            invalidcode: apiCalls.convertLocalLang("invalid_code")
          }),
          className: "custom-msg",
          duration: 0.5
        });
      }

      this.setState({ ...this.state, errorMsg: false });
      // if (this.props.userProfile.isBusiness) {
      //     let saveObj = this.props.sendReceive.withdrawCryptoObj;
      //     let withdrawal = await withDrawCrypto(saveObj)
      //     if (withdrawal.ok) {
      //         this.props.dispatch(fetchDashboardcalls(this.props.userProfile.id))
      //         //setIsWithdrawSuccess(true)
      //         this.props.dispatch(setWithdrawcrypto(null))
      //         this.props.dispatch(setSubTitle(""));
      //         this.props.changeStep('withdraw_crpto_success');
      //         appInsights.trackEvent({
      //             name: 'Withdraw Crypto', properties: { "Type": 'User', "Action": 'save', "Username": this.props.userProfile.userName, "MemeberId": this.props.userProfile.id, "Feature": 'Withdraw Crypto', "Remarks": 'Withdraw crypto save', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Withdraw Crypto' }
      //         });
      //     }
      // } else {

      // }
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
  render() {
    const { Paragraph, Text } = Typography;
    if (this.state.usdLoading || this.state.oneUsdLoading) {
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
              prefixText={"USD"}
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
              prefixText={`1 ${this.props.sendReceive.withdrawCryptoObj?.walletCode
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
              content="address"
              component={Text}
            />
            <Text className="fw-400 text-white">
              {this.props.sendReceive.withdrawCryptoObj?.toWalletAddress}
            </Text>
          </div>
          <Form
            className="mt-36"
            name="advanced_search"
            autoComplete="off"
            form={this.form}
          >
            <div>
              <Form.Item
                name="code"
                className="input-label otp-verify my-36"
                extra={
                  <Text className="fs-12 text-white-30 fw-200">
                    {this.state.verificationText}
                  </Text>
                }
                rules={[{ required: true, message: "Is required" }]}
                label={
                  <Button type="text" onClick={this.getOTP}>
                    {this.state.buttonText}
                  </Button>
                }
              >
                <NumberFormat
                  className="cust-input text-left"
                  placeholder={apiCalls.convertLocalLang("verification_code")}
                  maxLength={6}
                  onChange={(e) => this.handleOtp(e.target.value)}
                  style={{ width: '100%' }}
                />

              </Form.Item>
              <div>
                <Text className="fs-12 text-white-30 fw-200">
                  {this.state.invalidcode}
                </Text>
                <Text className="fs-12 text-white-30 fw-200">
                  {this.state.validationText}
                </Text>
              </div>

            </div>


            <Translate
              className="fs-14 text-center text-white-30 mt-24"
              content="summary_hint_text"
              component={Paragraph}
            />
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
            {/* <SuisseBtn
              className={"pop-btn"}
              htmlType="submit"
              onRefresh={() => this.onRefresh()}
              title={"confirm_btn_text"}
              loading={this.state.isButtonLoad}
              autoDisable={true}
              onClick={() => this.onClick()}
            /> */}
            <Button
              size="large"
              block
              className="pop-btn"
              htmlType="submit"
              onClick={() => this.onClick()}
            >
              <Translate content="Confirm" component={Text} />
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
