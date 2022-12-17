import React, { Component } from 'react';
import { Typography, List, Button, Image, Dropdown, Space, Menu, Drawer, Tooltip,Row,Col } from 'antd';
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
import BankWallets from '../bankui.component';
import {setReceiveFiatHead, setSendFiatHead} from '../../reducers/buyFiatReducer';
import Loader from "../../Shared/loader";
import { buyFiatSteps as config } from '../buyfiat.component/config';
const { Title, Paragraph } = Typography;

class Iban extends Component {
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
    cockpitCharts=()=>{
        this.props.history.push("/cockpitCharts");
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
            this.props.dispatch(setReceiveFiatHead(false));
            this.props.dispatch(setSendFiatHead(false));
            // this.props.dispatch(setWithdrawfiatenaable(true))
            // this.props.dispatch(setWithdrawfiat({ walletCode: value }))
            this.setState({ ...this.setState, showFuntransfer: true, selectedCurrency:value })
        } else if (e === 1) {
            this.props.dispatch(setReceiveFiatHead(true));
            this.props.dispatch(setWithdrawfiatenaable(false))
            this.props.dispatch(setdepositCurrency(value))
            this.setState({
                valNum: e
            }, () => {
                this.setState({
                    ...this.state,
                    buyFiatDrawer: true,
                    selctedVal: value
                })
    
            })
        }else if(e===3){
            this.props.history.push(`/payments/${value.walletCode}`)
        }else {
            this.props.history.push(`/internaltransfer`)
        }
        
    }
    showTransactionDrawer = (item) => {
        this.setState({ ...this.state, transactions: true, selectedWallet: item?.walletCode });
    }
    menuBar = (item) => (
        <Menu>
            <ul className="drpdwn-list">
                <li onClick={() => this.showSendReceiveDrawer(3, item)}>
                    <Link value={3} className="c-pointer">
                    <Translate content="menu_payments" />
                    </Link>
                </li>
                <li onClick={() => this.showTransactionDrawer(item)}>
                    <Link value={4} className="c-pointer">
                    <Translate content="transactions_history" />
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
            {/* <BankWallets/> */}
            <div className="fait-wallets-style">
            <Translate content="iban" component={Title} className="db-titles" />
                <div>
              {/* <Button className="dbchart-link" style={{ height: 36,}} onClick={() => this.cockpitCharts()} >
                  <Translate content="cockpit" />
                  <span className="icon sm right-angle ml-4" />
              </Button> */}
                    
              </div>
              </div>
                {/* <div style={{ display: "flex",alignItems:"baseline" }}>

                <Translate content="suissebase_subtitle" component={Paragraph} className="text-white-30 fs-16 mb-16 px-4" />
                <Currency defaultValue={totalFiatValue} className={`fs-24 m-0 fw-600 ${totalFiatValue < 0 ? 'text-red' : 'text-green'}`} style={{ lineHeight: '54px' }} />
                </div> */}
                {wallets?.loading ? (
                    <Loader />
                ) : (
                        <List
                            itemLayout="horizontal"
                            dataSource={wallets.data}
                            bordered={false}
                            className="mobile-list iban-list"
                            //loading={wallets.loading}
                            renderItem={item =>
                                <List.Item className="listitems-design iban-style">
                                    <List.Item.Meta
                                        avatar={<><div className='crypto-curr-align'><div><Image preview={false} src={item.imagePath} /></div>
                                            <Dropdown
                                                overlay={this.menuBar(item)}
                                                trigger={['click']} placement="bottomCenter" arrow overlayClassName="secureDropdown depwith-drpdown" >
                                                <a onClick={e => e.preventDefault()}>
                                                    <Space>
                                                        <span class="icon lg menu-bar  p-relative"></span>
                                                        {/* <DownOutlined /> */}
                                                    </Space>
                                                </a>
                                            </Dropdown>
                                        </div>    </>}
                                        title={<><div className="coin-style">{item.walletCode}</div>
                                            <Currency className="currency-style" defaultValue={Math.abs(item.amount) > 999999 ? Math.sign(item.amount) * ((Math.abs(item.amount) / 1000000).toFixed(1)) : Math.sign(item.amount) * Math.abs(item.amount)} suffixText={Math.abs(item.amount) > 999999 ? "M" : null} prefix={(item?.walletCode == "USD" ? "$" : null) || (item?.walletCode == "GBP" ? "£" : null) || (item?.walletCode == "EUR" ? "€" : null)} decimalPlaces={8} type={"text"} style={{ lineHeight: '12px' }} />

                                        </>}
                                    // description={}
                                    />
                                    <div className="crypto-btns crypto-btn-top d-flex">
                                        <Translate content="deposit" onClick={() => this.showSendReceiveDrawer(1, item.walletCode)} component={Button} type="primary" className="custom-btn prime" />
                                        <Translate content="withdraw" onClick={() => { this.showSendReceiveDrawer(2, item.walletCode) }} component={Button} className="custom-btn sec ml-16" disabled={item.amount > 0 ? false : true} />
                                        {/* <Translate content="deposit" onClick={() => this.showSendReceiveDrawer(1, item.walletCode)} component={Button} type="primary" className="custom-btn prime" />
                                <Translate content="withdraw" onClick={() => this.showSendReceiveDrawer(2, item.walletCode)} component={Button} className="custom-btn sec ml-16" disabled={item.amount > 0 ? false : true} /> */}

                                    </div>
                                </List.Item>}
                        />
                )}
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
                        <span></span>
                        {!this.props.buyFiat?.sendFiatHeader && <div className="text-center fs-24">
                            <Translate className="mb-0 text-white-30 fw-600" content={this.props.buyFiat.stepTitles[config[this.props.buyFiat.stepcode]]} component={Paragraph} />
                            </div>
                        }
                        <span onClick={() => this.setState({ ...this.state, showFuntransfer: false })} className="icon md close-white c-pointer" />
                    </div>]}
                    className="side-drawer"
                    visible={this.state.showFuntransfer}
                >
                    <OnthegoFundTransfer selectedCurrency={this.state.selectedCurrency} ontheGoType={"Onthego"} onClosePopup={() => this.setState({ ...this.state, showFuntransfer: false })}  />
                </Drawer>
            </>
        );
    }
}

export default ConnectStateProps(withRouter(Iban));