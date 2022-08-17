import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Button, Modal, Tooltip } from "antd";
import Loader from "../../Shared/loader";
import { getAddress, getFileURL,getFavData ,getViewData,} from "./api";
import { connect } from "react-redux";
import FilePreviewer from "react-file-previewer";
import { bytesToSize } from "../../utils/service";
import { addressTabUpdate,setAddressStep,selectedTab} from "../../reducers/addressBookReducer";
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
		setIsLoading(true)
		let response = await getViewData(props?.match?.params?.id,  props?.userConfig?.id);
		if (response.ok) {
			setCryptoAddress(response.data);
			setBankDetailes(response.data.payeeAccountModels)
		}
		setIsLoading(false)
	};
	const backToAddressBook = () => {
		props?.history?.push("/userprofile/5");
		props?.dispatch(addressTabUpdate(false))
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
								BENEFICIARY DETAILS 
							</Title>
							{cryptoAddress && (
								<Row gutter={8}>
									<Col xl={24} xxl={24} className="bank-view">
										<Row className="kpi-List">
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Favorite Name</label>
													<div className=" kpi-val">
														{cryptoAddress?.favouriteName === " " ||
																		cryptoAddress?.favouriteName === null
																		? "-"
																		: cryptoAddress?.favouriteName}
													</div>
												</div>
											</Col>

											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Name</label>
													<div className=" kpi-val">
														{cryptoAddress?.fullName === " " ||
																		cryptoAddress?.fullName === null
																		? "-"
																		: cryptoAddress?.fullName}
													</div>
												</div>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Email</label>
													<div className="kpi-val">
														<div className=" kpi-val">
															{cryptoAddress?.email === " " ||
																		cryptoAddress?.email === null
																		? "-"
																		: cryptoAddress?.email}
														</div>
													</div>
												</div>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Phone Number</label>
													{ <div className=" kpi-val">
													{cryptoAddress?.phoneNumber === " " ||
																		cryptoAddress?.phoneNumber === null
																		? "-"
																		: cryptoAddress?.phoneNumber}
													
													</div> }
												</div>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Address Type</label>
													{ <div className=" kpi-val">
													{cryptoAddress?.addressType === " " ||
																		cryptoAddress?.addressType === null
																		? "-"
																		: cryptoAddress?.addressType}
													
													</div> }
												</div>
											</Col>

										</Row>
										<Title className="page-title text-white">
								CRYPTO ADDRESS DETAILS 
							</Title>
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
															<Col xs={24} md={24} lg={14} xl={4} xxl={4}>
																<Text className="fw-300 text-white-50 fs-12">
																	Address Label
																</Text>
																<Title level={5} className="m-0 mb-8 l-height-normal text-white-50 text-white-50"  >
																	{item.label === " " ||
																		item.label === null
																		? "-"
																		: item.label}
																</Title>
															</Col>
															<Col xs={24} md={24} lg={14} xl={3} xxl={3}>
																<Text className="fw-300 text-white-50 fs-12">
																	Coin
																</Text>
																<Title level={5} className="m-0 mb-8 l-height-normal text-white-50"  >
																	{item.walletCode === " " ||
																		item.walletCode === null
																		? "-"
																		: item.walletCode}
																</Title>
															</Col>
															<Col xs={24} md={24} lg={14} xl={10} xxl={14}>
																<Text className="fw-300 text-white-50 fs-12">
																	 Address 
																</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal text-white-50"  >
																{item.walletAddress === " " ||
																		item.walletAddress === null
																		? "-"
																		: item.walletAddress}
															</Title>
														</Col>
														<Col xs={24} md={24} lg={14} xl={4} xxl={3}>
																<Text className="fw-300 text-white-50 fs-12">
																	 Address State
																</Text>
															<Title level={5} className="m-0 mb-8 l-height-normal text-white-50"  >
																{item.addressState === " " ||
																		item.addressState === null
																		? "-"
																		: item.addressState}
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

