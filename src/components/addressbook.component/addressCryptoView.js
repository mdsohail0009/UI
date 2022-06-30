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
const AddressCryptoView = (props) => {
	const [loading, setIsLoading] = useState(false);
	const [cryptoAddress, setCryptoAddress] = useState({});
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
			setCryptoAddress(response.data);
			setBankDetailes(response.data.payeeAccountModels)
		}
		setIsLoading(false)
	};
	const backToAddressBook = () => {
		props?.history?.push("/userprofile/?key=5");
	};


	const iban=cryptoAddress?.bankType === "iban"? "IBAN": "Bank Account"
	const iban1=cryptoAddress?.bankType === "iban"? "IBAN": "Bank Account Number"


	return (
		<>
			<div className="main-container">
				<div className="box basic-info">
					{loading ? (
						<Loader />
					) : (
						<>
							<Title className="page-title text-white">
								BENEFICIARY BANK DETAILS 
							</Title>
							{cryptoAddress && (
								<Row gutter={8}>
									<Col xl={24} xxl={24} className="bank-view">
										<Row className="kpi-List">
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Favorite Name</label>
													<div className=" kpi-val">
														{cryptoAddress?.favouriteName}
													</div>
												</div>
											</Col>

											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Name</label>
													<div className=" kpi-val">
														{cryptoAddress?.fullName}
													</div>
												</div>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Email</label>
													<div className="kpi-val">
														<div className=" kpi-val">
															{cryptoAddress?.email}
														</div>
													</div>
												</div>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Phone Number</label>
													{ <div className=" kpi-val">{cryptoAddress?.phoneNumber}
											
													
													</div> }
												</div>
											</Col>
										
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">
													Address Line1
													</label>
													{ <div className=" kpi-val">
														{cryptoAddress?.line1}
													</div> }
												</div>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Address Line2</label>
													{ <div className="kpi-val">{cryptoAddress?.line2}</div> }
												</div>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">City</label>
													<div className="kpi-val">
														{cryptoAddress?.city}
													</div>
												</div>
											</Col>
										{/* </Row>
										
										<Row className="kpi-List"> */}
										
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">State</label>
													<div className=" kpi-val">{cryptoAddress?.state}
														
													</div>
												</div>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Country</label>
													<div className="kpi-val">
														{cryptoAddress?.country}
													</div>
												</div>
											</Col>
											
												<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
													<div>
														<label className="kpi-label">Post code</label>
														<div className="kpi-val">
															{cryptoAddress?.postalCode}
														</div>
													</div>
												</Col>
											{/* )} */}
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
																	Address Lable
																</Text>
																<Title level={5} className="m-0 mb-8 l-height-normal" style={{color:"white"}}>
																	{item.lable}
																</Title>
															</Col>
															<Col xs={24} md={24} lg={14} xl={8} xxl={3}>
																<Text className="fw-300 text-white-50 fs-12">
																	Wallet Code
																</Text>
																<Title level={5} className="m-0 mb-8 l-height-normal" style={{color:"white"}}>
																	{item.walletCode}
																</Title>
															</Col>
															<Col xs={24} md={24} lg={14} xl={8} xxl={3}>
																<Text className="fw-300 text-white-50 fs-12">
																	Wallet Address 
																</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal" style={{color:"white"}}>
																{item.walletAddress}
															</Title>
														</Col>
														
														
														
													</Row>
												</div>
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

export default connect(connectStateToProps)(AddressCryptoView);

