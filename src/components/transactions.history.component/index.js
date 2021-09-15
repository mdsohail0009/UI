import React, { Component } from 'react';
import { Drawer, Tabs, Table, Collapse} from 'antd';
import HistoryGridComponent from './HistoryGridComponent';
import { connect } from 'react-redux';

const { TabPane } = Tabs;
const { Panel } = Collapse;


function collapseGrids(key) {
  console.log(key);
}

const columns = [
  { field: "firstName", title: "User Name", width: 220,filter: true, },
  { field: "walletCode", title: "Wallet Code", width: 150,filter: true, },
  { field: "txDate", title: "Tax Date", width: 180, filterType: "date", filter: true, },
  { field: "type", title: "Type", width: 150,filter: true, },
  { field: "docType", title: "Doc Type", width: 150,filter: true, },
  { field: "credit", title: "Credit", filter: true, width: 160 },
  { field: "debit", title: "Debit", filter: true, width: 180 },
  { field: "description", title: "Description", filter: true, width: 220 }
];


class TransactionsHistory extends Component { 
  componentDidMount(){
    this.props.thref(this)
  }
  state = {
    gridUrl: process.env.REACT_APP_GRID_API+"Transaction/TransactionHistoryk", activeTab: "1"
  }
  setKy=()=>{
    this.setState({activeTab:'1'})
  }
  changeTab = activeKey => {
    this.setState({
      activeTab: activeKey
    });
  };
  render() {
    const {gridUrl}=this.state
    return (
      <>
        <Drawer
          title={[<div className="side-drawer-header">
            <span className="text-white">Transactions</span>
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
          <div className="transaction-tabs">
            <Tabs className="crypto-list-tabs" activeKey={this.state.activeTab} onChange={this.changeTab}>
              <TabPane tab="All" key='1' className="alltab-space" onClick={()=>  this.changeTab("1")}>
              <Collapse onChange={collapseGrids} className="mb-16">
                <Panel header="Buy/Sell" key="1">
                  {/* <Table columns={columns}   /> */}
                  <HistoryGridComponent  columns={columns} gridUrl={gridUrl} params={{memberId:this.props.member?.id,screenName: 'BuyandSell' }}></HistoryGridComponent>
                </Panel>
                </Collapse>

                <Collapse onChange={collapseGrids} className="mb-16">
                <Panel header="Swap" key="2">
                <HistoryGridComponent  columns={columns} gridUrl={gridUrl} params={{memberId:this.props.member?.id,screenName: 'Swap' }}></HistoryGridComponent>
                </Panel>
                </Collapse>

                <Collapse onChange={collapseGrids}>
                <Panel header="Deposit/Withdraw" key="3">
                <HistoryGridComponent  columns={columns} gridUrl={gridUrl} params={{memberId:this.props.member?.id,screenName: 'DepositandWithdraw' }}></HistoryGridComponent>
                </Panel>
              </Collapse>
              </TabPane>

              <TabPane tab="Buy/Sell" key='2' onClick={()=>  this.changeTab("2")}>
              <HistoryGridComponent  columns={columns} gridUrl={gridUrl} params={{memberId:this.props.member?.id,screenName: 'BuyandSell' }}></HistoryGridComponent>
              </TabPane>
              <TabPane tab="Swap" key='3' onClick={()=>  this.changeTab("3")}>
              <HistoryGridComponent  columns={columns} gridUrl={gridUrl} params={{memberId:this.props.member?.id,screenName: 'Swap' }}></HistoryGridComponent>
              </TabPane>
              <TabPane tab="Deposit/Withdraw" key='4' onClick={()=> this.changeTab("4")}>
              <HistoryGridComponent  columns={columns} gridUrl={gridUrl} params={{memberId:this.props.member?.id,screenName: 'DepositandWithdraw' }}></HistoryGridComponent>
              </TabPane>
            </Tabs>
            </div>

          {/* <Table columns={columns}   /> */}
        </Drawer>
      </>
    );
  }
}
const connectStateToProps = ({ userConfig }) => {
  return {  member: userConfig.userProfileInfo }
}
export default connect(connectStateToProps)(TransactionsHistory)