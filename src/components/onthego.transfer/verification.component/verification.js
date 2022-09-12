import React, { useState, useEffect } from "react";
import { Typography, Button, Form, Input, Alert, Tooltip, Row, Col, Checkbox, Modal, message } from "antd";
import { getCode, getVerification, sendEmail, verifyEmailCode, getAuthenticator, getVerificationFields } from "./api";
import { connect } from 'react-redux';
import NumberFormat from "react-number-format";

const Verification = (props) => {
	const { Text,Title } = Typography;
	const [form] = Form.useForm();
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
	const [types, setTypes] = useState("Send");
	const [textDisable, setTextDisable] = useState(false);
	const [emailText, setEmailText] = useState("get_email");
	const [emailDisable, setEmailDisable] = useState(true);
	const [tooltipVisible, setTooltipVisible] = useState(false);
	const [tooltipEmail, setTooltipEmail] = useState(false);
	const [emailVerificationText, setEmailVerificationText] = useState("");
	const [authCode, setAuthCode] = useState("");
	const [otpCode, setOtpCode] = useState("");
	const [verifyOtpText, setVerifyOtpText] = useState("");
	const [verifyEmailText, setVerifyEmailText] = useState("");
	const [seconds, setSeconds] = useState(30);
	const [seconds2, setSeconds2] = useState(30);
	const [verify, setVerify] = useState(false);
	const [emailCode, setEmailCode] = useState("");
	const [disableSave, setDisableSave] = useState(false);
	const [isEmailVerification, setIsEmailVerification] = useState(false);
	const [isPhoneVerification, setIsPhoneVerification] = useState(false);
	const [verifyPhone, setVerifyPhone] = useState(false);
	const [verifyEmail, setEmail] = useState(false);
	const [verifyTextotp, setVerifyTextOtp] = useState(false);
	const [verifyEmailOtp, setVerifyEmailOtp] = useState(false);
	const [verifyAuthCode, setVerifyAuthCode] = useState(false);
	const [authDisable, setAuthDisable] = useState(false);
	const [contactModal, setContactModal] = useState(false);
	const [agreeRed, setAgreeRed] = useState(true)
	const [isLoading, setIsLoading] = useState(false)
	const [isAuthenticatorVerification, setIsAuthenticatorVerification] =
		useState(false);


	const btnList = {
		get_otp: (
			<Text className="text-yellow" >Click here to get Code</Text>
		),
		resendotp: (
			<Text className="text-yellow" >Resend Code</Text>
		),
		sentVerify: (
			<Text
				className={`pl-0 ml-0 text-white-50
        
        ${textDisable ? "c-notallowed" : ""}`} >Verification code sent</Text>
		),
		verified: (

			<Text className="text-yellow"> </Text>

		),
	};
	const verifyOtp = {
		verifyOtpBtn: (

			<Text className={` text-yellow`} >Click here to verify</Text>
		),
	};
	const emailBtn = {
		get_email: (

			<Text className={`text-yellow`} >Click here to get code</Text>
		),
		resendEmail: (

			<Text className={`text-yellow `}>Click here to resend code</Text>

		),
		sentVerification: (

			<Text
				className={`
            ${textDisable ? "c-notallowed" : ""}`}>Verification code sent</Text>
		),
	};
	const verifyText = {
		verifyTextBtn: (

			<Text paragraph className={`text-yellow `}>Click here to verify</Text>
		),
	};

	useEffect(() => {
		getVerifyData();
	}, []);

	let timeInterval;
	let count = 30;
	const startTimer = () => {
		let timer = count - 1;
		let seconds;
		timeInterval = setInterval(function () {
			seconds = parseInt(timer % 30);
			setSeconds(seconds);
			if (--timer < 0) {
				timer = count;
				clearInterval(timeInterval);
				setDisable(false);
				setTypes("Resend");
			}
		}, 1000);
	};
	let timeInterval2;
	let count2 = 30;
	const startTimer2 = () => {
		let timer2 = count2 - 1;
		let seconds2;
		timeInterval2 = setInterval(function () {
			seconds2 = parseInt(timer2 % 30);
			setSeconds2(seconds2);
			if (--timer2 < 0) {
				timer2 = count2;
				clearInterval(timeInterval2);
				setDisable(false);
				setType("Resend");
			}
		}, 1000);
	};


	const transferDetials = async (values) => {
		setAgreeRed(true);
		setDisableSave(false);
			setAgreeRed(true);
			if (verifyData.isPhoneVerified) {
				if (!isPhoneVerification) {
					setDisableSave(false);
					setMsg("Please verify phone verification code");
					useOtpRef.current.scrollIntoView(0, 0);
					return;
				}
			}
			if (verifyData.isEmailVerification) {
				if (!isEmailVerification) {
					setDisableSave(false);
					setMsg("Please verify  email verification code");
					useOtpRef.current.scrollIntoView(0, 0);
					return;
				}
			}
			if (verifyData.twoFactorEnabled) {
				if (!isAuthenticatorVerification) {
					setDisableSave(false);
					//setIsLoading(false);
					setMsg("Please verify authenticator code");
					useOtpRef.current.scrollIntoView(0, 0);
					return;
				}
			}
			if (
				verifyData.isPhoneVerified == "" &&
				verifyData.isEmailVerification == "" &&
				verifyData.twoFactorEnabled == ""
			) {
				this.setState({
					...this.state,
					errorMsg:
						"Without Verifications you can't send. Please select send verifications from security section",
				});
			}
			
	};
	
	const fullNumber = props.auth.phone_number;
	const last4Digits = fullNumber.slice(-4);
	const maskedNumber = last4Digits.padStart(fullNumber.length, "*");

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
		let response = await sendEmail(props.userConfig.id, type);
		if (response.ok) {
			setEmailText("sentVerification");
			setEmailDisable(false);
			setTextDisable(true);
			setTooltipEmail(true);
			setEmailVerificationText(
				"Enter 6 digit code sent to your Email Id "
			);
			startTimer2();
			setTimeout(() => {
				setEmailText("resendEmail");
				setTooltipEmail(false);
			}, 30000);
			setTimeout(() => {
				setVerifyEmailText(null);
			}, 30000);
		} else {
			setMsg(response.data);
			useOtpRef.current.scrollIntoView(0, 0);
		}
	};

	const getEmailVerification = async (values) => {
		let response = await verifyEmailCode(props.userConfig.id, emailCode);
		if (response.ok) {
			setEmailDisable(true);
			setIsEmailVerification(true);
			updateverifyObj(true,'isEmailVerification')
			setEmail(true);
			setVerifyEmailOtp(true);
			setEmailText(null);
			setVerifyEmailText(null);
		} else if (response.data == null) {
			setVerifyEmailOtp(false);
			useOtpRef.current.scrollIntoView(0, 0);
			setMsg("Please enter email verification code");
		} else {
			setEmail(false);
			setEmailDisable(false);
			setMsg("Invalid email verification code");
			useOtpRef.current.scrollIntoView(0, 0);
			setIsEmailVerification(false);
			updateverifyObj(false,'isEmailVerification')
		}
	};

	const handleSendOtp = (val) => {
		setVerifyEmailText("verifyTextBtn");
		setTooltipEmail(false);
		setEmailText(null);
		setVerify(true);
		setDisableSave(false);
	};
	const handleEmailChange = (e) => {
		setEmailCode(e.target.value);
	};
	const getOTP = async (val) => {
		let response = await getCode(props.userConfig.id, types);
		if (response.ok) {
			setMsg(null);
			setTooltipVisible(true);
			setButtonText("sentVerify");
			setInputDisable(false);
			setDisable(true);
			setVerifyOtpText(null);
			setVerificationText(
				" Enter 6 digit code sent to" + " " + maskedNumber
				// " Enter 6 digit code sent to your registered Mobile number"
			)
			startTimer();
			setTimeout(() => {
				setButtonText("resendotp");
			}, 30000);
			setTimeout(() => {
				setTooltipVisible(false);
			}, 30000);

		} else {
			setMsg(response.data);
			useOtpRef.current.scrollIntoView(0, 0);
		}
	};

	const getOtpVerification = async () => {
		let response = await getVerification(props.userConfig.id, otpCode);
		if (response.ok) {
			setButtonText("verified")
			setMsg(null)
			setVerifyPhone(true);
			setIsPhoneVerification(true);
			updateverifyObj(true,'isPhoneVerification')
			setVerifyTextOtp(true);
			setVerifyOtpText(null);
			setInputDisable(true);


		} else if (response.data == null) {
			useOtpRef.current.scrollIntoView(0, 0);
			setMsg("Please enter phone verification code");
		} else {
			useOtpRef.current.scrollIntoView(0, 0);
			setVerifyPhone(false);
			setVerifyTextOtp(false);
			setInputDisable(false);
			setMsg("Invalid phone verification code");
			setIsPhoneVerification(false);
			updateverifyObj(false,'isPhoneVerification')
		}
	};
	const handleChange = (e) => {
		if (e) {
			handleOtp(e)
			setOtpCode(e)
		} else {
			setButtonText('resendotp');
			setTooltipVisible(false);
			setDisableSave(false);
			setVerifyOtpText("");
		}
	};

	const handleOtp = (val) => {
		setVerifyOtpText("verifyOtpBtn");
		setTooltipVisible(false);
		setButtonText(null);
		setDisableSave(false);
	};
	const updateverifyObj = (val,name) =>{
		debugger;
		if(name=='isEmailVerification'){
			props.onchangeData({verifyData:verifyData,isEmailVerification:val,isAuthenticatorVerification:isAuthenticatorVerification,isPhoneVerification:isPhoneVerification })
		}else if(name=='isPhoneVerification'){
			props.onchangeData({verifyData:verifyData,isEmailVerification:isEmailVerification,isAuthenticatorVerification:isAuthenticatorVerification,isPhoneVerification:val })
		}else if(name=='isAuthenticatorVerification'){
			props.onchangeData({verifyData:verifyData,isEmailVerification:isEmailVerification,isAuthenticatorVerification:val,isPhoneVerification:isPhoneVerification })
		}
	}
	const getAuthenticatorCode = async () => {
		let response = await getAuthenticator(authCode, props.userConfig.id);
		if (response.ok) {
			setMsg(null)
			setIsAuthenticatorVerification(true);
			updateverifyObj(true,'isAuthenticatorVerification');
			setVerifyAuthCode(true);
			setAuthDisable(true);
		} else if (response.data == null) {
			useOtpRef.current.scrollIntoView(0, 0);
			setMsg("Please enter authenticator code");
		} else {
			setAuthDisable(false);
			useOtpRef.current.scrollIntoView(0, 0);
			setMsg("Invalid authenticator code");
			updateverifyObj(false,'isAuthenticatorVerification');
			setVerifyAuthCode(false);
		}
	};
	const handleAuthenticator = (e) => {
		setAuthCode(e.target.value);
	};
	const handleCancel = () => {
		setContactModal(false)
	}
	const handleOk = () => {
		setContactModal(false)
	}
	return (
		<div className="mt-16">
			{" "}
			<div ref={useOtpRef}></div>
			{errorMsg && (
				<Alert
					showIcon
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
						 {verifyData.isEmailVerification === true && ( 
							<Text className="fs-14 mb-8 text-white d-block fw-200">
								Email verification code *
							</Text>
						)} 


						{verifyData.isEmailVerification === true && (
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
											style={{ float: "right", color: "var(--textRed)" }}>
											{invalidcode}
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
								<div className="p-relative d-flex align-center">
									<Input
										type="text"

										className="cust-input custom-add-select mb-0"
										placeholder={"Enter code"}
										maxLength={6}

										style={{ width: "100%" }}
										disabled={emailDisable}
										onClick={(event) => handleSendOtp(event.currentTarget.value)}
										onChange={(e) => handleEmailChange(e)}
									/>
									<div className="new-add c-pointer get-code text-yellow hy-align">
										{!verifyEmailOtp && (
											<Button
												type="text"
												// style={{ color: "black" }}
												//loading={emailLoading}
												style={{ color: "black", margin: "0 auto" }}
												onClick={getEmail}>
												{isResend && emailBtn[emailText]}
											</Button>
										)}
										{tooltipEmail == true && (
											<Tooltip
												placement="topRight"
												title={`Haven\'t received code? Request new code in ${seconds2} seconds. The code will expire after 30mins.`}>
												<span className="icon md info mr-8" />
											</Tooltip>
										)}
										{verify == true && (
											<Button
												type="text"
												//loading={emailVerifyLoading}
												onClick={(e) => getEmailVerification(e)}
												disabled={verifyEmail === true}>
												{verifyText[verifyEmailText]}
												{verifyEmailOtp === true && (
													<span className="icon md greenCheck" />
												)}

											</Button>
										)}
									</div>
								</div>
							</Form.Item>
						 )} 
                        	{verifyData.isPhoneVerified == true && (
							<Text className="fw-300 mb-8 px-4 text-white-50 pt-16">
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
											style={{ float: "right", color: "var(--textRed)" }}>
											{invalidcode}
										</Text>
									</div>
								}

								rules={[
									{
										required: true,
										message: "is required"
									},
								]}

							>
								<div className="p-relative d-flex align-center">
									<NumberFormat
										customInput={Input}
										thousandSeparator={false}
										prefix={""}
										decimalScale={0}
										allowNegative={false}
										className="cust-input custom-add-select mb-0"
										placeholder={"Enter code"}
										maxLength={6}
										style={{ width: "100%" }}
										onValueChange={(e) => handleChange(e.value)}
										disabled={inputDisable}
									/>
									<div className="new-add c-pointer get-code text-yellow hy-align">
										{!verifyTextotp && (
											<Button
												type="text"
												style={{ color: "black", margin: "0 auto" }}
												//loading={phoneLoading}
												onClick={getOTP}
												disabled={disable}>
												{btnList[buttonText]}
											</Button>
										)}
										{tooltipVisible === true && (
											<Tooltip
												placement="topRight"
												title={`Haven\'t received code ? Request new code in ${seconds} seconds. The code will expire after 30mins.`}>
												<span className="icon md info mr-8" />
											</Tooltip>
										)}
										{/* <Button
											type="text"
											style={{ color: "black", margin: "0 auto" }}
											onClick={getOtpVerification}
											disabled={verifyPhone === true}
                                            >
											{verifyOtp[verifyOtpText]}
											{verifyTextotp === true && (
												<span className="icon md greenCheck" />
											)}

										</Button> */}
										{verify == true && (
											<Button
												type="text"
												//loading={emailVerifyLoading}
												onClick={getOtpVerification}
												disabled={verifyPhone === true}>
												{verifyOtp[verifyOtpText]}
												{verifyTextotp === true && (
													<span className="icon md greenCheck" />
												)}

											</Button>
										)}
									</div>
								</div>
							</Form.Item>

						)} 
                        {verifyData.twoFactorEnabled == true && (
							<Text className="text-upper mb-8 fw-300 mb-4 text-white-50 pt-16">
								Authenticator Code *
							</Text>
						 )} 
						{verifyData.twoFactorEnabled == true && (

							<Form.Item
								name="authenticator"
								className="input-label otp-verify "
								extra={
									<div>
										<Text
											className="fs-12 text-red fw-200"
											style={{ float: "right", color: "var(--textRed)" }}>
											{invalidcode}
										</Text>
									</div>
								}
							>
								<div className="p-relative d-flex align-center">

									<Input
										type="text"
										className="cust-input custom-add-select mb-0"
										placeholder={"Enter code"}
										maxLength={6}
										onChange={(e) => handleAuthenticator(e)}
										style={{ width: "100%" }}
										disabled={authDisable == true}
									/>
									<div className="new-add c-pointer get-code text-yellow hy-align" >
										<Button
											type="text"
											//loading={authLoading}
											style={{ color: "black", margin: "0 auto" }}
											onClick={getAuthenticatorCode}
										>
											{verifyAuthCode ? (
												<span className="icon md greenCheck" />
											) : (
												"Click here to verify"
											)}
										</Button>
									</div>
								</div>
							</Form.Item>


						)}
						
					</Form>
					<Modal
						title="Create contact" visible={contactModal}
						closable={false}
						closeIcon={false}
						footer={[
							<>
								<Button style={{ width: 100 }}
									className=" pop-cancel"
									onClick={() => handleCancel()}
								>Cancel</Button>
								<Button className="primary-btn pop-btn"
									style={{ width: 100, height: 50 }}
									onClick={() => handleOk()}
								>Ok</Button>
							</>
						]} >
						<h4 className="text-white fs-16 fw-400">You are creating contact using this Address,is it Ok? </h4>
					</Modal>
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
  export default connect(connectStateToProps,connectDispatchToProps)(Verification)