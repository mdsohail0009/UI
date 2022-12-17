import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Button, Modal, Tooltip } from "antd";
import Loader from "../../Shared/loader";
import { getFileURL, getCryptoData } from "./api";
import { connect } from "react-redux";
import FilePreviewer from "react-file-previewer";
import { bytesToSize } from "../../utils/service";
import { addressTabUpdate} from "../../reducers/addressBookReducer";
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


	useEffect(() => {
		loadDataAddress();
	}, []);// eslint-disable-line react-hooks/exhaustive-deps
	const loadDataAddress = async () => {
		setIsLoading(true)
		let response = await getCryptoData(props?.match?.params?.id, props?.userConfig?.id);
		if (response.ok) {
			setCryptoAddress(response.data);
		}
		setIsLoading(false)
	};
	const backToAddressBook = () => {
		props?.history?.push("/addressbook");
		props?.dispatch(addressTabUpdate(false));
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

	return (
		<>
			<div className="main-container cust-cypto-view">
			<Title className="basicinfo mb-12">
				Beneficiary Details
			</Title>
				<div className="box basic-info ">
					{loading ? (
						<Loader />
					) : (
						<>
							
							{cryptoAddress && (
								<div className="custom-alert-width">
								<Row gutter={8}>
									<Col xl={24} xxl={24} className="bank-view">
										<Row className="kpi-List">
											<Col xs={24} sm={24} md={12} lg={14} xxl={14}>
												<div>
													<label className="kpi-label">Whitelist Name</label>
													<div className=" kpi-val">
														{cryptoAddress?.saveWhiteListName === " " ||
															cryptoAddress?.saveWhiteListName === null
															? "-"
															: cryptoAddress?.saveWhiteListName}
													</div>
												</div>
											</Col>
											<Col xs={24} sm={24} md={12} lg={5} xxl={5}>
												<div>
													<label className="kpi-label">Token</label>
													<div className=" kpi-val">
														{cryptoAddress?.token === " " ||
															cryptoAddress?.token === null
															? "-"
															: cryptoAddress?.token}
													</div>
												</div>
											</Col>
											<Col xs={24} sm={24} md={12} lg={5} xxl={5}>
												<div>
													<label className="kpi-label">Network</label>
													<div className=" kpi-val">
														{cryptoAddress?.network === " " ||
															cryptoAddress?.network === null
															? "-"
															: cryptoAddress?.network}
													</div>
												</div>
											</Col>
											
											<Col xs={24} sm={24} md={12} lg={14} xxl={14}>
												<div>
													<label className="kpi-label">Wallet Address</label>
													<div className=" kpi-val">
														{cryptoAddress?.walletAddress === " " ||
															cryptoAddress?.walletAddress === null
															? "-"
															: cryptoAddress?.walletAddress}
													</div>
												</div>
											</Col>
											<Col xs={24} sm={24} md={12} lg={5} xxl={5}>
												<div>
													<label className="kpi-label">Address State</label>
													<div className=" kpi-val">
														{cryptoAddress?.adressstate === " " ||
															cryptoAddress?.adressstate === null
															? "-"
															: cryptoAddress?.adressstate}
													</div>
												</div>
											</Col>
												
										</Row>
										{cryptoAddress?.documents?.details.map((file) => (
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
									</Col>
								</Row>
								</div>
							)}
							<div className="">
								<Button
									className="pop-btn "
									block
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

export default connect(connectStateToProps)(AddressCryptoView);

