import React, { Component } from "react";
import {
	Drawer,
	Typography,
	Button,
	Row, Col, Select, Form,Spin
} from "antd";
import { connect } from "react-redux";
import Translate from "react-translate-component";
import apiCalls from "../../api/apiCalls";
import List from "../grid.component";
import {getTransactionSearch, getTransactionCurrency } from './api';
import { setCurrentAction } from "../../reducers/actionsReducer";
import {getFeaturePermissionsByKey} from '../shared/permissions/permissionService';
import { withRouter } from "react-router-dom";
import { setSelectedFeatureMenu } from "../../reducers/feturesReducer";

const { Option } = Select;
class TransactionsHistory extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: false,
      customerData: [],
      typeData: [],
      doctypeData: [],
      currenyData: [],
      permissions:{},
      value: "",
      searchObj: {
        type: "All",
        docType: "All",
        customerId: this.props.customer?.id,
        currency: this.props?.selectWallet || "All"
      },
      tranObj: {},
      loader: true,
      gridUrl: process.env.REACT_APP_GRID_API + `Transaction/Customers`,
    };
    this.props.dispatch(setSelectedFeatureMenu(this.props.transactionsPermissions?.featureId));
    this.gridRef = React.createRef();
  }

componentDidMount() {
  getFeaturePermissionsByKey('transactions',this.loadInfo)
    
  }

 loadInfo = () =>{
  this.permissionsInterval = setInterval(this.loadPermissions, 200);
  this.TransactionSearch();
  this.transactionCurrency();
    //this.setState({...this.state, searchObj: {...this.state.searchObj, currency: this.props?.selectWallet || "All"}})
  }

  loadPermissions = () => {
		if (this.props.transactionsPermissions) {
      this.props.dispatch(setSelectedFeatureMenu(this.props.transactionsPermissions?.featureId));
			clearInterval(this.permissionsInterval);
			let _permissions = {};
			for (let action of this.props.transactionsPermissions?.actions) {
				_permissions[action.permissionName] = action.values;
			}
			this.setState({ ...this.state, permissions: _permissions, searchObj: {...this.state.searchObj, currency: this.props?.selectWallet || "All"} },
      () => { this.gridRef.current?.refreshGrid(); }
      );
      if(!this.state.permissions?.view) {
				this.props.history.push("/accessdenied");
			}
    }
	}
  gridColumns = [
    {field: "date", title: "Date", filter: true, filterType: "date", locked: true, width: 210,
},
    { field: "docType", title: "Transaction", filter: true,  },
    { field: "wallet", title: "Wallet", filter: true,  },
    { field: "debit", title: "Debit",  filter: true, footerCell: true, dataType: 'number', filterType: "numeric" },
    { field: "credit", title: "Credit", filter: true, footerCell: true, dataType: 'number', filterType: "numeric" },
    { field: "state", title: "State", filter: true,  },
    // { field: "fromWalletCode", title: "From Wallet Code", filter: true, width: 180, },
    // { field: "fromValue", title: "From Value", width: 150, filter: true, footerCell: true, dataType: 'number', filterType: "numeric" },
    // { field: "toWalletCode", title: "To Wallet Code", filter: true, width: 150 },
    // { field: "toValue", title: "To Value", width: 150, filter: true, footerCell: true, dataType: 'number', filterType: "numeric"},
    // { field: "fromValueBefore", title: "From Before Value", width: 180, filter: true, footerCell: true, dataType: 'number', filterType: "numeric" },
    // { field: "fromValueAfter", title: "From After Value", width: 180, filter: true, footerCell: true, dataType: 'number', filterType: "numeric" },
    // { field: "toValueBefore", title: "To Before Value", width: 180, filter: true, footerCell: true, dataType: 'number', filterType: "numeric" },
    // { field: "toValueAfter", title: "To After Value", width: 150, filter: true, footerCell: true, dataType: 'number', filterType: "numeric" },
   

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
  transactionCurrency = async () => {
    let response = await getTransactionCurrency();
    if (response.ok) {
      let obj={code:"All"}
      let walletList=[];
      walletList.push(obj);
      walletList=[...walletList,...response.data]
      this.setState({
        currenyData: walletList || response.data,
      
      });
    }
  };
  handleChange = (value, prop) => {
    var val = "";
    let { customerData, searchObj } = this.state;
    if (prop == "customerId") {
      let index = customerData.findIndex(function (o) { return o.name == value; });
      val = customerData[index].id;
    }
    searchObj[prop] = prop == "customerId" ? val : value;
    this.setState({ ...this.state, searchObj });
    if(prop == "currency") {
      const searchVal = `${value ? value : "All"}`;
      this.setState({...this.state, searchObj: {...this.state.searchObj, currency: searchVal || "All"}})
    }
  };
  handleSearch = (values) => {
    let { searchObj } = this.state;
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

	
	render() {
		const { Title } = Typography;
		const { customerData, typeData, doctypeData, currenyData, gridUrl, searchObj } = this.state;
		const options1 = typeData.map((d) => (
		  <Option key={d.value} value={d.name}>{d.name}</Option>
		));
		const options2 = doctypeData.map((d) => (
		  <Option key={d.value} value={d.name}>{d.name}</Option>
		));
    const options3 = currenyData?.map((d) => (
		  <Option key={d.code} value={d.code}>{d.code}</Option>
		));
    // if(this.state.loader){
    //   return <Spin loading={true}></Spin>
    // }else{
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
            initialValues={this.state.customerData}
            className="ant-advanced-search-form form form-bg search-bg pt-8"
            autoComplete="off"
          >
            <Row >
             
              <Col xs={24} sm={24} md={7} lg={7} xl={6} className="px-8 transaction_resp">
                <Form.Item name="type" className="input-label mb-0" label="Type">
                  <Select
                    defaultValue="All"
                    className="cust-input w-100 bgwhite"
                    dropdownClassName="select-drpdwn"
                    showSearch
                    onChange={(e) => this.handleChange(e, "type")}
                    placeholder="Select Type"
                  >
                    {options1}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={7} lg={7} xl={6} className="px-8 transaction_resp">
                <Form.Item  className="input-label mb-0" label="Wallet">
                  <Select
                    value = {this.state.searchObj.currency}
                   // defaultValue={this.state.searchObj.currency}
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
              <Col xs={24} sm={24} md={7} lg={7} xl={6}  className="px-8 transaction_resp">
                <Form.Item name="docType" className="input-label mb-0" label="Transaction">
                  <Select
                    defaultValue="All"
                    className="cust-input w-100 bgwhite"
                    dropdownClassName="select-drpdwn"
                    showSearch
                    onChange={(e) => this.handleChange(e, "docType")}
                    placeholder="Select Doc Type"
                  >
                    {options2}
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} sm={24} md={3} lg={3} xl={3}  className=" text-right transaction_resp">
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
         columns={this.gridColumns}
         showExcelExport ={this.state.permissions?.ExcelExport}
         excelFileName = {'Transactions'}
        />
				</Drawer>
			   </>
			   
    );
   // }
  }
}
const connectStateToProps = ({ userConfig,menuItems }) => {
	return { customer: userConfig.userProfileInfo,transactionsPermissions: menuItems?.featurePermissions.transactions };
};
const connectDispatchToProps = dispatch => {
  return {
     setAction: (val) => {
         dispatch(setCurrentAction(val))
       },
     dispatch 
 } 
}
export default connect(connectStateToProps,connectDispatchToProps)(withRouter(TransactionsHistory));
