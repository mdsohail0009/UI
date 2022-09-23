import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Button, Modal, Tooltip } from "antd";
import Loader from "../../Shared/loader";
import { getAddress, getFileURL, getFavData, getViewData, getCryptoData } from "./api";
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
const AddressCryptoView = (props) => {
	const [loading, setIsLoading] = useState(false);
	const [cryptoAddress, setCryptoAddress] = useState({});
	const [previewPath, setPreviewPath] = useState(null);
	const [previewModal, setPreviewModal] = useState(false);
	const [bankDetailes, setBankDetailes] = useState([]);


	useEffect(() => {
		loadDataAddress();
	}, []);// eslint-disable-line react-hooks/exhaustive-deps
	const loadDataAddress = async () => {
		setIsLoading(true)
		let response = await getCryptoData(props?.match?.params?.id, props?.userConfig?.id);
		if (response.ok) {
			setCryptoAddress(response.data);
			setBankDetailes(response.data.payeeAccountModels)
		}
		setIsLoading(false)
	};
	const backToAddressBook = () => {
		props?.history?.push("/addressbook");
		props?.dispatch(addressTabUpdate(false));
	};


	const iban = cryptoAddress?.bankType === "iban" ? "IBAN" : "Bank Account"
	const iban1 = cryptoAddress?.bankType === "iban" ? "IBAN" : "Bank Account Number"


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
													<label className="kpi-label">Whitelist Name</label>
													<div className=" kpi-val">
														{cryptoAddress?.saveWhiteListName === " " ||
															cryptoAddress?.saveWhiteListName === null
															? "-"
															: cryptoAddress?.saveWhiteListName}
													</div>
												</div>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div>
													<label className="kpi-label">Coin</label>
													<div className=" kpi-val">
														{cryptoAddress?.token === " " ||
															cryptoAddress?.token === null
															? "-"
															: cryptoAddress?.token}
													</div>
												</div>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
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
											
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
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
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
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
												{cryptoAddress?.documents?.details.map((file) =>
													<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
														<div className="docfile mr-0" key={file.id}>
															<span className={`icon xl file mr-16`} />
															<div
																className="docdetails c-pointer"
															// onClick={() => docPreview(file)}
															>
																{file.name !== null ? (
																	<EllipsisMiddle suffixCount={4}>
																		{file.documentName}
																	</EllipsisMiddle>
																) : (
																	<EllipsisMiddle suffixCount={4}>Name</EllipsisMiddle>
																)}
															</div>
														</div>
													</Col>
												)}
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

