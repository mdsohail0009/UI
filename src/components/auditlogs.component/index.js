import React, { Component } from "react";
import { connect } from "react-redux";
import { Drawer, Typography, Row, Col, Select, Button, Form, DatePicker, Modal, Tooltip, Input, Icon} from "antd";
import List from "../grid.component";
//import { fetchUsersUpdate } from "../../reducers/auditlogReducer";
import Loader from '../../Shared/loader'
import apiCalls from "../../api/apiCalls";
//import { setBreadcrumb } from '../../reducers/breadcrumbReducer';
import * as _ from 'lodash';
import moment from 'moment';


const { Title } = Typography;
const { Option } = Select;

class AuditLogs extends Component {
  formRef = React.createRef();
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      userData: [],
      featureData: [],
      selectedDateObj: {},
      value: "",
      modal: false,
      showElement: false,
      selectedTimespan: "",
      timeSpanfromdate:"",
      timeSpantodate:"",
      isCustomDate: false,
      searchObj: {
        timeSpan: "Last One Week",
        fromdate: '',
        todate: '',
        userName: "All Users",
        feature: "All Features",
      },
      tranObj: {},
      timeSpan: ["Last 1 Day", "Last One Week", "Custom"],
      gridUrl: process.env.REACT_APP_GRID_API + "AuditLog/GetAdminLogsK",
    };

    this.gridRef = React.createRef();
   
  }
  gridColumns = [
    { field: "date", title: "Date", filter: true, filterType: "date", width: 150 },
    { field: "feature", title: "Feature", filter: true, width: 160 },
    { field: "featurePath", title: "Feature Path", filter: true, width: 150 },
    { field: "userName", title: "Name", filter: true },
    { field: "action", title: "Action", width: 150, filter: true },
    { field: "remarks", title: "Remarks", width: 250, filter: true },
  ]
  onFocus = () => {
    console.log('focus');
  }

  componentDidMount = () => {
    //this.TransactionUserSearch();
    this.TransactionFeatureSearch();
  };

  // update = (e) => {
  //   const items = e.dataItem;
  //   const val = items.id;
  //   this.props.dispatch(setBreadcrumb({ key: '/auditlogs/' + val, val: items.userName }))
  //   this.props.history.push("/auditlogs/" + val);
  // };

  TransactionUserSearch = async (userVal) => {
    let response = await apiCalls.userNameLuSearch(userVal);
    if (response.ok) {
      this.setState({
        userData: response.data,
      });
    }
  };

  TransactionFeatureSearch = async () => {
    let response = await apiCalls.getFeatureLuSearch();
    if (response.ok) {
      this.setState({
        featureData: response.data
      });
    }
  };

  SearchGrid = async () => {
    let response = await apiCalls.getSearchGrid();
    if (response.ok) {
      console.log(response.data);
    }
  };

  handleUserChange = (event) => {
    if (event.target.value != null && event.target.value.length > 2) {
      let userVal = event.target.value
      this.TransactionUserSearch(userVal);
    }

  }

  handleChange = (val, id) => {
    debugger
    let {searchObj,timeSpanfromdate}=this.state;
    searchObj[id]=val;
    var value = val;
    if (value == "Custom") {
     // this.formRef.current.setFieldsValue({...this.state,timeSpanfromdate})
      this.setState({ modal:true,isCustomDate:true,searchObj:searchObj })
  }else{
      this.setState({ searchObj:searchObj,isCustomDate:false});
  }
  };

  handleOk = (values, id) => {
    debugger
    let { selectedTimespan,timeSpanfromdate,timeSpantodate } = this.state;
    values.fromdate = moment(values.fromdate).format('DD/MM/YYYY');
    values.todate = moment(values.todate).format('DD/MM/YYYY');
    timeSpanfromdate = values.fromdate;
    timeSpantodate = values.todate;
    selectedTimespan = timeSpanfromdate +" " + "-" + " "+ timeSpantodate;
    this.formRef.current.setFieldsValue({...this.state, selectedTimespan})
    this.setState({...this.state, selectedTimespan,timeSpanfromdate,timeSpantodate, modal: false,});
};

  handleCancel = e => {
    this.setState({ modal: false, selection: [], check: false });
}

handleSearch = (values) => {
  debugger
  let { searchObj } = this.state;
  this.setState({ ...this.state, searchObj }, () => { this.gridRef.current.refreshGrid(); });

};

  render() {
    const { gridUrl, searchObj, featureData, userData, timeSpan, isCustomDate} = this.state;

    const options1 = featureData.map((d) => (
      <Option key={d} value={d}>{d}</Option>
    ));
    const options2 = userData.map((d) => (
      <Option key={d.name} value={d.code}>{d.name}</Option>
    ));
    const options3 = timeSpan.map((d) => (
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
            className="ant-advanced-search-form form form-bg search-bg pt-8"
            autoComplete="off"
            ref={this.formRef}   
          >
            <Row style={{ alignItems: 'flex-end' }}>
              <Col sm={24} md={7} className="px-8">
                <Form.Item
                 name="timeSpan" 
                 className="input-label mb-0" 
                 label="Time Span"
                 rules={[
                  {
                      required: true,
                      message: 'Is required',
                  },
              ]}
                 >
                  <Select
                    className="cust-input w-100 bgwhite"
                    showSearch
                    onChange={(e) => this.handleChange(e, 'timeSpan')}
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
              {/* <Col sm={24} md={7} className="px-8"> */}
              <Form.Item 
                  name="selectedTimespan" 
                  className="input-label" 
                  label="Date" 
                  rules={[
                            {
                                required: true,
                                message: 'Is required',
                            },
                        ]}
                        >
                    <Input className="cust-input cust-adon" addonAfter={<i className="icon md date c-pointer" onClick={() => { this.setState({ ...this.state, modal: true })}} />} />
                  </Form.Item>
              </Col>: ""}

              <Col sm={24} md={7} className="px-8">
                <Form.Item 
                name="userName" 
                className="input-label mb-0" 
                label="Name"
                rules={[
                  {
                      required: true,
                      message: 'Is required',
                  },
              ]}
                >
                  <Select
                    defaultValue="All Users"
                    className="cust-input w-100 bgwhite"
                    showSearch
                    onKeyUp={(event) => this.handleUserChange(event, "userName")}
                    onChange={(e) => this.handleChange(e, 'userName')}
                    placeholder="Select Users"
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
                    {options2}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={24} md={7} className="px-8">
                <Form.Item 
                name="feature" 
                className="input-label mb-0" 
                label="Features"
                rules={[
                  {
                      required: true,
                      message: 'Is required',
                  },
              ]}
                >
                  <Select
                    defaultValue="All Features"
                    className="cust-input w-100 bgwhite"
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
              </Col>
              <Col sm={24} md={3} className="px-8 text-right">
                <Button
                  type="primary"
                  className="primary-btn px-24 search-btn mt-20"
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
          visible={this.state.modal}
          closeIcon={<Tooltip title="Close"><span className="icon md x" onClick={this.handleCancel} /></Tooltip>}
          footer={null}
        >
          <div className="">
            {this.state.stateLoading && <Loader />}
            <Form

          
              className="ant-advanced-search-form"
              autoComplete="off"
              onFinish={(e) => this.handleOk(e, "timeSpan")}
            >
              <Row gutter={24} className="mb-24 pb-24 border-bottom">
                <Col xs={24} sm={24} md={12} >
                <Form.Item 
                  name="fromdate" 
                  className="input-label" 
                  label="From Date"  
                  rules={[
                            {
                                required: true,
                                message: 'Is required',
                            },
                        ]}
                        >
                    <DatePicker format={"DD-MM-YYYY"} className="cust-input" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={24} md={12}>
                  <Form.Item 
                  name="todate" 
                  className="input-label" 
                  label="To Date"  
                  rules={[
                            {
                                required: true,
                                message: 'Is required',
                            },
                        ]}
                        >
                    <DatePicker className="cust-input" format={"DD-MM-YYYY"}/>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item className="mb-0">
                <div className="text-right">
                  <Button type="primary" className="primary-btn cancel-btn mr-8" onClick={this.handleCancel} > Cancel</Button>
                  <Button type="primary" key="submit" className="primary-btn" htmlType="submit"> Save</Button>
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
export default connect(null, (dispatch) => { return { dispatch } })(AuditLogs);
