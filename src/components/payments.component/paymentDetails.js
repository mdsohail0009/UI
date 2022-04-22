import React, { Component, createRef } from 'react';
import { Typography, Button, Form, Select, message, Input, Alert, Popover, Spin, Tooltip, Upload, Modal } from 'antd';
import Translate from 'react-translate-component';
import { getCurrencyLu, getPaymentsData, savePayments, getBankData, creatPayment, updatePayments } from './api'
import NumberFormat from 'react-number-format';
import { connect } from "react-redux";
import Loader from '../../Shared/loader';

const { confirm } = Modal;
const { Option } = Select;
const { Title, Text } = Typography;

class PaymentDetails extends Component {
  formRef = createRef();
  constructor(props) {
    super(props);
    this.state = {
      currencylu: [],
      currency: "USD",
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
      fileDetails: [],
      paymentDoc: {},
      payAmount: null,
      amount: 0,
      type: this.props.match.params.type,
      state:this.props.match.params.state,
      billPaymentData: null,
    };
    this.gridRef = React.createRef();
    this.useDivRef = React.createRef();
  }
  backToPayments = () => {
    this.props.history.push("/payments");
  };
  componentDidMount() {
    this.getCurrencyLookup();
    this.getPayments();
    this.useDivRef.current.scrollIntoView();
  }
  handleAlert = () => {
    this.setState({ ...this.state, errorMessage: null });
  };

  handleCurrencyChange = async (val, props) => {
    this.setState({ ...this.state, currency: val, paymentsData: [] });
    if ((this.state.currency = val)) {
      let response = await getPaymentsData(
        "00000000-0000-0000-0000-000000000000",
        this.props.userConfig?.id,
        this.state.currency
      );
      if (response.ok) {
        console.log(response.data.paymentsDetails);
        this.setState({
          ...this.state,
          paymentsData: response.data.paymentsDetails,
          loading: false,
        });
      } else {
        message.destroy();
        this.setState({ ...this.state, errorMessage: response.data });
        this.useDivRef.current.scrollIntoView();
      }
    }
  };
  getCurrencyLookup = async () => {
    let response = await getCurrencyLu(this.props.userConfig?.id);
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
        this.props.userConfig?.id,
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
          errorMessage: response.data,
          loading: false,
        });
        this.useDivRef.current.scrollIntoView();
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
          errorMessage: response.data,
          loading: false,
        });
        this.useDivRef.current.scrollIntoView();
      }
    }
  };
  saveRolesDetails = async () => {
    debugger
    let objData = this.state.paymentsData.filter((item) => {
      return item.checked;
    });
    if (objData.length <1) {
      this.setState({
        ...this.state,
        errorMessage: "Please Check atleast one record",
      });
      // this.useDivRef.current.scrollIntoView();
      return;
    }
    let objAmount = objData.some((item) => {
      return (item.recordStatus !== "Deleted" && (item.amount == null || item.amount <= 0));
    });

    let obj = Object.assign({});
    obj.id = this.props.userConfig.id;
    obj.currency = this.state.currency;
    obj.memberId = this.props.userConfig.id;
    obj.createdBy = this.props.userConfig.userName;
    obj.modifiedBy = "";
    obj.paymentsDetails = objData;
    if (obj.currency != null) {
      if (objAmount) {
        this.setState({ ...this.state, errorMessage: "Please enter amount" });
        // this.useDivRef.current.scrollIntoView();
      }else {
        this.setState({ btnDisabled: true });
        if (
          this.props.match.params.id === "00000000-0000-0000-0000-000000000000"
        ) {
          let response = await savePayments(obj);
          if (response.ok) {
            this.setState({ btnDisabled: false });
            message.destroy();
            message.success({
              content: "Payment details saved successfully",
              className: "custom-msg",
              duration: 0.5,
            });
            this.props.history.push("/payments");
            // this.useDivRef.current.scrollIntoView()
          } else {
            this.setState({ btnDisabled: false });
            message.destroy();
            this.setState({ ...this.state, errorMessage: response.data })
            // this.useDivRef.current.scrollIntoView()
          }
        }
        else {
          let PaymentDetail = this.state.paymentsData;
          for (var i in PaymentDetail) {
            if (PaymentDetail[i].checked === false) {
              PaymentDetail[i].RecordStatus = "Deleted";
            }
          }
          let response = await updatePayments(this.state.paymentsData);
          if (response.ok) {
            this.setState({ btnDisabled: false });
            message.destroy();
            message.success({
              content: "Payment details update successfully",
              className: "custom-msg",
              duration: 0.5,
            });
            this.props.history.push("/payments");
          } else {
            this.setState({ btnDisabled: false });
            message.destroy();
            this.setState({ ...this.state, errorMessage: response.data });
            // this.useDivRef.current.scrollIntoView();
          }
        }
      }
    } else {
      this.setState({ ...this.state, errorMessage: "Please select currency" });
      // this.useDivRef.current.scrollIntoView();
    }
  };

  deleteDetials = async (id,paymentsData) => {
    let data = paymentsData;
    let isAtleastOneRecord = false;
    let indexno = '';
    for (let i in data) {
        if (data[i].id === id.id) {
        indexno = i;
        }else if(data[i].recordStatus!== "Deleted"){
            isAtleastOneRecord = true
        }
    }
    if(isAtleastOneRecord){
            data[indexno].recordStatus = "Deleted";
          data[indexno].amount = "0";
        this.setState({ ...this.state.paymentsData, paymentData: data });
    }else{
        this.setState({
            ...this.state,
            errorMessage: "Atleast one record is required",
          });
          this.useDivRef.current.scrollIntoView();
    }
  };

  moreInfoPopover = async (id, index) => {
    this.setState({ ...this.state, tooltipLoad: true });
    let response = await getBankData(id);
    if (response.ok) {
      this.setState({
        ...this.state,
        moreBankInfo: response.data,
        visible: true,
        tooltipLoad: false,
      });
    } else {
      this.setState({ ...this.state, visible: false, tooltipLoad: false });
    }
  };
  handleVisibleChange = (index) => {
    this.setState({ ...this.state, visible: false });
  };
  beforeUpload = (file) => {
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
      this.setState({ ...this.state, isValidFile: true });
      return true;
    } else {
      this.state.errorMessage(
        "File is not allowed. You can upload jpg, png, jpeg and PDF  files"
      );
      this.setState({ ...this.state, isValidFile: false });
      return Upload.LIST_IGNORE;
    }
  };
  handleUpload = ({ file }, item) => {
    this.setState({
      ...this.state,
      fileDetails: [],
      isSubmitting: true,
      errorMessage: null,
      loading: true,
    });
    let paymentDetialsData = this.state.paymentsData;
    if((file.name.split('.')).length > 2){
      this.setState({
        ...this.state,
        errorMessage: "File don't allow double extension",
      });
  }
  debugger
    for (let pay in paymentDetialsData) {
     
      if (paymentDetialsData[pay].id === item.id) {
        let obj = {
          id: paymentDetialsData[pay]?.documents?.details[pay]?.id ==="00000000-0000-0000-0000-000000000000" ? paymentDetialsData[pay]?.documents?.details[pay]?.id:"00000000-0000-0000-0000-000000000000",
          documentId:paymentDetialsData[pay]?.documents?.details[pay]?.documentId ==='00000000-0000-0000-0000-000000000000' ? paymentDetialsData[pay]?.documents?.details[pay]?.documentId:"00000000-0000-0000-0000-000000000000",
          isChecked: file.name == "" ? false : true,
          documentName: `${file.name}`,
          remarks: `${file.size}`,
          state: null,
          status: false,
          path: `${file.name}`,
        };
        paymentDetialsData[pay].documents.details = [obj];
      }
      // paymentDetialsData[pay].documents.details = [obj];
    }
    this.setState({
      ...this.state,
      paymentsData: paymentDetialsData,
      loading: false,
    });
  };
  addressTypeNames = (type) =>{
    const stepcodes = {
              "1stparty" : "1st Party",
              "3rdparty" : "3rd Party",
     }
     return stepcodes[type]
 }
  popOverContent = () => {
    const { moreBankInfo, tooltipLoad } = this.state;
    if (tooltipLoad) {
      return <Spin />;
    } else {
      return (
        <div className="more-popover">
          <Text className="lbl">Address Label</Text>
          <Text className="val">{moreBankInfo?.favouriteName}</Text>
          {/* <Text className='lbl'>Recipient Name</Text>
                <Text className='val'>{moreBankInfo?.beneficiaryAccountName}</Text> */}
          <Text className="lbl">Recipient Address</Text>
          <Text className="val">{moreBankInfo?.beneficiaryAccountAddress}</Text>
          <Text className="lbl">BIC/SWIFT/Routing Number</Text>
          <Text className="val">{moreBankInfo?.routingNumber}</Text>
          <Text className="lbl">Bank Address</Text>
          <Text className="val">{moreBankInfo?.bankAddress}</Text>
        </div>
      );
    }
  };

  render() {
    let total = 0;
    for (let i = 0; i < this.state.paymentsData.length; i++) {
      total += Number(this.state.paymentsData[i].amount);
    }
    const { currencylu, paymentsData, loading, type } = this.state;
    const { form } = this.props;
    return (
      <>
        <div ref={this.useDivRef}></div>
        <div className="main-container">
          <div className="mb-16">
            <Title className="basicinfo mb-0">
              <Translate
                content="menu_payments"
                component={Text}
                className="basicinfo"
              />
            </Title>
          </div>
          <div className="box basic-info text-white">
            {this.state.errorMessage != null && (
              <Alert
                description={this.state.errorMessage}
                type="error"
                closable
                onClose={() => this.handleAlert()}
              />
            )}
            <Form autoComplete="off">
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
              <div>
                <table className="pay-grid">
                  <thead>
                    <tr>
                    {(this.props.match.params.id ===
                        "00000000-0000-0000-0000-000000000000" || this.props.match.params.state ==="Submitted" || this.props.match.params.state ==="Pending")
                       && (<th style={{ width: 50 }}></th>)}
                      {/* <th style={{ width: 50 }}></th> */}
                      <th>Name</th>
                      <th>Bank Name</th>
                      {/* <th>BIC/SWIFT/Routing Number</th> */}
                      <th>Bank account number</th>
                      {(this.props.match.params.id !==
                        "00000000-0000-0000-0000-000000000000" 
                        // && this.props.match.params.state ==="Submitted" || this.props.match.params.state ==="Pending"
                        )
                       && (
                       <th>State</th>
                        )} 
                        
                      <th>Amount</th>
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
                            if(item.recordStatus != 'Deleted'){
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
                            {(this.props.match.params.id ===
                                "00000000-0000-0000-0000-000000000000" || this.props.match.params.state ==="Submitted" || this.props.match.params.state ==="Pending")
                              &&
                                  <td
                                    style={{ width: 50 }}
                                    className="text-center"
                                  >
                                    <label className="text-center custom-checkbox p-relative">
                                      <Input
                                
                                        name="check"
                                        type="checkbox"
                                        disabled={
                                          this.props.match.params.id !==
                                            "00000000-0000-0000-0000-000000000000" ||
                                          item.state === "Approved" ||
                                          item.state === "Cancelled" ||
                                          item.state === "Pending"
                                        }
                                        checked={item.checked}
                                        className="grid_check_box"
                                        onClick={(value) => {
                                          let paymentData =
                                            this.state.paymentsData;
                                          if (value.target.checked === false) {
                                            paymentData[i].amount = 0;
                                          }
                                          paymentData[i].checked =
                                            value.target.checked;
                                          this.setState({
                                            ...this.state,
                                            paymentsData: paymentData,
                                          });
                                        }}
                                      />
                                      <span></span>
                                    </label>
                                  </td>
                            }
                                  <td>
                                    {item?.beneficiaryAccountName ? (
                                      <>{item?.beneficiaryAccountName}</>
                                    ) : (
                                      <span>{" - - "}</span>
                                    )}
                                  </td>
                                  <td>
                                    <div className="d-flex align-center justify-content">
                                      <span>
                                        {item.bankname}

                                        {item.isPrimary !== null ? (<>
                                            {(this.props.match.params.id ===
                                              "00000000-0000-0000-0000-000000000000" || this.props.match.params.state ==="Submitted" || this.props.match.params.state ==="Pending")
                                                && <>
                                          <Text
                                            size="small"
                                            className="file-label ml-8"
                                          >
                                            
                                           {this.addressTypeNames(item.addressType)}{" "} 

                                          </Text>
                                            </>}
                                            </>) : (
                                          ""
                                        )}
                                      </span>
                                      <Popover
                                        className="more-popover"
                                        content={this.popOverContent}
                                        trigger="click"
                                        visible={item.visible}
                                        placement="top"
                                        onVisibleChange={() =>
                                          this.handleVisibleChange(i)
                                        }
                                      >
                                        <span
                                          className="icon md info c-pointer"
                                          onClick={() =>
                                            this.moreInfoPopover(
                                              item.addressId,
                                              i
                                            )
                                          }
                                        />
                                      </Popover>
                                    </div>
                                  </td>
                                  <td>{item.accountnumber}</td>
                                  {(this.props.match.params.id !== "00000000-0000-0000-0000-000000000000" 
                                  //  &&this.props.match.params.state =="Submitted" || this.props.match.params.state =="Pending")
                                         ) && (
                                    <td>{item.state ? item.state : "- -"}</td>
                                  )} 
                                  {(this.props.match.params.id ===
                                              "00000000-0000-0000-0000-000000000000" || this.props.match.params.state ==="Submitted" || this.props.match.params.state ==="Pending")
                                                ? <>
                                  <td>
                                    <div className="d-flex">
                                      <Form.Item
                                        //name={item.id}
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
                                        type="dashed"
                                        size="large"
                                        className="ml-8 mt-12"
                                        shape="circle"
                                        style={{
                                          backgroundColor: "transparent",
                                        }}
                                        action={
                                          process.env.REACT_APP_UPLOAD_API +
                                          "UploadFile"
                                        }
                                        showUploadList={false}
                                        beforeUpload={(props) => {
                                          this.beforeUpload(props);
                                        }}
                                        onChange={(props) => {
                                          this.handleUpload(props, item);
                                        }}
                                        disabled={
                                          item.state === "Approved" ||
                                          item.state === "Cancelled" ||
                                          item.state === "Pending"
                                        }
                                      >
                                        <span
                                          className={`icon md attach ${
                                            item.state === "Approved"
                                              ? ""
                                              : "c-pointer"
                                          } `}
                                        />
                                      </Upload>
                                      {this.props.match.params.id !==
                                        "00000000-0000-0000-0000-000000000000" && (
                                        <Button
                                          disabled={
                                            item.state === "Approved" ||
                                            item.state === "Cancelled" ||
                                            item.state === "Pending"
                                          }
                                          className="delete-btn mt-30"
                                          style={{ padding: "0 14px" }}
                                          onClick={() =>
                                            confirm({
                                              content: (
                                                <div className="fs-14 text-white-50">
                                                  Are you sure do you want to
                                                  delete Payment ?
                                                </div>
                                              ),
                                              title: (
                                                <div className="fs-18 text-white-30">
                                                  Delete Payment ?
                                                </div>
                                              ),
                                              onOk: () => {
                                                this.deleteDetials(item, this.state.paymentsData);
                                              },
                                            })
                                          }
                                        >
                                          <span className="icon md delete mt-12" />
                                        </Button>
                                      )}
                                    </div>

                                    {item.documents?.details.map((file) => (
                                      <>
                                        {file.documentName !== null && (
                                          <div className='pay-doc'>
                                          <Tooltip title={file.documentName}>
                                          <Text className="file-label fs-12">
                                            {file.documentName}
                                          </Text>
                                          </Tooltip>
                                          </div>
                                        )}
                                      </>
                                    ))}
                                  </td>
                                  </>: <td>
                                                    <NumberFormat
                                                        value={item.amount}
                                                        thousandSeparator={true}
                                                        displayType={'text'}
                                                        renderText={value => value}
                                                    />
                                                    <br/>
                                      {item.documents?.details.map((file) => 
                                     <>
                                     {file.documentName !== null && (
                                       <div className='pay-doc'>
                                       <Tooltip title={file.documentName}>
                                       <Text className="file-label fs-12">
                                         {file.documentName}
                                       </Text>
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
                          })}
                        </tbody>
                      ) : (
                        <tbody>
                          <tr>
                            <td
                              colSpan="8"
                              className="p-16 text-center"
                              style={{ color: "white", width: 300 }}
                            >
                              No bank details available
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
                                              "00000000-0000-0000-0000-000000000000" || this.props.match.params.state ==="Submitted" || this.props.match.params.state ==="Pending") &&<>
                      <td></td>
                      <td></td>
                      </>
                    }
                      {this.props.match.params.id !==
                        "00000000-0000-0000-0000-000000000000" && <td></td>}
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
                                              "00000000-0000-0000-0000-000000000000" || this.props.match.params.state ==="Submitted" || this.props.match.params.state ==="Pending") &&
                  <Button
                   className="pop-btn px-36"
                    disabled={this.state.btnDisabled}
                    onClick={() => {
                      this.saveRolesDetails();
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
      </>
    );
  }
}
const connectStateToProps = ({ userConfig }) => {
    return { userConfig: userConfig.userProfileInfo };
};
export default connect(connectStateToProps, null)(PaymentDetails);