import React, { useState, useEffect } from "react";
import { Typography, Button, Form, message,In, Input,Alert } from "antd";
import Currency from "../shared/number.formate";
import { setStep } from "../../reducers/buysellReducer";
import { connect } from "react-redux";
import Translate from "react-translate-component";
import apiCalls from "../../api/apiCalls";
import NumberFormat from "react-number-format";

const WithdrawalSummary = ({
  sendReceive,
  onConfirm,
  onCancel,
  userConfig
}) => {
  const { Text } = Typography;
  const [isLoding, setIsLoding] = useState(false);
  const [form] = Form.useForm();
  const [otp, setOtp] = useState(false);
  const useOtpRef = React.useRef(null);
  const [buttonText, setButtonText] = useState('get_otp');
  const [verificationText, setVerificationText] = useState("");
  const [isResend, setIsResend] = useState(true);
  const [seconds, setSeconds] = useState("02:00");
  const [invalidcode, setInvalidCode] = useState("");
  const [validationText, setValidationText] = useState("");
  const [disable, setDisable] = useState(false);
  const [inputDisable,setInputDisable] = useState(true);
  const [showtext,setShowTimer] = useState(true);
  const [resendDisable,setResendDisable] = useState(false);
  const [msg,setMsg] = useState(false);
  const [refresh, setRefresh] = useState(false);
  const[type,setType] = useState('Send');
  const btnList = {get_otp:<Translate className="pl-0 ml-0 text-yellow-50" content="get_code" />,
 resendotp:<Translate className="pl-0 ml-0 text-yellow-50" content="resend_code"  with={{ counter: `${disable ? "(" + seconds + ")" : ""}` }} />}

              

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

  let timeInterval;
  let count = 120;
  const startTimer = () => {
  let timer= count;
  let minutes,seconds;
    timeInterval =   setInterval(function () {
      minutes = parseInt(timer / 60, 10)
      seconds = parseInt(timer % 60, 10);
       minutes = minutes < 10 ? "0" + minutes : minutes;
      seconds = seconds < 10 ? "0" + seconds : seconds;
      setSeconds( minutes + ":" + seconds);
       if (--timer < 0) {
        timer= count;
        clearInterval(timeInterval); 
        setDisable(false);
        setType("Resend");
        }
      
  }, 1000);
}

  const saveWithdrwal = async () => {
    debugger
    console.log(otp);
    let response = await apiCalls.getVerification(userConfig?.id, otp);
    if (response.ok) {
      message.destroy();
      message.success({
        content: "OTP Verified Successfully",
        className: "custom-msg",
        duration: 0.5
      });
      setIsLoding(true);
      onConfirm();
    } else {
       window.scrollTo(0, 0);
        setMsg(true);
     }
  };
  const fullNumber = userConfig.phoneNumber;
  const last4Digits = fullNumber.slice(-4);
  const maskedNumber = last4Digits.padStart(fullNumber.length, "*");

  const getOTP = async (val) => {

    setButtonText('resendotp');
    setDisable(true);
    setInputDisable(false);
    setSeconds("02:00");
    let response = await apiCalls.getCode(userConfig.id, type);
    if (response.ok) {
        startTimer ();
       setVerificationText(
        apiCalls.convertLocalLang("digit_code") + " " + maskedNumber
      );
     };
}

  return (
    
    <div className="mt-16">
       {msg &&
                <div className="custom-alert" ><Alert
                    message="Invalid code "
                    type="warning"
                    showIcon
                    closable={false}
                />
                </div>}
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
          rules={[{ required: true, message:"Is required" }]}
         label={
            <Button type="text" onClick={getOTP}  disabled={disable}>
              {isResend && btnList[buttonText]}
           </Button>
          }>
            <Input
          type="number"
            className="cust-input text-left"
            placeholder={apiCalls.convertLocalLang("verification_code")}
            maxLength={6}
            onKeyPress={(event) => 
              { debugger
               if(event.currentTarget.value.length > 5) {
                 debugger
            event.preventDefault();
          setOtp(event.currentTarget.value)}}}
               style={{ width: "100%" }}
            disabled={inputDisable}
          />
        </Form.Item>
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
  return { userConfig: userConfig.userProfileInfo, sendReceive };
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
)(WithdrawalSummary);
