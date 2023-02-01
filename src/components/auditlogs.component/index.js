import React, { Component } from "react";
import { connect } from "react-redux";
import { Drawer, Row, Col, Select, Button, Alert, Form, DatePicker, Modal, Tooltip, Input, Typography ,Empty} from "antd";
import List from "../grid.component";
import Loader from '../../Shared/loader'
import { userNameLuSearch, getFeatureLuSearch, getAuditLogInfo } from './api';
import moment from 'moment';
import Translate from 'react-translate-component';
import apicalls from '../../api/apiCalls';
import { getScreenName } from "../../reducers/feturesReducer";


const { Option } = Select;
const { Text } = Typography;

class AuditLogs extends Component {
  formRef = React.createRef();
  formDateRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userData: [],
      featureData: [],
      value: "",
      modal: false,
      selectedTimespan: "",
      timeSpanfromdate: "",
      timeSpantodate: "",
      customFromdata: "",
      customTodate: "",
      isCustomDate: false,
      moreAuditLogs: false,
      message: "",
      searchObj: {
        timeSpan: "Last 1 Day",
        feature: "All Features",
        fromdate: '',
        todate: '',
      },
      logRowData: null,
      timeListSpan: ["Last 1 Day", "Last One Week", "Custom"],
      gridUrl: process.env.REACT_APP_GRID_API + "AuditLogs/Accounts",
      featureName: ''
    };
    this.gridRef = React.createRef();
  }
  componentDidMount = async () => {
    this.auditlogsTrack();
    this.props.dispatch(getScreenName({getScreen:null}))
    this.TransactionFeatureSearch(this.props.userProfile?.userName);
  };
  auditlogsTrack = () => {
    apicalls.trackEvent({ "Type": 'User', "Action": 'Audit logs page view', "Username": this.props.userProfileInfo?.userName, "customerId": this.props.userProfileInfo?.id, "Feature": 'Audit Logs', "Remarks": 'Audit logs page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Audit Logs' });
  }
  gridColumns = [
    { field: "date", title: apicalls.convertLocalLang('Date'), filter: true, isShowTime: true, filterType: "date", width: 360 },
    { field: "feature", title: apicalls.convertLocalLang('Features'), filter: true, width: 360 },
    { field: "action", title: apicalls.convertLocalLang('Action'), width: 360, filter: true },
    { field: "description", title: "Description", filter: true, width: 620 },
    { field: "", title: "", width: 100, customCell: (props) => (<td><Tooltip title="More Info"><div className="icon md info c-pointer" onClick={() => this.showMoreAuditLogs(props)}></div></Tooltip></td>) },
  ]
  showMoreAuditLogs = (e) => {
    this.fetchAuditLoginfo(e.dataItem.id, e);
  }
  fetchAuditLoginfo = async (id, e) => {
    this.setState({
      ...this.state, isLoading: false, moreAuditLogs: true, featureName: e.dataItem.feature
    })
    let res = await getAuditLogInfo(id);
    if (res.ok) {
      this.setState({
        ...this.state, logRowData: res.data, isLoading: false
      })
    }
  }
  hideMoreAuditLogs = () => {
    this.setState({
      moreAuditLogs: false, logRowData: {}
    })
  }
  backToDashboard=()=>{
    if (!this.props?.userProfile?.isKYC) {
        this.props.history.push("/notkyc");
        return;
    }
      else{
        this.props.history.push("/");
      }
}
  TransactionUserSearch = async (userVal) => {
    let response = await userNameLuSearch(userVal);
    if (response.ok) {
      this.setState({
        userData: response.data,
      });
    }
  };

  TransactionFeatureSearch = async (userVal) => {
    let response = await getFeatureLuSearch(userVal);
    if (response.ok) {
      this.setState({
        featureData: response.data
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

  handleChange = (val, id) => {
    let { searchObj } = this.state;
    searchObj[id] = val;
    this.setState({ ...this.state, searchObj: searchObj });
  };

  handleDateChange = (prop, val) => {
    let { searchObj, customFromdata, customTodate } = this.state;
    searchObj[val] = new Date(prop);
    this.setState({ ...this.state, searchObj, fromdate: customFromdata, todate: customTodate });

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
    values.fromdate = moment(values.fromdate).format('MM/DD/YYYY');
    values.todate = moment(values.todate).format('MM/DD/YYYY');
    timeSpanfromdate = values.fromdate;
    timeSpantodate = values.todate;
    selectedTimespan = moment(timeSpanfromdate).format('DD/MM/YYYY') + " - " + moment(timeSpantodate).format('DD/MM/YYYY');
    this.formRef.current.setFieldsValue({ ...this.state, selectedTimespan });
    this.setState({ ...this.state, selectedTimespan, timeSpanfromdate, timeSpantodate, customFromdata, customTodate, modal: false, message: '' });
    this.formDateRef.current.resetFields();
  };

  handleCancel = e => {
    let { searchObj, customFromdata, customTodate } = this.state;
    if (customFromdata && customTodate) {
      this.setState({ modal: false, selection: [], check: false, message: '' });
    } else {
      this.setState({ ...this.state, searchObj: { ...searchObj, timeSpan: "Last 1 Day", fromdate: '', todate: '' }, modal: false, selection: [], check: false, isCustomDate: false, message: '' });
      this.formRef.current.setFieldsValue({ ...searchObj, timeSpan: "Last 1 Day", fromdate: '', todate: '' })
      this.formDateRef.current.resetFields();
    }
  }

  handleSearch = () => {
    let { searchObj, timeSpanfromdate, timeSpantodate } = this.state;
    if (searchObj.timeSpan === "Custom") {
      searchObj.fromdate = moment(timeSpanfromdate).format('MM-DD-YYYY');
      searchObj.todate = moment(timeSpantodate).format('MM-DD-YYYY');
    }
    this.setState({ ...this.state, searchObj }, () => { this.gridRef.current.refreshGrid(); });
  };

  render() {
    const { gridUrl, searchObj, featureData, timeListSpan, moreAuditLogs, logRowData, isLoading } = this.state;

    const options3 = timeListSpan.map((d) => (
      <Option key={d} value={d}>{d}</Option>
    ));

    return (
      <>
        <Drawer
          title={[<div className="side-drawer-header">
            <span className="grid-title"><Translate content="AuditLogs" component={Drawer.span} className="text-white" /></span>
            <div className="text-center fs-14"></div>
            <span onClick={this.props.onClose} className="icon md close-white c-pointer" />
          </div>]}
          placement="right"
          closable={false}
          width="100%"
          onClose={this.props.onClose}
          visible={this.props.showDrawer}
          className="side-drawer-full custom-gridresponsive addressbook-content"
          destoryOnClose={true}
        >
           </Drawer>
           <div className="main-container grid-demo">
			<div className="backbtn-arrowmb" ><span className="icon md leftarrow c-pointer backarrow-mr" onClick={()=>this.backToDashboard()}/><span className="back-btnarrow  c-pointer" onClick={()=>this.backToDashboard()} >Back</span></div>
      <span className="grid-title"><Translate content="AuditLogs" component={Drawer.span} className="text-white" /></span>
      </div>
          <div className="cust-list main-container">
            <Form
              className="ant-advanced-search-form form form-bg search-bg pt-8 pb-30 customaudit-select"
              autoComplete="off"
              ref={this.formRef}
            >
              <Row className="align-center">
                <Col xs={24} sm={24} md={6} xl={6} className="px-8">
                  <Form.Item
                    name="timeSpan"
                    className="input-label selectcustom-input mb-0"
                    label={<Translate content="TimeSpan" component={Form.label} className="label-style" />}
                  >
                    <Select
                      className="cust-input mb-0 custom-search"
                      dropdownClassName="select-drpdwn"
                      //showSearch
                      defaultValue="Last 1 Day"
                      onChange={(e) => this.handleTimeSpan(e, 'timeSpan')}
                      placeholder="Time Span"
                    >
                      {options3}
                    </Select>
                  </Form.Item>
                </Col>

                {this?.state?.isCustomDate ? <Col xs={24} sm={24} md={6} xl={6} className="px-8">
                  <Form.Item
                    name="selectedTimespan"
                    className="input-label selectcustom-input mb-0"
                    label="Selected timespan"
                  >
                    <Input disabled placeholder="DD/MM/YYYY" className="cust-input cust-adon mb-0" addonAfter={<i className="icon md date-white c-pointer" onClick={(e) => { this.datePopup(e, 'searchObj') }} />} />
                  </Form.Item>
                </Col> : ""}
                <Col xs={24} sm={24} md={6} xl={6}  className="px-8">
                  <Form.Item
                    name="feature"
                    className="input-label selectcustom-input mb-0"
                    label={<Translate content="Features" component={Form.label} className="label-style" />}
                  >
                    <Select
                      defaultValue="All Features"
                      className="cust-input mb-0"
                      dropdownClassName="select-drpdwn"
                      onChange={(e) => {this.TransactionFeatureSearch(e, "feature");this.handleChange(e, 'feature');}}
                    >
                      <Option value="All Features">All Features</Option>
                      {featureData?.forEach((item, idx) => {
                        if (item.groupName === "User Features") {
                          return <Option key={idx} value={item.name}>{item.name}</Option>
                        }
                      })}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} sm={24} md={3} className="px-8">
                  <Button
                    type="primary"
                    className="primary-btn px-24 search-btn ant-btn-lg prime mt-16 mb-8 ant-btn pop-btn"
                    htmlType="submit"
                    onClick={this.handleSearch}
                  ><Translate content="search" />
                  <span class="icon md search-angle"></span>
                  </Button>
                </Col>
              </Row>
            </Form>
          </div>
          <List className=""
            url={gridUrl} additionalParams={searchObj} ref={this.gridRef}
            key={gridUrl}
            columns={this.gridColumns}
          />
          <Modal
            title={<Translate content="Custom_Dates" component={Modal.title} />}
            className="widthdraw-pop"
            visible={this.state.modal}
            closeIcon={<Tooltip title="Close"><span className="icon md close c-pointer" onClick={this.handleCancel} /></Tooltip>}
            footer={null}
          >
            <div>
              {this.state.stateLoading && <Loader />}
              <Form
                autoComplete="off"
                onFinish={(e) => this.handleOk(e, "timeSpan")}
                ref={this.formDateRef}
              >
                {this.state?.message && <Alert showIcon type="info" description={this.state?.message} closable={false} />}
                <div className="">
                  <Form.Item
                    name="fromdate"
                    className="input-label"
                    style={{ marginLeft: 0 }}
                    label={<Translate content="Start_Date" component={Form.label} className="ml-8" />}
                    rules={[
                      { required: true, message: "Is required" }
                    ]}
                  >
                    <DatePicker
                      format={"DD/MM/YYYY"}
                      placeholder={apicalls.convertLocalLang('Select_Date')}
                      onChange={(e) => this.handleDateChange(e, 'fromdate')}
                      className="cust-input mb-0" style={{ width: '100%' }} />
                  </Form.Item>

                  <Form.Item
                    name="todate"
                    className="input-label"
                    style={{ marginLeft: 0 }}
                    label={<Translate content="End_Date" component={Form.label} className=" ml-8" />}
                    rules={[
                      { required: true, message: apicalls.convertLocalLang('is_required') }, {
                        type: "date", validator: async (rule, value, callback) => {
                          if (value) {
                            if (new Date(value) < moment(searchObj.fromdate).format('DD/MM/YYYY')) {
                              throw new Error("Start date must be less than or equal to the end date.")
                            } else {
                              callback();
                            }
                          }
                        }
                      }
                    ]}
                  >
                    <DatePicker
                      className="cust-input mb-0"
                      placeholder={apicalls.convertLocalLang('Select_Date')}
                      onChange={(e) => this.handleDateChange(e, 'todate')}
                      format={"DD/MM/YYYY"}
                      style={{ width: '100%' }}
                    />
                  </Form.Item>
                </div>
                <Form.Item className="mb-0">
                  <div className="text-right">
                  <Button type="button" block key="submit" className="primary-btn pop-btn detail-popbtn paynow-btn-ml" htmlType="submit"><span><Translate content="ok" /></span></Button>
                    <Button type="button" block className="cust-cancel-btn detail-popbtn paynow-btn-ml" onClick={this.handleCancel} ><span><Translate content="cancel" /></span></Button>         
                  </div>
                </Form.Item>
              </Form>
            </div>
          </Modal>

        <Drawer
          title={[<div className="side-drawer-header">
            <span />
            <div className="text-center fs-16">
              <div className="drawer-maintitle rec-bottom">{this.state.featureName}</div>
            </div>
            <span onClick={this.hideMoreAuditLogs} className="icon md close-white c-pointer" />
          </div>]}
          placement="right"
          closable={true}
          visible={moreAuditLogs}
          closeIcon={null}
          onClose={this.hideMoreAuditLogs}
          className="side-drawer"
          destoryOnClose={true}
        >
          {(isLoading && (logRowData?.browser == null) || (logRowData?.location == null) || (logRowData?.ip == null )|| 
            logRowData?.deviceType == null) ? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={apicalls.convertLocalLang('No_data')} />
            : <><div className="coin-info">
            <Text>City</Text>
            <Text>{logRowData?.location?.city}</Text>
          </div>
            <div className="coin-info">
              <Text>State</Text>
              <Text>{logRowData?.location?.state}</Text>
            </div>
            <div className="coin-info">
              <Text>Country</Text>
              <Text>{logRowData?.location?.countryName}</Text>
            </div>
            <div className="coin-info">
              <Text>Postal Code</Text>
              <Text>{logRowData?.location?.postal}</Text>
            </div>
            <div className="coin-info">
              <Text>Latitude</Text>
              <Text>{logRowData?.location?.latitude}</Text>
            </div>
            <div className="coin-info">
              <Text>Longitude</Text>
              <Text>{logRowData?.location?.longitude}</Text>
            </div>
            <div className="coin-info">
              <Text>Browser</Text>
              <Text>{logRowData?.browser}</Text>
            </div>
            <div className="coin-info">
              <Text>Device Type</Text>
              <Text style={{ textTransform: 'capitalize' }}>{logRowData?.deviceType?.type}</Text>
            </div>
            <div className="coin-info">
              <Text>Device Name</Text>
              <Text>{logRowData?.deviceType?.name}</Text>
            </div>
            <div className="coin-info">
              <Text>Device Version</Text>
              <Text>{logRowData?.deviceType?.version?.replace("null","")}</Text>
            </div></>}

        </Drawer>
      </>
    );
  }
}

const connectStateToProps = ({ userConfig }) => {
  return { userProfile: userConfig.userProfileInfo }
}

export default connect(connectStateToProps, (dispatch) => { return { dispatch } })(AuditLogs);
