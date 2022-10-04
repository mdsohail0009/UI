import React, { Component } from "react";

import { Typography, Button, Alert,Drawer, Form, Input,Modal, Tooltip, Checkbox, Image } from "antd";
import { connect } from "react-redux";
import alertIcon from '../../assets/images/pending.png';
import Translate from "react-translate-component";
import Loader from "../../Shared/loader";
import Currency from "../shared/number.formate";
import { withRouter } from 'react-router';
import { handleNewExchangeAPI, withDrawCrypto } from "../send.component/api";
import { fetchDashboardcalls } from "../../reducers/dashboardReducer";
import {
	setCryptoFinalRes, setStep,
	setSubTitle,
	setWithdrawcrypto,
	handleSendFetch,
	setAddress,
} from "../../reducers/sendreceiveReducer";

import apiCalls from "../../api/apiCalls";
import { publishBalanceRfresh } from "../../utils/pubsub";
import { Link } from "react-router-dom";
import NumberFormat from "react-number-format";
import { setCurrentAction } from "../../reducers/actionsReducer";
import { CopyToClipboard } from 'react-copy-to-clipboard';
import apicalls from '../../api/apiCalls';

const { Text, Title } = Typography;

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
		inputEmailDisable: true,
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
		seconds: 30,
		seconds2: 30,
		inValidData: false,
		authenticator: "",
		EmailCode: "",
		OtpVerification: "",
		emailCodeVal: "",
		invalidData: false,
		verifyPhone: false,
		verifyEmail: false,
		verifyAuth: false,
		verifyTextotp: false,
		verifyEmailOtp: false,
		verifyAuthCode: false,
		inputAuthDisable: false,
		phoneLoading: false,
		phoneVerifyLoading: false,
		emailLoading: false,
		emailVerifyLoading: false,
		faLoading: false,
		isEmailVerification: false,
		isPhoneVerification: false,
		isAuthenticatorVerification: false,
		btnLoading: false,
		agreeRed: true,
		permissions: {},
		previewModal:false,
		showDeclartion: false,
	};

	useDivRef = React.createRef();
	componentDidMount() {
		this.trackEvent();
		this.props.dispatch(setSubTitle(""));
		this.handleNewExchangeRate();
		this.permissionsInterval = setInterval(this.loadPermissions, 200);
		this.getVerifyData();
	}
	loadPermissions = () => {
		if (this.props.withdrawCryptoPermissions) {
			clearInterval(this.permissionsInterval);
			let _permissions = {};
			for (let action of this.props.withdrawCryptoPermissions?.actions) {
				_permissions[action.permissionName] = action.values;
			}
			this.setState({ ...this.state, permissions: _permissions });
		}
	}



	LinkValue = (props) => {
		return (
			<Translate
				className="textpure-yellow text-underline c-pointer"
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

	startTimer = () => {
		let timeInterval;
		let count = 30;
		let timer = count - 1;
		let seconds;
		timeInterval = setInterval(() => {
			seconds = parseInt(timer % 30);
			this.setState({ ...this.state, seconds: seconds })
			if (--timer < 0) {
				timer = count;
				clearInterval(timeInterval);
				this.setState({ ...this.state, disable: false, type: "Resend" })
			}
		}, 1000);
	};
	startTimer2 = () => {
		let timeInterval2;
		let count2 = 30;
		let timer2 = count2 - 1;
		let seconds2;
		timeInterval2 = setInterval(() => {
			seconds2 = parseInt(timer2 % 30);
			this.setState({ ...this.state, seconds2: seconds2 })
			if (--timer2 < 0) {
				timer2 = count2;
				clearInterval(timeInterval2);
				this.setState({ ...this.state, disable: false, type: "Resend" })
			}
		}, 1000);
	};

	trackEvent = () => {
		apiCalls.trackEvent({
			Type: "User",
			Action: "Withdraw Crypto summary page view",
			Username: this.props.userProfile.userName,
			customerId: this.props.userProfile.id,
			Feature: "Withdraw Crypto",
			Remarks: "Withdraw Crypto summary page view",
			Duration: 1,
			Url: window.location.href,
			FullFeatureName: "Withdraw Crypto",
		});
	};

	onRefresh = () => {
		this.loadOneCoinData();
		this.loadData();
	};
	onCancel = () => {
		this.setState({...this.state,previewModal:true})
		//this.props.dispatch(setWithdrawcrypto(null));
		//this.props.changeStep('withdraw_crpto_cancel_confirm');
		//this.props.changeStep("step1");
	};
	onModalCancel=()=>{
		this.setState({...this.state,previewModal:false})
	}
	onModalOk=()=>{
		this.setState({...this.state,previewModal:false})
        if (this.props.onClose) {
            this.props.onClose();
        }
		// this.props.dispatch(fetchDashboardcalls(this.props.userProfile.id));
		// this.props.dispatch(setWithdrawcrypto(null));
		// this.props.dispatch(setSubTitle(""));
		// publishBalanceRfresh("success");
		this.props.dispatch(setWithdrawcrypto(null))
        this.props.dispatch(handleSendFetch({ key: "cryptoWithdraw", activeKey: 1 }));
        this.props.dispatch(setAddress(null))
	}
	handleNewExchangeRate = async () => {
		debugger
		this.setState({ ...this.state, loading: true });
		const { totalValue, walletCode, toWalletAddress, addressBookId, network, isShowDeclaration } =
			this.props.sendReceive?.withdrawCryptoObj;
		let _obj = { ...this.props.sendReceive?.withdrawCryptoObj };
		let withdrawObj = {
			customerId: this.props?.userProfile?.id,
			addressBookId: addressBookId,
			coinAmount: totalValue,
			address: toWalletAddress,
			coin: walletCode,
			network: network,
		}
		const response = await handleNewExchangeAPI(withdrawObj);
		if (response.ok) {
			_obj["comission"] = response.data?.comission;
			_obj.totalValue = response?.data?.amount;
			_obj.memberWalletId = response?.data?.memberWalletId;
			this.props?.dispatch(setWithdrawcrypto(_obj));
			this.setState({
				...this.state,
				usdAmount: response.data?.amountInUsd,
				OneusdAmount: response?.data?.exchangeRate,
				loading: false,
				comission: response?.data?.comission,
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
			if (!(response.data.isEmailVerification || response.data.isPhoneVerification || response.data.twoFactorEnabled || response.data.isLiveVerification)) {
				this.setState({
					...this.state,
					errorMsg:
						"Without verifications you can't send. Please select send verifications from security section"
				});
			}
		} else {
			this.setState({
				...this.state,
				errorMsg:
					"Without verifications you can't send. Please select send verifications from security section",
			});
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
				errorMsg: null,
				verificationText:
					apiCalls.convertLocalLang("digit_code") + " " + this.maskedNumber,
			});
			this.startTimer();

			setTimeout(() => {
				this.setState({
					buttonText: "resendotp",
					tooltipVisible: false,
					verifyOtpText: null,
				});
			}, 30000);
		} else {
			this.setState({
				...this.state,
				errorMsg: apiCalls.convertLocalLang("request_fail"),
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
				inputEmailDisable: false,
				tooltipEmail: true,
				errorMsg: null,
				emailVerificationText:
					apiCalls.convertLocalLang("digit_code") + " " + "your Email Id ",
			});
			this.startTimer2();
			setTimeout(() => {
				this.setState({
					emailText: "resendEmail",
					tooltipEmail: false,
					verifyText: null,
				});
			}, 30000);
		} else {
			this.setState({
				...this.state,
				errorMsg: apiCalls.convertLocalLang("request_fail"),
			});
		}
	};

	getEmailVerification = async () => {
		this.setState({ ...this.state, emailVerifyLoading: true })
		let response = await apiCalls.verifyEmail(
			this.props.userProfile.id,
			this.state.emailCodeVal
		);
		if (response.ok) {
			this.setState({
				...this.state,
				emailVerifyLoading: false,
				EmailCode: response.data,
				verifyEmail: true,
				verifyEmailOtp: true,
				verifyOtpText: null,
				verifyText: null,
				emailText: null,
				inputEmailDisable: true,
				isEmailVerification: true,
				errorMsg: null

			});
		} else if (response.data == null) {
			this.setState({
				...this.state,
				errorMsg: "Please enter email verification code", emailVerifyLoading: false
			});
		} else {
			this.setState({ ...this.state, inValidData: true });
			this.setState({
				...this.state,
				errorMsg: apiCalls.convertLocalLang("email_invalid_code"),
				emailVerifyLoading: false,
				invalidData: true,
				verifyEmail: false,
				inputEmailDisable: false,
			});
		}
	};

	getOtpVerification = async () => {
		this.setState({ ...this.state, phoneVerifyLoading: true })
		let response = await apiCalls.getVerification(
			this.props.userProfile.id,
			this.state.otpCode
		);
		if (response.ok) {
			this.setState({
				...this.state,
				phoneVerifyLoading: false,
				OtpVerification: response.data,
				verifyPhone: true,
				verifyTextotp: true,
				verifyOtpText: null,
				buttonText: null,
				inputDisable: true,
				isPhoneVerification: true,
				errorMsg: null
			});
		} else if (response.data == null) {
			this.setState({
				...this.state,
				errorMsg: "Please enter phone verification code",
				invalidData: true,
				phoneVerifyLoading: false
			});
		} else {
			this.useDivRef.current.scrollIntoView(0, 0);
			this.setState({
				...this.state,
				errorMsg: apiCalls.convertLocalLang("phone_invalid_code"),
				phoneVerifyLoading: false,
				verifyPhone: false,
				inputDisable: false,
				inValidData: true,
			});
		}
	};
	handleOtp = (val) => {
		this.setState({
			...this.state,
			otp: val,
			verifyOtpText: "verifyOtpBtn",
			tooltipVisible: false,
			buttonText: "",
		});
	};

	handleSendOtp = (val) => {
		this.setState({
			...this.state,
			emailOtp: val.emailCode,
			verifyText: "verifyBtn",
			tooltipEmail: false,
			emailText: "",
		});
	};

	getAuthenticator = async () => {
		this.setState({ ...this.state, faLoading: true })
		let response = await apiCalls.getAuthenticator(
			this.state.authCode,
			this.props.userProfile.userId
		);
		if (response.ok) {
			this.setState({
				...this.state,
				faLoading: false,
				authenticator: response.data,
				verifyAuth: true,
				verifyAuthCode: true,
				inputAuthDisable: true,
				isAuthenticatorVerification: true,
				errorMsg: null
			});
		} else if (response.data == null) {
			this.setState({
				...this.state,
				errorMsg: "Please enter authenticator code", faLoading: false
			});
		} else {
			this.useDivRef.current.scrollIntoView(0, 0);
			this.setState({
				...this.state,
				errorMsg: apiCalls.convertLocalLang("twofa_invalid_code"),
				faLoading: false,
				verifyAuth: false,
				inputAuthDisable: false,
				inValidData: true,
			});
		}
	};
	handleChange = (e) => {
		if (e) {
			this.handleOtp(e)
			this.setState({
				...this.state,
				otpCode: e, buttonText: "",
				tooltipVisible: false,
				verifyOtpText: "verifyOtpBtn",
			})
		} else {
			this.setState({
				buttonText: "resendotp",
				tooltipVisible: false,
				verifyOtpText: null,
			});
		}
	};
	handleAuthenticator = (e) => {
		this.setState({ ...this.state, authCode: e.target.value, faLoading: false });
	};
	handleEmailChange = (e) => {
		this.setState({ ...this.state, emailCodeVal: e.target.value });
	};
	saveWithdrwal = async (values) => {
		if (!values.isAccept) {
			this.setState({
				...this.state,
				errorMsg: apiCalls.convertLocalLang("agree_termsofservice"),
				agreeRed: false,
			});
			this.useDivRef.current.scrollIntoView(0, 0);
		}
		else if (!(this.state.verifyData.isEmailVerification || this.state.verifyData.isPhoneVerification || this.state.verifyData.twoFactorEnabled || this.state.verifyData.isLiveVerification)) {
			this.setState({
				...this.state,
				errorMsg:
					"Without verifications you can't send. Please select send verifications from security section"
			});
		}
		else {

			this.setState({ ...this.state, btnLoading: true, agreeRed: true })

			if (this.state.verifyData.isPhoneVerified) {
				if (!this.state.isPhoneVerification) {
					this.setState({
						...this.state,
						errorMsg: "Please verify phone verification code", btnLoading: false
					});
					this.useDivRef.current.scrollIntoView(0, 0);
					return;
				}
			}
			if (this.state.verifyData.isEmailVerification) {
				if (!this.state.isEmailVerification) {
					this.setState({
						...this.state,
						errorMsg: "Please verify email verification code", btnLoading: false
					});
					this.useDivRef.current.scrollIntoView(0, 0);
					return;
				}
			}
			if (this.state.verifyData.twoFactorEnabled) {
				if (!this.state.isAuthenticatorVerification) {
					this.setState({
						...this.state,
						errorMsg: "Please verify authenticator code", btnLoading: false
					});
					this.useDivRef.current.scrollIntoView(0, 0);
					return;
				}
			}
			// if (
			// 	this.state.verifyData.isPhoneVerified == "" &&
			// 	this.state.verifyData.isEmailVerification == "" &&
			// 	this.state.verifyData.twoFactorEnabled == ""
			// ) {
			// 	this.setState({
			// 		...this.state,
			// 		errorMsg:
			// 			"Without Verifications you can't withdraw. Please select withdraw verifications from security section", btnLoading: false
			// 	});
			// }
			if (this.props.userProfile.isBusiness || !this.state.verifyData?.isLiveVerification) {
				let saveObj = this.props.sendReceive.withdrawCryptoObj;
				let trackAuditLogData = this.props.trackAuditLogData;
				trackAuditLogData.Action = "Save";
				trackAuditLogData.Remarks = "Withdraw Crypto save";
				saveObj.info = JSON.stringify(trackAuditLogData);
				saveObj.Createdby=this.props.userProfile.userName;
				let withdrawal = await withDrawCrypto(saveObj);
				if (withdrawal.ok) {
					debugger
					if(saveObj?.isShowDeclaration) {
						this.props.dispatch(setCryptoFinalRes(withdrawal.data));
						this.props.dispatch(fetchDashboardcalls(this.props.userProfile.id));
						this.props.dispatch(setWithdrawcrypto(null));
						this.props.dispatch(setSubTitle(""));
						this.setState({ ...this.state, errorMsg: null, isBtnLoading: false, showDeclartion: true });
						publishBalanceRfresh("success");
					}
					else {
						this.setState({ ...this.state, btnLoading: false })
						this.props.dispatch(setCryptoFinalRes(withdrawal.data));
						this.props.dispatch(fetchDashboardcalls(this.props.userProfile.id));
						this.props.dispatch(setWithdrawcrypto(null));
						this.props.dispatch(setSubTitle(""));
						this.props.changeStep("withdraw_crpto_success");
						publishBalanceRfresh("success");
					}
				}

				else {
					this.setState({
						...this.state,
						errorMsg: this.isErrorDispaly(withdrawal), btnLoading: false
					});
				}
			}
			else if (this.state.verifyData?.isLiveVerification) {
				this.props.dispatch(
					setSubTitle(apiCalls.convertLocalLang("Withdraw_liveness"))
				);
				this.props.changeStep("withdraw_crypto_liveness");
			}
			//  else {
			// 	this.props.dispatch(
			// 		setSubTitle(apiCalls.convertLocalLang("Withdraw_liveness"))
			// 	);
			// 	this.props.changeStep("withdraw_crypto_liveness");
			// }
			// this.setState({ 
			// 	...this.state,
			// 	errorMsg:
			// 		"We can not process this request, Since commission is more than or equal to requested amount",
			// });
		}
	};
	isErrorDispaly = (objValue) => {
		if (objValue.data && typeof objValue.data === "string") {
			return objValue.data;
		} else if (objValue.originalError && typeof objValue.originalError.message === "string"
		) {
			return objValue.originalError.message;
		} else {
			return "Something went wrong please try again!";
		}
	};

	fullNumber = this.props.oidc?.phone_number;
	last4Digits = this.fullNumber?.slice(-4);
	maskedNumber = this.last4Digits?.padStart(this.fullNumber.length, "*");

	address = this.props.sendReceive.withdrawCryptoObj?.toWalletAddress;
	firstAddress = this.address?.slice(0, 4);
	lastAddress = this.address?.slice(-4);
	renderIcon=()=>{

	}


	render() {
		const { Paragraph, Text } = Typography;
		const { seconds, disable, textDisable, seconds2, agreeRed, showDeclartion } = this.state;
		const link = <this.LinkValue content="terms_service" />;

		const btnList = {
			get_otp: (
				<Translate
					className={`pl-0 ml-0 text-yellow-50 ${disable ? "c-notallowed" : ""
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
					className={`pl-0 ml-0 text-white-50`}
					content="sent_verification"
					with={{ counter: `${textDisable ? "(" + seconds + ")" : ""}` }}
				/>
			),
		};
		const verifyOtpText = {
			verifyOtpBtn: (
				<Translate
					className={`pl-0 ml-0 text-yellow-50 `}
					content="verify_button"
				/>
			),
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
					className={`pl-0 ml-0 text-white-50
          ${textDisable ? "c-notallowed" : ""}`}
					content="sent_verification"
				/>
			),
		};
		const verifyText = {
			verifyBtn: (
				<Translate
					className={`pl-0 ml-0 text-yellow-50 `}
					content="verify_btn"
				/>
			),
		};


		if (this.state.loading) {
			return <Loader />;
		}
		if (showDeclartion) {
			return <div className="text-center">
			  <Image width={80} preview={false} src={alertIcon} />
			  <Title level={2} className="text-white-30 my-16 mb-0">Declaration form sent successfully </Title>
			  <Text className="text-white-30">{`Declaration form has been sent to ${this.props.userProfile?.email}. 
				   Please sign using link received in email to whitelist your address. `}</Text>
			  <Text className="text-white-30">{`Please note that your withdrawal will only be processed once your whitelisted address has been approved`}</Text>
			  <div className="my-25"><Button
				onClick={() => { this.props?.onBackCLick("step1"); this.props.dispatch(handleSendFetch({ key: "cryptoWithdraw", activeTab: 2 })) }}
				type="primary" className="mt-36 pop-btn text-textDark">BACK</Button></div>
			</div>
		  }
		  else {
		return (
			<>
				<div ref={this.useDivRef}></div>
				{this.state.errorMsg && (
					<Alert
						className="mb-12"
						showIcon
						onClose={() => this.state.errorMsg(null)}
						description={this.state.errorMsg}
						closable={false}
						type="error"
					/>
				)}
				{this.state.loading ? (
					<Loader />
				) : (
					<div className="auto-scroll">
						<div
							className="fs-36 text-white-30 fw-200 text-center"
							style={{ lineHeight: "36px" }}>
							<Currency
								prefix={""}
								decimalPlaces={8}
								defaultValue={
									this.props.sendReceive.withdrawCryptoObj?.totalValue
								}
								suffixText={
									this.props.sendReceive.withdrawCryptoObj?.walletCode
								}
							/>{" "}
						</div>
						<div className="text-white-50 fw-400 text-center fs-14 mb-16">
							<Currency
								defaultValue={this.state.usdAmount}
								prefix={""}
								decimalPlaces={2}
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
								suffixText={
									this.props.sendReceive.withdrawCryptoObj?.walletCode
								}
							/>
						</div>
						<div className="pay-list fs-14">
							<Translate
								className="fw-400 text-white"
								content="WithdrawalFee"
								component={Text}
							/>
							<Text
								className="fw-400 text-white"
								style={{
									width: "250px",
									textOverflow: "ellipsis",
									overflow: "hidden",
									whiteSpace: "nowrap",
									textAlign: "end",
								}}>
								{this.state?.comission}
							</Text>
						</div>
						<div className="pay-list fs-14">
							<Translate
								className="fw-400 text-white"
								content="address"
								component={Text}
							/>
								<CopyToClipboard text={this.props.sendReceive.withdrawCryptoObj?.toWalletAddress} options={{ format: 'text/plain' }}>
									<Text copyable={{ tooltips: [apicalls.convertLocalLang('copy'), apicalls.convertLocalLang('copied')] }} className="mb-0 fs-18 fw-400 text-white fw-500" >{this.props.sendReceive.withdrawCryptoObj?.toWalletAddress?.length>0?this.props.sendReceive.withdrawCryptoObj?.toWalletAddress.substring(0,4)+`................`+this.props.sendReceive.withdrawCryptoObj?.toWalletAddress.slice(-4):"-"}</Text>
								</CopyToClipboard>
						</div>
						<div className="pay-list fs-14">
							<Translate
								className="fw-400 text-white"
								content="network"
								component={Text}
							/>
							<Text className="fw-400 text-white">
							{this.props.sendReceive.withdrawCryptoObj?.network || '-'}
							</Text>
						</div>
						<Form
							className="mt-36"
							name="advanced_search"
							autoComplete="off"
							form={this.form}
							onFinish={this.saveWithdrwal}>
							{this.state.permissions?.Send && this.state.verifyData.isPhoneVerified == true && (
								<Text className="fs-14 mb-8 text-white d-block fw-200">
									Phone verification code *
								</Text>
							)}
							{this.state.permissions?.Send && this.state.verifyData.isPhoneVerified == true && (
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
												style={{ float: "right", color: "var(--textRed)" }}>
												{this.state.invalidcode}
											</Text>
										</div>
									}
									rules={[{ required: true, message: "Is required" }]}
								>
									<div className="p-relative d-flex align-center">

										<NumberFormat
											customInput={Input}
											thousandSeparator={false}
											prefix={""}
											decimalScale={0}
											allowNegative={false}
											allowLeadingZeros={true}
											className="cust-input custom-add-select mb-0"
											placeholder={"Enter code"}
											maxLength={6}
											style={{ width: "100%" }}
											onValueChange={(e) => this.handleChange(e.value)}
											disabled={this.state.inputDisable}
										/>
										<div className="new-add c-pointer get-code text-yellow hy-align">
											{!this.state.verifyTextotp && (
												<Button
													type="text"
													loading={this.state.phoneLoading}
													style={{ color: "black" }}
													onClick={this.getOTP}
													disabled={this.state.disable}>
													{btnList[this.state.buttonText]}
												</Button>
											)}
											{this.state.tooltipVisible == true && (
												<Tooltip
													placement="topRight"
													title={`Haven\'t received code? Request new code in ${seconds} seconds. The code will expire after 30mins.`}>

													<span className="icon md info mr-8" />
												</Tooltip>
											)}
											<Button
												type="text"
												loading={this.state.phoneVerifyLoading}
												style={{ color: "black", margin: "0 auto" }}
												onClick={this.getOtpVerification}
												disabled={this.state.verifyPhone == true}>
												{verifyOtpText[this.state.verifyOtpText]}
												{this.state.verifyTextotp == true && (
													<span className="icon md greenCheck" />
												)}
											</Button>
										</div>
									</div>
								</Form.Item>
							)}
							{this.state.verifyData.isPhoneVerified}
							{this.state.permissions?.Send && this.state.verifyData.isEmailVerification == true && (
								<Text className="fs-14 mb-8 text-white d-block fw-200">
									Email verification code *
								</Text>
							)}
							{this.state.permissions?.Send && this.state.verifyData.isEmailVerification == true && (
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
												style={{ float: "right", color: "var(--textRed)" }}>
												{this.state.invalidcode}
											</Text>
										</div>
									}
									rules={[{ required: true, message: "Is required" }]}
								>
									<div className="p-relative d-flex align-center">
										<Input
											type="text"

											className="cust-input custom-add-select mb-0"
											placeholder={"Enter code"}
											maxLength={6}
											style={{ width: "100%" }}
											onClick={(event) =>
												this.handleSendOtp(event.currentTarget.value)
											}
											onChange={(e) => this.handleEmailChange(e, "emailCodeVal")}
											disabled={this.state.inputEmailDisable}
										/>
										<div className="new-add c-pointer get-code text-yellow hy-align">
											{!this.state.verifyEmailOtp && (
												<Button
													type="text"
													style={{ color: "black", margin: "0 auto" }}
													loading={this.state.emailLoading}
													onClick={this.getEmail}>
													{emailBtn[this.state.emailText]}
												</Button>
											)}
											{this.state.tooltipEmail == true && (
												<Tooltip
													placement="topRight"
													title={`Haven\'t received code? Request new code in ${seconds2} seconds. The code will expire after 30mins.`}>

													<span className="icon md info mr-8" />
												</Tooltip>
											)}


											<Button
												type="text"
												style={{ color: "black", margin: "0 auto" }}
												loading={this.state.emailVerifyLoading}
												onClick={(e) => this.getEmailVerification(e)}
												disabled={this.state.verifyEmail == true}>
												{verifyText[this.state.verifyText]}
												{this.state.verifyEmailOtp == true && (
													<span className="icon md greenCheck" />
												)}
											</Button>


										</div>
									</div>
								</Form.Item>
							)}
							{this.state.permissions?.Send && this.state.verifyData.twoFactorEnabled == true && (
								<Text className="fs-14 mb-8 text-white d-block fw-200">
									Authenticator Codesss *
								</Text>
							)}
							{this.state.permissions?.Send && this.state.verifyData.twoFactorEnabled == true && (
								<Form.Item
									name="authenticator"
									className="input-label otp-verify"
									extra={
										<div>
											<Text
												className="fs-12 text-red fw-200"
												style={{ float: "right", color: "var(--textRed)" }}>
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
											onChange={(e) =>
												this.handleAuthenticator(e, "authenticator")
											}
											style={{ width: "100%" }}
											disabled={this.state.inputAuthDisable == true}
										/>
										<div className="new-add c-pointer get-code text-yellow hy-align" >
											<Button
												type="text"
												loading={this.state.faLoading}
												style={{ color: "black", margin: "0 auto" }}
												onClick={this.getAuthenticator}>
												{this.state.verifyAuthCode ? (
													<span className="icon md greenCheck" />
												) : (
													"Click here to verify"
												)}
											</Button>
										</div>
									</div>
								</Form.Item>
							)}

							<Form.Item
								className="custom-forminput mb-36 agree send-crypto-sumry"
								name="isAccept"
								valuePropName="checked"
								required
							>
								{this.state.permissions?.Send && <span className="d-flex">
									<Checkbox className={`ant-custumcheck ${!agreeRed ? "check-red" : " "}`} />
									<span className="withdraw-check"></span>
									<Translate
										content="agree_to_suissebase"
										with={{ link }}
										component={Paragraph}
										className="fs-14 text-white-30 ml-16 mb-4"
										style={{ flex: 1 }}
									/>
								</span>}
							</Form.Item>
							{this.state.permissions?.Send && <Button size="large" block className="pop-btn" htmlType="submit" loading={this.state.btnLoading}>
								<Translate content="with_draw" component={Text} />
							</Button>}

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
							<Modal
								className="documentmodal-width fiat-crypto-model"
								destroyOnClose={true}
								title="Confirm"
								width={350}
								visible={this.state.previewModal}
								closeIcon={
									<Tooltip title="Close">
										<span
											className="icon md close-white c-pointer"

											onClick={() => this.onModalCancel()}
										/>
									</Tooltip>
								}
								footer={
									<>									
										<Button
											className="pop-btn px-36"
											style={{ margin: "0 8px" }}
											onClick={() => this.onModalCancel()}

										>
											No
										</Button>
										<Button
											className="pop-btn px-36"
											style={{ margin: "0 8px" }}
											onClick={() => this.onModalOk()}
										>
											Yes
										</Button>
									</>
								}>
									<div style={{color:"white"}}>
								Are you sure you want to cancel?
								</div>
							</Modal>
		{/* <Drawer
                        destroyOnClose={true}
                        title={[
                            <div >
                               
                                <div className="text-center fs-16">
                                    
									<div>
									Are you sure you want to cancel?
									Your address details will not be saved
									</div>
									<span
										onClick={() => this.onModalCancel()}
										className="icon md close-white c-pointer"
									/>
                                </div>
                                
                            </div>,
                        ]}
                        placement="right"
                        closable={true}
                        visible={this.state.previewModal}
                        closeIcon={null}
                        className="side-drawer w-50p">
                        
                    </Drawer> */}
					
					</div>
				)}
				
			</>
		);
	   }
	}
}

const connectStateToProps = ({ sendReceive, userConfig, menuItems,oidc }) => {
	return {
		sendReceive,
		userProfile: userConfig.userProfileInfo,
		trackAuditLogData: userConfig.trackAuditLogData,
		withdrawCryptoPermissions: menuItems?.featurePermissions?.send_crypto,
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
)(withRouter(WithdrawSummary));
