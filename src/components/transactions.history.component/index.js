import React, { Component } from "react";
import {
	Drawer,
	Tabs,
	Collapse,
	Typography,
	Tooltip,
	Modal,
	Button,
	Row, Col, Select, Form
} from "antd";
import HistoryGridComponent from "./HistoryGridComponent";
import { connect } from "react-redux";
import Translate from "react-translate-component";
import apiCalls from "../../api/apiCalls";
import Info from "../shared/info";
import List from "../grid.component";
import {getTransactionSearch } from './api';
const { Option } = Select;
class TransactionsHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      memberData: [],
      typeData: [],
      doctypeData: [],
      value: "",
      searchObj: {
        type: "All",
        docType: "All",
        AccountId: this.props.member?.id
      },
      tranObj: {},
      gridUrl: process.env.REACT_APP_GRID_API + `Transaction/Accounts`,
    };
    this.gridRef = React.createRef();
  }

componentDidMount() {
    this.TransactionSearch();
  }
  gridColumns = [
    {field: "date", title: "Date", filter: true, isShowTime: true, filterType: "date", locked: true, width: 210,
},
    { field: "docType", title: "Transaction", filter: true, width: 120, },
    { field: "fromWalletCode", title: "From Wallet Code", filter: true, width: 180, },
    { field: "fromValue", title: "From Value", width: 150, filter: true, footerCell: true, dataType: 'number', filterType: "numeric" },
    { field: "toWalletCode", title: "To Wallet Code", filter: true, width: 150 },
    { field: "toValue", title: "To Value", width: 150, filter: true, footerCell: true, dataType: 'number', filterType: "numeric" },
    { field: "fromValueBefore", title: "From Before Value", width: 180, filter: true, footerCell: true, dataType: 'number', filterType: "numeric" },
    { field: "fromValueAfter", title: "From After Value", width: 180, filter: true, footerCell: true, dataType: 'number', filterType: "numeric" },
    { field: "toValueBefore", title: "To Before Value", width: 180, filter: true, footerCell: true, dataType: 'number', filterType: "numeric" },
    { field: "toValueAfter", title: "To After Value", width: 150, filter: true, footerCell: true, dataType: 'number', filterType: "numeric" },
    { field: "status", title: "State", filter: true, width: 150 },

  ]
  TransactionSearch = async () => {
    let response = await getTransactionSearch();
    if (response.ok) {
      this.setState({
        typeData: response.data.types,
        doctypeData: response.data.docTypes,
      });
    }
  };
  handleChange = (value, prop) => {
    var val = "";
    let { memberData, searchObj } = this.state;
    if (prop == "memberId") {
      let index = memberData.findIndex(function (o) { return o.name == value; });
      val = memberData[index].id;
    }
    searchObj[prop] = prop == "memberId" ? val : value;
    this.setState({ ...this.state, searchObj });
  };
  handleSearch = (values) => {
    let { searchObj } = this.state;
    this.setState({ ...this.state, searchObj },
       () => { this.gridRef.current.refreshGrid(); }
      );
    apiCalls.trackEvent({
      Type: "Admin",
      Action: "Transactions grid page view",
      Username: this.props.userConfig?.userName,
      MemeberId: this.props.userConfig?.id,
      Feature: "Transactions",
      Remarks: "Transactions grid page view",
      Duration: 1,
      Url: window.location.href,
      FullFeatureName: "Transactions"
    });

  };

	
	render() {
		const { Title } = Typography;
		const { memberData, typeData, doctypeData, gridUrl, searchObj } = this.state;
		const options1 = typeData.map((d) => (
		  <Option key={d.value} value={d.name}>{d.name}</Option>
		));
		const options2 = doctypeData.map((d) => (
		  <Option key={d.value} value={d.name}>{d.name}</Option>
		));
		return (
			<>
				 <Drawer
          title={[<div className="side-drawer-header">
            <Translate content="menu_transactions_history" component={Title} className="fs-26 fw-400 mb-0 text-white-30" />

            <span onClick={this.props.onClose} className="icon md close-white c-pointer" />
          </div>]}
          placement="right"
          closable={false}
          width="100%"
          onClose={this.props.onClose}
          visible={this.props.showDrawer}
          className="side-drawer-full custom-gridresponsive"
        >
        <div>
          <Form
            initialValues={this.state.memberData}
            className="ant-advanced-search-form form form-bg search-bg pt-8"
            autoComplete="off"
          >
            <Row >
             
              <Col sm={24} md={7} className="px-8">
                <Form.Item name="type" className="input-label mb-0" label="Type">
                  <Select
                    defaultValue="All"
                    //className="cust-input w-100 bgwhite"
                    className="cust-input mb-0"
                    dropdownClassName="select-drpdwn"
                    showSearch
                    onChange={(e) => this.handleChange(e, "type")}
                    placeholder="Select Type"
                  >
                    {options1}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={24} md={7} className="px-8">
                <Form.Item name="docType" className="input-label mb-0" label="Transaction">
                  <Select
                    defaultValue="All"
                    // className="cust-input w-100 bgwhite"
                    className="cust-input mb-0"
                    dropdownClassName="select-drpdwn"
                    showSearch
                    onChange={(e) => this.handleChange(e, "docType")}
                    placeholder="Select Doc Type"
                  >
                    {options2}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={24} md={3} className=" text-right">
                <Button
                            className="pop-btn "
                            style={{  height: 40,marginTop:"35px" }}
                            htmlType="submit"
                            onClick={this.handleSearch}
                        >
                            Search
                        </Button>
              </Col>
              
            </Row>
          </Form>
        </div>
        <List
         url={gridUrl} additionalParams={searchObj} ref={this.gridRef}
         key={gridUrl}
         columns={this.gridColumns}
         showExcelExport ={true}
         excelFileName = {'Transactions'}

        />
				</Drawer>
			   </>
			   
    );
  }
}
const connectStateToProps = ({ userConfig }) => {
	return { member: userConfig.userProfileInfo };
};
export default connect(connectStateToProps)(TransactionsHistory);
