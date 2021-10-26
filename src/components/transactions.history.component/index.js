import React, { Component } from 'react';
import { Drawer, Tabs, Collapse, Typography } from 'antd';
import HistoryGridComponent from './HistoryGridComponent';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';

const { TabPane } = Tabs;
const { Panel } = Collapse;


function collapseGrids(key) {
  console.log(key);
}

class TransactionsHistory extends Component {
  componentDidMount() {
    this.props.thref(this)
  }
  state = {
    BuySellURL: process.env.REACT_APP_GRID_API + "BuySell/MemberBuyandSellK",
    SwapURL: process.env.REACT_APP_GRID_API + "Swap/MemberSwapK",
    WithdrawURL: process.env.REACT_APP_GRID_API + "Withdrawal/MemberWithdrawalFiatK",
    DepositURL: process.env.REACT_APP_GRID_API + "Deposit/MemberDepositFiatK",
    WithdrawCryptoURL: process.env.REACT_APP_GRID_API + "Withdrawal/MemberWithdrawalCryptoK",
    DepositCryptoURL: process.env.REACT_APP_GRID_API + "Deposit/MemberDepositCryptoK", activeTab: "1"
  }
  setKy = () => {
    this.setState({ activeTab: '1' })
  }
  changeTab = activeKey => {
    this.setState({
      activeTab: activeKey
    });
  };
  render() {
    const { BuySellURL, SwapURL, WithdrawURL, DepositURL, DepositCryptoURL, WithdrawCryptoURL } = this.state
    const { Paragraph,Text } = Typography;
    const { TabPane } = Tabs;
    
const withdrawcolumns = [ 
  { field: "accountType", title: <Translate content="accountType" component={Text} className=" custom-font fw-300 fs-14 text-white " />, filter: true, width: 200 },
  { field: "walletCode", title: <Translate content="Wallet" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 200 },
  { field: "amount", title: <Translate content="amount" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 220, dataType: "number", filterType: "numeric", },
  { field: "bankName", title: <Translate content="Bank_name" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 220 },
  { field: "accountNumber", title: <Translate content="Bank_account" component={Text} className="custom-font fw-300 fs-14 text-white" />, width: 220, filter: true },
  { field: "swiftCode", title:<Translate content="BIC_SWIFT_routing_number" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 250 },
  { field: "createdDate", title: <Translate content="RequestDate" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 210, footerCell: true, filterType: "date" },
  { field: "status", title:  <Translate content="Status" component={Text} className="custom-font fw-300 fs-14 text-white" />, width: 200, filter: true },
  { field: "statusRemarks", title: <Translate content="remarks" component={Text} className="custom-font fw-300 fs-14 text-white" />, width: 280, filter: true }
];

const DepositColmns = [
  { field: "refrenceId", title: <Translate content="ReferenceId" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 346 },
  { field: "currency", title: <Translate content="currency" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 210 },
  { field: "bankName", title: <Translate content="Bank_name" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 260 },
  { field: "amountDeposit", title:  <Translate content="amount" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 250 },
  { field: "date", title: <Translate content="Date" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 210, filterType: "date" },
  { field: "status", title: <Translate content="Status" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 260 },
  { field: "statusRemarks", title: <Translate content="remarks" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 460 }
]
const SwapColmns = [
  { field: "date", title: <Translate content="Date" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, filterType: "date", },
  { field: "fromWalletCode", title: <Translate content="FromWallet" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true },
  { field: "toWalletCode", title:  <Translate content="ToWallet" component={Text} className="custom-font fw-300 fs-14 text-white" />, width: 170, filter: true },
  { field: "fromValue", title:  <Translate content="FromValue" component={Text} className="custom-font fw-300 fs-14 text-white" />, width: 180, filter: true, dataType: 'number' },
  { field: "toValue", title:  <Translate content="ToValue" component={Text} className="custom-font fw-300 fs-14 text-white" />, width: 140, filter: true, dataType: 'number' },
  { field: "totalAmount", title: <Translate content="TotalAmount" component={Text} className="custom-font fw-300 fs-14 text-white" />, width: 180, filter: true, dataType: 'number' },
  { field: "amountInUsd", title: <Translate content="AmountInUsd" component={Text} className="custom-font fw-300 fs-14 text-white" />, width: 150, filter: true, dataType: 'number' },
]
const BuySellColmns = [
  { field: "date", title:<Translate content="Date" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, filterType: "date", width: 184 },
  { field: "type", title: <Translate content="Type" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 190 },
  { field: "fromWalletCode", title: <Translate content="FromWallet" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 200 },
  { field: "fromValue", title:  <Translate content="FromValue" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 190, dataType: 'number' },
  { field: "toWalletCode", title: <Translate content="ToWallet" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 190 },
  { field: "tovalue", title: <Translate content="ToValue" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 200, dataType: 'number' },
  { field: "beforeValue", title: <Translate content="BeforeValue" component={Text} className="custom-font fw-300 fs-14 text-white" />, width: 200, filter: true, dataType: 'number' },
  { field: "afterValue", title: <Translate content="AfterValue" component={Text} className="custom-font fw-300 fs-14 text-white" />, width: 200, filter: true, dataType: 'number' },
  { field: "totalAmount", title: <Translate content="TotalAmount" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 210, dataType: 'number' },
  { field: "amountInUsd", title: <Translate content="AmountInUsd" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 200, dataType: 'number' },
]
const depositCryptoColomns = [
  { field: "walletCode", title: <Translate content="Wallet" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true },
  { field: "coinName", title: <Translate content="coinName" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 180 },
  { field: "availableCoins", title: <Translate content="availableCoins" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 200 },
  { field: "fromWalletAddress", title:<Translate content="walletAddress" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 200 },
  { field: "createdDate", title:  <Translate content="RequestDate" component={Text} className="custom-font fw-300 fs-14 text-white" />, width: 150, filterType: "date", filter: true, },
]
const withdrwCryptoColomns = [
  { field: "walletCode", title:  <Translate content="Wallet" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true },
  { field: "amount", title:  <Translate content="amount" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 200, filterType: "numeric", dataType: 'number' },
  { field: "walletAddress", title:  <Translate content="walletAddress" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 200 },
  { field: "createdDate", title:  <Translate content="RequestDate" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 200, filterType: "date" },
  { field: "status", title:<Translate content="Status" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 200 },
  { field: "statusRemarks", title: <Translate content="remarks" component={Text} className="custom-font fw-300 fs-14 text-white" />, filter: true, width: 200, }
]
    return (
      <>
        <Drawer
          title={[<div className="side-drawer-header">
   
            <span className="text-white">
              <Translate content="menu_transactions_history" component={Text} className="custom-font fw-300 fs-14 text-white " /></span>

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
            <Tabs className="crypto-list-tabs mt-0" activeKey={this.state.activeTab} onChange={this.changeTab}>
           
              <TabPane
                key='1'
                className="alltab-space"
                onClick={() => this.changeTab("1")}
                tab={<Translate content="All" component={Tabs.TabPane.tab} className="custom-font fw-300 fs-14" />}
              >
               
                <Collapse onChange={collapseGrids} className="mb-16">
                  <Panel
                    header={<Translate content="BuyandSell" component={Collapse.Panel.header} className="custom-font fw-300 fs-14 text-white" />}
                    key="1">
                    {this.state.activeTab === '1' && <HistoryGridComponent columns={BuySellColmns} gridUrl={BuySellURL} params={{ memberId: this.props.member?.id }} ></HistoryGridComponent>}
                  </Panel>
                </Collapse>

                <Collapse onChange={collapseGrids} className="mb-16">
                  <Panel
                    header={<Translate content="menu_swap" component={Collapse.Panel.header} className="custom-font fw-300 fs-14 text-white " />}
                    key="2">
                    {this.state.activeTab === '1' && <HistoryGridComponent columns={SwapColmns} gridUrl={SwapURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                  </Panel>
                </Collapse>

                <Collapse onChange={collapseGrids} className="mb-16">
                  <Panel
                    header={<Translate content="DepositandFiat" component={Collapse.Panel.header} className="custom-font fw-300 fs-14 text-white " />}
                    key="3">
                    {this.state.activeTab === '1' && <HistoryGridComponent columns={DepositColmns} gridUrl={DepositURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                  </Panel>
                </Collapse>

             
                <Collapse onChange={collapseGrids} className="mb-16">
                  <Panel
                    header={<Translate content="DepositandCrypto" component={Collapse.Panel.header} className="custom-font fw-300 fs-14 text-white " />}
                    key="4">
                    {this.state.activeTab === '1' && <HistoryGridComponent columns={depositCryptoColomns} gridUrl={DepositCryptoURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                  </Panel>
                </Collapse>
                
                <Collapse onChange={collapseGrids} className="mb-16">
                  <Panel
                    header={<Translate content="withdrawFiat" component={Collapse.Panel.header} className="custom-font fw-300 fs-14 text-white " />}
                    key="5">
                    {this.state.activeTab === '1' && <HistoryGridComponent columns={withdrawcolumns} gridUrl={WithdrawURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                  </Panel>
                </Collapse>
             
                <Collapse onChange={collapseGrids} className="mb-16">
                  <Panel
                    header={<Translate content="withdrawCrypto" component={Collapse.Panel.header} className="custom-font fw-300 fs-14 text-white " />}
                    key="6">
                    {this.state.activeTab === '1' && <HistoryGridComponent columns={withdrwCryptoColomns} gridUrl={WithdrawCryptoURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                  </Panel>
                </Collapse>
              </TabPane>

              <TabPane 
              tab={<Translate content="BuyandSell" component={Tabs.TabPane.tab} className="custom-font fw-300 fs-14" />}
               key='2'
                onClick={() => this.changeTab("2")}>
                {this.state.activeTab === '2' && <HistoryGridComponent columns={BuySellColmns} gridUrl={BuySellURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
              <TabPane
               tab={<Translate content="menu_swap" component={Tabs.TabPane.tab} className="custom-font fw-300 fs-14" />}
                key='3'
                 onClick={() => this.changeTab("3")}>
                {this.state.activeTab === '3' && <HistoryGridComponent columns={SwapColmns} gridUrl={SwapURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
              <TabPane tab={<Translate content="DepositandFiat" component={Tabs.TabPane.tab} className="custom-font fw-300 fs-14" />} key='4' onClick={() => this.changeTab("4")}>
                {this.state.activeTab === '4' && <HistoryGridComponent columns={DepositColmns} gridUrl={DepositURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
              <TabPane tab={<Translate content="DepositandCrypto" component={Tabs.TabPane.tab} className="custom-font fw-300 fs-14 " />} key='5' onClick={() => this.changeTab("5")}>
                {this.state.activeTab === '5' && <HistoryGridComponent columns={depositCryptoColomns} gridUrl={DepositCryptoURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
              <TabPane tab={<Translate content="withdrawFiat" component={Tabs.TabPane.tab} className="custom-font fw-300 fs-14 " />} key='6' onClick={() => this.changeTab("6")}>
                {this.state.activeTab === '6' && <HistoryGridComponent columns={withdrawcolumns} gridUrl={WithdrawURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
              <TabPane tab={<Translate content="withdrawCrypto" component={Tabs.TabPane.tab} className="custom-font fw-300 fs-14" />} key='7' onClick={() => this.changeTab("7")}>
                {this.state.activeTab === '7' && <HistoryGridComponent columns={withdrwCryptoColomns} gridUrl={WithdrawCryptoURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
            </Tabs>
          </div>

        </Drawer>
      </>
    );
  }
}
const connectStateToProps = ({ userConfig }) => {
  return { member: userConfig.userProfileInfo }
}
export default connect(connectStateToProps)(TransactionsHistory)