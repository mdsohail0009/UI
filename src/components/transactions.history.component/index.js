import React, { Component } from 'react';
import { Drawer, Tabs, Collapse } from 'antd';
import HistoryGridComponent from './HistoryGridComponent';
import { connect } from 'react-redux';

const { TabPane } = Tabs;
const { Panel } = Collapse;


function collapseGrids(key) {
  console.log(key);
}

const withdrawcolumns = [
  { field: "accountType", title: "Account Type", filter: true, width: 200 },
  { field: "walletCode", title: "Wallet", filter: true, width: 200 },
  { field: "amount", title: "Amount", filter: true, width: 220, dataType: "number", filterType: "numeric", },
  { field: "bankName", title: "Bank Name", filter: true, width: 220 },
  { field: "accountNumber", title: "Bank account number/IBAN", width: 220, filter: true },
  { field: "swiftCode", title: " BIC/SWIFT/Routing number", filter: true, width: 250 },
  { field: "createdDate", title: "Request Date", filter: true, width: 210, footerCell: true, filterType: "date" },
  { field: "status", title: "State", width: 200, filter: true },
  { field: "statusRemarks", title: "Remarks", width: 280, filter: true }
];
const DepositColmns = [
  { field: "refrenceId", title: "Reference Id", filter: true, width: 346 },
  { field: "currency", title: "Currency", filter: true, width: 210 },
  { field: "bankName", title: "Bank Name", filter: true, width: 260 },
  { field: "amountDeposit", title: "Amount", filter: true, width: 250 },
  { field: "date", title: "Date", filter: true, width: 210, filterType: "date" },
  { field: "status", title: "State", filter: true, width: 260 },
  { field: "statusRemarks", title: "Remarks", filter: true, width: 460 }
]
const SwapColmns = [
  { field: "date", title: "Date", filter: true, filterType: "date", },
  { field: "fromWalletCode", title: "From Wallet", filter: true },
  { field: "toWalletCode", title: "To Wallet", width: 170, filter: true },
  { field: "fromValue", title: "From Value", width: 180, filter: true, dataType: 'number' },
  { field: "toValue", title: "To Value", width: 140, filter: true, dataType: 'number' },
  { field: "totalAmount", title: "Total Amount", width: 180, filter: true, dataType: 'number' },
  { field: "amountInUsd", title: "Amount in USD", width: 150, filter: true, dataType: 'number' },
]
const BuySellColmns = [
  { field: "date", title: "Date", filter: true, filterType: "date", width: 184 },
  { field: "type", title: "Type", filter: true, width: 190 },
  { field: "fromWalletCode", title: "From Wallet", filter: true, width: 200 },
  { field: "fromValue", title: "From Value", filter: true, width: 190, dataType: 'number' },
  { field: "toWalletCode", title: "To Wallet", filter: true, width: 190 },
  { field: "tovalue", title: "To Value", filter: true, width: 200, dataType: 'number' },
  { field: "beforeValue", title: "Before Value", width: 200, filter: true, dataType: 'number' },
  { field: "afterValue", title: "After Value", width: 200, filter: true, dataType: 'number' },
  { field: "totalAmount", title: "Total Amount", filter: true, width: 210, dataType: 'number' },
  { field: "amountInUsd", title: "Amount In Usd", filter: true, width: 200, dataType: 'number' },
]
const depositCryptoColomns = [
  { field: "walletCode", title: "Wallet", filter: true },
  { field: "coinName", title: "Wallet Name", filter: true, width: 180 },
  { field: "availableCoins", title: "Deposited Coins", filter: true, width: 200 },
  { field: "fromWalletAddress", title: "Wallet Address", filter: true, width: 200 },
  { field: "createdDate", title: "Date", width: 150, filterType: "date", filter: true, },
]
const withdrwCryptoColomns = [
  { field: "walletCode", title: "Wallet", filter: true },
  { field: "amount", title: "Amount", filter: true, width: 200, filterType: "numeric", dataType: 'number' },
  { field: "walletAddress", title: "Wallet Address", filter: true, width: 200 },
  { field: "createdDate", title: "Request Date", filter: true, width: 200, filterType: "date" },
  { field: "status", title: "State", filter: true, width: 200 },
  { field: "statusRemarks", title: "Remarks", filter: true, width: 200, }
]
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
    return (
      <>
        <Drawer
          title={[<div className="side-drawer-header">
            <span className="text-white">Transactions</span>
            <div />
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
              <TabPane tab="All" key='1' className="alltab-space" onClick={() => this.changeTab("1")}>
              {this.state.activeTab === '1' && <><Collapse onChange={collapseGrids} className="mb-16">
                  <Panel header="Buy/Sell" key="1">
                    {this.state.activeTab === '1' && <HistoryGridComponent columns={BuySellColmns} gridUrl={BuySellURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                  </Panel>
                </Collapse>

                <Collapse onChange={collapseGrids} className="mb-16">
                  <Panel header="Swap" key="2">
                    {this.state.activeTab === '1' && <HistoryGridComponent columns={SwapColmns} gridUrl={SwapURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                  </Panel>
                </Collapse>

                <Collapse onChange={collapseGrids} className="mb-16">
                  <Panel header="Deposit Fiat" key="3">
                    {this.state.activeTab === '1' && <HistoryGridComponent columns={DepositColmns} gridUrl={DepositURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                  </Panel>
                </Collapse>
                <Collapse onChange={collapseGrids} className="mb-16">
                  <Panel header="Deposit Crypto" key="4">
                    {this.state.activeTab === '1' && <HistoryGridComponent columns={depositCryptoColomns} gridUrl={DepositCryptoURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                  </Panel>
                </Collapse>
                <Collapse onChange={collapseGrids} className="mb-16">
                  <Panel header="Withdraw Fiat" key="5">
                    {this.state.activeTab === '1' && <HistoryGridComponent columns={withdrawcolumns} gridUrl={WithdrawURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                  </Panel>
                </Collapse>
                <Collapse onChange={collapseGrids} className="mb-16">
                  <Panel header="Withdraw Crypto" key="6">
                    {this.state.activeTab === '1' && <HistoryGridComponent columns={withdrwCryptoColomns} gridUrl={WithdrawCryptoURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                  </Panel>
                </Collapse></>}
              </TabPane>

              <TabPane tab="Buy/Sell" key='2' onClick={() => this.changeTab("2")}>
                {this.state.activeTab === '2' && <HistoryGridComponent columns={BuySellColmns} gridUrl={BuySellURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
              <TabPane tab="Swap" key='3' onClick={() => this.changeTab("3")}>
                {this.state.activeTab === '3' && <HistoryGridComponent columns={SwapColmns} gridUrl={SwapURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
              <TabPane tab="Deposit Fiat" key='4' onClick={() => this.changeTab("4")}>
                {this.state.activeTab === '4' && <HistoryGridComponent columns={DepositColmns} gridUrl={DepositURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
              <TabPane tab="Deposit Crypto" key='5' onClick={() => this.changeTab("5")}>
                {this.state.activeTab === '5' && <HistoryGridComponent columns={depositCryptoColomns} gridUrl={DepositCryptoURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
              <TabPane tab="Withdraw Fiat" key='6' onClick={() => this.changeTab("6")}>
                {this.state.activeTab === '6' && <HistoryGridComponent columns={withdrawcolumns} gridUrl={WithdrawURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
              <TabPane tab="Withdraw Crypto" key='7' onClick={() => this.changeTab("7")}>
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