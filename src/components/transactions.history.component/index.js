import React, { Component } from 'react';
import { Drawer, Tabs, Collapse, Typography } from 'antd';
import HistoryGridComponent from './HistoryGridComponent';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import apiCalls from '../../api/apiCalls';

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
  withdrawcolumns = [
    { field: "accountType", title: apiCalls.convertLocalLang('accountType'), filter: true, width: 200 },
    { field: "walletCode", title: apiCalls.convertLocalLang('Wallet'), filter: true, width: 200 },
    { field: "amount", title: apiCalls.convertLocalLang('amount'), filter: true, width: 220, dataType: "number", filterType: "numeric", },
    { field: "bankName", title: apiCalls.convertLocalLang('Bank_name'), filter: true, width: 220 },
    { field: "accountNumber", title: apiCalls.convertLocalLang('Bank_account'), width: 220, filter: true },
    { field: "swiftCode", title: apiCalls.convertLocalLang('BIC_SWIFT_routing_number'), filter: true, width: 250 },
    { field: "createdDate", title: apiCalls.convertLocalLang('RequestDate'), filter: true, width: 210, footerCell: true, filterType: "date" },
    { field: "status", title: apiCalls.convertLocalLang('Status'), width: 200, filter: true },
    { field: "statusRemarks", title: apiCalls.convertLocalLang('remarks'), width: 280, filter: true }
  ];
  DepositColmns = [
    { field: "refrenceId", title: apiCalls.convertLocalLang('ReferenceId'), filter: true, width: 346 },
    { field: "currency", title: apiCalls.convertLocalLang('currency'), filter: true, width: 210 },
    { field: "bankName", title: apiCalls.convertLocalLang('Bank_name'), filter: true, width: 260 },
    { field: "amountDeposit", title: apiCalls.convertLocalLang('amount'), filter: true, width: 250 },
    { field: "date", title: apiCalls.convertLocalLang('Date'), filter: true, width: 210, filterType: "date" },
    { field: "status", title: apiCalls.convertLocalLang('Status'), filter: true, width: 260 },
    { field: "statusRemarks", title: apiCalls.convertLocalLang('remarks'), filter: true, width: 460 }
  ];
  SwapColmns = [
    { field: "date", title: apiCalls.convertLocalLang('Date'), filter: true, filterType: "date", },
    { field: "fromWalletCode", title: apiCalls.convertLocalLang('FromWallet'), filter: true },
    { field: "toWalletCode", title: apiCalls.convertLocalLang('ToWallet'), width: 170, filter: true },
    { field: "fromValue", title: apiCalls.convertLocalLang('FromValue'), width: 180, filter: true, dataType: 'number' },
    { field: "toValue", title: apiCalls.convertLocalLang('ToValue'), width: 140, filter: true, dataType: 'number' },
    { field: "totalAmount", title: apiCalls.convertLocalLang('TotalAmount'), width: 180, filter: true, dataType: 'number' },
    { field: "amountInUsd", title: apiCalls.convertLocalLang('AmountInUsd'), width: 150, filter: true, dataType: 'number' },
  ];
  BuySellColmns = [
    { field: "date", title: apiCalls.convertLocalLang('Date'), filter: true, filterType: "date", width: 184 },
    { field: "type", title: apiCalls.convertLocalLang('Type'), filter: true, width: 190 },
    { field: "fromWalletCode", title: apiCalls.convertLocalLang('FromWallet'), filter: true, width: 200 },
    { field: "fromValue", title: apiCalls.convertLocalLang('FromValue'), filter: true, width: 190, dataType: 'number' },
    { field: "toWalletCode", title: apiCalls.convertLocalLang('ToWallet'), filter: true, width: 190 },
    { field: "tovalue", title: apiCalls.convertLocalLang('ToValue'), filter: true, width: 200, dataType: 'number' },
    { field: "beforeValue", title: apiCalls.convertLocalLang('BeforeValue'), width: 200, filter: true, dataType: 'number' },
    { field: "afterValue", title: apiCalls.convertLocalLang('AfterValue'), width: 200, filter: true, dataType: 'number' },
    { field: "totalAmount", title: apiCalls.convertLocalLang('TotalAmount'), filter: true, width: 210, dataType: 'number' },
    { field: "amountInUsd", title: apiCalls.convertLocalLang('AmountInUsd'), filter: true, width: 200, dataType: 'number' },
  ];
  depositCryptoColomns = [
    { field: "walletCode", title: apiCalls.convertLocalLang('Wallet'), filter: true },
    { field: "coinName", title: apiCalls.convertLocalLang('coinName'), filter: true, width: 180 },
    { field: "availableCoins", title: apiCalls.convertLocalLang('availableCoins'), filter: true, width: 200 },
    { field: "fromWalletAddress", title: apiCalls.convertLocalLang('walletAddress'), filter: true, width: 200 },
    { field: "createdDate", title: apiCalls.convertLocalLang('RequestDate'), width: 150, filterType: "date", filter: true, },
  ];
  withdrwCryptoColomns = [
    { field: "walletCode", title: apiCalls.convertLocalLang('Wallet'), filter: true },
    { field: "amount", title: apiCalls.convertLocalLang('amount'), filter: true, width: 200, filterType: "numeric", dataType: 'number' },
    { field: "walletAddress", title: apiCalls.convertLocalLang('walletAddress'), filter: true, width: 200 },
    { field: "createdDate", title: apiCalls.convertLocalLang('RequestDate'), filter: true, width: 200, filterType: "date" },
    { field: "status", title: apiCalls.convertLocalLang('Status'), filter: true, width: 200 },
    { field: "statusRemarks", title: apiCalls.convertLocalLang('remarks'), filter: true, width: 200, }
  ];
  render() {
    const { BuySellURL, SwapURL, WithdrawURL, DepositURL, DepositCryptoURL, WithdrawCryptoURL } = this.state
    const { Paragraph, Text } = Typography;
    const { TabPane } = Tabs;
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

                  {this.state.activeTab === '1' && <><Collapse onChange={collapseGrids} className="mb-16">
                  <Panel
                    header={<Translate content="BuyandSell" component={Collapse.Panel.header} className="custom-font fw-300 fs-14 text-white" />}
                    key="1">
                    {this.state.activeTab === '1' && <HistoryGridComponent columns={this.BuySellColmns} gridUrl={BuySellURL} params={{ memberId: this.props.member?.id }} ></HistoryGridComponent>}
                  </Panel>
                </Collapse>

                <Collapse onChange={collapseGrids} className="mb-16">
                  <Panel
                    header={<Translate content="menu_swap" component={Collapse.Panel.header} className="custom-font fw-300 fs-14 text-white " />}
                    key="2">
                    {this.state.activeTab === '1' && <HistoryGridComponent columns={this.SwapColmns} gridUrl={SwapURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                  </Panel>
                </Collapse>

                <Collapse onChange={collapseGrids} className="mb-16">
                  <Panel
                    header={<Translate content="DepositandFiat" component={Collapse.Panel.header} className="custom-font fw-300 fs-14 text-white " />}
                    key="3">
                    {this.state.activeTab === '1' && <HistoryGridComponent columns={this.DepositColmns} gridUrl={DepositURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                  </Panel>
                </Collapse>


                <Collapse onChange={collapseGrids} className="mb-16">
                  <Panel
                    header={<Translate content="DepositandCrypto" component={Collapse.Panel.header} className="custom-font fw-300 fs-14 text-white " />}
                    key="4">
                    {this.state.activeTab === '1' && <HistoryGridComponent columns={this.depositCryptoColomns} gridUrl={DepositCryptoURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                  </Panel>
                </Collapse>

                <Collapse onChange={collapseGrids} className="mb-16">
                  <Panel
                    header={<Translate content="withdrawFiat" component={Collapse.Panel.header} className="custom-font fw-300 fs-14 text-white " />}
                    key="5">
                    {this.state.activeTab === '1' && <HistoryGridComponent columns={this.withdrawcolumns} gridUrl={WithdrawURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                  </Panel>
                </Collapse>

                <Collapse onChange={collapseGrids} className="mb-16">
                  <Panel
                    header={<Translate content="withdrawCrypto" component={Collapse.Panel.header} className="custom-font fw-300 fs-14 text-white " />}
                    key="6">
                    {this.state.activeTab === '1' && <HistoryGridComponent columns={this.withdrwCryptoColomns} gridUrl={WithdrawCryptoURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
                  </Panel>
                </Collapse></>}
              </TabPane>

              <TabPane
                tab={<Translate content="BuyandSell" component={Tabs.TabPane.tab} className="custom-font fw-300 fs-14" />}
                key='2'
                onClick={() => this.changeTab("2")}>
                {this.state.activeTab === '2' && <HistoryGridComponent columns={this.BuySellColmns} gridUrl={BuySellURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
              <TabPane
                tab={<Translate content="menu_swap" component={Tabs.TabPane.tab} className="custom-font fw-300 fs-14" />}
                key='3'
                onClick={() => this.changeTab("3")}>
                {this.state.activeTab === '3' && <HistoryGridComponent columns={this.SwapColmns} gridUrl={SwapURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
              <TabPane tab={<Translate content="DepositandFiat" component={Tabs.TabPane.tab} className="custom-font fw-300 fs-14" />} key='4' onClick={() => this.changeTab("4")}>
                {this.state.activeTab === '4' && <HistoryGridComponent columns={this.DepositColmns} gridUrl={DepositURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
              <TabPane tab={<Translate content="DepositandCrypto" component={Tabs.TabPane.tab} className="custom-font fw-300 fs-14 " />} key='5' onClick={() => this.changeTab("5")}>
                {this.state.activeTab === '5' && <HistoryGridComponent columns={this.depositCryptoColomns} gridUrl={DepositCryptoURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
              <TabPane tab={<Translate content="withdrawFiat" component={Tabs.TabPane.tab} className="custom-font fw-300 fs-14 " />} key='6' onClick={() => this.changeTab("6")}>
                {this.state.activeTab === '6' && <HistoryGridComponent columns={this.withdrawcolumns} gridUrl={WithdrawURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
              </TabPane>
              <TabPane tab={<Translate content="withdrawCrypto" component={Tabs.TabPane.tab} className="custom-font fw-300 fs-14" />} key='7' onClick={() => this.changeTab("7")}>
                {this.state.activeTab === '7' && <HistoryGridComponent columns={this.withdrwCryptoColomns} gridUrl={WithdrawCryptoURL} params={{ memberId: this.props.member?.id }}></HistoryGridComponent>}
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