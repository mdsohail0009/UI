
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
import { getScreenName } from '../../reducers/feturesReducer';
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
            this.props.dispatch(getScreenName({getScreen:"withdraw"}))
        } else if (e === 1) {
            this.props.dispatch(setReceiveFiatHead(true));
            this.props.dispatch(setWithdrawfiatenaable(false))
            this.props.dispatch(setdepositCurrency(value))
            this.props.dispatch(getScreenName({getScreen:"deposit"}))
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
            this.props.dispatch(getScreenName({getScreen:"dashboard"}))
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
                   
                    
                    <Link to="/transactions" value={4} className="c-pointer"><Translate content="transactions_history" /></Link>
                   
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
   
        this.props.dispatch(getScreenName({getScreen:"dashboard"}))
        this.setState({
            buyFiatDrawer: false,
            transactions: false,
            showFuntransfer:false
        })
    }
    render() {
        const { wallets } = this.props.dashboard;

        return (
            <>
            <div className="fait-wallets-style">
            <Translate content="fait_walets" component={Title} className="db-titles" />
                <div>
              <Button className="dbchart-link mobile-viewall" style={{ height: 36,}}  >
                  <Translate content="cockpit" onClick={() => this.cockpitCharts()}  />
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
                    className="mobile-list faitwallet-cards"
                    renderItem={item =>
                        <List.Item className="listitems-design">
                            <List.Item.Meta
                                avatar={<Image preview={false} src={item.imagePath} />}
                                title={<><div className='crypto-curr-align'><div><div className="coin-style">{item.walletCode}</div>
                            <Currency className="currency-style" defaultValue={Math.abs(item.amount) > 999999 ? Math.sign(item.amount)*((Math.abs(item.amount)/1000000).toFixed(1)) : Math.sign(item.amount)*Math.abs(item.amount)} suffixText={Math.abs(item.amount) > 999999?"M":null} prefix={(item?.walletCode == "USD" ? "$" : null) || (item?.walletCode == "GBP" ? "£" : null) || (item?.walletCode == "EUR" ? "€" : null)} decimalPlaces={8} type={"text"} style={{ lineHeight: '12px' }} />
                            </div>
                                <Dropdown 
                                overlay={this.menuBar(item)}
                                 trigger={['click']} placement="bottomCenter" arrow overlayClassName="secureDropdown depwith-drpdown" >
                            <a onClick={e => e.preventDefault()}>
                              <Space>
                              <span class="icon lg menu-bar p-relative"></span>
                          
                            </Space>
                          </a>
                        </Dropdown></div></>}
                                
                            />
                            <div className="crypto-btns crypto-btn-top">
                                <Translate content="deposit" onClick={() => this.showSendReceiveDrawer(1, item.walletCode)} component={Button} type="primary" className="custom-btn prime" />
                                <Translate content="withdraw" onClick={() => { this.showSendReceiveDrawer(2, item.walletCode) }} component={Button} className="custom-btn sec ml-16" disabled={item.amount > 0 ? false : true} />
                               
                           
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
                        <span></span>
                        {!this.props.buyFiat?.sendFiatHeader && <div className="text-center">
                            <Translate className="drawer-maintitle" content={this.props.buyFiat.stepTitles[config[this.props.buyFiat.stepcode]]} component={Paragraph} />
                            </div>
                        }
                        <span onClick={() => this.closeDrawer()} className="icon md close-white c-pointer" />
                    </div>]}
                    className="side-drawer"
                    visible={this.state.showFuntransfer}
                >
                    <OnthegoFundTransfer selectedCurrency={this.state.selectedCurrency} ontheGoType={"Onthego"} onClosePopup={() => this.closeDrawer()}  />
                </Drawer>
            </>
        );
    }
}

export default ConnectStateProps(withRouter(Wallets));