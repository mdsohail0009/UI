import React, { useState, useEffect } from "react";
import { Typography, Button, Form, message,In, Input } from "antd";
import Currency from "../shared/number.formate";
import { setStep } from "../../reducers/buysellReducer";
import { connect } from "react-redux";
import Translate from "react-translate-component";
import apiCalls from "../../api/apiCalls";
import {withdrawSave,} from "../../api/apiServer";
import { fetchDashboardcalls } from "../../reducers/dashboardReducer";
import {setWithdrawfiat,rejectWithdrawfiat,setWithdrawfiatenaable} from "../../reducers/sendreceiveReducer";

const WithdrawalFiatSummary = ({sendReceive,userConfig, changeStep,dispatch,trackAuditLogData}) => {
  const { Text } = Typography;
  const [isLoding, setIsLoding] = useState(false);
  const [form] = Form.useForm();
  const [otp, setOtp] = useState(false);
  const useOtpRef = React.useRef(null);
  const [buttonText, setButtonText] = useState(
    <Translate className="pl-0 ml-0 text-yellow-50" content="get_code" />
  );
  const [verificationText, setVerificationText] = useState("");
  const [isResend, setIsResend] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [invalidcode, setInvalidCode] = useState("");
  const [validationText, setValidationText] = useState("");
  const [disable, setDisable] = useState(false);
  const[inputDisable,setInputDisable]=useState(true);
  const[showtext,setShowText]=useState(true);
  const[resendDisable,setResendDisable]=useState(false)

  useEffect(() => {
    withdrawSummayTrack();
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
  }
  const saveWithdrwal = async () => {
    let response = await apiCalls.getVerification(userConfig?.id, otp);
    if (response.ok) {
      message.destroy();
      message.success({
        content: "OTP Verified Successfully",
        className: "custom-msg",
        duration: 0.5
      });
      setIsLoding(true);
     
    } else {
      message.destroy();
      message.error({
        //content:setInvalidCode(apiCalls.convertLocalLang("invalid_code").toString()),  
        content:"Invalid Code",
        className: "custom-msg",
        duration: 2.0
        //error: response.status === 401 ? response.data.message : response.data,
        
      });
    }
    let Obj = Object.assign({}, sendReceive.withdrawFiatObj);
    Obj.accountNumber = apiCalls.encryptValue(Obj.accountNumber, userConfig?.sk);
    Obj.bankName = apiCalls.encryptValue(Obj.bankName, userConfig?.sk);
    Obj.routingNumber = apiCalls.encryptValue(Obj.routingNumber, userConfig?.sk);
    Obj.bankAddress = apiCalls.encryptValue(Obj.bankAddress, userConfig?.sk);
    Obj.beneficiaryAccountAddress = apiCalls.encryptValue(Obj.beneficiaryAccountAddress, userConfig?.sk);
    Obj.beneficiaryAccountName = apiCalls.encryptValue(Obj.beneficiaryAccountName, userConfig?.sk);
    Obj.info = JSON.stringify(trackAuditLogData);
    let withdrawal = await withdrawSave(Obj);
    if (withdrawal.ok) {
      dispatch(fetchDashboardcalls(userConfig.id));
      dispatch(rejectWithdrawfiat());
      changeStep("step7");
    }
  };
  const onCancel = () =>{
    changeStep("step1");
    dispatch(setWithdrawfiatenaable(true))
  }
  const fullNumber = userConfig.phoneNumber;
  const last4Digits = fullNumber.slice(-4);
  const maskedNumber = last4Digits.padStart(fullNumber.length, "*");

  const getOTP = async (val) => {
    setInputDisable(false)
    setDisable(true)
    let response = await apiCalls.getCode(userConfig.id, isResend);
    if (response.ok) {
      setTimeout(() => {
        setButtonText(<Translate className="pl-0 ml-0 text-yellow-50" content="resend_code" />);
        setDisable(false)
      }, 120000);
      setVerificationText(
        apiCalls.convertLocalLang("digit_code") + " " + maskedNumber
      );
      setValidationText(<Translate className="pl-0 ml-0 text-yellow-50" content="resend_text" />);
      setShowText(true);
      setTimeout(()=>{setShowText(false)},120000)
    }
  };

  return (
    <div className="mt-16">
      <Text className="fs-14 text-white-50 fw-200">
        {" "}
        <Translate
          content="amount"
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
      <div ref={useOtpRef}></div>

      <Form
        className="mt-36"
        name="advanced_search"
        form={form}
        onFinish={saveWithdrwal}
        autoComplete="off"
      >
        <Form.Item
          name="code"
          className="input-label otp-verify my-36"
          extra={
            <div><Text className="fs-12 text-white-30 fw-200">
              {verificationText}
            </Text>
            <Text className="fs-12 text-red fw-200" style={{float: "right", color: 'var(--textRed)'}}>
            {invalidcode}
          </Text></div>
          }
          rules={[{ required: true, message: "Is required" }]}
          label={
            <Button type="text" onClick={getOTP} disabled={disable}>
              {buttonText}
              {/* {seconds} */}
            </Button>
          }
        >
          <Input
          type="text"
            className="cust-input text-left"
            placeholder={apiCalls.convertLocalLang("verification_code")}
            maxLength={6}
            onChange={(e) => {
              setOtp(e.target.value);
            }}
            style={{ width: "100%" }}
            disabled={inputDisable}
          />
        </Form.Item>
        <div>
        {showtext &&<Text className="fs-12 text-white-30 text-center d-block mb-16 fw-200">
          {validationText}
        </Text>}
        </div>
        

        <Button
          disabled={isLoding}
          size="large"
          block
          className="pop-btn"
          htmlType="submit"
        >
          <Translate content="Confirm" component={Text} />
        </Button>
      </Form>
      <div className="text-center">
        <Translate
          content="back"
          component={Button}
          onClick={() => onCancel()}
          type="text"
          size="large"
          className="text-center text-white-30 pop-cancel fw-400 fs-14 text-upper text-center"
        />
      </div>
    </div>
  );
};

const connectStateToProps = ({ userConfig, sendReceive }) => {
  return { userConfig: userConfig.userProfileInfo, sendReceive,  trackAuditLogData: userConfig.trackAuditLogData };
};
const connectDispatchToProps = (dispatch) => {
  return {
    changeStep: (stepcode) => {
      dispatch(setStep(stepcode));
    },
    dispatch
  };
};
export default connect(connectStateToProps,connectDispatchToProps)(WithdrawalFiatSummary);
