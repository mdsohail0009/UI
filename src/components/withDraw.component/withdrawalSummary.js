import React, { useState, useEffect } from "react";
import { Typography, Button, Form, Spin, Input, Alert, Tooltip } from "antd";
import Currency from "../shared/number.formate";
import { setStep } from "../../reducers/buysellReducer";
import { connect } from "react-redux";
import Translate from "react-translate-component";
import apiCalls from "../../api/apiCalls";
import { withdrawSave } from "../../api/apiServer";
import Loader from "../../Shared/loader";
import { fetchDashboardcalls } from "../../reducers/dashboardReducer";
import {
	rejectWithdrawfiat,
	
	setWithdrawFinalRes,
} from "../../reducers/sendreceiveReducer";
import { LoadingOutlined } from "@ant-design/icons";
import NumberFormat from "react-number-format";
import { setCurrentAction } from "../../reducers/actionsReducer";
import apicalls from "../../api/apiCalls";
const WithdrawalFiatSummary = ({
	sendReceive,
	userConfig,
	changeStep,
	dispatch,
	trackAuditLogData,
	withdrawFiatPermissions,
	oidc
}) => {
	const { Text } = Typography;
	const [isLoding, setIsLoding] = useState(false);
	const [form] = Form.useForm();
	const useOtpRef = React.useRef(null);
	const [buttonText, setButtonText] = useState("get_otp");
	const [verificationText, setVerificationText] = useState("");
	const [isResend] = useState(true);
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
	const [seconds, setSeconds] = useState(120);
	const [seconds2, setSeconds2] = useState(120);
	const [validData, setValidData] = useState(false);
	const [verify, setVerify] = useState(false);
	const [emailCode, setEmailCode] = useState("");
	const [disableSave, setDisableSave] = useState(false);
	const [isEmailVerification, setIsEmailVerification] = useState(false);
	const [isPhoneVerification, setIsPhoneVerification] = useState(false);
	const [verifyPhone, setVerifyPhone] = useState(false);
	const [verifyEmail, setEmail] = useState(false);
	const [verifyAuth, setVerifyAuth] = useState(false);
	const [verifyTextotp, setVerifyTextOtp] = useState(false);
	const [verifyEmailOtp, setVerifyEmailOtp] = useState(false);
	const [verifyAuthCode, setVerifyAuthCode] = useState(false);
	const [phoneLoading, setPhoneLoading] = useState(false);
	const [phoneVerifyLoading, setPhoneVerifyLoading] = useState(false);
	const [emailLoading, setEmailLoading] = useState(false);
	const [emailVerifyLoading, setEmailVerifyLoading] = useState(false);
	const [authLoading, setAuthLoading] = useState(false);
	const [authDisable, setAuthDisable] = useState(false);
	const [isAuthenticatorVerification, setIsAuthenticatorVerification] =useState(false);
    const [isLoading,setIsLoading]=useState(false);
	const[permissions,setPermessions] = useState({});

	const btnList = {
		get_otp: (
			<Translate className="pl-0 ml-0 text-yellow-50" content="get_code" />
		),
		resendotp: (
			<Translate
				className="pl-0 ml-0 text-yellow-50"
				content="resend_code"
			/>
		),
		sentVerify: (
			<Translate
				className={`pl-0 ml-0 text-white-50
        
        ${textDisable ? "c-notallowed" : ""}`}
				content="sent_verification"
			/>
		),
		verified: (
			<Translate className="pl-0 ml-0 text-yellow-50" content="empty" />
		),
		verifyOtpBtn: (
			<Translate
				className={`pl-0 ml-0 text-yellow-50 `}
				content="verify_button"
			/>
		)
	};
	const verifyOtp = {
		verifyOtpBtn: (
			<Translate
				className={`pl-0 ml-0 text-yellow-50 `}
				content="verify_button"
			/>
		),
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
				className={`pl-0 ml-0 text-white-50
      ${textDisable ? "c-notallowed" : ""}`}
				content="sent_verification"
			/>
		),
	};
	const verifyText = {
		verifyTextBtn: (
			<Translate className={`pl-0 ml-0 text-yellow-50 `} content="verify_btn" />
		),
	};

	useEffect(() => {
		withdrawSummayTrack();
		getVerifyData();
		loadPermessions();
	}, []);//eslint-disable-line react-hooks/exhaustive-deps

	const loadPermessions = () => {
		if (withdrawFiatPermissions) {
			let _permissions = {};
			for (let action of withdrawFiatPermissions?.actions) {
				_permissions[action.permissionName] = action.values;
			}
			setPermessions(_permissions)
		}
	}
	let cleartime;
	let timeInterval;
	let count = 120;
	const startTimer = () => {
		let timer = count - 1;
		let seconds;
		timeInterval = setInterval(function () {
			seconds = parseInt(timer % 120);
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
	let count2 = 120;
	const startTimer2 = () => {
		let timer2 = count2 - 1;
		let seconds2;
		timeInterval2 = setInterval(function () {
			seconds2 = parseInt(timer2 % 120);
			setSeconds2(seconds2);
			if (--timer2 < 0) {
				timer2 = count2;
				clearInterval(timeInterval2);
				setDisable(false);
				setType("Resend");
			}
		}, 1000);
	};

	const withdrawSummayTrack = () => {
		apiCalls.trackEvent({
			Type: "User",
			Action: "Withdraw Fiat summary page view",
			Username: userConfig?.userName,
			customerId: userConfig?.id,
			Feature: "Withdraw Fiat",
			Remarks: "Withdraw Fiat summary page view",
			Duration: 1,
			Url: window.location.href,
			FullFeatureName: "Withdraw Fiat",
		});
	};

	const saveWithdrwal = async (values) => {
		if (!(verifyData.isEmailVerification || verifyData.isPhoneVerified || verifyData.twoFactorEnabled || verifyData.isLiveVerification)) {
			setMsg(
				"Without verifications you can't send. Please select send verifications from security section"
			);
			return;
		}
		setDisableSave(true);
		if (verifyData.isPhoneVerified) {
			if (!isPhoneVerification) {
				setDisableSave(false);
				setIsLoading(false);
				setMsg("Please verify phone verification code");
				 useOtpRef.current.scrollIntoView(0, 0);
				return;
			}
		}
		if (verifyData.isEmailVerification) {
			if (!isEmailVerification) {
				setDisableSave(false);
				setIsLoading(false);
				setMsg("Please verify  email verification code");			
				 useOtpRef.current.scrollIntoView(0, 0);
				return;
			}
		}
		if (verifyData.twoFactorEnabled) {
			if (!isAuthenticatorVerification) {
				setDisableSave(false);
				setIsLoading(false);
				setMsg("Please verify authenticator code");
				 useOtpRef.current.scrollIntoView(0, 0);
				return;
			}
		}
		
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
		Obj.createdBy=userConfig?.isBusiness ? userConfig.businessName : userConfig.firstName + " " + userConfig?.lastName
		Obj.info = JSON.stringify(trackAuditLogData);
		let withdrawal = await withdrawSave(Obj);
		setIsLoading(false);
		if (withdrawal.ok) {
			setDisableSave(false);
			dispatch(setWithdrawFinalRes(withdrawal.data));
			dispatch(fetchDashboardcalls(userConfig.id));
			dispatch(rejectWithdrawfiat());
			setIsLoding(false);
			changeStep("step7");
		} else {
			setMsg(apicalls.isErrorDispaly(withdrawal));
			setIsLoding(false);
			setDisableSave(false);
		}
	};

	const fullNumber = userConfig.phoneNo;
	const last4Digits = fullNumber?.slice(-4);
	const maskedNumber = last4Digits?.padStart(fullNumber.length, "*");

	const getVerifyData = async () => {
		let response = await apiCalls.getVerificationFields();
		if (response.ok) {
			setVerifyData(response.data);
			if (!(response.data.isEmailVerification || response.data.isPhoneVerification || response.data.twoFactorEnabled || response.data.isLiveVerification)) {
				setMsg(
					"Without verifications you can't send. Please select send verifications from security section"
				);
			}
		} else {
			setMsg(
				"Without verifications you can't send. Please select send verifications from security section"
			);
		}
	};

	const getEmail = async (val) => {
		let response = await apiCalls.sendEmail(type);
		if (response.ok) {
			setEmailText("sentVerification");
			setEmailDisable(false);
			setTextDisable(true);
			setTooltipEmail(true);
			setVerifyOtpText(null);
			setEmailVerificationText(
				apiCalls.convertLocalLang("digit_code") + " " + "your Email Id "
			);
			startTimer2();
			setTimeout(() => {
				setEmailText("resendEmail");
				setTooltipEmail(false);
				setTooltipVisible(false);
				setVerifyOtpText(null);
			}, 30000);
			
			setTimeout(() => {
				setVerifyEmailText(null);
			}, 30000);
		} else {
			setMsg(apiCalls.convertLocalLang("request_fail"));
			useOtpRef.current.scrollIntoView(0, 0);
		}
	};
	const getEmailVerification = async (values) => {
		setValidData(true);
		setEmailVerifyLoading(true)
		let response = await apiCalls.verifyEmail(emailCode);
		if (response.ok) {
			setEmailDisable(true);
			setEmailVerifyLoading(false)
			setIsEmailVerification(true);
			setEmail(true);
			setVerifyEmailOtp(true);
			setEmailText(null);
			
			setVerifyEmailText(null);
		} else if (response.data == null) {
			setVerifyEmailOtp(false);
			useOtpRef.current.scrollIntoView(0, 0);
			setMsg("Please enter email verification code");
			setEmailVerifyLoading(false)
		} else {
			setEmail(false);
			setEmailDisable(false);
			setMsg(apiCalls.convertLocalLang("email_invalid_code"));
			useOtpRef.current.scrollIntoView(0, 0);
			setIsEmailVerification(false);
			setEmailVerifyLoading(false)
		}
	};
	const antIcon = (
		<LoadingOutlined
			style={{ fontSize: 18, color: "#fff", marginRight: "16px" }}
			spin
		/>
	  );
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
		let response = await apiCalls.getCode(types);
		if (response.ok) {
			setMsg(null);
			setTooltipVisible(true);
			setButtonText("sentVerify");
			setInputDisable(false);
			setDisable(true);
			setVerificationText(
				apiCalls.convertLocalLang("digit_code") + " " + maskedNumber
			);
			startTimer();
			cleartime=setTimeout(() => {
			setButtonText("resendotp");
			setTooltipVisible(false);
			setVerifyOtpText(null);
		}, 30000);
		
			setTimeout(() => {
				setTooltipVisible(false);
			}, 30000);
			setTimeout(() => {
				setVerifyOtpText(null);
			}, 30000);
		 } else {
			setMsg(apiCalls.convertLocalLang("request_fail"));
			useOtpRef.current.scrollIntoView(0, 0);
		}
	};



	const getOtpVerification = async () => {
		setValidData(true);
		setPhoneVerifyLoading(true)
		let response = await apiCalls.getVerification(otpCode);
		if (response.ok) {
			setMsg(null)
		
			setVerifyPhone(true);
			setPhoneVerifyLoading(false)
			setIsPhoneVerification(true);
			setVerifyTextOtp(true);
			setVerifyOtpText(null);
			setInputDisable(true);
			clearTimeout(cleartime);
		} else if (response.data == null) {
			useOtpRef.current.scrollIntoView(0, 0);
			setMsg("Please enter phone verification code");
			setPhoneVerifyLoading(false)
		} else {
			useOtpRef.current.scrollIntoView(0, 0);
			setVerifyPhone(false);
			setVerifyTextOtp(false);
			setInputDisable(false);
			setMsg(apiCalls.convertLocalLang("phone_invalid_code"));
			setIsPhoneVerification(false);
			setPhoneVerifyLoading(false)
		}
	};
	const handleChange = (e) => {
		if(e){
			handleOtp(e)
			setOtpCode(e)
		}else{
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
	const getAuthenticator = async () => {
		setValidData(true);
		setAuthLoading(true)
		let response = await apiCalls.getAuthenticator(authCode);
		if (response.ok) {
			setMsg(null)
			setAuthLoading(false)
			setVerifyAuth(true);
			setIsAuthenticatorVerification(true);
			setVerifyAuthCode(true);
			setAuthDisable(true);
		} else if (response.data == null) {
			useOtpRef.current.scrollIntoView(0, 0);
			setMsg("Please enter authenticator code");
			setAuthLoading(false)
		} else {
			setVerifyAuth(false);
			setAuthDisable(false);
			useOtpRef.current.scrollIntoView(0, 0);
			setMsg(apiCalls.convertLocalLang("twofa_invalid_code"));
			setIsAuthenticatorVerification(false);
			setAuthLoading(false)
		}
	};
	const handleAuthenticator = (e) => {
		setAuthCode(e.target.value);
		setAuthLoading(false)
	};

	return (
		<div className="mt-16">
			{" "}
			<div ref={useOtpRef}></div>
			{errorMsg && (
				<Alert
					showIcon
					type="error"
					message={apiCalls.convertLocalLang("withdrawFiat")}
					description={errorMsg}
					closable={false}
				/>
			)}
			{isLoding ? (
				<Loader />
			) : (
				<>
					<Text className="fs-14 text-white-50 fw-200">
						<Translate
							content="you_are_sending"
							component={Text}
							className="fs-14 text-white-50 fw-200"
						/>
					</Text>
					<Currency
						className="fs-18 fw-400 text-white-30 mb-36"
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
						className="fs-18 fw-400 text-white-30 mb-36"
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
						className="fs-18 fw-400 text-white-30 mb-36"
						prefix={""}
						defaultValue={sendReceive.withdrawFiatObj?.totalValue}
						suffixText={sendReceive.withdrawFiatObj?.walletCode}
					/>
					<Text className="fs-14 text-white-50 fw-200">
						<Translate
							content="Bank_name"
							component={Text}
							className="fs-14 text-white-50 fw-200"
						/>
					</Text>
					<Text className="fs-18 fw-400 text-white-30 d-block mb-36">
						{sendReceive.withdrawFiatObj?.bankName}
					</Text>
					<Text className="fs-14 text-white-50 fw-200">
						{" "}
						<Translate
							content="Bank_account_iban"
							component={Text}
							className="fs-14 text-white-50 fw-200"
						/>
					</Text>
					<Text className="fs-18 fw-400 text-white-30 d-block mb-36">
						{sendReceive.withdrawFiatObj?.accountNumber}
					</Text>
					<Text className="fs-14 text-white-50 fw-200">
						<Translate
							content="BIC_SWIFT_routing_number"
							component={Text}
							className="fs-14 text-white-50 fw-200"
						/>
					</Text>
					<Text className="fs-18 fw-400 text-white-30 d-block mb-36">
						{sendReceive.withdrawFiatObj?.routingNumber}
					</Text>

					
					<ul className="pl-0 ml-16 text-white-50 my-36">
						<li>
							<Translate
								className="pl-0 ml-0 text-white-50"
								content="account_details"
								component={Text}
							/>{" "}
						</li>
					
					</ul>
					<Form
						className="mt-36"
						name="advanced_search"
						form={form}
						onFinish={saveWithdrwal}
						
						autoComplete="off">
						{permissions?.withdraw  && verifyData.isPhoneVerified === true && (
							<Text className="fs-14 mb-8 text-white d-block fw-200">
								Phone verification code *
							</Text>
						)}
						{permissions?.withdraw  && verifyData.isPhoneVerified === true && (
							<Form.Item
								name="code"
								className="input-label otp-verify"
								extra={
									<div>
										<Text className="verification-text">
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
										message: apiCalls.convertLocalLang("is_required"),
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
											allowLeadingZeros={true}
											className="cust-input custom-add-select mb-0 ibanborder-field"
											placeholder={"Enter code"}
											maxLength={6}
									style={{ width: "100%"  }}
									onValueChange={(e) => handleChange(e.value)}
									disabled={inputDisable}
									addonAfter={<div className="new-add hy-align">
									{!verifyTextotp && (
										<Button
											type="text"
											style={{color:"black"}}
											loading={phoneLoading}
											onClick={getOTP}
											disabled={disable}>
											{btnList[buttonText]}
										</Button>
									 )} 
									{tooltipVisible === true && (
										<Tooltip
											placement="topRight"
											title={`Haven't received code ? Request new code in ${seconds} seconds. The code will expire after 2 Min.`}>
											<span className="icon md info mr-8" />
										</Tooltip>
									)}
									<Button
										type="text"
										 loading={phoneVerifyLoading}
										style={{color:"black", margin:"0 auto"}}
										onClick={getOtpVerification}
										disabled={verifyPhone === true || verifyTextotp}>
										{verifyOtp[verifyOtpText]}
										{verifyTextotp === true && (
											<span className="icon md greenCheck check-ml-align" />
										)}
									</Button>
								</div>}
								/>
							
									</div>
							</Form.Item>
						)}
						{permissions?.withdraw  && verifyData.isEmailVerification === true && (
							<Text className="fs-14 mb-8 text-white d-block fw-200">
								Email verification code *
							</Text>
						)}
						{permissions?.withdraw  && verifyData.isEmailVerification === true && (
							<Form.Item
								name="emailCode"
								className="input-label otp-verify"
								extra={
									<div>
										<Text className="verification-text">
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
										message: apiCalls.convertLocalLang("is_required"),
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
												style={{color:"black"}}
												loading={emailLoading}
												onClick={getEmail}>
												{isResend && emailBtn[emailText]}
											</Button>
										)}
										{tooltipEmail === true && (
											<Tooltip
												placement="topRight"
												title={`Haven't received code? Request new code in ${seconds2} seconds. The code will expire after 2 Min.`}>
												<span className="icon md info mr-8" />
											</Tooltip>
										)}
										{verify === true && (
											<Button
												type="text"
												loading={emailVerifyLoading}
												onClick={(e) => getEmailVerification(e)}
												disabled={verifyEmail === true || verifyEmailOtp === true}>
												{verifyText[verifyEmailText]}
												{verifyEmailOtp === true && (
													<span className="icon md greenCheck check-ml-align" />
												)}

											</Button>
										)}
									</div>
									</div>
							</Form.Item>
						)}
						{permissions?.withdraw  && verifyData.twoFactorEnabled === true && (
							<Text className="fs-14 mb-8 text-white d-block fw-200">
								Authenticator Code *
							</Text>
						)}
						{permissions?.withdraw  && verifyData.twoFactorEnabled === true && (
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
										},
									},
									{
										required: true,
										message: apiCalls.convertLocalLang("is_required"),
									},
								]}
								>
									<div className="p-relative d-flex align-center">
									
								<Input
									type="text"
									className="cust-input custom-add-select mb-0"
									placeholder={"Enter code"}
									maxLength={6}
									onChange={(e) => handleAuthenticator(e)}
									style={{ width: "100%" }}
									disabled={authDisable === true}
								/>
								<div className="new-add c-pointer get-code text-yellow hy-align" >
										<Button
											type="text"
											loading={authLoading}
											style={{color:"black", margin:"0 auto"}}
											onClick={getAuthenticator}
											disabled={authDisable||verifyAuthCode}>
											{verifyAuthCode ? (
												<span className="icon md greenCheck check-ml-align"  />
											) : (
												"Click here to verify"
											)}
										</Button>
									</div>
									</div>
							</Form.Item>
						)}
					{permissions?.withdraw  &&	<Button
							size="large"
							block
							className="pop-btn"
							loading={disableSave}
							htmlType="submit">
								{isLoading && <Spin indicator={antIcon} />}
							<Translate content="with_draw" component={Text} />
						</Button>}
					</Form>
				</>
			)}
		</div>
	);
};

const connectStateToProps = ({ userConfig, sendReceive,menuItems,oidc }) => {
	return {
		userConfig: userConfig.userProfileInfo,
		sendReceive,
		trackAuditLogData: userConfig.trackAuditLogData,
		withdrawFiatPermissions: menuItems?.featurePermissions?.sendreceivefiat,
		oidc:oidc.user?.profile
	};
};
const connectDispatchToProps = (dispatch) => {
	return {
		changeStep: (stepcode) => {
			dispatch(setStep(stepcode));
		},
		setAction: (val) => {
            dispatch(setCurrentAction(val))
          },
		dispatch,
	};
};
export default connect(
	connectStateToProps,
	connectDispatchToProps
)(WithdrawalFiatSummary);
