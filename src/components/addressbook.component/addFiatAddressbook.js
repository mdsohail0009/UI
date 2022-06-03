import React, { useState, useEffect } from "react";
import {
	Form,
	Typography,
	Input,
	Button,
	Alert,
	Spin,
	message,
	Select,
	Checkbox,
	Tooltip,
	Upload,
	Modal,
	Radio,
	Row,
	Col,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { setStep, setHeaderTab } from "../../reducers/buysellReducer";
import Translate from "react-translate-component";
import { connect } from "react-redux";
import WalletList from "../shared/walletList";
import { saveAddress, favouriteNameCheck, getAddress, getFileURL } from "./api";
import Loader from "../../Shared/loader";
import apiCalls from "../../api/apiCalls";
import { validateContentRule } from "../../utils/custom.validator";
import { Link } from "react-router-dom";
import { bytesToSize } from "../../utils/service";
import { addressTabUpdate } from "../../reducers/addressBookReducer";
import FilePreviewer from "react-file-previewer";

const { Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;
const { Dragger } = Upload;

const EllipsisMiddle = ({ suffixCount, children }) => {
	const start = children?.slice(0, children.length - suffixCount)?.trim();
	const suffix = children?.slice(-suffixCount)?.trim();

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
const NewFiatAddress = (props) => {
	const [form] = Form.useForm();
	const [errorMsg, setErrorMsg] = useState(null);
	const [isLoading, setIsLoading] = useState(false);
	const [fiatAddress, setFiatAddress] = useState({});
	const useDivRef = React.useRef(null);
	const [btnDisabled, setBtnDisabled] = useState(false);
	const [addressFile, setAdressFile] = useState(null);
	const [identityFile, setIdentityFile] = useState(null);
	const [declarationFile, setDeclarationFile] = useState(null);
	const [isUploading, setUploading] = useState(false);
	const [addressState, setAddressState] = useState(null);
	const [selectParty, setSelectParty] = useState(props?.checkThirdParty);
	const [withdrawEdit, setWithdrawValues] = useState();
	const [isEdit, setEdit] = useState(false);
	const [uploadAdress, setUploadAddress] = useState(false);
	const [uploadIdentity, setUploadIdentity] = useState(false);
	const [previewPath, setPreviewPath] = useState(null);
	const [previewModal, setPreviewModal] = useState(false);
	const [bankType, setBankType] = useState("");
	const [errorWarning, setErrorWarning] = useState(null);
	const bankNameRegex = /^[A-Za-z0-9]+$/;
	const IbanRegex = /^[A-Za-z0-9]{14,}$/;

	useEffect(() => {
		if (selectParty === true) {
			form.setFieldsValue({ addressType: "3rdparty",bankType:'bank',accountNumber: "",
			routingNumber: "",
			bankName: "",
			bankAddress: "",
			country: "",
			state: "",
			zipCode: "", });
		} else {
			form.setFieldsValue({
				addressType: "1stparty",
				beneficiaryAccountName: getName(),
				bankType:'bank',accountNumber: "",
				routingNumber: "",
				bankName: "",
				bankAddress: "",
				country: "",
				state: "",
				zipCode: "",
			});
		}
		if (
			props?.addressBookReducer?.selectedRowData?.id !==
				"00000000-0000-0000-0000-000000000000" &&
			props?.addressBookReducer?.selectedRowData?.id
		) {
			loadDataAddress();
			setEdit(true);
		}
		setBankType('bank');
		addressbkTrack();
	}, []);// eslint-disable-line react-hooks/exhaustive-deps
	const getName = () => {
		return props?.userConfig.isBusiness
			? props?.userConfig.businessName
			: props?.userConfig?.firstName + " " + props?.userConfig?.lastName;
	};
	const addressbkTrack = () => {
		apiCalls.trackEvent({
			Type: "User",
			Action: "Withdraw Fiat Address Book Details page view ",
			Username: props?.userConfig?.id,
			MemeberId: props?.userConfig?.id,
			Feature: "Withdraw Fiat",
			Remarks: "Withdraw Fiat Address book details view",
			Duration: 1,
			Url: window.location.href,
			FullFeatureName: "Withdraw Fiat",
		});
	};
	const loadDataAddress = async () => {
		setIsLoading(true);
		let response = await getAddress(
			props?.addressBookReducer?.selectedRowData?.id,
			"fiat"
		);
		if (response.ok) {
			if (response.data.addressType === "3rdparty") {
				setSelectParty(true);
			} else {
				setSelectParty(false);
			}
			setFiatAddress(response.data);
			setWithdrawValues(response.data);
			setAddressState(response.data.addressState);
			setBankType(response.data.bankType);
			if (
				props?.addressBookReducer?.selectedRowData &&
				props?.buyInfo.memberFiat?.data
			) {
				handleWalletSelection(
					props?.addressBookReducer?.selectedRowData?.currency
				);
			}
			let fileInfo = response?.data?.documents?.details;
			if (response?.data?.addressType === "1stparty" && fileInfo?.length !== 0) {
				setDeclarationFile(response?.data?.documents?.details[0]);
				form.setFieldsValue({ file3: true });
			} else {
				setIdentityFile(response?.data?.documents?.details[0]);
				setAdressFile(response?.data?.documents?.details[1]);
				form.setFieldsValue({ file1: true });
				form.setFieldsValue({ file2: true });
			}

			form.setFieldsValue({ ...response.data });
			setIsLoading(false);
		} else {
			setErrorMsg(isErrorDispaly(response));
			setIsLoading(false);
			useDivRef.current.scrollIntoView();
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
	const handleWalletSelection = (walletId) => {
		setFiatAddress({ toCoin: walletId });
		form.setFieldsValue({ toCoin: walletId });
	};
	const savewithdrawal = async (values) => {
		setIsLoading(false);
		setErrorMsg(null);
		setBtnDisabled(true);
		const type = "fiat";
		values["id"] = props?.addressBookReducer?.selectedRowData?.id;
		values["membershipId"] = props?.userConfig?.id;

		if (!selectParty) {
			values["beneficiaryAccountName"] = props?.userConfig.isBusiness
				? props?.userConfig.businessName
				: props?.userConfig?.firstName + " " + props?.userConfig?.lastName;
		}
		values["type"] = type;
		values["info"] = JSON.stringify(props?.trackAuditLogData);
		values["addressState"] = addressState;
		let Id = "00000000-0000-0000-0000-000000000000";
		let favaddrId = props?.addressBookReducer?.selectedRowData
			? props?.addressBookReducer?.selectedRowData?.id
			: Id;
		let namecheck = values.favouriteName.trim();
		let responsecheck = await favouriteNameCheck(
			props?.userConfig?.id,
			namecheck,
			"fiat",
			favaddrId
		);
		if (!values.isAgree) {
			setBtnDisabled(false);
			useDivRef.current.scrollIntoView();
			setErrorMsg(apiCalls.convertLocalLang("agree_termsofservice"))
		} else if (responsecheck.data !== null) {
			setIsLoading(false);
			setBtnDisabled(false);
			useDivRef.current.scrollIntoView();
			return setErrorMsg("Address label already existed");
		} else {
			setBtnDisabled(true);
			let saveObj = Object.assign({}, values);

			saveObj.accountNumber = apiCalls.encryptValue(
				saveObj.accountNumber,
				props?.userConfig?.sk
			);
			saveObj.bankAddress = apiCalls.encryptValue(
				saveObj.bankAddress,
				props?.userConfig?.sk
			);
			saveObj.bankName = apiCalls.encryptValue(
				saveObj.bankName,
				props?.userConfig?.sk
			);
			saveObj.beneficiaryAccountAddress = apiCalls.encryptValue(
				saveObj.beneficiaryAccountAddress,
				props?.userConfig?.sk
			);
			saveObj.beneficiaryAccountName = apiCalls.encryptValue(
				saveObj.beneficiaryAccountName,
				props?.userConfig?.sk
			);
			saveObj.routingNumber = apiCalls.encryptValue(
				saveObj.routingNumber,
				props?.userConfig?.sk
			);
			saveObj.toWalletAddress = apiCalls.encryptValue(
				saveObj.toWalletAddress,
				props?.userConfig?.sk
			);
			saveObj.country = apiCalls.encryptValue(
				saveObj.country,
				props?.userConfig?.sk
			);
			saveObj.state = apiCalls.encryptValue(
				saveObj.state,
				props?.userConfig?.sk
			);
			saveObj.zipCode = apiCalls.encryptValue(
				saveObj.zipCode,
				props?.userConfig?.sk
			);
			saveObj.documents = {
				id: withdrawEdit
					? withdrawEdit?.documents?.id
					: "00000000-0000-0000-0000-000000000000",
				transactionId: null,
				adminId: "00000000-0000-0000-0000-000000000000",
				date: null,
				typeId: null,
				memberId: props?.userConfig?.id,
				caseTitle: null,
				caseState: null,
				remarks: null,
				status: null,
				state: null,
				details: [],
			};
			if (selectParty) {
				if (identityFile) {
					saveObj.documents.details.push(identityFile);
				}
				if (addressFile) {
					saveObj.documents.details.push(addressFile);
				}
			} else {
				if (declarationFile) {
					saveObj.documents.details.push(declarationFile);
				}
			}
			let response = await saveAddress(saveObj);

			if (response.ok) {
				setBtnDisabled(false);
				setErrorMsg("");
				useDivRef.current.scrollIntoView();
				message.success({
					content: apiCalls.convertLocalLang("address_msg"),
					className: "custom-msg",
					duration: 3,
				});
				form.resetFields();
				props?.onCancel();
				setIsLoading(false);
				props?.dispatch(addressTabUpdate(true));
				props?.dispatch(setHeaderTab(""));
				props?.props?.history?.push("/userprofile");
			} else {
				setErrorMsg(isErrorDispaly(response));
				setIsLoading(false);
				setBtnDisabled(false);
				useDivRef.current.scrollIntoView();
			}
		}
	};
	const getIbanData = async (val) => {
		form.setFieldsValue({
			bankName: "",
			bankAddress: "",
			state: null,
			country: null,
			zipCode: "",
			routingNumber: "",
		});
		if (val && val.length > 14) {
			let response = await apiCalls.getIBANData(val);
			if (response.ok) {
				const oldVal = form.getFieldValue();
				form.setFieldsValue({
					routingNumber: response.data.routingNumber || oldVal.routingNumber,
					bankName: response.data.bankName || oldVal.bankName,
					bankAddress: response.data.bankAddress || oldVal.bankAddress,
					zipCode: response.data.zipCode || oldVal.zipCode,
					state: response.data.state || oldVal.state,
					country: response.data.country || oldVal.country,
				});
			}
		}
	};
	const beforeUpload = (file, type) => {
		setErrorWarning(null);
		if (file.name.split(".").length > 2) {
			useDivRef.current.scrollIntoView();
			setErrorMsg(null);
			setErrorWarning("File don't allow double extension");
			return;
		} else {
			if (type === "IDENTITYPROOF") {
				let fileType = {
					"image/png": true,
					"image/jpg": true,
					"image/jpeg": true,
					"image/PNG": true,
					"image/JPG": true,
					"image/JPEG": true,
					"application/pdf": true,
					"application/PDF": true,
				};
				if (fileType[file.type]) {
					setUploadIdentity(true);
					return true;
				} else {
					setErrorMsg(null);
					setErrorWarning(
						"File is not allowed. You can upload jpg, png, jpeg and PDF files"
					);
					useDivRef.current.scrollIntoView();
					setUploadIdentity(false);
					return Upload.LIST_IGNORE;
				}
			} else if (type === "ADDRESSPROOF") {
				let fileType = {
					"image/png": true,
					"image/jpg": true,
					"image/jpeg": true,
					"image/PNG": true,
					"image/JPG": true,
					"image/JPEG": true,
					"application/pdf": true,
					"application/PDF": true,
				};
				if (fileType[file.type]) {
					setUploadAddress(true);
					return true;
				} else {
					setErrorMsg(null);
					setErrorWarning(
						"File is not allowed. You can upload jpg, png, jpeg and PDF files"
					);
					setUploadAddress(false);
					return Upload.LIST_IGNORE;
				}
			} else if (type === "DECLARATION") {
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
					setErrorMsg(null);
					setErrorWarning("File is not allowed. You can upload only PDF file");
					setUploading(false);
					return Upload.LIST_IGNORE;
				}
			}
		}
	};
	const radioChangeHandler = (e) => {
		setErrorMsg(null);
		setErrorWarning(null);
		setUploading(false);
		setUploadAddress(false);
		setUploadIdentity(false);
		setIdentityFile(null);
		setAdressFile(null);
		setDeclarationFile(null);
		form.setFieldsValue({ file1: false, file2: false, file3: false });
		form.resetFields();
		setFiatAddress(null);
		if (e.target.value === "1stparty") {
			form.setFieldsValue({
				addressType: "1stparty",
				beneficiaryAccountName: props?.userConfig.isBusiness
					? props?.userConfig.businessName
					: props?.userConfig?.firstName + " " + props?.userConfig?.lastName,
					bankType:'bank'
			});
			setBankType('bank');
			setSelectParty(false);
		} else {
			form.setFieldsValue({
				addressType: "3rdparty",
				beneficiaryAccountName: null,
				bankType:'bank'
			});
			setBankType('bank');
			setSelectParty(true);
		}
	};

	const upLoadFiles = ({ file }, type) => {
		let obj = {
			documentName: `${file.name}`,
			isChecked: file.name === "" ? false : true,
			remarks: `${file.size}`,
			state: null,
			status: false,
			path: `${file.response}`,
			size: `${file.size}`,
		};
		if (file?.status === "done") {
			if (type === "IDENTITYPROOF" && uploadIdentity) {
				obj["documentId"] =
					identityFile !== null
						? identityFile?.documentId
						: "00000000-0000-0000-0000-000000000000";
				obj["id"] =
					identityFile !== null
						? identityFile?.id
						: "00000000-0000-0000-0000-000000000000";
				obj["Recorder"] = 1;
				setIdentityFile(obj);
				setUploadIdentity(false);
				form.setFieldsValue({ file1: true });
			} else if (type === "ADDRESSPROOF" && uploadAdress) {
				obj["documentId"] =
					addressFile !== null
						? addressFile?.documentId
						: "00000000-0000-0000-0000-000000000000";
				obj["id"] =
					addressFile !== null
						? addressFile?.id
						: "00000000-0000-0000-0000-000000000000";
				obj["Recorder"] = 2;
				setAdressFile(obj);
				setUploadAddress(false);
				form.setFieldsValue({ file2: true });
			} else if (type === "DECLARATION" && isUploading) {
				obj["documentId"] =
					declarationFile !== null
						? declarationFile?.documentId
						: "00000000-0000-0000-0000-000000000000";
				obj["id"] =
					declarationFile !== null
						? declarationFile?.id
						: "00000000-0000-0000-0000-000000000000";

				setDeclarationFile(obj);
				form.setFieldsValue({ file3: true });
				setUploading(false);
			}
		}
	};

	const docPreview = async (file) => {
		let res = await getFileURL({ url: file.path });
		if (res.ok) {
			setPreviewModal(true);
			setPreviewPath(res.data);
		}
	};
	const filePreviewPath = () => {
			return previewPath;
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

	const changeBankType = (e) => {
		setBankType(e);

		form.setFieldsValue({
			accountNumber: "",
			routingNumber: "",
			bankName: "",
			bankAddress: "",
			country: "",
			state: "",
			zipCode: "",
		});
	};

	const doNothing = () => {
		//---Do nothing
	};

	const antIcon = (
		<LoadingOutlined
			style={{ fontSize: 18, color: "#fff", marginRight: "16px" }}
			spin
		/>
	);
	return (
		<>
			{isLoading ? (
				<Loader />
			) : (
				<div className="addbook-height">
					<div ref={useDivRef}></div>
					{errorMsg !== null && (
						<Alert
							type="error"
							description={errorMsg}
							onClose={() => setErrorMsg(null)}
							showIcon
						/>
					)}
					{errorMsg !== null ||
						(errorWarning !== null && (
							<Alert
								type="warning"
								description={errorWarning}
								onClose={() => setErrorWarning(null)}
								showIcon
							/>
						))}
					<Form
						form={form}
						onFinish={savewithdrawal}
						autoComplete="off"
						initialValues={fiatAddress}>
						<Form.Item
							name="addressType"
							label={
								<div>
									Address Type{" "}
									<Tooltip
										title={
											<ul className=" p-0" style={{ listStyleType: "none" }}>
												<li className=" mb-4">
													<span className=" text-yellow">1st Party </span>:
													Funds will be deposited to your own bank account.
												</li>
												<li className=" mb-4">
													<span className=" text-yellow">3rd Party </span>:
													Funds will be deposited to other beneficiary bank
													account.
												</li>
											</ul>
										}>
										<div className="icon md info c-pointer"></div>
									</Tooltip>
								</div>
							}
							className="custom-label">
							<Radio.Group
								size="large"
								buttonStyle="solid"
								className="text-white ml-8"
								onChange={radioChangeHandler}
								defaultValue={
									(selectParty && "3rdparty") || (!selectParty && "1stparty")
								}
								value={
									(selectParty && "3rdparty") || (!selectParty && "1stparty")
								}>
								<Radio
									value={"1stparty"}
									className="text-white"
									disabled={isEdit}>
									1st Party
								</Radio>
								<Radio
									value={"3rdparty"}
									className="text-white"
									disabled={isEdit}>
									3rd Party
								</Radio>
							</Radio.Group>
						</Form.Item>

						<Translate
							content="Beneficiary_BankDetails"
							component={Paragraph}
							className="mb-16 fs-14 text-aqua fw-500 text-upper"
						/>
						<Row gutter={[16, 16]}>
							<Col xs={24} md={12} lg={12} xl={12} xxl={12}>
								<Form.Item
									className="custom-forminput custom-label mb-0"
									name="favouriteName"
									required
									label={
										<Translate content="AddressLabel" component={Form.label} />
									}
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
										className="cust-input"
										maxLength="20"
										placeholder={apiCalls.convertLocalLang("AddressLabel")}
									/>
								</Form.Item>
							</Col>

							<Col xs={24} md={12} lg={12} xl={12} xxl={12}>
								<Form.Item
									className="custom-forminput custom-label mb-0"
									name="toCoin"
									label={
										<Translate content="currency" component={Form.label} />
									}
									rules={[
										{
											required: true,
											message: apiCalls.convertLocalLang("is_required"),
										},
									]}>
									<WalletList
										hideBalance={true}
										valueFeild={"currencyCode"}
										selectedvalue={fiatAddress?.toCoin}
										placeholder={apiCalls.convertLocalLang("selectcurrency")}
										onWalletSelect={(e) => handleWalletSelection(e)}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={12} lg={12} xl={12} xxl={12}>
								<Form.Item
									className="custom-forminput custom-label mb-0"
									label={
										<Translate content="bank_type" component={Form.label} />
									}
									name="bankType"
									required
									rules={[
										{
											required: true,
											message: apiCalls.convertLocalLang("is_required"),
										},
									]}>
									<Select
										dropdownClassName="select-drpdwn"
										placeholder={apiCalls.convertLocalLang("bank_type")}
										className="cust-input"
										style={{ width: "100%" }}
										bordered={false}
										showArrow={true}
										optionFilterProp="children"
										onChange={(e) => changeBankType(e)}>
										<Option value={"bank"}>{"Bank Account"}</Option>
										<Option value={"iban"}>{"IBAN"}</Option>
									</Select>
								</Form.Item>
							</Col>
							<Col xs={24} md={12} lg={12} xl={12} xxl={12}>
								<Form.Item
									className="custom-forminput custom-label mb-0"
									name="accountNumber"
									label={
										bankType !== "iban"
											? apiCalls.convertLocalLang("Bank_account")
											: apiCalls.convertLocalLang("iban")
									}
									required
									rules={[
										{
											required: true,
											message: apiCalls.convertLocalLang("is_required"),
										},
										{
											pattern: bankType !== "iban"?bankNameRegex:IbanRegex,
											message: bankType !== "iban"?"Invalid Bank account number":"Invalid IBAN",
										},
									]}>
									<Input
										className="cust-input"
										maxLength={100}
										placeholder={
											bankType !== "iban"
												? apiCalls.convertLocalLang("Bank_account")
												: apiCalls.convertLocalLang("iban")
										}
										onBlur={
											bankType === "iban"
												? (val) => getIbanData(val.currentTarget.value)
												: doNothing
										}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={12} lg={12} xl={12} xxl={12}>
								<Form.Item
									className="custom-forminput custom-label mb-0"
									name="routingNumber"
									label={
										<Translate
											content="BIC_SWIFT_routing_number"
											component={Form.label}
										/>
									}
									required
									rules={[
										{
											required: true,
											message: apiCalls.convertLocalLang("is_required"),
										},
										{
											pattern: /^[A-Za-z0-9]+$/,
											message: "Invalid BIC/SWIFT/Routing number",
										},
									]}>
									<Input
										className="cust-input"
										disabled={bankType === "iban" ? true : false}
										maxLength={100}
										placeholder={apiCalls.convertLocalLang(
											"BIC_SWIFT_routing_number"
										)}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={12} lg={12} xl={12} xxl={12}>
								<Form.Item
									className="custom-forminput custom-label mb-0"
									name="bankName"
									label={
										<Translate content="Bank_name" component={Form.label} />
									}
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
										className="cust-input"
										disabled={bankType === "iban" ? true : false}
										maxLength={200}
										placeholder={apiCalls.convertLocalLang("Bank_name")}
									/>
								</Form.Item>
							</Col>
							<Col xs={24} md={24} lg={24} xl={24} xxl={24}>
								<Form.Item
									className="custom-forminput custom-label mb-0"
									name="bankAddress"
									label={
										<Translate content="Bank_address1" component={Form.label} />
									}
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
										className="cust-input"
										disabled={bankType === "iban" ? true : false}
										maxLength={200}
										placeholder={apiCalls.convertLocalLang("Bank_address1")}
									/>
								</Form.Item>
							</Col>
						</Row>
						<Translate
							content="Beneficiary_Details"
							component={Paragraph}
							className="mb-16 mt-24 fs-14 text-aqua fw-500 text-upper"
						/>
						<Row gutter={[16, 16]}>
							<Col xs={24} md={24} lg={24} xl={24} xxl={24}>
								<Form.Item
									className="custom-label mb-0"
									name="beneficiaryAccountName"
									required
									label={
										<Translate
											content={
												(props?.userConfig?.isBusiness&& !selectParty && "company_name") ||
												((!props?.userConfig?.isBusiness || selectParty)&&
													"Recipient_full_name")
											}
											component={Form.label}
										/>
									}
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
									{selectParty ? (
										<Input
											className="cust-input"
											placeholder={
												(props?.userConfig?.isBusiness && !selectParty&&
													apiCalls.convertLocalLang("company_name")) ||
												((!props?.userConfig?.isBusiness || selectParty) &&
													apiCalls.convertLocalLang("Recipient_full_name"))
											}
											value="naresh"
										/>
									) : (
										<Input
											className="cust-input"
											value={"naresh"}
											placeholder="Recipient full name"
											disabled={true}
										/>
									)}
								</Form.Item>
							</Col>
							<Col xs={24} md={24} lg={24} xl={24} xxl={24}>
								<Form.Item
									className="custom-forminput custom-label mb-0"
									name="beneficiaryAccountAddress"
									label={
										<Translate
											content="Recipient_address1"
											component={Form.label}
										/>
									}
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
										className="cust-input"
										maxLength={200}
										placeholder={apiCalls.convertLocalLang(
											"Recipient_address1"
										)}
									/>
								</Form.Item>
							</Col>
							{selectParty && (
								<Col xs={24} md={24} lg={24} xl={24} xxl={24}>
									<Form.Item
										className="custom-label"
										name="remarks"
										label={
											<Translate content="remarks" component={Form.label} />
										}>
										<TextArea
											placeholder="Remarks"
											className="cust-input pt-16"
											autoSize={{ minRows: 3, maxRows: 3 }}
											maxLength={300}></TextArea>
									</Form.Item>
								</Col>
							)}
						</Row>

						<Row gutter={[12, 12]}>
							{selectParty === true && (
								<Col xs={24} md={24} lg={12} xl={12} xxl={12}>
									<Form.Item
										name={"file1"}
										className="mb-0"
										rules={[
											{
												required: true,
												message: "Please upload identity document",
											},
										]}>
										{
											<Dragger
												accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG"
												className="upload mt-16"
												multiple={false}
												action={process.env.REACT_APP_UPLOAD_API + "UploadFile"}
												showUploadList={false}
												beforeUpload={(identityprop) => {
													beforeUpload(identityprop, "IDENTITYPROOF");
												}}
												onChange={(identityprop) =>
													upLoadFiles(identityprop, "IDENTITYPROOF")
												}>
												<p className="ant-upload-drag-icon mb-16">
													<span className="icon xxxl doc-upload" />
												</p>
												<p className="ant-upload-text fs-18 mb-0">
													Please upload identity document here
												</p>
											</Dragger>
										}
										{!uploadIdentity && identityFile !== null && (
											<div className="docfile mr-0">
												<span
													className={`icon xl ${
														(identityFile.documentName?.slice(-3) === "zip" &&
															"file") ||
														(identityFile.documentName?.slice(-3) !== "zip" &&
															"") ||
														(identityFile.documentName?.slice(-3) === "pdf" &&
															"file") ||
														(identityFile.documentName?.slice(-3) !== "pdf" &&
															"image")
													} mr-16`}
												/>

												<div
													className="docdetails c-pointer"
													onClick={() => docPreview(identityFile)}>
													<EllipsisMiddle suffixCount={4}>
														{identityFile.documentName}
													</EllipsisMiddle>
													<span className="fs-12 text-secondary">
														{bytesToSize(identityFile.remarks)}
													</span>
												</div>
											</div>
										)}
										{uploadIdentity && (
											<div className="text-center mt-16">
												<Spin />
											</div>
										)}
									</Form.Item>
								</Col>
							)}
							{selectParty === true && (
								<Col xs={24} md={24} lg={12} xl={12} xxl={12}>
									<Form.Item
										name={"file2"}
										className="mb-0"
										rules={[
											{
												required: true,
												message: "Please upload address proof",
											},
										]}>
										{<>
											<Dragger
												accept=".pdf,.jpg,.jpeg,.png, .PDF, .JPG, .JPEG, .PNG"
												className="upload mt-16"
												multiple={false}
												action={process.env.REACT_APP_UPLOAD_API + "UploadFile"}
												showUploadList={false}
												beforeUpload={(addressprop) => {
													beforeUpload(addressprop, "ADDRESSPROOF");
												}}
												onChange={(addressprop) =>
													upLoadFiles(addressprop, "ADDRESSPROOF")
												}>
												<p className="ant-upload-drag-icon mb-16">
													<span className="icon xxxl doc-upload" />
												</p>
												<p className="ant-upload-text fs-18 mb-0">
													Please upload address proof here
												</p>
											</Dragger>
											</>
										}
									</Form.Item>
									{!uploadAdress && addressFile !== null && (
										<div className="docfile mr-0">
											<span
												className={`icon xl ${
													(addressFile?.documentName?.slice(-3) === "zip" &&
														"file") ||
													(addressFile?.documentName?.slice(-3) !== "zip" &&
														"") ||
													(addressFile.documentName?.slice(-3) === "pdf" &&
														"file") ||
													(addressFile.documentName?.slice(-3) !== "pdf" &&
														"image")
												} mr-16`}
											/>
											<div
												className="docdetails c-pointer"
												onClick={() => docPreview(addressFile)}>
												<EllipsisMiddle suffixCount={4}>
													{addressFile.documentName}
												</EllipsisMiddle>
												<span className="fs-12 text-secondary">
													{bytesToSize(addressFile.remarks)}
												</span>
											</div>
										</div>
									)}
									{uploadAdress && (
										<div className="text-center mt-16">
											<Spin />
										</div>
									)}
								</Col>
							)}
						</Row>

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
									index: 50,
									position: "absolute",
									width: "600px",
									top: -10,
									left: 30,
									paddingBottom: "10px",
									marginBottom: "10px",
								}}
							/>
						</div>

						<Form.Item className="text-center">
							<Button
								htmlType="submit"
								size="large"
								className="pop-btn mb-36"
								loading={btnDisabled}
								style={{ minWidth: 300 }}>
								{isLoading && <Spin indicator={antIcon} />}{" "}
								<Translate content="Save_btn_text" />
							</Button>
						</Form.Item>
					</Form>
					{filePreviewModal}
				</div>
			)}
		</>
	);
};

const connectStateToProps = ({
	buyInfo,
	userConfig,
	addressBookReducer,
	sendReceive,
	buySell,
}) => {
	return {
		buyInfo,
		userConfig: userConfig.userProfileInfo,
		sendReceive,
		addressBookReducer,
		trackAuditLogData: userConfig.trackAuditLogData,
		buySell,
	};
};

const connectDispatchToProps = (dispatch) => {
	return {
		changeStep: (stepcode) => {
			dispatch(setStep(stepcode));
		},
		dispatch,
	};
};
export default connect(
	connectStateToProps,
	connectDispatchToProps
)(NewFiatAddress);
