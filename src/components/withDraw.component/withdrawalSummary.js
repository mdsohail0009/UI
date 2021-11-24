import React, { useState } from "react";
import {
  Typography,
  Button,
  Form,
  Input,
  Row,
  Col,
  Search,
  Tooltip,
  message
} from "antd";
import Currency from "../shared/number.formate";
import { setStep } from "../../reducers/buysellReducer";
import { connect } from "react-redux";
import Translate from "react-translate-component";
import { useEffect } from "react";
import apicalls from "../../api/apiCalls";

const WithdrawalSummary = ({
  sendReceive,
  onConfirm,
  onCancel,
  userConfig
}) => {
  const { Text } = Typography;
  const [isLoding, setIsLoding] = useState(false);
  const text = (
    <span>
      Haven't recieved code?Request new code in 6 seconds.The code will expire
      after 30 mins.
    </span>
  );
  const [show, setShow] = useState(false);
  const delay = 5;
  const [otpSuccess, setotpSuccess] = useState(false);
  const [form] = Form.useForm();
  const [otp, setOtp] = useState("");
  const useOtpRef = React.useRef(null);
  const [isResendAvailable,setisResendAvailable]=useState("false");
  const [buttonText,setButtonText]=useState("GET CODE");


  useEffect(() => {
    console.log(userConfig.id);
  });

  const saveWithdrwal = async () => {
    let response = await apicalls.getVerification(userConfig.id, otp);

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
      message.destroy();
      message.error({
        content: response.data,
        className: "custom-msg",
        duration: 0.5
      });
    }
   
  };
  const getOTP = async (val) => {
    let response = await apicalls.getCode(userConfig.id);
    if (response.ok) {
      console.log(response);
    }
    setTimeout(() => {
      setButtonText("RESEND CODE");
    }, 30000);
  }
 
  const fullNumber = userConfig.phoneNumber;
  const last4Digits = fullNumber.slice(-4);
  const maskedNumber = last4Digits.padStart(fullNumber.length, "*");

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
        //initialValues={otpObj}
        name="advanced_search"
        form={form}
        onFinish={saveWithdrwal}
        autoComplete="off"
      >
        <Form.Item
          name="code"
          className="input-label otp-verify my-36"
          extra={
            <Text className="fs-12 text-white-30 fw-200">
              Enter 6 digit code sent to {maskedNumber}
            </Text>
          }
        >
          <Input
            className="cust-input text-left"
            placeholder="Enter Verification Code"
            maxLength={6}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button type="text" onClick={getOTP} >
            {buttonText}
          </Button>
               
          {/* <Button type="text">RESEND CODE</Button> */}
        </Form.Item>
        <Button
          disabled={isLoding}
          size="large"
          block
          className="pop-btn"
          //onClick={saveWithdrwal}
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
