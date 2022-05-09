import React, { Component } from 'react';
import { Drawer, Tabs, Collapse, Typography ,Row, Col, Select, Button, Form} from 'antd';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import apiCalls from '../../api/apiCalls';
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
    // this.props.thref(this)
    // apiCalls.trackEvent({ "Type": 'User', "Action": 'Transactions All page view', "Username": this.props.member?.userName, "MemeberId": this.props.member?.id, "Feature": 'Transactions', "Remarks": 'Transactions All page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Transactions' });
  }

  
  gridColumns = [
    {field: "date", title: "Date", filter: true, isShowTime: true, filterType: "date", locked: true, width: 210,
},
    // { field: "memberName", title: "Name", filter: true, width: 150, },
    // { field: "userName", title: "User Name", filter: true, width: 200 },
    // { field: "memberEmail", title: "Email", filter: true, width: 220 },
    { field: "docType", title: "Doc Type", filter: true, width: 120, },
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
    debugger
    let response = await getTransactionSearch();
    if (response.ok) {
      console.log(response.data)
      this.setState({
        typeData: response.data.types,
        doctypeData: response.data.docTypes,
      });
    }
  };
  handleChange = (value, prop) => {
    debugger
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
    debugger
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
    // const { BuySellURL, SwapURL, WithdrawURL, DepositURL, DepositCryptoURL, WithdrawCryptoURL } = this.state
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
                    className="cust-input w-100 bgwhite"
                    showSearch
                    onChange={(e) => this.handleChange(e, "type")}
                    placeholder="Select Type"
                  >
                    {options1}
                  </Select>
                </Form.Item>
              </Col>
              <Col sm={24} md={7} className="px-8">
                <Form.Item name="docType" className="input-label mb-0" label="Doc Type">
                  <Select
                    defaultValue="All"
                    className="cust-input w-100 bgwhite"
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
                {/* <Button
                            className="pop-btn px-24"
                            style={{  height: 40 }}
                            // onClick={this.handleSearch}
                        >
                          Excel Export
                        </Button> */}
              
            </Row>
          </Form>
        </div>
        <List
         url={gridUrl} additionalParams={searchObj} ref={this.gridRef}
         key={gridUrl}
         columns={this.gridColumns}
         showExcelExport ={true}
        />
        </Drawer>
        {/* <Drawer code commented date: 06-05-2022
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
          <div className="transaction-tabs">
            <Tabs className="crypto-list-tabs mt-0" activeKey={this.state.activeTab} onChange={this.changeTab}>
              <TabPane
                key='1'
                className="alltab-space"
                onClick={() => this.changeTab("1")}
                tab={<Translate content="All" component={Tabs.TabPane.tab} className="custom-font fw-400 fs-14" />}
              >

                {this.state.activeTab === '1' && <><Collapse onChange={collapseGrids} className="mb-16">
                  <Panel
                    header={<Translate content="BuyandSell" component={Collapse.Panel.header} className="custom-font fw-400 fs-14 text-white" />}
                    key="1">
                    {this.state.activeTab === '1' && <HistoryGridComponent columns={this.BuySellColmns} gridUrl={BuySellURL} params={{ memberId: this.props.member?.id }} ></HistoryGridComponent>}
                  </Panel>
                </Collapse>

                  <Collapse onChange={collapseGrids} className="mb-16">
                    <Panel
                      header={<Translate content="menu_swap" component={Collapse.Panel.header} className="custom-font fw-400 fs-14 text-white " />}
                      key="2">
                      {this.state.activeTab === '1' && <HistoryGridComponent columns={this.SwapColmns} gridUrl={SwapURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                    </Panel>
                  </Collapse>

                  <Collapse onChange={collapseGrids} className="mb-16">
                    <Panel
                      header={<Translate content="DepositandFiat" component={Collapse.Panel.header} className="custom-font fw-400 fs-14 text-white " />}
                      key="3">
                      {this.state.activeTab === '1' && <HistoryGridComponent columns={this.DepositColmns} gridUrl={DepositURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                    </Panel>
                  </Collapse>


                  <Collapse onChange={collapseGrids} className="mb-16">
                    <Panel
                      header={<Translate content="DepositandCrypto" component={Collapse.Panel.header} className="custom-font fw-400 fs-14 text-white " />}
                      key="4">
                      {this.state.activeTab === '1' && <HistoryGridComponent columns={this.depositCryptoColomns} gridUrl={DepositCryptoURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                    </Panel>
                  </Collapse>

                  <Collapse onChange={collapseGrids} className="mb-16">
                    <Panel
                      header={<Translate content="withdrawFiat" component={Collapse.Panel.header} className="custom-font fw-400 fs-14 text-white " />}
                      key="5">
                      {this.state.activeTab === '1' && <HistoryGridComponent columns={this.withdrawcolumns} gridUrl={WithdrawURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                    </Panel>
                  </Collapse>

                  <Collapse onChange={collapseGrids} className="mb-16">
                    <Panel
                      header={<Translate content="withdrawCrypto" component={Collapse.Panel.header} className="custom-font fw-400 fs-14 text-white " />}
                      key="6">
                      {this.state.activeTab === '1' && <HistoryGridComponent columns={this.withdrwCryptoColomns} gridUrl={WithdrawCryptoURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                    </Panel>
                  </Collapse></>}
              </TabPane>

              <TabPane
                tab={<Translate content="BuyandSell" component={Tabs.TabPane.tab} className="custom-font fw-400 fs-14" />}
                key='2'
                onClick={() => this.changeTab("2")}>
                {this.state.activeTab === '2' && <HistoryGridComponent columns={this.BuySellColmns} gridUrl={BuySellURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
              <TabPane
                tab={<Translate content="menu_swap" component={Tabs.TabPane.tab} className="custom-font fw-400 fs-14" />}
                key='3'
                onClick={() => this.changeTab("3")}>
                {this.state.activeTab === '3' && <HistoryGridComponent columns={this.SwapColmns} gridUrl={SwapURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
              <TabPane tab={<Translate content="DepositandFiat" component={Tabs.TabPane.tab} className="custom-font fw-400 fs-14" />} key='4' onClick={() => this.changeTab("4")}>
                {this.state.activeTab === '4' && <HistoryGridComponent columns={this.DepositColmns} gridUrl={DepositURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
              <TabPane tab={<Translate content="DepositandCrypto" component={Tabs.TabPane.tab} className="custom-font fw-400 fs-14 " />} key='5' onClick={() => this.changeTab("5")}>
                {this.state.activeTab === '5' && <HistoryGridComponent columns={this.depositCryptoColomns} gridUrl={DepositCryptoURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
              <TabPane tab={<Translate content="withdrawFiat" component={Tabs.TabPane.tab} className="custom-font fw-400 fs-14 " />} key='6' onClick={() => this.changeTab("6")}>
                {this.state.activeTab === '6' && <HistoryGridComponent columns={this.withdrawcolumns} gridUrl={WithdrawURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
              <TabPane tab={<Translate content="withdrawCrypto" component={Tabs.TabPane.tab} className="custom-font fw-400 fs-14" />} key='7' onClick={() => this.changeTab("7")}>
                {this.state.activeTab === '7' && <HistoryGridComponent columns={this.withdrwCryptoColomns} gridUrl={WithdrawCryptoURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
            </Tabs>
          </div>

        </Drawer> */}
      </>
    );
  }
}
const connectStateToProps = ({ userConfig }) => {
  return { member: userConfig.userProfileInfo }
}
export default connect(connectStateToProps)(TransactionsHistory)