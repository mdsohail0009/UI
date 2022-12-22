import React, { Component, createRef } from 'react';
import { Typography, Button, Form, Select, message, Input, Alert, Popover, Spin, Tooltip, Upload, Modal } from 'antd';
import Translate from 'react-translate-component';
import { getCurrencyLu, getPaymentsData, savePayments, getBankData, creatPayment, updatePayments, getFileURL } from './api'
import NumberFormat from 'react-number-format';
import { connect } from "react-redux";
import Loader from '../../Shared/loader';
import FilePreviewer from 'react-file-previewer';
const { Option } = Select;
const { Title, Text, Paragraph } = Typography;
const EllipsisMiddle = ({ suffixCount, children }) => {
  const start = children?.slice(0, children.length - suffixCount).trim();
  const suffix = children?.slice(-suffixCount).trim();
  return (
    <Text className="mb-0 fs-14 docnames c-pointer d-block file-label fs-12 text-yellow fw-400"
      style={{ maxWidth: '100% !important' }} ellipsis={{ suffix }}>
      {start}
    </Text>
  );
};
class PaymentDetails extends Component {
  formRef = createRef();
  constructor(props) {
    super(props);
    this.state = {
      currencylu: [],
      currency: "EUR",
      paymentsData: [],
      paymentSavedata: [],
      btnDisabled: false,
      disabled: false,
      errorMessage: null,
      visible: false,
      moreBankInfo: {},
      loading: false,
      tooltipLoad: false,
      uploadLoader: false,
      isValidFile: true,
      paymentsDocDetails: [],
      paymentDoc: {},
      payAmount: null,
      amount: 0,
      type: this.props.match.params.type,
      state: this.props.match.params.state,
      billPaymentData: null,
      uploadUrl: process.env.REACT_APP_UPLOAD_API + "UploadFile",
      isUploading: false,
      modal: false,
      selectData: null,
      uploadIndex: null,
      errorWarning: null,
      isloading:false,
    };
    this.gridRef = React.createRef();
    this.useDivRef = React.createRef();
  }
  backToPayments = () => {
    this.props.history.push(`/payments/${"All"}`);
  };
  componentDidMount() {
    this.getCurrencyLookup();
    this.getPayments();
    this.useDivRef.current.scrollIntoView();
  }
  handleAlert = () => {
    this.setState({ ...this.state, errorMessage: null });
  };

  handleCurrencyChange = async (val) => {
    this.setState({ ...this.state, currency: val, paymentsData: [], errorMessage: null, errorWarning: null,loading:true });
    if ((this.state.currency = val)) { //don't add === here
      let response = await getPaymentsData(
        "00000000-0000-0000-0000-000000000000",
        this.state.currency
      );
      if (response.ok) {
        this.setState({
          ...this.state,
          paymentsData: response.data.paymentsDetails,
          loading: false,
        });
      } else {
        message.destroy();
        this.setState({ ...this.state, errorMessage: response.data, loading: false });
        this.useDivRef.current.scrollIntoView(0,0);
      }
    }
  };
  getCurrencyLookup = async () => {
    let response = await getCurrencyLu();
    if (response.ok) {
      this.setState({ ...this.state, currencylu: response.data });
    } else {
      message.destroy();
      this.setState({ ...this.state, errorMessage: response.data });
      this.useDivRef.current.scrollIntoView();
    }
  };
  getPayments = async () => {
    this.setState({ ...this.state, loading: true });
    if (this.props.match.params.id === "00000000-0000-0000-0000-000000000000") {
      let response = await getPaymentsData(
        "00000000-0000-0000-0000-000000000000",
        this.state.currency
      );
      if (response.ok) {
        this.setState({
          ...this.state,
          currency: response.data.currency,
          billPaymentData: response.data,
          paymentsData: response.data.paymentsDetails,
          loading: false,
        });
      } else {
        message.destroy();
        this.setState({
          ...this.state,
          errorMessage: this.isErrorDispaly(response),
          loading: false,
        });
        this.useDivRef.current.scrollIntoView(0,0);
      }
    } else {
      let response = await creatPayment(this.props.match.params.id);
      if (response.ok) {
        let paymentDetails = response.data;
        for (let i in paymentDetails.paymentsDetails) {
          paymentDetails.paymentsDetails[i].checked = true;
        }
        this.setState({
          ...this.state,
          currency: response.data.currency,
          billPaymentData: response.data,
          paymentsData: paymentDetails.paymentsDetails,
          loading: false,
        });
      } else {
        message.destroy();
        this.setState({
          ...this.state,
          errorMessage: this.isErrorDispaly(response),
          loading: false,
        });
        this.useDivRef.current.scrollIntoView(0,0);
      }
    }
  };
  savePayment = async () => {
    let objData = this.state.paymentsData.filter((item) => {
      return item.amount;
    });
    let objAmount = objData.some((item) => {
      return (item.recordStatus !== "Deleted" && (item.amount === null || item.amount <= 0));
    });

    let obj = Object.assign({});
    obj.id = this.props.userConfig.id;
    obj.currency = this.state.currency;
    obj.CustomerId = this.props.userConfig.id;
    obj.createdBy = this.props.userConfig.userName;
    obj.modifiedBy = "";
    obj.paymentsDetails = objData;
    if (obj.currency != null) {
      if (objAmount) {
        this.setState({ ...this.state, errorWarning: null, errorMessage: "Amount must be greater than zero." });
        this.useDivRef.current.scrollIntoView(0,0);
      } else {
        this.setState({ btnDisabled: true });
        if (
          this.props.match.params.id === "00000000-0000-0000-0000-000000000000"
        ) {
          let response = await savePayments(obj);
          if (response.ok) {
            this.setState({ btnDisabled: false, loading: false, });
            message.destroy();
            message.success({
              content: "Payment details saved successfully",
              className: "custom-msg",
              duration: 3,
            });
            this.props.history.push(`/payments/${"All"}`);
          } else {
            message.destroy();
            this.setState({ ...this.state, btnDisabled: false, loading: false, errorWarning: null, errorMessage: this.isErrorDispaly(response) })
            this.useDivRef.current.scrollIntoView(0,0);
          }
        }
        else {
          let PaymentDetail = this.state.paymentsData;
          for (var i in PaymentDetail) {
            if (PaymentDetail[i].checked === false) {
              PaymentDetail[i].RecordStatus = "Deleted";
            }
            if (!PaymentDetail[i].amount) {
              this.setState({ ...this.state, errorWarning: null, errorMessage: "Please enter amount." });
              this.useDivRef.current.scrollIntoView(0,0);
              return
            }
          }
          let response = await updatePayments(this.state.paymentsData);
          if (response.ok) {
            this.setState({ btnDisabled: false, loading: false });
            message.destroy();
            message.success({
              content: "Payment details updated successfully",
              className: "custom-msg",
              duration: 3,
            });
            this.props.history.push(`/payments/${"All"}`);
          } else {
            message.destroy();
            this.setState({ ...this.state, btnDisabled: false, loading: false, errorWarning: null, errorMessage: this.isErrorDispaly(response) });
            this.useDivRef.current.scrollIntoView(0,0);
          }
        }
      }
    } else {
      this.setState({ ...this.state, errorWarning: null, errorMessage: "Please select currency" });
      this.useDivRef.current.scrollIntoView(0,0);
    }
  };
  isErrorDispaly = (objValue) => {
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
  deleteDetials = async (id, paymentsData) => {

    let data = paymentsData;
    let isAtleastOneRecord = false;
    let indexno = '';
    for (let i in data) {
      if (data[i].id === id.id) {
        indexno = i;
      } else if (data[i].recordStatus !== "Deleted") {
        isAtleastOneRecord = true
      }
    }
    if (isAtleastOneRecord) {
      data[indexno].recordStatus = "Deleted";
      data[indexno].amount = "0";
      this.setState({ ...this.state.paymentsData, paymentData: data, modal: false });
    } else {
      this.setState({
        ...this.state,
        errorMessage: "At least one record is required", modal: false
      });
      this.useDivRef.current.scrollIntoView();
    }
  };

 
 
  beforeUpload = (file) => {
    this.setState({ ...this.state, errorWarning: null, errorMessage: null });
    if (file.name.split('.').length > 2) {
      this.setState({ ...this.state, isValidFile: true, isUploading: false, errorMessage: null, errorWarning: "File don't allow double extension" });
      this.useDivRef.current.scrollIntoView(0,0);
      return
    }
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
      this.setState({ ...this.state, isValidFile: true, isUploading: true, errorWarning: null, errorMessage: null });
      return true;
    } else {
      this.setState({ ...this.state, isValidFile: true, isUploading: false, errorMessage: null, errorWarning: "File is not allowed. You can upload jpg, png, jpeg and PDF files" });
      this.useDivRef.current.scrollIntoView(0,0);
      return Upload.LIST_IGNORE;
    }
  };
  handleUpload = ({ file }, item, i) => {
    if (file.name.split('.').length > 2) {
      this.setState({ ...this.state, errorMessage: null, isUploading: false, uploadIndex: i });
    }
    else {
      this.setState({ ...this.state, errorMessage: null, isUploading: true, uploadIndex: i });

    }
    if (file?.status === "done" && this.state.isUploading) {
      let paymentDetialsData = this.state.paymentsData;

      let obj = {
        "documentName": `${file.name}`,
        "isChecked": file.name === "" ? false : true,
        "remarks": `${file.size}`,
        "state": null,
        "status": false,
        "path": `${file.response}`,
        "size": `${file.size}`,
      }
      for (let pay in paymentDetialsData) {
        if (paymentDetialsData[pay].id === item.id) {
          obj["id"] = paymentDetialsData[pay]?.documents?.details[0]?.id !== null ? paymentDetialsData[pay]?.documents?.details[0]?.id : "00000000-0000-0000-0000-000000000000"
          obj["documentId"] = paymentDetialsData[pay]?.documents?.details[0]?.documentId !== null ? paymentDetialsData[pay]?.documents?.details[0]?.documentId : "00000000-0000-0000-0000-000000000000"
          paymentDetialsData[pay].documents.details = [obj];
        }
      }
      this.setState({
        ...this.state, paymentsData: paymentDetialsData, loading: false,
        isUploading: false
      });


    }
  };
  onModalOpen = (item) => {
    if (
      item.state === "Approved" || item.state === "Cancelled" || item.state === "Pending") {
      this.setState({ ...this.state, modal: false, selectData: item })
    } else {
      this.setState({ ...this.state, modal: true, selectData: item })
    }

  }
  handleCancel = e => {
    this.setState({ ...this.state, modal: false });

  }
  docPreview = async (file) => {
    let res = await getFileURL({ url: file.path });
    if (res.ok) {
      this.state.PreviewFilePath = file.path;
      this.setState({ ...this.state, previewModal: true, previewPath: res.data });
    }
  }
  docPreviewClose = () => {
    this.setState({ ...this.state, previewModal: false, previewPath: null })
  }
  DownloadUpdatedFile = async () => {
    let res = await getFileURL({ url: this.state.PreviewFilePath });
    if (res.ok) {
      this.setState({ ...this.state, previewModal: true, previewPath: res.data });
      window.open(res.data, "_blank")
    }
  }
  fileDownload = async () => {
    let res = await getFileURL({ url: this.state.previewPath });
    if (res.ok) {
      this.DownloadUpdatedFile()
    }
  }
  filePreviewPath() {
    return this.state.previewPath;
  }
  addressTypeNames = (type) => {
		const stepcodes = {
			"ownbusiness": "My Company",
			"individuals": "Individuals",
			"otherbusiness": "Other Business",
			"myself": "My Self"
		};
		return stepcodes[type];
	};
  moreInfoPopover = async (id) => {
    this.setState({...this.state,isloading:true});
    let response = await getBankData(id);
    if (response.ok) {
      this.setState({
        ...this.state,
        moreBankInfo: response.data,
        visible: true,
        isloading:true
      });
    } else {
      this.setState({ ...this.state, visible: false, isloading: false });
    }
  };
  handleVisibleChange = () => {
    this.setState({ ...this.state, visible: false });
    if(this.state.visible=== false){
      this.setState({ ...this.state, isloading: false });
    }
  };
  popOverContent = () => {
    const { moreBankInfo,isloading} = this.state;
    if (!isloading) {
      return <Spin />;
    } else {
      return (
        <div className="more-popover">
          <Text className="lbl text-white">BIC/SWIFT/ABA Routing Code</Text>
          <Text className="val text-white">{moreBankInfo?.routingNumber}</Text>
          {this.state.currency === "USD" && moreBankInfo?.transferType!=="internationalIBAN"&&
          <>
          <Text className="lbl text-white">Bank Address</Text><br/>
          <Text className="lbl text-white">Address Line 1</Text> 
          <Text className="val text-white">{moreBankInfo?.bankAddress1}</Text>
          {moreBankInfo?.bankAddress2!==null &&<>
            <Text className="lbl text-white">Address Line 2</Text>
          <Text className="val text-white">{moreBankInfo?.bankAddress2}</Text>
          </>}
          </>}
          {(moreBankInfo?.transferType==="sepa" || moreBankInfo?.transferType==="internationalIBAN" ) && 
          <>
          <Text className="lbl text-white">Bank Address</Text>
          <Text className="val text-white">{moreBankInfo?.bankBranch}{","}{moreBankInfo?.country}{","}{moreBankInfo?.state}{","}{moreBankInfo?.city}{","}{moreBankInfo?.postalCode}</Text></>}
        </div>
      );
    }
  };

  render() {
    let total = 0;
    for (const idx in this.state.paymentsData) {
      this.state.paymentsData[idx].amount = isNaN(this.state.paymentsData[idx].amount) ? 0 : this.state.paymentsData[idx].amount
      total += Number(this.state.paymentsData[idx].amount);
    }
    const { currencylu, paymentsData, loading, isUploading, uploadIndex } = this.state;
    return (
      <>
        <div ref={this.useDivRef}></div>
        <div className="main-container">
          <div className="mb-16">
             <Title className="basicinfo mb-0"><span onClick={() => this.props.history?.push(`/payments/All`)} className='icon md c-pointer back mr-8'></span><Translate content="menu_payments" component={Text} className="basicinfo" /></Title>
          </div>
          <div className="box basic-info text-white">
            {this.state.errorMessage && (
              <Alert
                description={this.state.errorMessage}
                type="error"
                onClose={() => this.handleAlert()}
                showIcon
              />
            )}
            {this.state.errorWarning && (
              <Alert
                description={this.state.errorWarning}
                type="warning"
                onClose={() => this.handleAlert()}
                showIcon
              />
            )}
            <Form autoComplete="off">
            {(this.props.match.params.id ===
                        "00000000-0000-0000-0000-000000000000"
                      ) &&
              <Form.Item>
                <Select
                  className="cust-input cust-disable"
                  placeholder="Select Currency"
                  onChange={(e) => this.handleCurrencyChange(e)}
                  style={{ width: 280 }}
                  dropdownClassName="select-drpdwn"
                  bordered={false}
                  showArrow={true}
                  value={this.state.currency}
                  disabled={
                    this.props.match.params.id !==
                    "00000000-0000-0000-0000-000000000000"
                  }
                >
                  {currencylu?.map((item, idx) => (
                    <Option
                      key={idx}
                      className="fw-400"
                      value={item.currencyCode}
                    >
                      {" "}
                      {item.currencyCode}
                      {
                        <NumberFormat
                          value={item.avilable}
                          displayType={"text"}
                          thousandSeparator={true}
                          renderText={(value) => <span> Balance: {value}</span>}
                        />
                      }
                    </Option>
                  ))}
                </Select>
              </Form.Item>
  }
              <div className='responsive_table'>
                <table className="pay-grid">
                  <thead>
                    <tr>
                      <th className="doc-def" style={{ width: '250px' }}>Whitelist Name</th>
                      <th className="doc-def" style={{ width: '410px' }}>Bank Name</th>
                      <th style={{ width: '250px' }}>Bank Account Number/IBAN</th>
                      {(this.props.match.params.id !==
                        "00000000-0000-0000-0000-000000000000"
                      )
                        && (
                          <th>State</th>
                        )}

                      <th style={{ width: '250px' }}>Amount</th>
                    </tr>
                  </thead>

                  {loading ? (
                    <tbody>
                      <tr>
                        <td colSpan="8" className="p-16 text-center">
                          <Loader />
                        </td>
                      </tr>{" "}
                    </tbody>
                  ) : (
                    <>
                      {paymentsData?.length > 0 ? (
                        <tbody className="mb-0">
                          {paymentsData?.map((item, i) => {
                            if (item.recordStatus !== 'Deleted') {
                              return (
                                <>
                                  <tr
                                    key={i}
                                    disabled={
                                      this.props.match.params.id ===
                                        "00000000-0000-0000-0000-000000000000" ||
                                        item.state === "Submitted"
                                        ? false
                                        : true
                                    }
                                  >
                                    <td className="doc-def" style={{ width: '200px' }}>
                                      {item?.beneficiaryAccountName ? (
                                        <>{item?.beneficiaryAccountName}</>
                                      ) : (
                                        <span>{" - - "}</span>
                                      )}
                                    </td>
                                    <td className="doc-def" style={{ width: '350px' }}>
                                      <div className="d-flex align-center justify-content" style={{ width: '350px' }}>
                                        <span>
                                          <Tooltip title={item.bankname}>
                                            <span className='pay-docs'>{item.bankname}</span>
                                          </Tooltip>
                                          <Text
                                            size="small"
                                            className="file-label doc-def ml-8"
                                          >
                                            {this.addressTypeNames(item.addressType)}{" "}
                                          </Text>

                                        </span>
                                        <Popover
                                          className="more-popover"
                                          content={this.popOverContent}
                                          trigger="click"
                                          visible={item.visible}
                                          placement="top"
                                          onVisibleChange={() =>
                                            this.handleVisibleChange()
                                          }
                                        >
                                          <span
                                            className="icon md info c-pointer ml-4"
                                            onClick={() =>
                                              this.moreInfoPopover(
                                                item.addressId,
                                              )
                                            }
                                          />
                                        </Popover>
                                      </div>
                                    </td>
                                    <td style={{ width: '250px' }}>
                                      <Tooltip title={item.accountnumber}>
                                        <span className=''>{item.accountnumber}</span>

                                      </Tooltip>
                                    </td>
                                    {(this.props.match.params.id !== "00000000-0000-0000-0000-000000000000"

                                    ) && (
                                        <td>{item.state ? item.state : "- -"}</td>
                                      )}
                                    {(this.props.match.params.id ===
                                      "00000000-0000-0000-0000-000000000000" || this.props.match.params.state === "Submitted" || this.props.match.params.state === "Pending")
                                      ? <>
                                        <td style={{ width: '250px' }}>
                                          <div className="d-flex amt-field">
                                            <Form.Item
                                              className="mb-0"
                                              rules={
                                                item.checked && [
                                                  {
                                                    required: true,
                                                    message: "is_required",
                                                  },
                                                ]
                                              }
                                            >
                                              <NumberFormat
                                                className="cust-input text-right"
                                                customInput={Input}
                                                thousandSeparator={true}
                                                prefix={""}
                                                placeholder="0.00"
                                                decimalScale={2}
                                                allowNegative={false}
                                                maxlength={13}
                                                style={{ height: 44 }}
                                                onValueChange={({ e, value }) => {
                                                  let paymentData =
                                                    this.state.paymentsData;
                                                  paymentData[i].amount = value;
                                                  paymentData[i].checked =
                                                    value > 0
                                                      ? true
                                                      : paymentData[i].checked;
                                                  this.setState({
                                                    ...this.state,
                                                    paymentsData: paymentData,
                                                  });
                                                }}
                                                disabled={
                                                  item.state === "Approved" ||
                                                  item.state === "Cancelled" ||
                                                  item.state === "Pending"
                                                }
                                                value={item.amount}
                                              />
                                            </Form.Item>
                                            <Upload
                                              key={i}
                                              type="dashed"
                                              size="large"
                                              className="ml-8 mt-12"
                                              shape="circle"
                                              style={{
                                                backgroundColor: "transparent",
                                              }}
                                              multiple={false}
                                              action={this.state.uploadUrl}
                                              showUploadList={false}
                                              beforeUpload={(props) => this.beforeUpload(props)}
                                              onChange={(props) => this.handleUpload(props, item, i)}
                                              headers={{Authorization : `Bearer ${this.props.user.access_token}`}}
                                              disabled={
                                                item.state === "Approved" ||
                                                item.state === "Cancelled" ||
                                                item.state === "Pending"
                                              }
                                            >
                                              <span
                                                className={`icon md attach ${item.state === "Approved" || item.state === "Cancelled"
                                                  ? ""
                                                  : "c-pointer"
                                                  } `}
                                              />
                                            </Upload>

                                            {this.props.match.params.id !==
                                              "00000000-0000-0000-0000-000000000000" && (
                                                <span className='mt-30 ml-12 delete-btn delete-disable' disabled={
                                                  item.state === "Approved" ||
                                                  item.state === "Cancelled" ||
                                                  item.state === "Pending"
                                                }>
                                                  <span onClick={() => this.onModalOpen(item)}
                                                    className={`icon md delete mt-12 ${item.state === "Submitted" ? "c-pointer" : ''} `}
                                                  />
                                                </span>
                                              )}
                                          </div>

                                          {uploadIndex === i && isUploading ? <div className="text-center" >
                                            <Spin />
                                          </div> : item.documents?.details.map((file) => (
                                            <>
                                              {file.documentName !== null && (
                                                <div className='docdetails' style={{ width: "80px" }}>
                                                  <div onClick={() => this.docPreview(file)}>
                                                    <Tooltip title={file.documentName} >
                                                      <EllipsisMiddle suffixCount={4}>
                                                        {file.documentName}
                                                      </EllipsisMiddle>
                                                    </Tooltip>
                                                  </div>
                                                </div>
                                              )}
                                            </>
                                          ))}
                                        </td>
                                      </> : <td>
                                        <NumberFormat
                                          value={item.amount}
                                          thousandSeparator={true}
                                          displayType={'text'}
                                          renderText={value => value}
                                        />
                                        <br />

                                        {uploadIndex === i && isUploading ? <div className="text-center" >
                                          <Spin />
                                        </div> : item.documents?.details.map((file) =>
                                          <>

                                            {file.documentName !== null && (
                                              <div className='docdetails'style={{ width: "80px" }} onClick={() => this.docPreview(file)}>
                                                <Tooltip title={file.documentName}>
                                                  <EllipsisMiddle suffixCount={4}>
                                                    {file.documentName}
                                                  </EllipsisMiddle>
                                                </Tooltip>
                                              </div>
                                            )}
                                          </>

                                        )}
                                      </td>}
                                  </tr>
                                </>
                              );
                            }
                            else{
                              return <></>;
                            }
                          })}
                        </tbody>
                      ) : (
                        <tbody>
                          <tr>
                            <td
                              colSpan="8"
                              className="p-16 text-center"
                              style={{ width: 300 }}
                            >
                             No Data Found
                            </td>
                          </tr>{" "}
                        </tbody>
                      )}
                    </>
                  )}
                  {paymentsData?.length > 0 &&
                    <tfoot>
                      <tr>
                        {(this.props.match.params.id ===
                          "00000000-0000-0000-0000-000000000000" || this.props.match.params.state === "Submitted" || this.props.match.params.state === "Pending"|| this.props.match.params.state === "Approved"|| this.props.match.params.state === "Cancelled") && <>
                            <td></td>
                          
                          </>
                        }
                        {(this.props.match.params.id !== "00000000-0000-0000-0000-000000000000"|| this.props.match.params.state === "Approved"|| this.props.match.params.state === "Cancelled") && <>
                        <td></td>
                        </> }
                        <td></td>
                      
                        <td>
                          <span className="text-white fs-24 ml-8"> Total:</span>
                        </td>
                        <td>
                          <span className="text-white fs-24">
                            {" "}
                            <NumberFormat
                              className=" text-right"
                              customInput={Text}
                              thousandSeparator={true}
                              prefix={""}
                              decimalScale={2}
                              allowNegative={false}
                              maxlength={13}
                              style={{ height: 44 }}
                            >
                              <span className="text-white ">
                                {parseFloat(total).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}{" "}
                              </span>
                            </NumberFormat>
                          </span>
                        </td>
                      </tr>
                    </tfoot>
                  }
                </table>
              </div>
            </Form>
            <div className="text-right mt-36">
              {paymentsData.length > 0 ? (
                <div>
                  {(this.props.match.params.id ===
                    "00000000-0000-0000-0000-000000000000" || this.props.match.params.state === "Submitted" || this.props.match.params.state === "Pending") &&
                    <Button
                      htmlType="submit"
                      className="pop-btn px-36"
                      loading={this.state.btnDisabled}
                      onClick={() => {
                        this.savePayment();
                      }}
                    >
                      Pay Now
                    </Button>
                  }
                  <Button
                    className="pop-btn px-36"
                    style={{ margin: "0 8px" }}
                    onClick={this.backToPayments}
                  >
                    Cancel
                  </Button>

                </div>
              ) : (
                ""
              )}
            </div>
          </div>
        </div>
        <Modal
          className="documentmodal-width"
          title="Preview"
          width={1000}
          visible={this.state.previewModal}
          destroyOnClose={true}
          closeIcon={<Tooltip title="Close"><span className="icon md c-pointer close" onClick={this.docPreviewClose} /></Tooltip>}
          footer={<>
            <Button type="primary" onClick={this.docPreviewClose} className="text-center text-white-30 pop-cancel fw-400 mr-36">Close</Button>
            <Button className="pop-btn px-36" onClick={() => this.fileDownload()}>Download</Button>
          </>}
        >
          <FilePreviewer hideControls={true} file={{ url: this.state.previewPath ? this.filePreviewPath() : null, mimeType: this.state?.previewPath?.includes(".pdf") ? 'application/pdf' : '' }} />
        </Modal>
        <Modal title="Confirm Delete"
          destroyOnClose={true}
          closeIcon={<Tooltip title="Close"><span className="icon md c-pointer close" onClick={this.handleCancel} /></Tooltip>}
         
          visible={this.state.modal}
          className="payments-modal"
          footer={[
            <>
            <div className='cust-pop-up-btn crypto-pop bill-pop'>
              <Button
                className="pop-cancel btn-width  bill-cancel"
                onClick={this.handleCancel}>No</Button>
              <Button className="pop-btn px-36 btn-width"
                onClick={() => this.deleteDetials(this.state.selectData, this.state.paymentsData)}>Yes</Button></div>
            </>
          ]}
        >
             <Paragraph className="text-white">Are you sure, do you really want to delete ?</Paragraph>
        </Modal>

      </>
    );
  }
}
const connectStateToProps = ({ userConfig, oidc }) => {
  return { userConfig: userConfig.userProfileInfo, user: oidc.user };
};
export default connect(connectStateToProps, null)(PaymentDetails);