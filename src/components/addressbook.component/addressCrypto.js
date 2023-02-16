import React, { useEffect, useState } from "react";
import {
	Form,
	Input,
	Row,
	Col,
	Select,
	Typography,
	Button,
	Modal,
	Alert,
	Tooltip,
	message
} from "antd";
import { publishShowActions } from "../grid.component/subscribir";
import { handleCurrency } from "../../reducers/bankReducer";
import {
	getCoinList,
	getCurrency,
	getPayeeData,
	getFileURL,
   savePayeeAccounts 

} from "./api";
import { connect } from "react-redux";
import { bytesToSize } from "../../utils/service";
import Loader from "../loader.component";
import { validateContentRule } from "../../utils/custom.validator";
import FilePreviewer from "react-file-previewer";
import apiCalls from "../../api/apiCalls";


const { Option } = Select;
const { Text } = Typography;
const EllipsisMiddle = ({ suffixCount, children }) => {
	const start = children.slice(0, children.length - suffixCount).trim();
	const suffix = children.slice(-suffixCount).trim();
	return (
		<Text
			className="mb-0 fs-14 docnames c-pointer d-block"
			style={{ maxWidth: "100% !important" }}
			ellipsis={{ suffix }}>
			{start}
		</Text>
	);
};
function AddressBookDetails(props, { trackAuditLogData }) {
	const [form] = Form.useForm();
	const [isLoading, setIsLoading] = useState(false);
	const [cryptoAddress, setCryptoAddress] = useState({});
	const [fiatAddress, setFiatAddress] = useState({});
	const [coinList, setCoinList] = useState([]);
	const [currency, setCurrency] = useState([]);
	const [files, setFiles] = useState([]);
	const [errorMsg, setErrorMsg] = useState(null);
	const [previewPath, setPreviewPath] = useState(null);
	const [previewModal, setPreviewModal] = useState(false);
	const [isEdit, setIsEdit] = useState(false);
	const [isAddress, setIsAddress] = useState("");
	const [isBtnLoading, setBtnLoading] = useState(false);
	const [bankType, setBankType] = useState("");

	useEffect(() => {
		publishShowActions(false);
		if (props.match.params?.type === "Crypto") {
			getCoinData();
		}
		getCurrencyData();
		loadData();
	}, []);//eslint-disable-line react-hooks/exhaustive-deps
	const loadData = async () => {
		setIsLoading(true);
		let response = await getPayeeData(props.match.params.payeeId,props.match.params.id);
		if (response.ok) {
			setErrorMsg(null)
			setCryptoAddress(response.data);
			setFiatAddress(response.data);
			setIsAddress(response.data.addressState);
			response.data.addressState === "Approved" ||
				response.data.addressState === "Rejected"
				? setIsEdit(true)
				: setIsEdit(false);

			//!---------- this code is for multiple documents ---------
			let fileDetails = response.data.details;
			if (fileDetails) {
				if (fileDetails.length !== 0) {
					fileDetails.forEach((item) => {
						let obj = {};
						obj.id = item.id;
						obj.name = item.documentName;
						obj.size = item.remarks;
						obj.response = [item.path];

						setFiles((preState) => [...preState, obj]);
					});
				}
			}
			setBankType(response.data?.walletCode);
			form.setFieldsValue({
				...response.data, addressType: addressTypeNames(response.data.addressType),
			});

		} else {
			setErrorMsg(apiCalls.isErrorDispaly(response));
			setIsLoading(false);
		}
		setIsLoading(false);
	};

	const addressTypeNames = (type) => {
		if (props.match.params.type === "Crypto") {
			const stepcodes = {
				"1stparty": "first_Party",
				"3rdparty": "third_Party",
			};
			return stepcodes[type];
		}
		else {
			const stepcodes = {
				"ownbusiness": "Own Business",
				"individuals": "Individuals",
				"otherbusiness": "Other Business",
				"myself": "My Self"
			}
			return stepcodes[type];
		}
		
	};
	const getCoinData = async () => {
		let res = await getCoinList("All");
		if (res.ok) {
			setErrorMsg(null)
			setCoinList(res.data);
		} else {
			setErrorMsg(apiCalls.isErrorDispaly(res));
		}
	};
	const getCurrencyData = async () => {
		let res = await getCurrency();
		if (res.ok) {
			setErrorMsg(null)
			setCurrency(res.data);
		} else {
			setErrorMsg(apiCalls.isErrorDispaly(res));
		}
	};
	const saveAddressBook = async (values) => {
		setIsLoading(false);
		setBtnLoading(true);	
		
		values["id"] = props.match.params.payeeId;
		values["payeeId"] = props.match.params.id;
		values["modifiedBy"] = props.userConfig.userName;
		values["type"] = props.match.params.type === "Crypto" ? "Crypto" : "Fiat";
			let saveObj = Object.assign({}, values);
			saveObj.customerId = props.userConfig?.id;
			saveObj.info = JSON.stringify(props.trackAuditLogData);
			saveObj.adminId = props?.userConfig?.id;
			let response = await savePayeeAccounts(saveObj);
			if (response.ok) {
				setBtnLoading(true);
				message.destroy();
				setErrorMsg(null)
				message.success({
					content: "Address Book details saved successfully",
					className: "custom-msg",
					duration: 3
				});
				props.history.push("/addressbook");
				form.resetFields();
			} else {
				setBtnLoading(false);
				message.destroy();
				setErrorMsg(apiCalls.isErrorDispaly(response));
			}
			setIsLoading(false);
		
	};
	
	const backToAddressBook = () => {
		props.history.push("/addressbook");
	};
	const options = coinList?.map((item, idx) => (
		<option key={idx} value={item.walletCode}>
			{item.walletCode}
		</option>
	));
	const addressTypeName = (type) => {
		const stepcodes = {
			"Reject": "Rejected",
			"Rejected": "Rejected",
			"Approved": "Approved",
			"Approve": "Approved"
		}
		return stepcodes[type]
	}
	const handleStateChange = (val) => {
		setErrorMsg(null);
		let values = addressTypeName(val)
		setFiatAddress({ ...fiatAddress, addressState: values });
	};
	const handleChangeCrypto = (value) => {

		let values = addressTypeName(value)
		setCryptoAddress({ ...cryptoAddress, addressState: values })

	}
	const docPreview = async (file) => {
		let res = await getFileURL({ url: file.response[0] });
		if (res.ok) {
			setErrorMsg(null)
			setPreviewModal(true);
			setPreviewPath(res.data);
		} else {
			setErrorMsg(apiCalls.isErrorDispaly(response));
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
					<span className="icon md x c-pointer" onClick={() => setPreviewModal(false)} />
				</Tooltip>
			}
			footer={
				<>
					<Button
						type="primary"
						onClick={() => setPreviewModal(false)}
						className="primary-btn cancel-btn">
						Close
					</Button>
					<Button
						type="primary"
						className="primary-btn"
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

	if (props.match.params.type === "Crypto") {
		return (
			<>
				{errorMsg && (
					<Alert
						closable
						type="error"
						description={errorMsg}
						onClose={() => setErrorMsg(null)}
						showIcon
					/>
				)}
				{isLoading && <Loader />}
				<Form
					form={form}
					initialValues={cryptoAddress}
					onFinish={saveAddressBook}
					autoComplete="off">
					<Row gutter={[16, 16]}>
						<Col xs={24} sm={24} md={12} xl={6} xxl={6}>
							<Form.Item
								label="Address Label"
								name="label"
								className="input-label mb-0"
								rules={[
									{
										whitespace: true,
										message: "Is required",
									},
									{
										validator: validateContentRule,
									},
								]}>
								<Input
									className="cust-input"
									maxLength={20}
									placeholder="Address Label"
									disabled={true}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={12} xl={6} xxl={6}>
							<Form.Item
								label="Wallet Address"
								name="walletAddress"
								className="input-label mb-0">
								<Input
									className="cust-input"
									maxLength={100}
									placeholder="Wallet Address"
									disabled={true}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={12} xl={6} xxl={6}>
							<Form.Item
								label="Address Type"
								name="addressType"
								className="input-label mb-0">
								<Select
									className="cust-input"
									maxLength={100}
									placeholder="Select Address Type"
									dropdownClassName="select-drpdwn"
									showArrow={true}
									disabled={true}>
									<Option value="first_Party">1st Party</Option>
									<Option value="third_Party">3rd Party</Option>
									
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={12} xl={6} xxl={6}>
							<Form.Item
								label="Coin"
								name="walletCode"
								className="input-label mb-0">
								<Select
									className="cust-input"
									maxLength={100}
									placeholder="Select Coin"
									dropdownClassName="select-drpdwn"
									showArrow={true}
									disabled={true}>
									{options}
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={12} xl={6} xxl={6}>
							<Form.Item
								label="Address State"
								name="addressState"
								className="input-label mb-0"
								rules={[{ required: true, message: "Is required" }]}>
								<Select
									className="cust-input"
									maxLength={100}
									placeholder="Select Address State"
									dropdownClassName="select-drpdwn"
									showArrow={true}
									onChange={(e) => handleChangeCrypto(e)}
									disabled={isEdit === true}>
									<Option value="Approve">Approve</Option>
									<Option value="Rejected">
										{isAddress === "Rejected" ? "Rejected" : "Reject"}
									</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row>
					{files.length !== 0 &&
						files.map((file) => (
							<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
							<div className="docfile mr-0 mt-24 d-flex align-center" key={file.id}>
								<span
									className={`icon xl ${(file.name?.slice(-3) === "zip" && "file") ||
										(file.name?.slice(-3) !== "zip" && "") ||
										((file.name?.slice(-3) === "pdf" ||
											file.name?.slice(-3) === "PDF") &&
											"file") ||
										(file.name?.slice(-3) !== "pdf" &&
											file.name?.slice(-3) !== "PDF" &&
											"image")
										} mr-16`}
								/>
								<div
									className="docdetails c-pointer"
									onClick={() => docPreview(file)}>
									{file.name !== null ? (
										<EllipsisMiddle suffixCount={6}>{file.name}</EllipsisMiddle>
									) : (
										<EllipsisMiddle suffixCount={6}>Name</EllipsisMiddle>
									)}
									<span className="fs-12 text-secondary">
										{bytesToSize(file.size)}
									</span>
								</div>
							</div>
							</Col>
						))}
						</Row>
					<div className="text-right mt-36">
						{(isEdit !== true
						) && (
							<Button type="primary" className="primary-btn" htmlType="submit" disabled={cryptoAddress.addressState === "Submitted"} loading={isBtnLoading}>
								Save
								</Button>)}
						<Button
							type="primary"
							className="primary-btn cancel-btn"
							style={{ margin: "0 8px" }}
							onClick={backToAddressBook}>
							Cancel
						</Button>
					</div>
				</Form>
				{filePreviewModal}
			</>
		);
	} else {
		return (
			<>
				{errorMsg && (
					<Alert
						closable
						type="error"
						description={errorMsg}
						onClose={() => setErrorMsg(null)}
						showIcon
					/>
				)}
				{isLoading && <Loader />}
				<Form
					form={form}
					onFinish={saveAddressBook}
					autoComplete="off">
					<Text className="fs-6 fw-600 text-white-30">
						BENEFICIARY BANK DETAILS
					</Text>
					<Row gutter={[16, 16]} className="mb-36">
						<Col xs={24} sm={24} md={12} xl={6} xxl={6}>
							<Form.Item
								label="Whitelist Name"
								name="whiteListName"
								className="input-label mb-0"
								rules={[
									{
										whitespace: true,
										message: "Is required",
									},
									{
										validator: validateContentRule,
									},
								]}>
								<Input
									className="cust-input"
									maxLength="20"
									placeholder="Address Label"
									disabled={true}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={12} xl={6} xxl={6}>
							<Form.Item
								label="Address Type"
								name="addressType"
								className="input-label mb-0">
								<Select
									className="cust-input"
									maxLength={100}
									disabled={true}
									placeholder="Select Address Type"
									dropdownClassName="select-drpdwn"
									showArrow={true}>
									<Option value="ownbusiness">Own Business</Option>
									<Option value="individuals">Individuals</Option>
									<Option value="otherbusiness">Other Business</Option>
									<Option value="myself">My Self</Option>
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={12} xl={6} xxl={6}>
							<Form.Item
								label="Currency"
								name="walletCode"
								className="input-label mb-0">
								<Select
									disabled={true}
									className="cust-input"
									maxLength={100}
									placeholder="Select Currency"
									dropdownClassName="select-drpdwn"
									showArrow={true}>
									{currency?.map((item, idx) => (
										<Option key={idx} value={item.name}>
											{item.name}
										</Option>
									))}
								</Select>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={12} xl={6} xxl={6}>
							<Form.Item
								label={
									bankType === "EUR"
										? "IBAN"
									: "Bank Account Number"
								}
								name="accountNumber"
								className="input-label mb-0"
								rules={[
									{
										pattern: /^[A-Za-z0-9]+$/,
										message: "Invalid account number",
									},
								]}>
								<Input
									className="cust-input"
									maxLength={100}
									placeholder={
										bankType === "EUR" ? "IBAN" : "Bank Account Number"
									}
									disabled={true}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={12} xl={6} xxl={6}>
							<Form.Item
								label={fiatAddress.walletCode==="EUR"?"BIC":"BIC/SWIFT/Routing Number"}
								name="swiftRouteBICNumber"
								className="input-label mb-0"
								rules={[
									{
										pattern: /^[A-Za-z0-9]+$/,
										message: "Invalid BIC/SWIFT/Routing number",
									},
								]}>
								<Input
									className="cust-input"
									maxLength={100}
									placeholder={fiatAddress.walletCode==="EUR"?"BIC":"BIC/SWIFT/Routing Number"}
									disabled={true}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={12} xl={6} xxl={6}>
							<Form.Item
								label="Bank Name"
								name="bankName"
								className="input-label mb-0"
								rules={[
									{
										whitespace: true,
										message: "Is required",
									},
									{
										validator: validateContentRule,
									},
								]}>
								<Input
									className="cust-input"
									maxLength={100}
									placeholder="Bank Name"
									disabled={true}
								/>
							</Form.Item>
						</Col>
						{fiatAddress.walletCode==="EUR"&&<>
						<Col xs={24} sm={24} md={12} xl={6} xxl={6}>
							<Form.Item
								label="Branch"
								name="bankBranch"
								className="input-label mb-0"
								rules={[
									{
										whitespace: true,
										message: "Is required",
									},
									{
										validator: validateContentRule,
									},
								]}>
								<Input
									className="cust-input"
									maxLength={100}
									placeholder="Bank Name"
									disabled={true}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={12} xl={6} xxl={6}>
							<Form.Item
								label="Country"
								name="country"
								className="input-label mb-0"
								rules={[
									{
										whitespace: true,
										message: "Is required",
									},
									{
										validator: validateContentRule,
									},
								]}>
								<Input
									className="cust-input"
									maxLength={100}
									placeholder="Bank Name"
									disabled={true}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={12} xl={6} xxl={6}>
							<Form.Item
								label="State"
								name="state"
								className="input-label mb-0"
								rules={[
									{
										whitespace: true,
										message: "Is required",
									},
									{
										validator: validateContentRule,
									},
								]}>
								<Input
									className="cust-input"
									maxLength={100}
									placeholder="Bank Name"
									disabled={true}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={12} xl={6} xxl={6}>
							<Form.Item
								label="City"
								name="city"
								className="input-label mb-0"
								rules={[
									{
										whitespace: true,
										message: "Is required",
									},
									{
										validator: validateContentRule,
									},
								]}>
								<Input
									className="cust-input"
									maxLength={100}
									placeholder="Bank Name"
									disabled={true}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={12} xl={6} xxl={6}>
							<Form.Item
								label="Postal Code"
								name="postCode"
								className="input-label mb-0"
								rules={[
									{
										whitespace: true,
										message: "Is required",
									},
									{
										validator: validateContentRule,
									},
								]}>
								<Input
									className="cust-input"
									maxLength={100}
									placeholder="Bank Name"
									disabled={true}
								/>
							</Form.Item>
						</Col></>}
						{fiatAddress.walletCode ==="USD" && <Col xs={24} sm={24} md={12} xl={12} xxl={12}>
							<Form.Item
								label="Bank Address "
								name="bankaddress"
								className="input-label mb-0"
								rules={[
									{
										validator: validateContentRule,
									},
								]}>
								<Input
									className="cust-input"
									maxLength={100}
									placeholder="Bank address "
									disabled={true}
								/>
							</Form.Item>
						</Col>}
					</Row>
					<Text className="fs-6 fw-600 text-white-30">BENEFICIARY DETAILS</Text>
					<Row gutter={[16, 16]}>
						<Col xs={24} sm={24} md={12} xl={6} xxl={6}>
							<Form.Item
								label={
									(fiatAddress.accountType === "Business"&& "Business Name") ||
									(fiatAddress.accountType !== "Business" &&
										"Recipient Full Name")
								}
								name="name"
								className="input-label mb-0">
								<Input
									className="cust-input"
									maxLength={100}
									placeholder={
										(fiatAddress.accountType === "Business" &&
											"Business Name") ||
										(fiatAddress.accountType !== "Business" &&
											"Recipient Full Name")
									}
									disabled={true}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={24} xl={12} xxl={12}>
							<Form.Item
								label="Recipient Address "
								name="recipientAddress"
								className="input-label mb-0"
								rules={[
									{
										validator: validateContentRule,
									},
								]}>
								<Input
									className="cust-input"
									maxLength={100}
									placeholder="Recipient address "
									disabled={true}
								/>
							</Form.Item>
						</Col>
						<Col xs={24} sm={24} md={12} xl={6} xxl={6}>
							<Form.Item
								label="Address State"
								name="addressState"
								className="input-label mb-0"
								rules={[{ required: true, message: "Is required" }]}>
								<Select
									className="cust-input"
									maxLength={100}
									placeholder="Select Address State"
									dropdownClassName="select-drpdwn"
									showArrow={true}
									onChange={(e) => handleStateChange(e)}
									disabled={isEdit === true}>
									<Option value="Approve">Approve</Option>
									<Option value="Rejected">
										{isAddress === "Rejected" ? "Rejected" : "Reject"}
									</Option>
								</Select>
							</Form.Item>
						</Col>
					</Row>
					<Row>
					{files.length !== 0 &&
						files.map((file) => (
							<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
							<div className="docfile mr-0 mt-24 d-flex align-center" key={file.id}>
								<span
									className={`icon xl ${(file.name?.slice(-3) === "zip" && "file") ||
										(file.name?.slice(-3) !== "zip" && "") ||
										((file.name?.slice(-3) === "pdf" ||
											file.name?.slice(-3) === "PDF") &&
											"file") ||
										(file.name?.slice(-3) !== "pdf" &&
											file.name?.slice(-3) !== "PDF" &&
											"image")
										} mr-16`}
								/>
								<div
									className="docdetails c-pointer"
									onClick={() => docPreview(file)}>
									{file.name !== null ? (
										<EllipsisMiddle suffixCount={6}>{file.name}</EllipsisMiddle>
									) : (
										<EllipsisMiddle suffixCount={6}>Name</EllipsisMiddle>
									)}
									<span className="fs-12 text-secondary">
										{bytesToSize(file.size)}
									</span>
								</div>
							</div>
							</Col>
						))}
						</Row>
					<div className="text-right mt-36">
						{(isEdit !== true) && (
							<Button
								type="primary"
								className="primary-btn"
								htmlType="submit"
								disabled={fiatAddress.addressState === "Submitted"}
								loading={isBtnLoading}
								>
								Save
							</Button>
						)}
						<Button
							type="primary"
							className="primary-btn cancel-btn"
							style={{ margin: "0 8px" }}
							onClick={backToAddressBook}>
							Cancel
						</Button>
					</div>
				</Form>
				{filePreviewModal}
			</>
		);
	}
}
const connectStateToProps = ({ userConfig }) => {
	return {
		userConfig: userConfig.userProfileInfo,
		trackAuditLogData: userConfig.trackAuditLogData,
	};
};
const connectDispatchToProps = (dispatch) => {
	return {
		fetchCurrencyData: () => {
			dispatch(handleCurrency());
		},
	};
};
export default connect(
	connectStateToProps,
	connectDispatchToProps
)(AddressBookDetails);
