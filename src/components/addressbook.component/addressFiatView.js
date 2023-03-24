import React, { useEffect, useState } from "react";
import { Row, Col, Typography, Button,} from "antd";
import Loader from "../../Shared/loader";
import { getViewData, } from "./api";
import { connect } from "react-redux";
import { bytesToSize } from "../../utils/service";
import { addressTabUpdate, setAddressStep } from "../../reducers/addressBookReducer";
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
const AddressFiatView = (props) => {
	const [loading, setIsLoading] = useState(false);
	const [fiatAddress, setFiatAddress] = useState({});
	const [bankDetailes, setBankDetailes] = useState([]);
	const [docPreviewDetails, setDocPreviewDetails] = useState(null)
	const [docPreviewModal, setDocPreviewModal] = useState(false)

	useEffect(() => {
		loadDataAddress();
	}, []);// eslint-disable-line react-hooks/exhaustive-deps
	const loadDataAddress = async () => {
		setIsLoading(true)
		let response = await getViewData(props?.match?.params?.id, props?.match?.params?.type);
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
			
				<div className="box bg-box">
					{loading ? (
						<Loader />
					) : (
						<>
							
							{fiatAddress && (
								<div className="custom-alert-width">
									<Title className="basicinfo">
									Recipient Details
									</Title>
								<Row gutter={8}>
									<Col xl={24} xxl={24} className="bank-view addressbook-crypto-view">
										<Row className="kpi-List">
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div className="kpi-divstyle ad-rec-detyails">
													<label className="kpi-label">Whitelist Name</label>
													<div className=" kpi-val adview-name">
														{fiatAddress?.favouriteName === " " ||
															fiatAddress?.favouriteName === null
															? "-"
															: fiatAddress?.favouriteName}
													</div>
												</div>
											</Col>
											{fiatAddress?.addressType && <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div className="kpi-divstyle ad-rec-detyails">
													<label className="kpi-label">Address Type</label>
													{<div className=" kpi-val">
														{fiatAddress?.addressType === " " ||
															fiatAddress?.addressType === null
															? "-"
															:((fiatAddress?.addressType?.toLowerCase()==="myself")&&"My Self")||
															 ((fiatAddress?.addressType?.toLowerCase()==="individuals")&&"Individuals")||
															((fiatAddress?.addressType?.toLowerCase()==="ownbusiness")&&"My Company")||
															((fiatAddress?.addressType?.toLowerCase()==="otherbusiness")&&"Other Business")}

													</div>}
												</div>
											</Col>}
											{fiatAddress?.transferType && <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div className="kpi-divstyle ad-rec-detyails">
													<label className="kpi-label">Transfer Type</label>
													{<div className=" kpi-val">
														{fiatAddress?.transferType === " " ||
															fiatAddress?.transferType === null
															? "-"
															: ((fiatAddress?.transferType === "internationalIBAN") && `International ${bankDetailes[0].walletCode} IBAN`) ||
															fiatAddress?.transferType.toUpperCase()}

													</div>}
												</div>
											</Col>}

											{fiatAddress?.firstName &&<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div className="kpi-divstyle ad-rec-detyails">
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
												<div className="kpi-divstyle ad-rec-detyails">
													<label className="kpi-label">Last Name</label>
													<div className=" kpi-val">
														{fiatAddress?.lastName === " " ||
															fiatAddress?.lastName === null
															? "-"
															: fiatAddress?.lastName}
													</div>
												</div>
											</Col>}
											 {fiatAddress?.addressType != "individuals" && fiatAddress?.beneficiaryName &&<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div className="kpi-divstyle ad-rec-detyails">
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
												<div className="kpi-divstyle ad-rec-detyails">
													<label className="kpi-label">Relationship To Beneficiary</label>
													<div className=" kpi-val">
														{fiatAddress?.relation === " " ||
															fiatAddress?.relation === null
															? "-"
															: fiatAddress?.relation}
													</div>
												</div>
											</Col>}
											{fiatAddress?.phoneNumber && <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div className="kpi-divstyle ad-rec-detyails">
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
												<div className="kpi-divstyle ad-rec-detyails">
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
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div className="kpi-divstyle ad-rec-detyails">
													<label className="kpi-label">Address Line 2</label>
													{<div className="kpi-val">
														{fiatAddress?.line2 === " " ||
															fiatAddress?.line2 === null
															? "-"
															: fiatAddress?.line2}</div>}
												</div>
											</Col>
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div className="kpi-divstyle ad-rec-detyails">
													<label className="kpi-label">Address Line 3</label>
													{<div className="kpi-val">
														{fiatAddress?.line3 === " " ||
															fiatAddress?.line3 === null
															? "-"
															: fiatAddress?.line3}</div>}
												</div>
											</Col>

											{fiatAddress?.country && <Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div className="kpi-divstyle ad-rec-detyails">
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
												<div className="kpi-divstyle ad-rec-detyails">
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
												<div className="kpi-divstyle ad-rec-detyails">
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
												<div className="kpi-divstyle ad-rec-detyails">
													<label className="kpi-label">Postal Code</label>
													<div className="kpi-val">
														{fiatAddress?.postalCode === " " ||
															fiatAddress?.postalCode === null
															? "-"
															: fiatAddress?.postalCode}
													</div>
												</div>
											</Col>}											
											
											<Col xs={24} sm={24} md={12} lg={8} xxl={8}>
												<div className="kpi-divstyle ad-rec-detyails">
													<label className="kpi-label">Whitelisting Status</label>
													<div className="kpi-val">
														{bankDetailes[0]?.addressState}
													</div>
												</div>
											</Col>								
										</Row>
										<Title className="basicinfo  abbook-title-mt">
										   Recipient Bank Details
										</Title>
										<Row className="adressbook-fiatview">
											{bankDetailes?.map((item, idx) => (
												<><div className="alert-info-custom kpi-List adbook-newdesign"
													>
															<div className="fait-box kpi-divstyle">
															<Text className="kpi-label">
																Currency
															</Text>
															<div level={5} className="kpi-val"   >

																{item.walletCode === " " ||
																	item.walletCode === null
																	? "-"
																	: item.walletCode}
															</div>
															</div>
															{/* </div> */}
														{item.iban &&
														<div className="fait-box kpi-divstyle">
															<Text className="kpi-label">
																IBAN
															</Text>
															<div level={5} className="kpi-val"   >

																{item.iban === " " ||
																	item.iban === null
																	? "-"
																	: item.iban}
															</div>
															</div>
														}
														
														{item?.bankType && 
														<div className="fait-box kpi-divstyle">
															<Text className="kpi-label">
																Bank Type
															</Text>
															<div level={5} className="kpi-val"   >

																{item.bankType === " " ||
																	item.bankType === null
																	? "-"
																	: item.bankType}
															</div>
															</div>
														}
														{(item?.accountNumber && fiatAddress?.transferType !== "internationalIBAN" && item?.walletCode !="EUR")&&
														<div className="fait-box kpi-divstyle">
															<Text className="kpi-label">
																Bank Account Number / IBAN
															</Text>
															<div level={5} className="kpi-val"   >

																{item.accountNumber === " " ||
																	item.accountNumber === null
																	? "-"
																	: item.accountNumber}
															</div>
															</div>
														}														
														{((item?.swiftRouteBICNumber!=null|| item?.abaRoutingCode!=null ||bankDetailes[0]?.ukSortCode !=null) && (item?.iban ==null || item?.iban =="")) && 
														<div className="fait-box kpi-divstyle">
															<Text className="kpi-label">
															BIC/SWIFT/ABA Routing /Uk Sort Code
															</Text>
															<div level={5} className="kpi-val"   >
																   {((item?.swiftRouteBICNumber !=null && item?.swiftRouteBICNumber != "" ) ? item?.swiftRouteBICNumber : item?.abaRoutingCode || bankDetailes[0]?.ukSortCode)}
															</div>
															</div>
														}
														{item?.bankName && 
														<div className="fait-box kpi-divstyle">
															<Text className="kpi-label">
																Bank Name
															</Text>
															<div level={5} className="kpi-val"   >

																{item.bankName === " " ||
																	item.bankName === null
																	? "-"
																	: item.bankName}
															</div>
															</div>
														}
														{item.bic &&
														<div className="fait-box kpi-divstyle">
															<Text className="kpi-label">
																BIC
															</Text>
															<div level={5} className="kpi-val"   >

																{item.bic === " " ||
																	item.bic === null
																	? "-"
																	: item.bic}
															</div>
															</div>
														}
														{item?.bankBranch && 
														<div className="fait-box kpi-divstyle">
															<Text className="kpi-label">
															Branch
															</Text>
															<div level={5} className="kpi-val"   >

																{item.bankBranch === " " ||
																	item.bankBranch === null
																	? "-"
																	: item.bankBranch}
															</div>
															</div>
														}
														{item?.country && 
														<div className="fait-box kpi-divstyle">
															<Text className="kpi-label">
																Country
															</Text>
															<div level={5} className="kpi-val"   >

																{item.country === " " ||
																	item.country === null
																	? "-"
																	: item.country}
															</div>
															</div>
														}
														{item?.state && 
														<div className="fait-box kpi-divstyle">
															<Text className="kpi-label">
																State
															</Text>
															<div level={5} className="kpi-val"   >

																{item.state === "" || item.state === " " ||
																	item.state === null
																	? "-"
																	: item.state}
															</div>
															</div>
														}
														{item?.city&&
														<div className="fait-box kpi-divstyle">
															<Text className="kpi-label">
																City
															</Text>
															<div level={5} className="kpi-val"   >

																{item.city === " " ||
																	item.city === null
																	? "-"
																	: item.city}
															</div>
															</div>
														}
														{item?.postalCode &&
														<div className="fait-box kpi-divstyle">
															<Text className="kpi-label">
																Zip
															</Text>
															<div level={5} className="kpi-val"   >

																{item.postalCode === "" || item.postalCode === " " ||
																	item.postalCode === null
																	? "-"
																	: item.postalCode}
															</div>
															</div>
														}
														 {(item.walletCode!=='EUR'&& fiatAddress?.transferType !== "internationalIBAN")&&
														 <div className="fait-box kpi-divstyle">
															<Text className="kpi-label">
															Bank Address 1
															</Text>
															<div level={5} className="kpi-val"   >
																{item.line1 === " " ||
																	item.line1 === null
																	? "-"
																	: item.line1}
															</div>
															</div>
														}
														{(item.walletCode!=='EUR'&& fiatAddress?.transferType !== "internationalIBAN")&&
														<div className="fait-box kpi-divstyle">
															<Text className="kpi-label">
															Bank Address 2
															</Text>
															<div level={5} className="kpi-val"   >
																{item.line2 === " " ||
																	item.line2 === null
																	? "-"
																	: item.line2}
															</div>
															</div>
														}


													
												</div>
												{item?.docrepoitory.map((file) => (
													<Col xs={12} sm={12} md={12} lg={12} xxl={12} key={file.fileName}>
														<div
															className="docfile address-book-viewlevel"
															key={file.id}>
															<span
																className={`icon xl ${(file.fileName?.slice(-3) === "zip" &&
																		"file") ||
																	(file.fileName?.slice(-3) !== "zip" &&
																		"") ||
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
												</>
											))}
											
										</Row>
									</Col>
								</Row>
								<div className="text-right view-level-btn">
								<Button
								block
								className="cust-cancel-btn cust-cancel-btn pay-cust-btn detail-popbtn paynow-btn-ml"
									
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
      />
    }
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
