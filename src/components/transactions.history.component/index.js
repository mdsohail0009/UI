import React, { Component } from "react";
import {
  Drawer,
  Typography,
  Button,
  Row, Col, Select, Form,Modal,DatePicker,Tooltip,Alert,Input,message} from "antd";
import { connect } from "react-redux";
import Translate from "react-translate-component";
import apiCalls from "../../api/apiCalls";
import List from "../grid.component";
import { getTransactionSearch, getTransactionCurrency } from './api';
import { setCurrentAction } from "../../reducers/actionsReducer";
import { getFeaturePermissionsByKey } from '../shared/permissions/permissionService';
import { withRouter } from "react-router-dom";
import { setSelectedFeatureMenu } from "../../reducers/feturesReducer";
import NumberFormat from "react-number-format";
import moment from "moment/moment";
import TransactionSlips from "./transaction.slips";
import TransactionTimeSpan from "./transactionTimeSpan";
const { Option } = Select;
class TransactionsHistory extends Component {
  formRef = React.createRef();
  formDateRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      customerData: [],
      doctypeData: [],
      currenyData: [],
      permissions: {},
      value: "",
      statusData:[],
      timeListSpan: ["Last 1 Day", "Last One Week", "Custom"],
      modal: false,
      selectedTimespan: "",
      timeSpanfromdate: "",
      timeSpantodate: "",
      customFromdata: "",
      customTodate: "",
      isCustomDate: false,
      message:"",
      searchObj: {
        type: "All",
        docType: "All",
        customerId: this.props.customer?.id,
        currency: this.props?.selectWallet || "All",
        status:"All",
        timeSpan: "Last 1 Day",
        fromdate: "",
        todate: "",
      },
      tranObj: {},
      loader: true,
      gridUrl: process.env.REACT_APP_GRID_API + `Transaction/Customers`,
      showModal:false,
      modalData:{},
      modalPoupData:{},
      downloadError:"",
    };
    this.props.dispatch(setSelectedFeatureMenu(this.props.transactionsPermissions?.featureId || this.props.customer?.id));
    this.gridRef = React.createRef();
  }



  componentDidMount() {
    getFeaturePermissionsByKey('transactions', this.loadInfo)
  }

  loadInfo = () => {
    this.permissionsInterval = setInterval(this.loadPermissions, 200);
    this.TransactionSearch();
    this.transactionCurrency();
  }

  loadPermissions = () => {
    if (this.props.transactionsPermissions) {
      this.props.dispatch(setSelectedFeatureMenu(this.props.transactionsPermissions?.featureId));
      clearInterval(this.permissionsInterval);
      let _permissions = {};
      for (let action of this.props.transactionsPermissions?.actions) {
        _permissions[action.permissionName] = action.values;
      }
      this.setState({ ...this.state, permissions: _permissions, searchObj: { ...this.state.searchObj, currency: this.props?.selectWallet || "All" } }, () => {
        if (!this.state.permissions?.view) {
          this.props.history.push("/accessdenied");
        }
      });
    }
  }
  gridColumns = [
    {
      field: "date", title: "Date", filter: true, filterType: "date", locked: true, width: 210,
      customCell: (props) => (
        <td>
         
            {props.dataItem?.date ? <>{ moment.utc(props.dataItem?.date).local().format("DD/MM/YYYY hh:mm:ss A")}</> : props.dataItem?.date}

        
        </td>
      )
    },
    { field: "docType", title: "Type", filter: true,
    customCell: (props) => (
      <td className="d-flex justify-content">
      <div className="gridLink c-pointer	" onClick={() => this.transactionModal(props?.dataItem)}>
      {props?.dataItem?.docType}
      </div>
    </td>
    ), },
    { field: "wallet", title: "Wallet", filter: true, },
    {
      field: "debit", title: "Value", filter: false, dataType: 'number', filterType: "numeric",
      customCell: (props) => (
        <td>
          {props.dataItem?.debit && <NumberFormat value={props.dataItem?.debit} displayType={"text"} thousandSeparator={true} />}
          {props.dataItem?.credit && props.dataItem?.debit && "/"}
          {props.dataItem?.credit && <NumberFormat value={props.dataItem.credit} displayType={"text"} thousandSeparator={true} />}

        </td>
      ),
      combine: true,
      combineFields: ["debit","credit"]
    },

    {
      field: "senderName", title: "Sender/Recipient Full Name", width: 260,

      customCell: (props) => (
        <td>
          {props.dataItem?.senderName}
          {(props.dataItem?.senderName && props.dataItem?.beneficiryName) && "/"}
          {props.dataItem?.beneficiryName}

        </td>
      ),
      combine: true,
      combineFields: ["senderName", "beneficiryName"]
    },

    {
      field: "accountnumber", title: "Bank Account Number/IBAN", filter: true, width: 260,
    },
    { field: "state", title: "State", filter: true, },
    


  ]
  TransactionSearch = async () => {
    let response = await getTransactionSearch();
    if (response.ok) {
      this.setState({
        doctypeData: response.data.docTypes,
        statusData:response.data.status
      });
    }
  };
  transactionCurrency = async () => {
    let response = await getTransactionCurrency();
    if (response.ok) {
      let obj = { code: "All" }
      let walletList = [];
      walletList.push(obj);
      walletList = [...walletList, ...response.data]
      this.setState({
        currenyData: walletList || response.data,

      });
    }
  };
  handleTimeSpan = (val, id) => {
    let { searchObj } = this.state;
    searchObj[id] = val;
    if (val === "Custom") {
      this.setState({ ...this.state, modal: true, isCustomDate: true, searchObj: searchObj })
      this.formRef.current.setFieldsValue({ ...this.state, selectedTimespan: null });
    } else {
      this.setState({ ...this.state, searchObj: { ...searchObj, fromdate: '', todate: '' }, isCustomDate: false, customFromdata: "", customTodate: "" });

    }
  }
  handleChange = (value, prop) => {
    var val = "";
    let { customerData, searchObj } = this.state;
    if (prop == "customerId") {
      let index = customerData.findIndex(function (o) { return o.name == value; });
      val = customerData[index].id;
    }
    searchObj[prop] = prop == "customerId" ? val : value;
    this.setState({ ...this.state, searchObj });
    if (prop == "currency") {
      const searchVal = `${value ? value : "All"}`;
      this.setState({ ...this.state, searchObj: { ...this.state.searchObj, currency: searchVal || "All" } })
    }
  };
  handleDateChange = (prop, val) => {
    let { searchObj, customFromdata, customTodate } = this.state;
    searchObj[val] = new Date(prop);
    this.setState({ ...this.state, searchObj, fromdate: customFromdata, todate: customTodate });

  };
  handleSearch = () => {
    let { searchObj, timeSpanfromdate, timeSpantodate } = this.state;
    if (searchObj.timeSpan === "Custom") {
      searchObj.fromdate = moment(timeSpanfromdate).format('MM-DD-YYYY');
      searchObj.todate = moment(timeSpantodate).format('MM-DD-YYYY');
    }
    this.setState({ ...this.state, searchObj },
      () => { this.gridRef.current?.refreshGrid(); }
    );
    apiCalls.trackEvent({
      Type: "Admin",
      Action: "Transactions grid page view",
      Username: this.props.userConfig?.userName,
      customerId: this.props.userConfig?.id,
      Feature: "Transactions",
      Remarks: "Transactions grid page view",
      Duration: 1,
      Url: window.location.href,
      FullFeatureName: "Transactions"
    });

  };

  datePopup = () => {
    let { searchObj, timeSpanfromdate, timeSpantodate, customFromdata, customTodate } = this.state;
    searchObj.fromdate = new Date(timeSpanfromdate)
    searchObj.fromdate = new Date(timeSpantodate)
    searchObj.fromdate = moment(timeSpanfromdate).format('DD/MM/YYYY');
    searchObj.todate = moment(timeSpantodate).format('DD/MM/YYYY');
    this.formDateRef.current.setFieldsValue({ fromdate: customFromdata, todate: customTodate })
    this.setState({ ...this.state, modal: true, searchObj });
  }

  handleOk = (values) => {
    let { selectedTimespan, timeSpanfromdate, timeSpantodate, customFromdata, customTodate } = this.state;

    if (new Date(moment(values.fromdate).format('MM/DD/YYYY')).getTime() > new Date(moment(values.todate).format('MM/DD/YYYY')).getTime()) {
      this.setState({ ...this.state, message: 'Start date must be less than or equal to the end date.' })
      return
    }
    customFromdata = values.fromdate;
    customTodate = values.todate;
    values.fromdate = values.fromdate.format('MM/DD/YYYY');
    values.todate =values.todate.format('MM/DD/YYYY');
    timeSpanfromdate = values.fromdate;
    timeSpantodate = values.todate;
    selectedTimespan = moment(timeSpanfromdate).format('DD/MM/YYYY') + " - " + moment(timeSpantodate).format('DD/MM/YYYY');
    this.formRef.current.setFieldsValue({ ...this.state, selectedTimespan });
    this.setState({ ...this.state, selectedTimespan, timeSpanfromdate, timeSpantodate, customFromdata, customTodate, modal: false, message: '' });
    this.formDateRef.current.resetFields();
  };
  handleDateCancel = e => {
    let { searchObj, customFromdata, customTodate } = this.state;
    if (customFromdata && customTodate) {
      this.setState({ modal: false,  message: '' });
    } else {
      this.setState({ ...this.state, searchObj: { ...searchObj, timeSpan: "Last 1 Day", fromdate: '', todate: '' }, modal: false, isCustomDate: false, message: '' });
      this.formRef.current.setFieldsValue({ ...searchObj, timeSpan: "Last 1 Day", fromdate: '', todate: '' })
      this.formDateRef.current.resetFields();
    }
  }
transactionModal=(data)=>{
  this.setState({ ...this.state, showModal:true,modalData:data ,
    isLoading:false  })
}
handleCancel=()=>{
  this.setState({ ...this.state, showModal:false,downloadError:"" })
}
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

  render() {
    const { Title } = Typography;
    const {  doctypeData, currenyData, gridUrl, searchObj,showModal,modalData,timeListSpan,statusData,isLoading,downloadError } = this.state;

    const options2 = doctypeData.map((d) => (
      <Option key={d.value} value={d.name}>{d.name}</Option>
    ));
    const options3 = currenyData?.map((d) => (
      <Option key={d.code} value={d.code}>{d.code}</Option>
    ));
    const options4 = timeListSpan.map((d) => (
      <Option key={d} value={d}>{d}</Option>
    ));
    const options5 = statusData?.map((d) => (
      <Option key={d.code} value={d.code}>{d.code}</Option>
    ));
    return (
      <>
        <Drawer
          title={[<div className="side-drawer-header">
            <Translate content="transactions_history" component={Title} className="fs-26 fw-400 mb-0 text-white-30" />
            <span onClick={this.props.onClose} className="icon md close-white c-pointer" />
          </div>]}
          placement="right"
          closable={false}
          width="100%"
          onClose={this.props.onClose}
          visible={this.props.showDrawer}
          className="side-drawer-full custom-gridresponsive transctns-grid"
        >
          <div>
            <Form
              initialValues={this.state.customerData}
              className="ant-advanced-search-form form form-bg search-bg pt-8"
              autoComplete="off"
              ref={this.formRef}
            >
              <Row >
              <Col xs={24} sm={24} md={7} lg={7} xl={5} className="px-8 transaction_resp">
              <Form.Item
                    name="Date"
                    className="input-label selectcustom-input mb-0"
                    label={<Translate content="TimeSpan" component={Form.label} className="input-label selectcustom-input mb-0" />}
                  >
                    <Select
                      className="cust-input mb-0 custom-search"
                      dropdownClassName="select-drpdwn"
                      defaultValue="Last 1 Day"
                      onChange={(e) => this.handleTimeSpan(e, 'timeSpan')}
                      placeholder="Time Span"
                    >
                      {options4}
                    </Select>
                  </Form.Item>
                </Col>
                {this?.state?.isCustomDate ? <Col xs={24} sm={24} md={7} lg={7} xl={5} className="px-8 transaction_resp">
                  <Form.Item
                    name="selectedTimespan"
                    className="input-label selectcustom-input mb-0 cust-label"
                    label="Selected timespan"
                  >
                    <Input disabled placeholder="DD/MM/YYYY" className="cust-input cust-adon mb-0" addonAfter={<i className="icon md date-white c-pointer" onClick={(e) => { this.datePopup(e, 'searchObj') }} />} />
                  </Form.Item>
                </Col> : ""}
                <Col xs={24} sm={24} md={7} lg={7} xl={5} className="px-8 transaction_resp">
                  <Form.Item name="docType" className="input-label mb-0 cust-label" label="Transaction Type" colon={false}>
                    <Select
                      defaultValue="All"
                      className="cust-input w-100 bgwhite c-pointer"
                      dropdownClassName="select-drpdwn"
                      showSearch
                      onChange={(e) => this.handleChange(e, "docType")}
                      placeholder="Select Doc Type"
                    >
                      {options2}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={7} lg={7} xl={5} className="px-8 transaction_resp">
                  <Form.Item className="input-label mb-0 cust-label" label="Wallet" colon={false}>
                    <Select
                      value={this.state.searchObj.currency}
                      className="cust-input w-100 bgwhite"
                      dropdownClassName="select-drpdwn"
                      showSearch
                      onChange={(e) => this.handleChange(e, "currency")}
                      placeholder="Select Wallet"
                    >
                      {options3}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={7} lg={7} xl={5} className="px-8 transaction_resp">
                  <Form.Item name="state" className="input-label mb-0 cust-label" label="State" colon={false}>
                    <Select
                      defaultValue="All"
                      className="cust-input w-100 bgwhite"
                      dropdownClassName="select-drpdwn"
                      showSearch
                      onChange={(e) => this.handleChange(e, "status")}
                      placeholder="Select Status"
                    >
                      {options5}
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={3} lg={3} xl={3} className="transaction_resp">
                  <Button
                    className="pop-btn search-btn"
                    style={{ height: 36, marginTop: "36px" }}
                    htmlType="submit"
                    onClick={this.handleSearch}
                  >
                    Search<span className="icon sm search-angle ml-8"></span>
                  </Button>
                </Col>

              </Row>
            </Form>
          </div>
          <List
            url={gridUrl} additionalParams={searchObj} ref={this.gridRef}
            columns={this.gridColumns}
            showExcelExport={this.state.permissions?.ExcelExport}
            excelFileName={'Transaction History'}
            exExportTitle={"Download Transaction History"}
          />
        </Drawer>

                <TransactionSlips showModal={showModal}  modalData={modalData} isLoading={isLoading} handleCancel={this.handleCancel} />
                <TransactionTimeSpan modal={this.state.modal} handleDateCancel={this.handleDateCancel} handleDateChange={this.handleDateChange} handleOk={this.handleOk} formDateRef={this.formDateRef} message={this.state?.message} searchObj={searchObj}/>
      </>

    );
  }
}
const connectStateToProps = ({ userConfig, menuItems }) => {
  return { customer: userConfig.userProfileInfo, transactionsPermissions: menuItems?.featurePermissions.transactions };
};
const connectDispatchToProps = dispatch => {
  return {
    setAction: (val) => {
      dispatch(setCurrentAction(val))
    },
    dispatch
  }
}
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(TransactionsHistory));
