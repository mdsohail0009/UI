import React, { Component } from "react";
import { connect } from "react-redux";
import { Drawer, Typography, Row, Col, Select, Button, Form, DatePicker, Modal, Tooltip, Input, message} from "antd";
import List from "../grid.component";
import Loader from '../../Shared/loader'
import { userNameLuSearch, getFeatureLuSearch } from './api';
import * as _ from 'lodash';
import moment from 'moment';


const { Title } = Typography;
const { Option } = Select;

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
      searchObj: {
        timeSpan: "Last 1 Day",
        fromdate: '',
        todate: '',
        userName: this.props.userProfile?.userName,
        feature: "All Features",
      },
      timeListSpan: ["Last 1 Day", "Last One Week", "Custom"],
      gridUrl: process.env.REACT_APP_GRID_API+"AuditLog/GetAdminLogsK",
    };

    this.gridRef = React.createRef();

  }
  gridColumns = [
    { field: "date", title: "Date", filter: true, filterType: "datetime", width: 250 },
    { field: "feature", title: "Feature", filter: true, width: 190 },
    { field: "featurePath", title: "Feature Path", filter: true, width: 230 },
    //{ field: "userName", title: "Name", filter: true, width: 250, },
    { field: "action", title: "Action", width: 200, filter: true },
    { field: "remarks", title: "Remarks",filter: true },
  ]

  componentDidMount = () => {
   this.TransactionFeatureSearch(this.props.userProfile?.userName);
  };

  TransactionUserSearch = async (userVal) => {
    let response = await userNameLuSearch(userVal);
    if (response.ok) {
      this.setState({
        userData: response.data,
        IsAdmin:false
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
    if (val == "Custom") {
      this.setState({ ...this.state, modal: true, isCustomDate: true, searchObj: searchObj })
    } else {
      this.setState({ ...this.state, searchObj: searchObj, isCustomDate: false });
    }
  }

  handleChange = (val, id) => {
    let { searchObj } = this.state;
    searchObj[id] = val;
    this.setState({ ...this.state, searchObj: searchObj });
  };

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

  datePopup = (prop, val) => {
    let { searchObj,timeSpanfromdate,timeSpantodate,customFromdata, customTodate } = this.state;
    searchObj.fromdate = new Date(timeSpanfromdate)
    searchObj.fromdate = new Date(timeSpantodate)
    searchObj.fromdate = moment(timeSpanfromdate).format('DD/MM/YYYY');
    searchObj.todate = moment(timeSpantodate).format('DD/MM/YYYY');
    this.formDateRef.current.setFieldsValue({ fromdate: customFromdata, todate: customTodate })
    this.setState({ ...this.state, modal: true, searchObj });
  }

  handleOk = (values) => {
    let { selectedTimespan, timeSpanfromdate, timeSpantodate, customFromdata, customTodate } = this.state;
    if(moment(values.fromdate).format('DD/MM/YYYY') > moment(values.todate).format('DD/MM/YYYY') ) {
     return message.error({
       content: 'Start date must be less than or equal to the end date.',
       className: 'custom-msg',
       duration: 1
   });
   }
    customFromdata = values.fromdate;
    customTodate = values.todate;
    values.fromdate = moment(values.fromdate).format('MM/DD/YYYY');
    values.todate = moment(values.todate).format('MM/DD/YYYY');
    timeSpanfromdate = values.fromdate;
    timeSpantodate = values.todate;
    selectedTimespan = moment(timeSpanfromdate).format('DD/MM/YYYY') + " " + "-" + " " + moment(timeSpantodate).format('DD/MM/YYYY');
    this.formRef.current.setFieldsValue({ ...this.state, selectedTimespan })
    this.setState({ ...this.state, selectedTimespan, timeSpanfromdate, timeSpantodate, customFromdata, customTodate, modal: false, });
  };

  handleCancel = e => {
    this.setState({ modal: false, selection: [], check: false, });
   // this.setState({ ...this.state, searchObj: searchObj, isCustomDate: false });
  }

  handleSearch = (values) => {
    let { searchObj, timeSpanfromdate, timeSpantodate } = this.state;
    if (searchObj.timeSpan == "Custom") {
      // searchObj.fromdate = new Date(timeSpanfromdate)
       //searchObj.todate = new Date(timeSpantodate)
       searchObj.fromdate = moment(timeSpanfromdate).format('MM/DD/YYYY');
       searchObj.todate = moment(timeSpantodate).format('MM/DD/YYYY');
       }
    this.setState({ ...this.state, searchObj }, () => { this.gridRef.current.refreshGrid(); });
  };

  render() {
    const { gridUrl, searchObj, featureData, userData, timeListSpan} = this.state;

    // const options1 = featureData.map((d) => (
    //   <Option key={d} value={d}>{d}</Option>
    // ));
    const options2 = userData.map((d) => (
      <Option key={d.name} value={d.code}>{d.name}</Option>
    ));
    const options3 = timeListSpan.map((d) => (
      <Option key={d} value={d}>{d}</Option>
    ));

    return (
      <>
       <Drawer
          title={[<div className="side-drawer-header">
            <span className="text-white">Audit Logs</span>
            <div className="text-center fs-14"></div>
            <span onClick={this.props.onClose} className="icon md close-white c-pointer" />
          </div>]}
          placement="right"
          closable={false}
          width="100%"
          onClose={this.props.onClose}
          visible={this.props.showDrawer}
          className="side-drawer-full"
        >
        <div>
          <Form
            className="ant-advanced-search-form form form-bg search-bg pt-8 pb-30"
            autoComplete="off"
            ref={this.formRef}
          >
            <Row style={{ alignItems: 'flex-end' }}>
              <Col sm={24} md={7} className="px-8">
                <Form.Item
                  name="timeSpan"
                  className="input-label selectcustom-input mb-0"
                  label="Time Span"
                >
                  <Select
                     className="cust-input mb-0 custom-search"
                     dropdownClassName="select-drpdwn"
                    showSearch
                    defaultValue="Last 1 Day"
                    onChange={(e) => this.handleTimeSpan(e, 'timeSpan')}
                    placeholder="Time Span"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {options3}
                  </Select>
                </Form.Item>
              </Col>

              {this?.state?.isCustomDate ? <Col sm={24} md={7} className="px-8">
                <Form.Item
                  name="selectedTimespan"
                  className="input-label selectcustom-input mb-0"
                  label="Selected timespan"
                >
                  <Input disabled className="cust-input cust-adon mb-0" addonAfter={<i className="icon md date-white c-pointer" onClick={(e) => { this.datePopup(e, 'searchObj') }} />} />
                </Form.Item>
              </Col> : ""}
              {/* <Col sm={24} md={7} className="px-8">
                <Form.Item
                  name="feature"
                  className="input-label selectcustom-input mb-0"
                  label="Features"
                >
                  <Select
                   defaultValue="All Features"
                   className="cust-input mb-0"
                   dropdownClassName="select-drpdwn"
                    showSearch
                    onChange={(e) => this.TransactionFeatureSearch(e, "feature")}
                    onChange={(e) => this.handleChange(e, 'feature')}
                    placeholder="Select Features"
                    optionFilterProp="children"
                    filterOption={(input, option) =>
                      option.children
                        .toLowerCase()
                        .indexOf(input.toLowerCase()) >= 0
                    }
                    filterSort={(optionA, optionB) =>
                      optionA.children
                        .toLowerCase()
                        .localeCompare(optionB.children.toLowerCase())
                    }
                  >
                    {options1}

                  </Select>
                </Form.Item>
              </Col> */}

              <Col sm={24} md={7} className="px-8">
                <Form.Item
                   name="feature"
                   className="input-label selectcustom-input mb-0"
                   label="Features"
                >
                  <Select
                    defaultValue="All Features"
                    className="cust-input mb-0"
                    dropdownClassName="select-drpdwn"
                    onChange={(e) => this.TransactionFeatureSearch(e, "feature")}
                    onChange={(e) => this.handleChange(e, 'feature')}
                  >
                   <Option value="All Features">All Features</Option>
                      {featureData?.map((item, idx) => {
                        if (item.groupName == "User Features") {
                          return <Option key={idx} value={item.name}>{item.name}</Option>
                        }
                      })}
                  </Select>
                </Form.Item>
              </Col>

              <Col sm={24} md={3} className="px-8">
                <Button
                  type="primary"
                  className="primary-btn px-24 search-btn custom-btn prime mt-16 mb-8"
                  htmlType="submit"
                  onClick={this.handleSearch}
                >Search
                </Button>
              </Col>
            </Row>
          </Form>
        </div>
        <List
          url={gridUrl} additionalParams={searchObj} ref={this.gridRef}
          key={gridUrl}
          columns={this.gridColumns}
        />
        <Modal
          title="Custom Dates"
          className="widthdraw-pop"
          visible={this.state.modal}
          closeIcon={<Tooltip title="Close"><span className="icon md close" onClick={this.handleCancel} /></Tooltip>}
          footer={null}
        >
          <div className="">
            {this.state.stateLoading && <Loader />}
            <Form
              className="ant-advanced-search-form"
              autoComplete="off"
              onFinish={(e) => this.handleOk(e, "timeSpan")}
              ref={this.formDateRef}
            >
              <Row gutter={24} className="mb-24 pb-24 border-bottom">
                <Col xs={24} sm={24} md={12} className="mb-24">
                  <Form.Item
                    name="fromdate"
                    className="input-label ml-0"
                    label="Start Date"
                    rules={[
                      { required: true, message: "Is required" }, {
                          type: "date", validator: async (rule, value, callback) => {
                              if (value && searchObj.fromdate) {
                              }
                          }
                      }
                  ]}
                  >
                    <DatePicker 
                    format={"DD/MM/YYYY"} 
                    onChange={(e) => this.handleDateChange(e, 'fromdate')}
                    className="cust-input mb-0" style={{width:'100%'}}/>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12} className="mb-24">
                  <Form.Item
                    name="todate"
                    className="input-label ml-0"
                    label="End Date"
                    rules={[
                      { required: true, message: "Is required" }, {
                          type: "date", validator: async (rule, value, callback) => {
                              if (value) {
                                  if (new Date(value) < searchObj.fromdate) {
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
                    onChange={(e) => this.handleDateChange(e, 'todate')}
                    format={"DD/MM/YYYY"} 
                    style={{width:'100%'}}
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item className="mb-0">
                <div className="text-right">
                  <Button type="button" className="c-pointer text-center ant-btn-lg text-white-30 pop-cancel fw-400 text-captz text-center mr-12" onClick={this.handleCancel} ><span>Cancel</span></Button>
                  <Button type="button" key="submit" className="c-pointer pop-btn ant-btn px-24" htmlType="submit"><span>Ok</span></Button>
                </div>
              </Form.Item>
            </Form>
          </div>
        </Modal>
        </Drawer>
      </>
    );
  }
}

const connectStateToProps = ({ userConfig }) => {
  return { userProfile: userConfig.userProfileInfo }
}

export default connect(connectStateToProps, (dispatch) => { return { dispatch } })(AuditLogs);
