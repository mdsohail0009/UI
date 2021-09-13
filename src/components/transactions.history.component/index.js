import React, { Component } from 'react';
import { Drawer, Tabs, Table, Collapse} from 'antd';
import HistoryGridComponent from './HistoryGridComponent';

const { TabPane } = Tabs;
const { Panel } = Collapse;


function collapseGrids(key) {
  console.log(key);
}

const columns = [
  { field: "txDate", title: "Tx Date", width: 150, filterType: "date", filter: true, },
  { field: "memberid", title: "Member Id", width: 150,filter: true, },
  { field: "credit", title: "Credit", filter: true, width: 160 },
  { field: "debit", title: "Debit", filter: true, width: 180 },
  { field: "status", title: "Status", filter: true, width: 200 },
  { field: "description", title: "Description", filter: true, width: 200 },
  { field: "transactionid", title: "Transaction Id", filter: true, width: 250 }
];


class TransactionsHistory extends Component { 
  state = {
    gridUrl: "https://tstget.suissebase.ch/api/v1/Transaction/TransactionHistoryk",key:1
  }
  
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
            <Tabs className="crypto-list-tabs">
              <TabPane tab="All" key={this.state.key} className="alltab-space">
              <Collapse defaultActiveKey={['1']} onChange={collapseGrids} className="mb-16">
                <Panel header="Buy/Sell" key="1">
                  {/* <Table columns={columns}   /> */}
                  <HistoryGridComponent  columns={columns} gridUrl={gridUrl} params={{screenName: 'Buy' }}></HistoryGridComponent>
                </Panel>
                </Collapse>

                <Collapse onChange={collapseGrids} className="mb-16">
                <Panel header="Swap" key="2">
                <HistoryGridComponent  columns={columns} gridUrl={gridUrl} params={{screenName: 'Swap' }}></HistoryGridComponent>
                </Panel>
                </Collapse>

                <Collapse onChange={collapseGrids}>
                <Panel header="Deposit/Withdraw" key="3">
                <HistoryGridComponent  columns={columns} gridUrl={gridUrl} params={{screenName: 'Deposit' }}></HistoryGridComponent>
                </Panel>
              </Collapse>
              </TabPane>

              <TabPane tab="Buy/Sell" key="2">
              <HistoryGridComponent  columns={columns} gridUrl={gridUrl} params={{screenName: 'Buy' }}></HistoryGridComponent>
              </TabPane>
              <TabPane tab="Swap" key="3">
              <HistoryGridComponent  columns={columns} gridUrl={gridUrl} params={{screenName: 'Swap' }}></HistoryGridComponent>
              </TabPane>
              <TabPane tab="Deposit/Withdraw" key="4">
              <HistoryGridComponent  columns={columns} gridUrl={gridUrl} params={{screenName: 'Deposit' }}></HistoryGridComponent>
              </TabPane>
            </Tabs>
            </div>

          {/* <Table columns={columns}   /> */}
        </Drawer>
      </>
    );
  }
}

export default TransactionsHistory