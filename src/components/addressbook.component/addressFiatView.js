import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Button, Modal, Tooltip } from "antd";
import Loader from "../../Shared/loader";
import { getAddress, getFileURL,getFavData ,getViewData,} from "./api";
import { connect } from "react-redux";
import FilePreviewer from "react-file-previewer";
import { bytesToSize } from "../../utils/service";

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
	const[bankDetailes,setBankDetailes]=useState([]);
	

	useEffect(() => {
		loadDataAddress();
	}, []);// eslint-disable-line react-hooks/exhaustive-deps
	const loadDataAddress = async () => {
		debugger
		setIsLoading(true)
		let response = await getViewData(props?.match?.params?.id,  props?.userConfig?.id);
		if (response.ok) {
			setFiatAddress(response.data);
			setBankDetailes(response.data.payeeAccountModels)
		}
		setIsLoading(false)
	};
	const backToAddressBook = () => {
		props?.history?.push("/userprofile/?key=5");
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

	const iban=fiatAddress?.bankType === "iban"? "IBAN": "Bank Account"
	const iban1=fiatAddress?.bankType === "iban"? "IBAN": "Bank Account Number"

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
								BENEFICIARY BANK DETAILS VIEW
							</Title>
							{fiatAddress && (
								<Row gutter={8}>
									<Col xl={24} xxl={24} className="bank-view">
										<Row className="kpi-List">
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Favorite Name</label>
													<div className=" kpi-val">
														{fiatAddress?.favouriteName}
													</div>
												</div>
											</Col>

											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Name</label>
													<div className=" kpi-val">
														{fiatAddress?.fullName}
													</div>
												</div>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Email</label>
													<div className="kpi-val">
														<div className=" kpi-val">
															{fiatAddress?.email}
														</div>
													</div>
												</div>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Phone Number</label>
													{ <div className=" kpi-val">{fiatAddress?.phoneNumber}
											
													
													</div> }
												</div>
											</Col>
											
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">
													Address Line1
													</label>
													{ <div className=" kpi-val">
														{fiatAddress?.line1}
													</div> }
												</div>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Address Line2</label>
													{ <div className="kpi-val">{fiatAddress?.line2}</div> }
												</div>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">City</label>
													<div className="kpi-val">
														{fiatAddress?.city}
													</div>
												</div>
											</Col>
										</Row>
										
										<Row className="kpi-List">
										
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">State</label>
													<div className=" kpi-val">{fiatAddress?.state}
														
													</div>
												</div>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Country</label>
													<div className="kpi-val">
														{fiatAddress?.country}
													</div>
												</div>
											</Col>
											
												<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
													<div>
														<label className="kpi-label">Post code</label>
														<div className="kpi-val">
															{fiatAddress?.postalCode}
														</div>
													</div>
												</Col>
										</Row>
										<Row>
												{bankDetailes?.map((item, idx) => (
													<div
														style={{
															border: "2px dashed var(--borderGrey)",
															padding: "12px 16px",
															borderRadius: 10,
															marginBottom: 16,
															width: "100%"
														}}>
														<Row gutter={[16, 16]} key={idx}>
															<Col xs={24} md={24} lg={14} xl={8} xxl={3}>
																<Text className="fw-300 text-white-50 fs-12">
																	Bank Name
																</Text>
																<Title level={5} className="m-0 mb-8 l-height-normal" style={{color:"white"}}>
																	{item.bankName}
																</Title>
															</Col>
															<Col xs={24} md={24} lg={14} xl={8} xxl={3}>
																<Text className="fw-300 text-white-50 fs-12">
																	Swift Code:
																</Text>
																<Title level={5} className="m-0 mb-8 l-height-normal" style={{color:"white"}}>
																	{item.swiftCode}
																</Title>
															</Col>
															<Col xs={24} md={24} lg={14} xl={8} xxl={3}>
																<Text className="fw-300 text-white-50 fs-12">
																	Swift Route BIC Number
																</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal" style={{color:"white"}}>
																{item.swiftRouteBICNumber}
															</Title>
														</Col>
														<Col xs={24} md={24} lg={14} xl={8} xxl={3}>
															<Text className="fw-300 text-white-50 fs-12">
																State
															</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal" style={{color:"white"}}>
																{item.state}
															</Title>
														</Col>
														<Col xs={24} md={24} lg={14} xl={8} xxl={3}>
															<Text className="fw-300 text-white-50 fs-12">
																Country
															</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal" style={{color:"white"}}>
																{item.country}
															</Title>
														</Col>
														<Col xs={24} md={24} lg={14} xl={8} xxl={3}>
															<Text className="fw-300 text-white-50 fs-12">
																Postal Code
															</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal" style={{color:"white"}}>
																{item.postalCode}
															</Title>
														</Col>
													</Row>
												</div>
											))}
											{fiatAddress?.documents?.details.map((file) => (
												<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
													<div
														className="docfile mr-0 d-flex ml-8"
														key={file.id}>
														<span
															className={`icon xl ${
																(file.documentName?.slice(-3) === "zip" &&
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

export default connect(connectStateToProps)(AddressFiatView);
