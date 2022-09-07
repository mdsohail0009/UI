import React, { useState, useEffect } from "react";
import { Typography, Button, Form, Input, Alert, Tooltip, Row, Col, Checkbox, Modal, message } from "antd";
import { getCode, getVerification, sendEmail, verifyEmailCode, getAuthenticator, getVerificationFields } from "./api";
import { connect } from 'react-redux';
import NumberFormat from "react-number-format";
import { setData } from "@telerik/kendo-intl";

const Verifications = (props) => {

    const [verifyData, setVerifyData] = useState({});
    const [isLoading, setIsLoading] = useState(false)
    const [email, setEmail] = useState({showRuleMsg:'',errorMsg:'',btnName:'get_otp',requestType:'Send',code:''});
    const [phone, setPhone] = useState({showRuleMsg:'',errorMsg:'',btnName:'get_otp',requestType:'Send'});
    const [authenticator, setAuthenticator] = useState({showRuleMsg:'',errorMsg:'',btnName:'get_otp'});
    const [secondslist, setSecondslist] = useState({phoneSeconds:30});
    const [errorMsg, setMsg] = useState(false);

    const [form] = Form.useForm();
    const useOtpRef = React.useRef(null);
    const { Text,Title } = Typography;
    const fullNumber = props.auth.phone_number;
    const last4Digits = fullNumber.slice(-4);
    const maskedNumber = last4Digits.padStart(fullNumber.length, "*");
 
    useEffect(() => {
        getVerifyData();
    }, []);

    let timeInterval;
    let count = 5;
    const startTimer = (secondsType) => {
        let timer = count - 1;
        let seconds;
        timeInterval = setInterval(function () {
            seconds = parseInt(timer % 30);
            setSecondslist({[secondsType]:seconds});
            if (--timer < 0) {
                timer = count;
                clearInterval(timeInterval);
                setData()
            }
        }, 1000);
    };

    const transferDetials = async (values) => {
        // setAgreeRed(true);
        // setDisableSave(false);
        // 	setAgreeRed(true);
        // 	if (verifyData.isPhoneVerified) {
        // 		if (!isPhoneVerification) {
        // 			setDisableSave(false);
        // 			setMsg("Please verify phone verification code");
        // 			useOtpRef.current.scrollIntoView(0, 0);
        // 			return;
        // 		}
        // 	}
        // 	if (verifyData.isEmailVerification) {
        // 		if (!isEmailVerification) {
        // 			setDisableSave(false);
        // 			setMsg("Please verify  email verification code");
        // 			useOtpRef.current.scrollIntoView(0, 0);
        // 			return;
        // 		}
        // 	}
        // 	if (verifyData.twoFactorEnabled) {
        // 		if (!isAuthenticatorVerification) {
        // 			setDisableSave(false);
        // 			//setIsLoading(false);
        // 			setMsg("Please verify authenticator code");
        // 			useOtpRef.current.scrollIntoView(0, 0);
        // 			return;
        // 		}
        // 	}
        // 	if (
        // 		verifyData.isPhoneVerified == "" &&
        // 		verifyData.isEmailVerification == "" &&
        // 		verifyData.twoFactorEnabled == ""
        // 	) {
        // 		this.setState({
        // 			...this.state,
        // 			errorMsg:
        // 				"Without Verifications you can't send. Please select send verifications from security section",
        // 		});
        // 	}

    };

    const getVerifyData = async () => {
        setIsLoading(true)
        let response = await getVerificationFields(props.userConfig.id);
        if (response.ok) {
            setVerifyData(response.data);
            setIsLoading(false)
        } else {
            setMsg(
                "Without Verifications you can't withdraw.Please select withdraw verifications from security section"
            );
            setIsLoading(false)
        }
    };

    const getEmail = async (val) => {
        // let response = await sendEmail(props.userConfig.id, type);
        // if (response.ok) {
        // 	setEmailText("sentVerification");
        // 	setEmailDisable(false);
        // 	setTextDisable(true);
        // 	setTooltipEmail(true);
        // 	setEmailVerificationText(
        // 		"Enter 6 digit code sent to your Email Id "
        // 	);
        // 	startTimer2();
        // 	setTimeout(() => {
        // 		setEmailText("resendEmail");
        // 		setTooltipEmail(false);
        // 	}, 30000);
        // 	setTimeout(() => {
        // 		setVerifyEmailText(null);
        // 	}, 30000);
        // } else {
        // 	setMsg(response.data);
        // 	useOtpRef.current.scrollIntoView(0, 0);
        // }
    };

    const getEmailVerification = async (values) => {
        // let response = await verifyEmailCode(props.userConfig.id, emailCode);
        // if (response.ok) {
        // 	setEmailDisable(true);
        // 	setIsEmailVerification(true);
        // 	updateverifyObj(true,'isEmailVerification')
        // 	setEmail(true);
        // 	setVerifyEmailOtp(true);
        // 	setEmailText(null);
        // 	setVerifyEmailText(null);
        // } else if (response.data == null) {
        // 	setVerifyEmailOtp(false);
        // 	useOtpRef.current.scrollIntoView(0, 0);
        // 	setMsg("Please enter email verification code");
        // } else {
        // 	setEmail(false);
        // 	setEmailDisable(false);
        // 	setMsg("Invalid email verification code");
        // 	useOtpRef.current.scrollIntoView(0, 0);
        // 	setIsEmailVerification(false);
        // 	updateverifyObj(false,'isEmailVerification')
        // }
    };

    const handleSendOtp = (val) => {
        // setVerifyEmailText("verifyTextBtn");
        // setTooltipEmail(false);
        // setEmailText(null);
        // setVerify(true);
        // setDisableSave(false);
    };
    const handleEmailChange = (e) => {
        // setEmailCode(e.target.value);
    };
    const getphoneOTP = async (val) => {
        setPhone({ ...phone, errorMsg: '', btnName: 'code_Sent', requestType: 'Resend', showRuleMsg: `Enter 6 digit code sent to ${maskedNumber}` })
        startTimer('phoneSeconds')
        
        return
        let response = await getCode(props.userConfig.id, phone.requestType);
        if (response.ok) {
            setPhone({ ...phone, errorMsg: null, btnName: 'code_Sent', requestType: 'Resend', showRuleMsg: `Enter 6 digit code sent to ${maskedNumber}` })

        } else {
            setPhone({ ...phone, errorMsg: isErrorDispaly(response), showRuleMsg: '' })
            useOtpRef.current.scrollIntoView(0, 0);
        }
    };
    const handlephoneinputChange = (e) => {
        console.log(e.target.value)
        console.log(phone)
        if (e.target.value) {
            setPhone({ ...phone, btnName: 'verifyOtpBtn', code: e.target.value })
        } else {
            setPhone({ ...phone, btnName: 'resendotp', code: '' })
        }
    };
    const setData = () =>{
        console.log(phone)
    }
    const isErrorDispaly = (objValue) => {
        if (objValue.data && typeof objValue.data === "string") {
          return objValue.data;
        } else if (
          objValue.originalError &&
          typeof objValue.originalError.message === "string"
        ) {
          return objValue.originalError.message;
        } else {
          return "Something went wrong please try again!";
        }
      };

    const getOtpVerification = async () => {
        // let response = await getVerification(props.userConfig.id, otpCode);
        // if (response.ok) {
        // 	setButtonText("verified")
        // 	setMsg(null)
        // 	setVerifyPhone(true);
        // 	setIsPhoneVerification(true);
        // 	updateverifyObj(true,'isPhoneVerification')
        // 	setVerifyTextOtp(true);
        // 	setVerifyOtpText(null);
        // 	setInputDisable(true);


        // } else if (response.data == null) {
        // 	useOtpRef.current.scrollIntoView(0, 0);
        // 	setMsg("Please enter phone verification code");
        // } else {
        // 	useOtpRef.current.scrollIntoView(0, 0);
        // 	setVerifyPhone(false);
        // 	setVerifyTextOtp(false);
        // 	setInputDisable(false);
        // 	setMsg("Invalid phone verification code");
        // 	setIsPhoneVerification(false);
        // 	updateverifyObj(false,'isPhoneVerification')
        // }
    };
    

    const handleOtp = (val) => {
        // setVerifyOtpText("verifyOtpBtn");
        // setTooltipVisible(false);
        // setButtonText(null);
        // setDisableSave(false);
    };
    const updateverifyObj = (val, name) => {
        // debugger;
        // if (name == 'isEmailVerification') {
        //     props.onchangeData({ verifyData: verifyData, isEmailVerification: val, isAuthenticatorVerification: isAuthenticatorVerification, isPhoneVerification: isPhoneVerification })
        // } else if (name == 'isPhoneVerification') {
        //     props.onchangeData({ verifyData: verifyData, isEmailVerification: isEmailVerification, isAuthenticatorVerification: isAuthenticatorVerification, isPhoneVerification: val })
        // } else if (name == 'isAuthenticatorVerification') {
        //     props.onchangeData({ verifyData: verifyData, isEmailVerification: isEmailVerification, isAuthenticatorVerification: val, isPhoneVerification: isPhoneVerification })
        // }
    }
    const getAuthenticatorCode = async () => {
        // let response = await getAuthenticator(authCode, props.userConfig.id);
        // if (response.ok) {
        // 	setMsg(null)
        // 	setIsAuthenticatorVerification(true);
        // 	updateverifyObj(true,'isAuthenticatorVerification');
        // 	setVerifyAuthCode(true);
        // 	setAuthDisable(true);
        // } else if (response.data == null) {
        // 	useOtpRef.current.scrollIntoView(0, 0);
        // 	setMsg("Please enter authenticator code");
        // } else {
        // 	setAuthDisable(false);
        // 	useOtpRef.current.scrollIntoView(0, 0);
        // 	setMsg("Invalid authenticator code");
        // 	updateverifyObj(false,'isAuthenticatorVerification');
        // 	setVerifyAuthCode(false);
        // }
    };
    const handleAuthenticator = (e) => {
        // setAuthCode(e.target.value);
    };
    const handleCancel = () => {
        // setContactModal(false)
    }
    const handleOk = () => {
        // setContactModal(false)
    }

    const phone_btnList = {
        get_otp: (
            <Button
            type="text"
            style={{ color: "black", margin: "0 auto" }}
            onClick = {()=>getphoneOTP()}><Text className="text-yellow" >Click here to get Code</Text></Button>
        ),
        resendotp: (
            <Button
            type="text"
            style={{ color: "black", margin: "0 auto" }}
            ><Text className="text-yellow" >Resend Code</Text></Button>
        ),
        code_Sent: (<>
            <Button
            type="text"
            style={{ color: "black", margin: "0 auto" }}
            ><Text
                className={`pl-0 ml-0 text-white-50
        ${"c-notallowed"}`} >Verification code sent</Text></Button>
            <Tooltip
                placement="topRight"
                title={`Haven\'t received code ? Request new code in ${secondslist.phoneSeconds} seconds. The code will expire after 30mins.`}>
                <span className="icon md info mr-8" />
            </Tooltip>
            </>
        ),
        verified: (

            <Button
            type="text"
            style={{ color: "black", margin: "0 auto" }}
            ><Text className="text-yellow"> </Text></Button>

        ),
        verifyOtpBtn: (

            <Button
            type="text"
            style={{ color: "black", margin: "0 auto" }}
            ><Text className={` text-yellow`} >Click here to verify</Text></Button>
        ),
    };

    return (
        <div className="mt-16">
            {" "}
            <div ref={useOtpRef}></div>
            {errorMsg && (<Alert showIcon
                type="error"
                message={"Transfer"}
                description={errorMsg}
                closable={false}
            />
            )}
            {isLoading ? (<>
                {/* <Loader /> */}
            </>
            ) : (
                <>
                    <Form
                        className="mt-36"
                        name="advanced_search"
                        form={form}
                        onFinish={transferDetials}
                        autoComplete="off">
                            {verifyData.isPhoneVerified === true && (<>
                                <Text className="fs-14 mb-8 text-white d-block fw-200">
                                    Email verification code *
                                </Text>
                                <Form.Item
                                    name="emailCode"
                                    className="input-label otp-verify"
                                    extra={
                                        <div>
                                            <Text className="fs-12 text-white-30 fw-200">
                                                {phone.showRuleMsg}
                                            </Text>
                                            <Text
                                                className="fs-12 text-red fw-200"
                                                style={{ float: "right", color: "var(--textRed)" }}>
                                                {phone.errorMsg}
                                            </Text>
                                        </div>
                                    }
                                    rules={[
                                        {
                                            required: true,
                                            message: "is required",
                                        },
                                    ]}
                                >
                                    {console.log(phone.requestType)}
                                    <div className="p-relative d-flex align-center">
                                        <Input
                                            type="text"
                                            className="cust-input custom-add-select mb-0"
                                            placeholder={"Enter code"}
                                            maxLength={6}
                                            style={{ width: "100%" }}
                                            disabled={phone.requestType=='Send'}
                                            // onClick={(event) => handleSendOtp(event.currentTarget.value)}
                                            onChange={(e) => handlephoneinputChange(e)}
                                        />
                                        <div className="new-add c-pointer get-code text-yellow hy-align">
                                        {phone_btnList[phone.btnName]}
                                        </div>
                                    </div>
                                </Form.Item>
                            </>
                            )}

                            

                    </Form>
                </>
            )}

        </div>
    );
};

const connectStateToProps = ({ userConfig, oidc }) => {
    return {
        userConfig: userConfig.userProfileInfo,
        auth: oidc.user.profile

    };
};
const connectDispatchToProps = dispatch => {
    return {
        changeInternalStep: (stepcode) => {
            // dispatch(setInternalStep(stepcode))
        },
        dispatch
    }

}
export default connect(connectStateToProps, connectDispatchToProps)(Verifications)