import React, { Component } from 'react';
import { Typography, List, Button, Image, Dropdown, Space, Menu, Drawer } from 'antd';
import Translate from 'react-translate-component';
import SuissebaseFiat from '../buyfiat.component/suissebaseFiat';
import { fetchMemberWalletsData, fetchPortfolioData } from '../../reducers/dashboardReducer';
import ConnectStateProps from '../../utils/state.connect';
import Currency from '../shared/number.formate';
import MassPayment from '../buyfiat.component'
import { withRouter, Link } from 'react-router-dom';
import TransactionsHistory from "../transactions.history.component";
import { setWithdrawfiatenaable, setStep } from '../../reducers/sendreceiveReducer'
import { setdepositCurrency, getCurrencieswithBankDetails } from '../../reducers/depositReducer'
import OnthegoFundTransfer from '../onthego.transfer';
import {setReceiveFiatHead, setSendFiatHead} from '../../reducers/buyFiatReducer';
import Loader from "../../Shared/loader";
import { buyFiatSteps as config } from '../buyfiat.component/config';
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
            <ul className="pl-0 drpdwn-list">
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

        return (
            <>
            <div className="d-flex justify-content">
                <Translate content="suissebase_title" component={Title} className="fs-24 fw-600 text-white px-4 mb-16 mt-4" />
                <div>
              <Button className="pop-btn dbchart-link fs-14 fw-500" style={{ height: 36,}} onClick={() => this.cockpitCharts()} >
                  <Translate content="cockpit" />
                  <span className="icon sm right-angle ml-4" />
              </Button>
                    
              </div>
              </div>
                {wallets?.loading ? (
                    <Loader />
                ) : (
                <List
                    itemLayout="horizontal"
                    dataSource={wallets.data}
                    bordered={false}
                    className="mobile-list"
                    renderItem={item =>
                        <List.Item className="py-10 px-0">
                            <List.Item.Meta
                                avatar={<Image preview={false} src={item.imagePath} />}
                                title={<div className="fs-16 fw-600 text-upper text-white-30 l-height-normal">{item.walletCode}</div>}
                                description={<Currency className="fs-16 text-white-30 m-0" defaultValue={Math.abs(item.amount) > 999999 ? Math.sign(item.amount)*((Math.abs(item.amount)/1000000).toFixed(1)) : Math.sign(item.amount)*Math.abs(item.amount)} suffixText={Math.abs(item.amount) > 999999?"M":null} prefix={(item?.walletCode === "USD" ? "$" : null) || (item?.walletCode === "GBP" ? "£" : null) || (item?.walletCode === "EUR" ? "€" : null)} decimalPlaces={8} type={"text"} style={{ lineHeight: '12px' }} />}
                            />
                            <div className="crypto-btns">
                                <Translate content="deposit" onClick={() => this.showSendReceiveDrawer(1, item.walletCode)} component={Button} type="primary" className="custom-btn prime" />
                                <Translate content="withdraw" onClick={() => { this.showSendReceiveDrawer(2, item.walletCode) }} component={Button} className="custom-btn sec ml-16" disabled={item.amount > 0 ? false : true} />
                            <Dropdown 
                            overlay={this.menuBar(item)}
                             trigger={['click']} placement="bottomCenter" arrow overlayClassName="secureDropdown depwith-drpdown" >
                        <Link onClick={e => e.preventDefault()}>
                          <Space>
                          <span class="icon md menu-bar ml-4 p-relative"></span>
                        </Space>
                      </Link>
                    </Dropdown>
                    </div>
                        </List.Item>}
                />
                )}  
                <Translate content="suissebase_title_crypto" component={Title} className="fs-24 fw-600 text-white px-4 mb-16 mt-4" />
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
                        <span></span>
                        {!this.props.buyFiat?.sendFiatHeader && <div className="text-center fs-24">
                            <Translate className="mb-0 text-white-30 fw-600" content={this.props.buyFiat.stepTitles[config[this.props.buyFiat.stepcode]]} component={Paragraph} />
                            </div>
                        }
                        <span onClick={() => this.setState({ ...this.state, showFuntransfer: false })} className="icon md close-white c-pointer" />
                    </div>]}
                    className="side-drawer w-50p"
                    visible={this.state.showFuntransfer}
                >
                    <OnthegoFundTransfer selectedCurrency={this.state.selectedCurrency} ontheGoType={"Onthego"} onClosePopup={() => this.setState({ ...this.state, showFuntransfer: false })}  />
                </Drawer>
            </>
        );
    }
}

export default ConnectStateProps(withRouter(Wallets));