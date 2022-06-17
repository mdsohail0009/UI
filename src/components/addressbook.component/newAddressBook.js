import React, { useState, useEffect } from "react";
import {
	Form,
	Input,
	Button,
	Alert,
	Spin,
	message,
	Typography,
	Select,
	Checkbox,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
	rejectCoin,
	setAddressStep,
	fetchAddressCrypto,
} from "../../reducers/addressBookReducer";
import { connect } from "react-redux";
import { saveAddress, favouriteNameCheck, getAddress } from "./api";
import Loader from "../../Shared/loader";
import Translate from "react-translate-component";
import apiCalls from "../../api/apiCalls";
import { validateContentRule } from "../../utils/custom.validator";
import { Link } from "react-router-dom";
import WAValidator from "multicoin-address-validator";

const { Text, Paragraph } = Typography;
const { Option } = Select;

const LinkValue = (props) => {
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
const link = <LinkValue content="terms_service" />;
const NewAddressBook = ({
	changeStep,
	addressBookReducer,
	userConfig,
	onCancel,
	rejectCoinWallet,
	InputFormValues,
	trackAuditLogData,
}) => {
	const [form] = Form.useForm();
	const useDivRef = React.useRef(null);
	const [errorMsg, setErrorMsg] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [cryptoAddress, setCryptoAddress] = useState({});
	const [btnDisabled, setBtnDisabled] = useState(false);
	const [file, setFile] = useState(null);
	const [addressState, setAddressState] = useState("");
	const [error,setError]=useState(null);
	useEffect(() => {
		if (addressBookReducer?.cryptoValues) {
			form.setFieldsValue({
				toCoin: addressBookReducer?.cryptoValues?.toCoin,
				favouriteName: addressBookReducer?.cryptoValues.favouriteName,
				toWalletAddress: addressBookReducer?.cryptoValues.toWalletAddress,
				addressType: addressBookReducer?.cryptoValues?.addressType,
				remarks: addressBookReducer?.cryptoValues?.remarks,
				isAgree: addressBookReducer?.cryptoValues?.isAgree,
			});

			setFile(addressBookReducer?.cryptoValues?.uploadedFile);
		} else {
			if (
				addressBookReducer?.selectedRowData?.id !==
					"00000000-0000-0000-0000-000000000000" &&
				addressBookReducer?.selectedRowData?.id
			) {
				loadDataAddress();
			}
		}

		form.setFieldsValue(addressBookReducer?.cryptoValues);
	}, []);// eslint-disable-line react-hooks/exhaustive-deps

	useEffect(() => {
		if (form.getFieldValue("toWalletAddress")) {
			form
				.validateFields(["toWalletAddress"])
				.then((values) => console.log(values));
		}
	}, []);// eslint-disable-line react-hooks/exhaustive-deps

	const selectCrypto = () => {
		let getvalues = form.getFieldsValue();
		getvalues.uploadedFile = file;
		getvalues.addressState = addressState;
		InputFormValues(getvalues);
		changeStep("step2");
	};
	const loadDataAddress = async () => {
		setIsLoading(true);
		let response = await getAddress(
			addressBookReducer?.selectedRowData?.id,
			"crypto"
		);
		if (response.ok) {
			setCryptoAddress(response.data);
			setAddressState(response.data.addressState);
			form.setFieldsValue({
				...response.data,
				toCoin: addressBookReducer?.selectedRowData?.coin,
			});
			const fileInfo = response?.data?.documents?.details[0];
			if (fileInfo?.path) {
				form.setFieldsValue({ file: true });
				setFile({
					name: fileInfo?.documentName,
					size: fileInfo.remarks,
					response: [fileInfo.path],
				});
			}
			setIsLoading(false);
		}
		else{
			setIsLoading(false);
			setErrorMsg(isErrorDispaly(response));

		}
	};
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
	const saveAddressBook = async (values) => {
		setIsLoading(false);
		setBtnDisabled(true);
		const type = "crypto";
		let Id = "00000000-0000-0000-0000-000000000000";
		values["id"] = addressBookReducer?.selectedRowData?.id;
		values["membershipId"] = userConfig.id;
		values["beneficiaryAccountName"] =
			userConfig.firstName + " " + userConfig.lastName;
		values["type"] = type;
		values["info"] = JSON.stringify(trackAuditLogData);
		values["addressState"] = addressBookReducer?.selectedRowData?.addressState;
		let namecheck = values.favouriteName.trim();
		let favaddrId = addressBookReducer?.selectedRowData
			? addressBookReducer?.selectedRowData?.id
			: Id;
		let responsecheck = await favouriteNameCheck(
			userConfig.id,
			namecheck,
			"crypto",
			favaddrId
		);
		if (!values.isAgree) {
			setBtnDisabled(false);
			useDivRef.current.scrollIntoView();
			setErrorMsg(apiCalls.convertLocalLang("agree_termsofservice"))
		} else if (responsecheck.data !== null) {
			setBtnDisabled(false);
			setIsLoading(false);
			useDivRef.current.scrollIntoView();
			return setErrorMsg("Address label already existed");
		} else {
			setBtnDisabled(true);
			setErrorMsg("");
			let saveObj = Object.assign({}, values);
			saveObj.toWalletAddress = apiCalls.encryptValue(
				saveObj.toWalletAddress,
				userConfig.sk
			);
			saveObj.beneficiaryAccountName = apiCalls.encryptValue(
				saveObj.beneficiaryAccountName,
				userConfig.sk
			);
			let response = await saveAddress(saveObj);
			if (response.ok) {
				setBtnDisabled(false);
				message.success({
					content: apiCalls.convertLocalLang("address_msg"),
					className: "custom-msg",
					duration:4
				});
				form.resetFields();
				rejectCoinWallet();
				InputFormValues(null);
				onCancel();
				setIsLoading(false);
				setError("")
			} else {
				setError(isErrorDispaly(response));
				setBtnDisabled(false);
				setIsLoading(false);
			}
		}
	};

	const antIcon = (
		<LoadingOutlined
			style={{ fontSize: 18, color: "#fff", marginRight: "16px" }}
			spin
		/>
	);

	const validateAddressType = (_, value) => {
		if (value) {
			let address = value;
			let coinType = form.getFieldValue("toCoin");
			if (coinType) {
				const validAddress = WAValidator.validate(address, coinType, "both");
				if (!validAddress) {
					return Promise.reject(
						"Address is not Valid, please enter a valid address according to the coin selected"
					);
				} else {
					return Promise.resolve();
				}
			} else {
				return Promise.reject("Please select a coin first");
			}
		} else {
			return Promise.reject("is required");
		}
	};
	return (
		<>
			<div>
				<div ref={useDivRef}></div>
				{errorMsg && (
					<Alert
						type="error"
						description={errorMsg}
						onClose={() => setErrorMsg(null)}
						showIcon
					/>
				)}
					{error && (
					<Alert
						type="error"
						description={error}
						showIcon
					/>
				)}
				{isLoading ? (
					<Loader className="loader" />
				) : (
					<Form
						form={form}
						initialValues={cryptoAddress}
						onFinish={saveAddressBook}
						autoComplete="off">
						<Form.Item
							className="custom-label"
							label={
								<Translate content="AddressLabel" component={Form.label} />
							}
							name="favouriteName"
							required
							rules={[
								{
									required: true,
									message: apiCalls.convertLocalLang("is_required"),
								},
								{
									whitespace: true,
									message: apiCalls.convertLocalLang("is_required"),
								},
								{
									validator: validateContentRule,
								},
							]}>
							<Input
								className="cust-input mb-0"
								maxLength="20"
								placeholder={apiCalls.convertLocalLang("Enteraddresslabel")}
							/>
						</Form.Item>
						<Form.Item
							className="custom-label"
							name="toCoin"
							label={<Translate content="Coin" component={Form.label} />}
							rules={[
								{
									required: true,
									message: apiCalls.convertLocalLang("is_required"),
								},
							]}>
							<Input
								disabled
								placeholder={apiCalls.convertLocalLang("Selectcoin")}
								className="cust-input select-crypto cust-adon mb-0 text-center c-pointer"
								addonAfter={
									<i
										className="icon md rarrow-white c-pointer"
										onClick={selectCrypto}
									/>
								}
							/>
						</Form.Item>
						<Form.Item
							className="custom-label"
							name="toWalletAddress"
							label={<Translate content="address" component={Form.label} />}
							required
							rules={[
								{
									validator: validateAddressType,
								},
							]}>
							<Input
								className="cust-input mb-0"
								maxLength="100"
								placeholder={apiCalls.convertLocalLang("address")}
							/>
						</Form.Item>

						<Form.Item
							className="custom-label"
							name="addressType"
							label={
								<Translate content="address_type" component={Form.label} />
							}
							rules={[
								{
									required: true,
									message: apiCalls.convertLocalLang("is_required"),
								},
							]}>
							<Select
								className="cust-input mb-0"
								placeholder="Select Address Type"
								dropdownClassName="select-drpdwn"
								bordered={false}
								showArrow={true}>
								<Option value="1stparty">1st Party</Option>
								<Option value="3rdparty">3rd Party</Option>
							</Select>
						</Form.Item>

						<div style={{ position: "relative" }}>
							<Form.Item
								className="custom-forminput mt-36 agree"
								name="isAgree"
								valuePropName="checked"
								>
								<Checkbox className="ant-custumcheck" />
							</Form.Item>
							<Translate
								content="agree_to_suissebase"
								with={{ link }}
								component={Paragraph}
								className="fs-14 text-white-30 ml-16 mb-4 mt-16"
								style={{
									index: 100,
									position: "absolute",
									width: "420px",
									top: -20,
									left: 30,
									paddingBottom: "10px",
									marginBottom: "10px",
								}}
							/>
								<div className="whitelist-note">
								<Alert type="warning" message={`Note : Declaration form has been sent to ${cryptoAddress?.email || "your email address"}. Please sign using link received in email to whitelist your address`} showIcon closable={false} />
							</div>
						</div>

						<div style={{ marginTop: "50px" }}>
							<Button
								htmlType="submit"
								size="large"
								block
								className="pop-btn"
								loading={btnDisabled}>
								{isLoading && <Spin indicator={antIcon} />}{" "}
								<Translate content="Save_btn_text" component={Text} />
							</Button>
						</div>
					</Form>
				)}
			</div>
		</>
	);
};

const connectStateToProps = ({ addressBookReducer, userConfig }) => {
	return {
		addressBookReducer,
		userConfig: userConfig.userProfileInfo,
		trackAuditLogData: userConfig.trackAuditLogData,
	};
};
const connectDispatchToProps = (dispatch) => {
	return {
		changeStep: (stepcode) => {
			dispatch(setAddressStep(stepcode));
		},
		rejectCoinWallet: () => {
			dispatch(rejectCoin());
		},
		InputFormValues: (cryptoValues) => {
			dispatch(fetchAddressCrypto(cryptoValues));
		},
	};
};
export default connect(
	connectStateToProps,
	connectDispatchToProps
)(NewAddressBook);
