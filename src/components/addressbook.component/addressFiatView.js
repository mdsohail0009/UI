import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Button, Modal, Tooltip } from "antd";
import Loader from "../../Shared/loader";
import { getAddress, getFileURL, getFavData, getViewData, } from "./api";
import { connect } from "react-redux";
import FilePreviewer from "react-file-previewer";
import { bytesToSize } from "../../utils/service";
import { addressTabUpdate, setAddressStep, selectedTab } from "../../reducers/addressBookReducer";
const { Title, Text } = Typography;
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
const AddressFiatView = (props) => {
	const [loading, setIsLoading] = useState(false);
	const [fiatAddress, setFiatAddress] = useState({});
	const [previewPath, setPreviewPath] = useState(null);
	const [previewModal, setPreviewModal] = useState(false);
	const [bankDetailes, setBankDetailes] = useState([]);


	useEffect(() => {
		loadDataAddress();
	}, []);// eslint-disable-line react-hooks/exhaustive-deps
	const loadDataAddress = async () => {
		setIsLoading(true)
		let response = await getViewData(props?.match?.params?.id, props?.userConfig?.id, props?.match?.params?.type);
		if (response.ok) {
			setFiatAddress(response.data);
			setBankDetailes(response.data.payeeAccountModels)
		}
		setIsLoading(false)
	};
	const backToAddressBook = () => {
		props?.history?.push("/addressbook?key=2");
		props?.dispatch(addressTabUpdate(true));

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

	const iban = fiatAddress?.bankType === "iban" ? "IBAN" : "Bank Account"
	const iban1 = fiatAddress?.bankType === "iban" ? "IBAN" : "Bank Account Number"

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
	return (
		<>
			<div className="main-container">
				<div className="box basic-info">
					{loading ? (
						<Loader />
					) : (
						<>
							<Title className="page-title text-white">
								BENEFICIARY DETAILS
							</Title>
							{fiatAddress && (
								<Row gutter={8}>
									<Col xl={24} xxl={24} className="bank-view">
										<Row className="kpi-List">
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Favorite Name</label>
													<div className=" kpi-val">
														{fiatAddress?.favouriteName === " " ||
															fiatAddress?.favouriteName === null
															? "-"
															: fiatAddress?.favouriteName}
													</div>
												</div>
											</Col>
											{fiatAddress?.addressType && <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Address Type</label>
													{<div className=" kpi-val">
														{fiatAddress?.addressType === " " ||
															fiatAddress?.addressType === null
															? "-"
															: fiatAddress?.addressType}

													</div>}
												</div>
											</Col>}
											{fiatAddress?.transferType && <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Transfor Type</label>
													{<div className=" kpi-val">
														{fiatAddress?.transferType === " " ||
															fiatAddress?.transferType === null
															? "-"
															: fiatAddress?.transferType}

													</div>}
												</div>
											</Col>}

											{fiatAddress?.firstName &&<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">First Name</label>
													<div className=" kpi-val">
														{fiatAddress?.firstName === " " ||
															fiatAddress?.firstName === null
															? "-"
															: fiatAddress?.firstName}
													</div>
												</div>
											</Col>}
											{fiatAddress?.lastName &&<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Last Name</label>
													<div className=" kpi-val">
														{fiatAddress?.lastName === " " ||
															fiatAddress?.lastName === null
															? "-"
															: fiatAddress?.lastName}
													</div>
												</div>
											</Col>}
											{fiatAddress?.beneficiaryName &&<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Beneficiary Name</label>
													<div className=" kpi-val">
														{fiatAddress?.beneficiaryName === " " ||
															fiatAddress?.beneficiaryName === null
															? "-"
															: fiatAddress?.beneficiaryName}
													</div>
												</div>
											</Col>}
											{fiatAddress?.relation &&<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Relation</label>
													<div className=" kpi-val">
														{fiatAddress?.relation === " " ||
															fiatAddress?.relation === null
															? "-"
															: fiatAddress?.relation}
													</div>
												</div>
											</Col>}
											{fiatAddress?.email && <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Email</label>
													<div className="kpi-val">
														<div className=" kpi-val">
															{fiatAddress?.email === " " ||
																fiatAddress?.email === null
																? "-"
																: fiatAddress?.email}
														</div>
													</div>
												</div>
											</Col>}
											{fiatAddress?.phoneNumber && <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Phone Number</label>
													{<div className=" kpi-val">
														{fiatAddress?.phoneNumber === " " ||
															fiatAddress?.phoneNumber === null
															? "-"
															: fiatAddress?.phoneNumber}

													</div>}
												</div>
											</Col>}

											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">
														Address Line 1
													</label>
													{<div className=" kpi-val">
														{fiatAddress?.line1 === " " ||
															fiatAddress?.line1 === null
															? "-"
															: fiatAddress?.line1}
													</div>}
												</div>
											</Col>
											{fiatAddress?.line2 &&<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Address Line 2</label>
													{<div className="kpi-val">
														{fiatAddress?.line2 === " " ||
															fiatAddress?.line2 === null
															? "-"
															: fiatAddress?.line2}</div>}
												</div>
											</Col>}
											{fiatAddress?.line3 &&<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Address Line 3</label>
													{<div className="kpi-val">
														{fiatAddress?.line3 === " " ||
															fiatAddress?.line3 === null
															? "-"
															: fiatAddress?.line3}</div>}
												</div>
											</Col>}




											{fiatAddress?.country && <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Country</label>
													<div className="kpi-val">
														{fiatAddress?.country === " " ||
															fiatAddress?.country === null
															? "-"
															: fiatAddress?.country}
													</div>
												</div>
											</Col>}
											{fiatAddress?.state && <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">State</label>
													<div className=" kpi-val">
														{fiatAddress?.state === " " ||
															fiatAddress?.state === null
															? "-"
															: fiatAddress?.state}

													</div>
												</div>
											</Col>}
											{fiatAddress?.city && <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">City</label>
													<div className="kpi-val">

														{fiatAddress?.city === " " ||
															fiatAddress?.city === null
															? "-"
															: fiatAddress?.city}
													</div>
												</div>
											</Col>}
											{fiatAddress?.postalCode && <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Postal Code</label>
													<div className="kpi-val">
														{fiatAddress?.postalCode === " " ||
															fiatAddress?.postalCode === null
															? "-"
															: fiatAddress?.postalCode}
													</div>
												</div>
											</Col>}

											
										</Row>
										<Title className="page-title text-white">
											BENEFICIARY BANK DETAILS
										</Title>
										<Row>
											{bankDetailes?.map((item, idx) => (
												<><div
													style={{
														border: "2px dashed var(--borderGrey)",
														padding: "12px 16px",
														borderRadius: 10,
														marginBottom: 16,
														width: "100%"
													}}>
													<Row gutter={[16, 16]} key={idx}>
														
														<Col xs={24} md={24} lg={14} xl={8} xxl={4}>
															<Text className="fw-300 text-white-50 fs-12">
																Currency
															</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal text-white-50"   >

																{item.walletCode === " " ||
																	item.walletCode === null
																	? "-"
																	: item.walletCode}
															</Title>
														</Col>
														{item.iban &&<Col xs={24} md={24} lg={14} xl={8} xxl={4}>
															<Text className="fw-300 text-white-50 fs-12">
																IBAN
															</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal text-white-50"   >

																{item.iban === " " ||
																	item.iban === null
																	? "-"
																	: item.iban}
															</Title>
														</Col>}
														{item.bic &&<Col xs={24} md={24} lg={14} xl={8} xxl={4}>
															<Text className="fw-300 text-white-50 fs-12">
																BIC
															</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal text-white-50"   >

																{item.bic === " " ||
																	item.bic === null
																	? "-"
																	: item.bic}
															</Title>
														</Col>}
														{item?.bankType && <Col xs={24} md={24} lg={14} xl={8} xxl={4}>
															<Text className="fw-300 text-white-50 fs-12">
																Bank Type
															</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal text-white-50"   >

																{item.bankType === " " ||
																	item.bankType === null
																	? "-"
																	: item.bankType}
															</Title>
														</Col>}
														{item?.accountNumber && <Col xs={24} md={24} lg={14} xl={8} xxl={4}>
															<Text className="fw-300 text-white-50 fs-12">
																Bank Account Number / IBAN
															</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal text-white-50"   >

																{item.accountNumber === " " ||
																	item.accountNumber === null
																	? "-"
																	: item.accountNumber}
															</Title>
														</Col>}
														{item?.swiftRouteBICNumber && <Col xs={24} md={24} lg={14} xl={8} xxl={4}>
															<Text className="fw-300 text-white-50 fs-12">
																BIC/SWIFT/Routing Number
															</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal text-white-50"   >

																{item.swiftRouteBICNumber === " " ||
																	item.swiftRouteBICNumber === null
																	? "-"
																	: item.swiftRouteBICNumber}
															</Title>
														</Col>}
														{item?.abaRoutingCode && <Col xs={24} md={24} lg={14} xl={8} xxl={4}>
															<Text className="fw-300 text-white-50 fs-12">
																ABA Routing Number
															</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal text-white-50"   >

																{item.abaRoutingCode === " " ||
																	item.abaRoutingCode === null
																	? "-"
																	: item.abaRoutingCode}
															</Title>
														</Col>}
														{item?.bankName && <Col xs={24} md={24} lg={14} xl={8} xxl={4}>
															<Text className="fw-300 text-white-50 fs-12">
																Bank Name
															</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal text-white-50"   >

																{item.bankName === " " ||
																	item.bankName === null
																	? "-"
																	: item.bankName}
															</Title>
														</Col>}
														{item?.bankBranch && <Col xs={24} md={24} lg={14} xl={8} xxl={4}>
															<Text className="fw-300 text-white-50 fs-12">
																Bank branch
															</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal text-white-50"   >

																{item.bankBranch === " " ||
																	item.bankBranch === null
																	? "-"
																	: item.bankBranch}
															</Title>
														</Col>}
														{item?.country && <Col xs={24} md={24} lg={14} xl={8} xxl={4}>
															<Text className="fw-300 text-white-50 fs-12">
																Country
															</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal text-white-50"   >

																{item.country === " " ||
																	item.country === null
																	? "-"
																	: item.country}
															</Title>
														</Col>}
														{item?.state && <Col xs={24} md={24} lg={14} xl={8} xxl={4}>
															<Text className="fw-300 text-white-50 fs-12">
																State
															</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal text-white-50"   >

																{item.state === "" || item.state === " " ||
																	item.state === null
																	? "-"
																	: item.state}
															</Title>
														</Col>}
														{item?.city&&<Col xs={24} md={24} lg={14} xl={8} xxl={4}>
															<Text className="fw-300 text-white-50 fs-12">
																City
															</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal text-white-50"   >

																{item.city === " " ||
																	item.city === null
																	? "-"
																	: item.city}
															</Title>
														</Col>}
														{item?.postalCode &&<Col xs={24} md={24} lg={14} xl={8} xxl={4}>
															<Text className="fw-300 text-white-50 fs-12">
																Postal Code
															</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal text-white-50"   >

																{item.postalCode === "" || item.postalCode === " " ||
																	item.postalCode === null
																	? "-"
																	: item.postalCode}
															</Title>
														</Col>}
														{item.line1 && <Col xs={24} md={24} lg={14} xl={8} xxl={4}>
															<Text className="fw-300 text-white-50 fs-12">
																Address Line 1
															</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal text-white-50"   >
																{item.line1 === " " ||
																	item.line1 === null
																	? "-"
																	: item.line1}
															</Title>
														</Col>}
														{item.line2 && <Col xs={24} md={24} lg={14} xl={8} xxl={4}>
															<Text className="fw-300 text-white-50 fs-12">
																Address Line 2
															</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal text-white-50"   >
																{item.line2 === " " ||
																	item.line2 === null
																	? "-"
																	: item.line2}
															</Title>
														</Col>}

													</Row>
												</div>
												{item?.documents?.details.map((file) => (
													<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
														<div
															className="docfile mr-0 d-flex ml-8"
															key={file.id}>
															<span
																className={`icon xl ${(file.documentName?.slice(-3) === "zip" &&
																		"file") ||
																	(file.documentName?.slice(-3) !== "zip" &&
																		"") ||
																	((file.documentName?.slice(-3) === "pdf" ||
																		file.documentName?.slice(-3) === "PDF") &&
																		"file") ||
																	(file.documentName?.slice(-3) !== "pdf" &&
																		file.documentName?.slice(-3) !== "PDF" &&
																		"image")
																	} mr-16`}
															/>
															<div
																className="docdetails c-pointer"
																onClick={() => docPreview(file)}>
																{file.name !== null ? (
																	<EllipsisMiddle suffixCount={4}>
																		{file.documentName}
																	</EllipsisMiddle>
																) : (
																	<EllipsisMiddle suffixCount={4}>
																		Name
																	</EllipsisMiddle>
																)}
																<span className="fs-12 text-secondary">
																	{bytesToSize(file.remarks)}
																</span>
															</div>
														</div>
													</Col>
												))}
												</>
											))}
											
										</Row>
									</Col>
								</Row>
							)}
							<div className="text-right mt-24">
								<Button
									className="pop-btn px-36"
									style={{ margin: "0 8px" }}
									onClick={backToAddressBook}>
									Cancel
								</Button>
							</div>
						</>
					)}
				</div>
			</div>
			{filePreviewModal}
		</>
	);
};
const connectStateToProps = ({
	userConfig,
	addressBookReducer,
	sendReceive,
}) => {
	return {
		userConfig: userConfig.userProfileInfo,
		sendReceive,
		addressBookReducer,
	};
};
const connectDispatchToProps = (dispatch) => {
	return {
		changeStep: (stepcode) => {
			dispatch(setAddressStep(stepcode));
		},

		dispatch,
	};
}
export default connect(connectStateToProps, connectDispatchToProps)(AddressFiatView);
