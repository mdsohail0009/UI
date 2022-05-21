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
	Upload,
	Tooltip,
	Modal,
	Checkbox,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import {
	rejectCoin,
	setAddressStep,
	fetchAddressCrypto,
} from "../../reducers/addressBookReducer";
import { connect } from "react-redux";
import { saveAddress, favouriteNameCheck, getAddress, getFileURL } from "./api";
import Loader from "../../Shared/loader";
import Translate from "react-translate-component";
import apiCalls from "../../api/apiCalls";
import { validateContentRule } from "../../utils/custom.validator";
import { Link } from "react-router-dom";
import { bytesToSize, getDocObj } from "../../utils/service";
import { warning } from "../../utils/message";
import FilePreviewer from "react-file-previewer";
import WAValidator from "multicoin-address-validator";
// var WAValidator = require("wallet-address-validator");

const { Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const EllipsisMiddle = ({ suffixCount, children }) => {
	const start = children?.slice(0, children.length - suffixCount).trim();
	const suffix = children?.slice(-suffixCount).trim();
	return (
		<Text
			className="mb-0 fs-14 docnames c-pointer d-block"
			style={{ maxWidth: "100% !important" }}
			ellipsis={{ suffix }}>
			{start}
		</Text>
	);
};
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
	const [detailfile, setDetailFile] = useState(null);
	const [isUploading, setUploading] = useState(false);
	const [addressState, setAddressState] = useState("");
	const [previewPath, setPreviewPath] = useState(null);
	const [previewModal, setPreviewModal] = useState(false);
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
				addressBookReducer?.selectedRowData?.id !=
					"00000000-0000-0000-0000-000000000000" &&
				addressBookReducer?.selectedRowData?.id
			) {
				loadDataAddress();
			}
		}

		form.setFieldsValue(addressBookReducer?.cryptoValues);
	}, []);

	useEffect(() => {
		let address = form.getFieldValue("toWalletAddress");
		let coinType = form.getFieldValue("toCoin");
		if (form.getFieldValue("toWalletAddress")) {
			// const validAddress = WAValidator.validate(address, coinType, "both");
			form
				.validateFields(["toWalletAddress"])
				.then((values) => console.log(values));
		}
	}, []);

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
			setDetailFile(response?.data?.documents?.details[0]);
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
			setErrorMsg("Something went wrong please try again!")	
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
		if (responsecheck.data != null) {
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
				setError(response.data||"Something went wrong please try again!")
				setErrorMsg(response.data);
				setBtnDisabled(false);
				setIsLoading(false);
			}
		}
	};
	const uploadFile = ({ file }) => {
		if (file?.status === "done" && isUploading) {
			let obj = {
				name: `${file.name}`,
				isChecked: file.name == "" ? false : true,
				remarks: `${file.size}`,
				state: null,
				status: false,
				path: `${file.response}`,
				size: `${file.size}`,
				documentId:
					file !== null
						? file?.documentId
						: "00000000-0000-0000-0000-000000000000",
				id: file !== null ? file?.id : "00000000-0000-0000-0000-000000000000",
			};
			setFile(obj);
			setUploading(false);
		}
	};
	const antIcon = (
		<LoadingOutlined
			style={{ fontSize: 18, color: "#fff", marginRight: "16px" }}
			spin
		/>
	);
	const beforeUpload = (file) => {
		if (file.name.split(".").length > 2) {
			warning(" File don't allow double extension");
			return;
		}
		let fileType = {
			"image/png": false,
			"image/jpg": false,
			"image/jpeg": false,
			"image/PNG": false,
			"image/JPG": false,
			"image/JPEG": false,
			"application/pdf": true,
			"application/PDF": true,
		};
		if (fileType[file.type]) {
			setUploading(true);
			return true;
		} else {
			warning("File is not allowed. You can upload PDF  files");
			setUploading(false);
			return Upload.LIST_IGNORE;
		}
	};
	const docPreview = async (file) => {
		let res = await getFileURL({ url: file.response[0] });
		if (res.ok) {
			setPreviewModal(true);
			setPreviewPath(res.data);
		} else {
			// error(res.data);
		}
	};
	const filePreviewPath = () => {
		if (previewPath?.includes(".pdf")) {
			return previewPath;
		} else {
			return previewPath;
		}
	};
	const filePreviewModal = (
		<Modal
			className="documentmodal-width"
			destroyOnClose={true}
			title="Preview"
			width={1000}
			visible={previewModal}
			closeIcon={
				<Tooltip title="Close">
					<span
						className="icon md close-white c-pointer"
						onClick={() => setPreviewModal(false)}
					/>
				</Tooltip>
			}
			footer={
				<>
					<Button
						className="pop-btn px-36"
						style={{ margin: "0 8px" }}
						onClick={() => setPreviewModal(false)}>
						Close
					</Button>
					<Button
						className="pop-btn px-36"
						style={{ margin: "0 8px" }}
						onClick={() => window.open(previewPath, "_blank")}>
						Download
					</Button>
				</>
			}>
			<FilePreviewer
				hideControls={true}
				file={{
					url: previewPath ? filePreviewPath() : null,
					mimeType: previewPath?.includes(".pdf") ? "application/pdf" : "",
				}}
			/>
		</Modal>
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
	const handleTypeChange = (e) => {
		console.log(e);
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
								// {
								// 	validator: validateContentRule,
								// },
								{
									validator: validateAddressType,
								},
							]}>
							<Input
								className="cust-input mb-0"
								maxLength="100"
								// onBlur={(e) => handleAddressValidation(e)}
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
								//onChange={(e) => this.handleCurrencyChange(e)}
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
								rules={[
									{
										validator: (_, value) =>
											value
												? Promise.resolve()
												: Promise.reject(
														new Error(
															apiCalls.convertLocalLang("agree_termsofservice")
														)
												  ),
									},
								]}>
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
				{filePreviewModal}
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
