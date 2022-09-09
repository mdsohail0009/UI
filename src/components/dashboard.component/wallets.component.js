import React, { Component } from 'react';
import { Typography, List, Button, Image, Dropdown, Space, Menu, Drawer, Tooltip } from 'antd';
import Translate from 'react-translate-component';
import SuissebaseFiat from '../buyfiat.component/suissebaseFiat';
import { fetchMemberWalletsData, fetchPortfolioData } from '../../reducers/dashboardReducer';
import ConnectStateProps from '../../utils/state.connect';
import Currency from '../shared/number.formate';
import MassPayment from '../buyfiat.component'
import { withRouter, Link } from 'react-router-dom';
import TransactionsHistory from "../transactions.history.component";
import { setWithdrawfiatenaable, setWithdrawfiat, setStep } from '../../reducers/sendreceiveReducer'
import { setdepositCurrency, getCurrencieswithBankDetails } from '../../reducers/depositReducer'
import OnthegoFundTransfer from '../onthego.transfer';
const { Title, Paragraph } = Typography;

class Wallets extends Component {
    state = {
        sendReceiveDrawer: false,
        valNum: 1,
        wallets: [], loading: true,
        buyFiatDrawer: false,
        selctedVal: '',
        transactions: false,
        selectedWallet: '',
        showFuntransfer: false,
    }
    componentDidMount() {
        this.fetchWallets();
        this.props.dispatch(getCurrencieswithBankDetails())
    }
    async fetchWallets() {
        this.props.dispatch(fetchMemberWalletsData(this.props.userProfile.id))
        this.props.dispatch(fetchPortfolioData(this.props.userProfile.id))
    }
    showDocsError() {
        this.props.history.push("/docnotices");
    }
    showSendReceiveDrawer = (e, value) => {
        this.props.dispatch(setStep("step1"));
        const is2faEnabled = this.props.twoFA?.isEnabled;
        if (!this.props?.userProfile?.isKYC) {
            this.props.history.push("/notkyc");
            return;
        }
        if (!is2faEnabled) {
            this.props.history.push("/enabletwofactor");
            return;
        }
        if (this.props?.userProfile?.isDocsRequested) {
            this.props.history.push("/docnotices");
            return;
        }

        if (e === 2) {
            this.props.dispatch(setWithdrawfiatenaable(true))
            this.props.dispatch(setWithdrawfiat({ walletCode: value }))
        } else if (e === 1) {
            this.props.dispatch(setWithdrawfiatenaable(false))
            this.props.dispatch(setdepositCurrency(value))
        } else if (e === 3) {
            this.props.history.push(`/payments/${value.walletCode}`)
        } else {
            this.props.history.push(`/internaltransfer`)
        }
        this.setState({
            valNum: e
        }, () => {
            this.setState({
                ...this.state,
                buyFiatDrawer: true,
                selctedVal: value
            })

        })
    }
    showTransactionDrawer = (item) => {
        this.setState({ ...this.state, transactions: true, selectedWallet: item?.walletCode });
    }
    menuBar = (item) => (
        <Menu>
            <ul className="pl-0 drpdwn-list">
                <li onClick={() => this.showSendReceiveDrawer(3, item)}>
                    <Link value={3} className="c-pointer">
                    <Translate content="menu_payments" />
                    </Link>
                </li>
                <li onClick={() => this.showTransactionDrawer(item)}>
                    <Link value={4} className="c-pointer">
                    <Translate content="menu_transactions_history" />
                    </Link>
                </li>
                <li onClick={() => this.showSendReceiveDrawer(5, item)}>
                    <Link value={5} className="c-pointer">
                    <Translate content="menu_internal_transfer" />
                    </Link>
                </li>
            </ul>
        </Menu>
    )
    closeDrawer = () => {
        this.setState({
            buyFiatDrawer: false,
            transactions: false
        })
    }
    render() {
        const { wallets } = this.props.dashboard;
        const { totalCryptoValue, totalFiatValue } = this.props.dashboard.portFolio.data;

        return (
            <>
                <Translate content="suissebase_title" component={Title} className="fs-24 fw-600 text-white px-4 mb-16 mt-4" />
                {/* <div style={{ display: "flex",alignItems:"baseline" }}>

                <Translate content="suissebase_subtitle" component={Paragraph} className="text-white-30 fs-16 mb-16 px-4" />
                <Currency defaultValue={totalFiatValue} className={`fs-24 m-0 fw-600 ${totalFiatValue < 0 ? 'text-red' : 'text-green'}`} style={{ lineHeight: '54px' }} />
                </div> */}
                <List
                    itemLayout="horizontal"
                    dataSource={wallets.data}
                    bordered={false}
                    className="mobile-list"
                    loading={wallets.loading}
                    renderItem={item =>
                        <List.Item className="py-10 px-0">
                            <List.Item.Meta
                                avatar={<Image preview={false} src={item.imagePath} />}
                                title={<div className="fs-16 fw-600 text-upper text-white-30 l-height-normal">{item.walletCode}</div>}
                                description={<Currency className="fs-16 text-white-30 m-0" defaultValue={item.amount} prefix={(item?.walletCode == "USD" ? "$" : null) || (item?.walletCode == "GBP" ? "£" : null) || (item?.walletCode == "EUR" ? "€" : null)} decimalPlaces={8} type={"text"} style={{ lineHeight: '12px' }} />}
                            />
                            <div className="crypto-btns">
                                <Translate content="deposit" onClick={() => this.showSendReceiveDrawer(1, item.walletCode)} component={Button} type="primary" className="custom-btn prime" />
                                <Translate content="withdraw" onClick={() => { this.setState({ ...this.setState, showFuntransfer: true,selectedCurrency:item.walletCode }) }} component={Button} className="custom-btn sec ml-16" disabled={item.amount > 0 ? false : true} />
                                {/* <Translate content="deposit" onClick={() => this.showSendReceiveDrawer(1, item.walletCode)} component={Button} type="primary" className="custom-btn prime" />
                                <Translate content="withdraw" onClick={() => this.showSendReceiveDrawer(2, item.walletCode)} component={Button} className="custom-btn sec ml-16" disabled={item.amount > 0 ? false : true} /> */}
                            </div>
                            <Dropdown 
                            overlay={this.menuBar(item)}
                             trigger={['click']} placement="bottomCenter" arrow overlayClassName="secureDropdown depwith-drpdown" >
                        <a onClick={e => e.preventDefault()}>
                          <Space>
                          <span class="icon md menu-bar ml-4 p-relative"></span>
                          {/* <DownOutlined /> */}
                        </Space>
                      </a>
                    </Dropdown>
                        </List.Item>}
                />
                <SuissebaseFiat showDrawer={this.state.sendReceiveDrawer} valNum={this.state.valNum} onClose={() => this.closeDrawer()} />
                {this.state.buyFiatDrawer && <MassPayment showDrawer={this.state.buyFiatDrawer} tabData={{ tabVal: this.state.valNum, walletCode: this.state.selctedVal }} onClose={() => this.closeDrawer()} />}
                {this.state.transactions && <TransactionsHistory
                    showDrawer={this.state.transactions} selectWallet={this.state.selectedWallet}
                    onClose={() => {
                        this.closeDrawer();
                    }}
                />}
                <Drawer
                    destroyOnClose={true}
                    title={[<div className="side-drawer-header">
                        {/* {this.renderTitle()} */}
                        <div className="">
                            {/* <Title className="basicinfo">Fund Transfer</Title> */}
                        </div>
                        <span onClick={() => this.setState({ ...this.state, showFuntransfer: false })} className="icon md close-white c-pointer" />
                    </div>]}
                    className="side-drawer w-50p"
                    visible={this.state.showFuntransfer}
                >
                    <OnthegoFundTransfer selectedCurrency={this.state.selectedCurrency} />
                </Drawer>
            </>
        );
    }
}

export default ConnectStateProps(withRouter(Wallets));