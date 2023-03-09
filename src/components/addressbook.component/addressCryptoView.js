import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Button, Modal, Tooltip } from "antd";
import Loader from "../../Shared/loader";
import {  getCryptoData } from "./api";
import { connect } from "react-redux";
import { bytesToSize } from "../../utils/service";
import { addressTabUpdate} from "../../reducers/addressBookReducer";
import DocumentPreview from '../../Shared/docPreview'


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
	const [docPreviewDetails, setDocPreviewDetails] = useState(null)
	const [docPreviewModal, setDocPreviewModal] = useState(false)

	useEffect(() => {
		loadDataAddress();
	}, []);// eslint-disable-line react-hooks/exhaustive-deps
	const loadDataAddress = async () => {
		setIsLoading(true)
		let response = await getCryptoData(props?.match?.params?.id);
		if (response.ok) {
			setCryptoAddress(response.data);
		}
		setIsLoading(false)
	};
	const backToAddressBook = () => {
		props?.history?.push("/addressbook");
		props?.dispatch(addressTabUpdate(false));
	};
	

	const docPreviewOpen = (data) => {
		setDocPreviewModal(true)
		setDocPreviewDetails({ id: data.id, fileName: data.fileName })
	  }

	const docPreviewClose = () => {
		setDocPreviewModal(false)
		setDocPreviewDetails(null)
	  }
	
	

	return (
		<>
			<div className="main-container cust-cypto-view">
			
				<div className="">
				
					{loading ? (
						<Loader />
					) : (
						<>
							
							{cryptoAddress && (
								<div className="custom-alert-width">
									<Title className="basicinfo">
										Beneficiary Details
									</Title>
								<Row gutter={8}>
									<Col xl={24} xxl={24} className="bank-view">
										<Row className="kpi-List">
										<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div className="kpi-divstyle ad-rec-detyails">
													<label className="kpi-label">Whitelist Name</label>
													<div className=" kpi-val adview-name">
														{cryptoAddress?.saveWhiteListName === " " ||
															cryptoAddress?.saveWhiteListName === null
															? "-"
															: cryptoAddress?.saveWhiteListName}
													</div>
												</div>
											</Col>
											{/* <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div className="kpi-divstyle ad-rec-detyails">
													<label className="kpi-label">Token</label>
													<div className=" kpi-val adview-name">
														{cryptoAddress?.token === " " ||
															cryptoAddress?.token === null
															? "-"
															: cryptoAddress?.token}
													</div>
												</div>
											</Col> */}
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div className="kpi-divstyle ad-rec-detyails">
													<label className="kpi-label">Network</label>
													<div className=" kpi-val adview-name">
														{cryptoAddress?.network === " " ||
															cryptoAddress?.network === null
															? "-"
															: cryptoAddress?.network}
													</div>
												</div>
											</Col>
											
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div className="kpi-divstyle ad-rec-detyails">
													<label className="kpi-label">Wallet Address</label>
													<div className=" kpi-val adview-name">
														{cryptoAddress?.walletAddress === " " ||
															cryptoAddress?.walletAddress === null
															? "-"
															: cryptoAddress?.walletAddress}
													</div>
												</div>
											</Col>
											{process.env.REACT_APP_ISTR == "true" &&<><Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div className="kpi-divstyle ad-rec-detyails">
													<label className="kpi-label">Wallet Source</label>
													<div className=" kpi-val adview-name">
													{cryptoAddress?.walletSource==="Others"? `${cryptoAddress?.walletSource } (${cryptoAddress?.otherWallet})` :cryptoAddress?.walletSource|| "-"}
													</div>
												</div>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div className="kpi-divstyle ad-rec-detyails">
													<label className="kpi-label">Proof Of Ownership</label>
													<div className=" kpi-val adview-name">
													{cryptoAddress?.isDocumentUpload===true?"Yes": "No" || "-"}
													</div>
												</div>
											</Col></>}
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div className="kpi-divstyle ad-rec-detyails">
													<label className="kpi-label">Whitelisting Status</label>
													<div className=" kpi-val adview-name">
														{cryptoAddress?.adressstate === " " ||
															cryptoAddress?.adressstate === null
															? "-"
															: cryptoAddress?.adressstate}
													</div>
												</div>
											</Col>

										</Row>
										{process.env.REACT_APP_ISTR == "true" &&<Row>
										{cryptoAddress?.docRepositories?.map((file) => (
													<Col xs={12} sm={12} md={12} lg={8} xxl={8}>
														<div
															className="docfile mr-0 d-flex ml-8"
															key={file.id}>
															<span
																className={`icon xl ${(file.fileName?.slice(-3) === "zip" &&
																		"file") ||
																	(file.fileName?.slice(-3) !== "zip" &&
																		"") ||
																		((file.fileName?.slice(-3) === "mp4"||																file.fileName?.slice(-3) === "wmv"||file.fileName?.slice(-3) === "avi"||file.fileName?.slice(-3) === "mov") &&
																		"video")||
																	((file.fileName?.slice(-3) === "pdf" ||
																		file.fileName?.slice(-3) === "PDF") &&
																		"file") ||
																	(file.fileName?.slice(-3) !== "pdf" &&
																		file.fileName?.slice(-3) !== "PDF" &&
																		"image")
																	} mr-16`}
															/>
															<div
																className="docdetails c-pointer"
																onClick={() => docPreviewOpen(file)}
																>
																{file.name !== null ? (
																	<EllipsisMiddle suffixCount={4}>
																		{file.fileName}
																	</EllipsisMiddle>
																) : (
																	<EllipsisMiddle suffixCount={4}>
																		Name
																	</EllipsisMiddle>
																)}
																<span className="fs-12 text-secondary">
																	{bytesToSize(file.fileSize)}
																</span>
															</div>
														</div>
													</Col>
												))}
							</Row>}
									</Col>
								</Row>
								<div className="text-right view-level-btn">
								<Button
									className="cust-cancel-btn"
									block
									onClick={backToAddressBook}>
									Cancel
								</Button>
							</div>
								</div>
							)}
							
						</>
					)}
				</div>
			</div>
			{docPreviewModal &&
      <DocumentPreview
        previewModal={docPreviewModal}
        handleCancle={docPreviewClose}
        upLoadResponse={docPreviewDetails}
      />}
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

