import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Button, Typography, Empty,Dropdown, Menu, Space ,Alert} from 'antd';
import Translate from 'react-translate-component';
import BuySell from '../buy.component';
import SendReceive from '../send.component'
import { fetchYourPortfoliodata, } from '../../reducers/dashboardReducer';
import Currency from '../shared/number.formate';
import { fetchSelectedCoinDetails, setExchangeValue, setCoin } from '../../reducers/buyReducer';
import { setStep, setSellHeaderHide } from '../../reducers/buysellReducer';
import { updateCoinDetail } from '../../reducers/sellReducer'
import { convertCurrency } from '../buy.component/buySellService';
import { withRouter, Link } from 'react-router-dom';
import apiCalls from '../../api/apiCalls';
import { fetchWithDrawWallets, handleSendFetch, setSelectedWithDrawWallet, setSubTitle, setWithdrawfiatenaable,rejectWithdrawfiat, setWithdrawfiat,setWalletAddress, setSendCrypto, hideSendCrypto } from "../../reducers/sendreceiveReducer";
import {createCryptoDeposit} from "../deposit.component/api";
import TransactionsHistory from "../transactions.history.component";
import Loader from "../../Shared/loader";
import { getScreenName } from '../../reducers/feturesReducer';

class YourPortfolio extends Component {
    state = {
        loading: true,
        initLoading: true,
        portfolioData: [], buyDrawer: false, coinData: null,sendDrawer: false,
        selectedWallet: '',
        errorMessage:null
    }
    componentDidMount() {
        this.loadCryptos();
        // this.loadCoinDetailData();
    }
  //   loadCoinDetailData = async () => {
  //     this.setState({ ...this.state, loading: true,errorMessage:null})
  //     this.props.dispatch(fetchMarketCoinData(false))
  //     debugger
  //     const response = await getcoinDetails(this.props.match.params?.coinName);
  //     if (response.ok) {
  //         this.setState({ ...this.state, coinData: response.data,errorMessage:null },
  //         )
  //     }else{
  //       this.setState({...this.state,errorMessage:apiCalls.isErrorDispaly(response)})
  //     }
  //     this.setState({ ...this.state, loading: false})
  // }
    loadCryptos = () => {
        if (this.props.userProfile) {
            this.props.dispatch(fetchYourPortfoliodata());
        }
    }
    cockpitCharts=()=>{
      this.props.history.push("/cryptocoinsView");
    }
    showBuyDrawer = (item, key) => {
        if (!this.props?.userProfile?.isKYC) {
            this.props.history.push("/notkyc");
            return;
        }
        else if (!this.props.twoFA?.isEnabled) {
            this.props.history.push("/enabletwofactor");
            return;
        }
        else if (this.props?.userProfile?.isDocsRequested) {
            this.props.history.push("/docnotices");
            return;
        }

        if (key === "buy") {
            this.props.dispatch(fetchSelectedCoinDetails(item.coin));
            this.props.dispatch(setCoin({ ...item, toWalletCode: item.coin, toWalletId: item.id, toWalletName: item.coinFullName }));
            convertCurrency({ from: item.coin, to: "USD", value: 1, isCrypto: false, customer_id: this.props.userProfile?.id, screenName: null }).then(val => {
                this.props.dispatch(setExchangeValue({ key: item.coin, value: val }));
            });
            this.props.dispatch(setSellHeaderHide(false));
            this.props.dispatch(getScreenName({getScreen:"menu_buy_sell"}))
            this.props.dispatch(setStep("step2"));
        } else if (key === "sell") {
          this.props.dispatch(setSellHeaderHide(false));
            this.props.dispatch(setCoin(item));
            this.props.dispatch(setExchangeValue({ key: item.coin, value: item.oneCoinValue }));
            this.props.dispatch(updateCoinDetail(item))
            this.props.dispatch(getScreenName({getScreen:"menu_buy_sell"}))
            this.props.dispatch(setStep("step10"));
        }
        this.setState({
            buyDrawer: true
        })
    }
    showInternalTransfer=()=>{
      if(!this.props?.twoFA?.isEnabled){
        this.props.history.push("/enabletwofactor");
        return;
    }
      if (this.props?.userProfile?.isDocsRequested) {
        this.props.history.push("/docnotices");
        return;
    }
   else if (!this.props?.userProfile?.isKYC) {
        this.props.history.push("/notkyc");
        return;
    }else{
      this.props.dispatch(getScreenName({getScreen:"dashboard"}))
      this.props.history.push(`/internalTransfer`)
    }}
  
    showSendReceiveDrawer = async(e, value) => {
      let selectedObj = { ...value };
      selectedObj.coin = selectedObj.coin?.toUpperCase();
      this.props.dispatch(fetchWithDrawWallets({ customerId: this.props?.userProfile?.id }));
      this.props.dispatch(handleSendFetch({ key: "cryptoWithdraw", activeTab: null }));
      this.props.dispatch(setSubTitle(apiCalls.convertLocalLang("wallet_address")));
      let coin = value.coin?.toUpperCase();
      if (!this.props?.userProfile?.isKYC) {
          this.props.history.push("/notkyc");
          return;
      }
      if(!this.props?.twoFA?.isEnabled){
          this.props.history.push("/enabletwofactor");
          return;
      }
      if (this.props?.userProfile?.isDocsRequested) {
          this.props.history.push("/docnotices");
          return;
      }
      if (!this.props?.userProfile?.isKYC) {
          this.props.history.push("/notkyc");
          return;
      }
      const isDocsRequested = this.props.userProfile.isDocsRequested;
      if (isDocsRequested) {
          this.showDocsError();
          return;
      }
      if (e === 2) {
          this.props.dispatch(setWithdrawfiatenaable(true))
          this.props.dispatch(setWithdrawfiat({ walletCode: coin }))
          this.props.dispatch(setSelectedWithDrawWallet(selectedObj));
          this.props.dispatch(setSendCrypto(true));
           this.props.dispatch(getScreenName({getScreen:"withdraw"}))
          this.props.changeStep('withdraw_crypto_selected');
      } else {
        this.props.dispatch(setSendCrypto(false));
        this.props.dispatch(setWithdrawfiatenaable(false));
        this.props.dispatch(hideSendCrypto(false));
          this.props.dispatch(setSelectedWithDrawWallet(selectedObj));
         this.props.dispatch(getScreenName({getScreen:"deposit"}))
          this.props.dispatch(setStep("step7"));
          this.props.dispatch(setSubTitle(`${coin}` + " " + "balance" +" "+ ":" +" "+ `${selectedObj.coinBalance ?  selectedObj.coinBalance : '0'}`+`${" "}`+`${coin}`));
             const response = await createCryptoDeposit({ customerId: this.props.userProfile?.id, walletCode: coin, network: selectedObj?.netWork });
             if (response.ok) {
                this.props.dispatch(setWalletAddress(response.data));
             }else{
              this.setState({...this.state,errorMessage:apiCalls.isErrorDispaly(response)})

             }

          this.setState({
              ...this.state,
              sendDrawer: true
          })
      }
      this.setState({
          valNum: e
      }, () => {
          this.setState({
              ...this.state,
              sendDrawer: true,
              selctedVal: coin
          })

      })
  }
    closeDrawer = () => {
      this.props.dispatch(getScreenName({getScreen:"dashboard"}))
      this.props.dispatch(rejectWithdrawfiat())
      this.setState({
          buyDrawer: false,
          sendDrawer: false,
          transactions: false
      })
  }
  showTransactionDrawer =(item) => {
    this.setState({...this.state, transactions: true, selectedWallet: item?.coin});
}
     menuBar = (item) => (
      <Menu>
          <ul className="drpdwn-list">
            
              <li onClick={() => this.showBuyDrawer(item, "buy")}>
                  <Link  value={2} className="c-pointer">
                  <Translate content="buy" />
                  </Link>
              </li>
              <li onClick={() => this.showBuyDrawer(item, "sell")}>
                    <Link  value={4} className="c-pointer">
                    <Translate content="sell" />
                    </Link>
                </li>
                <li onClick={() => this.showInternalTransfer(item)}>
                  <Link  value={5} className="c-pointer">
                  <Translate content="menu_internal_transfer" />
                  </Link>
              </li>
              
          </ul>
      </Menu>
  )
    render() {
        const { Text,Title } = Typography;
        const { cryptoPortFolios } = this.props.dashboard
        return (
          <>
            {this.state.errorMessage != null && <Alert
            description={this.state.errorMessage}
            type="error"
            showIcon
            closable={false}
        />}
          <div className="" >
            <div className='fait-wallets-style m-0'>
            <Translate content="suissebase_title" component={Title} className="db-titles" />
              <Button className="dbchart-link mobile-viewall"  >
                  <Translate content="cockpit" onClick={() => this.cockpitCharts()}/>
              </Button>   
                    
              </div>
                {cryptoPortFolios?.loading ? (
               <Loader />
        ) : (
            <List
              className="mobile-list dash-mobile-list new-crypto-style"
              itemLayout="horizontal"
              dataSource={cryptoPortFolios.data}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={apiCalls.convertLocalLang("No_data")}
                  />
                )
              }}
              renderItem={(item) => (
                <List.Item
                  className="cytpo-list-style"
                  extra={
                    <div className='crypto-btns'>
                      
                      
                        <Translate
                        content="deposit"
                        component={Button}
                        className="custom-btn prime text-purewhite mr-16"
                        onClick={() =>  this.showSendReceiveDrawer(1, item)}
                      />
                      <Translate
                        content="withdraw"
                        component={Button}
                        type="primary"
                        onClick={() => this.showSendReceiveDrawer(2, item)}
                        className="custom-btn sec"
                        disabled={item.coinBalance > 0 ? false : true} 
                      />
                      
                      <Dropdown overlay={this.menuBar(item)} trigger={['click']} placement="bottomCenter" arrow overlayClassName="secureDropdown depwith-drpdown" >
                        <Link onClick={e => e.preventDefault()}>
                          <Space>
                          <span class="icon lg menu-bar p-relative"></span>
                          
                        </Space>
                      </Link>
                    </Dropdown>
                        
                    
                    </div>
                  }
                >
                 
                  <List.Item.Meta
                    avatar={<div className='crypto-bg'>
                      <span
                        className={`crypto-icon  ${item.coin}`}
                       
                      />
                      </div>
                    }
                    title={
                      <div className="crypto-card-design">
                        <div className='crypto-values'>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Text className="coin-style">
                            {item.coin}
                          </Text>
                         
                          
                        </div>
                        <Currency
                          defaultValue={item.coinBalance}
                          className="coinbal-style"
                          type={"text"}
                          prefix={""}
                        />
                        </div>
                        <div  className={` ${
                              item.coinValueinNativeCurrency > 0
                                ? "price-valgreen"
                                : "price-valred"
                            }`}>
                        <Currency
                            defaultValue={item.coinValueinNativeCurrency}
                            type={"text"}
                            className={`lg-fontsize ${
                              item.coinValueinNativeCurrency > 0
                                ? "text-green pg-text"
                                : "text-red red-text"
                            }`}
                          />
                          <span className={`icon sm  ${
                              item.coinValueinNativeCurrency > 0
                                ? "valupp-icon pg-arrow"
                                : "valdown-icon red-arrow"
                            }`} />
                            </div>
                      </div>
                    }
                  />
                
                </List.Item>
              )}
            />
        )}
            <BuySell
              showDrawer={this.state.buyDrawer}
              onClose={() => this.closeDrawer()}
            />
            <SendReceive showDrawer={this.state.sendDrawer} onClose={() => this.closeDrawer()} />
            {this.state.transactions && <TransactionsHistory
              showDrawer={this.state.transactions}
              selectWallet={this.state.selectedWallet}
              onClose={() => {
                this.closeDrawer();
              }}
            />}
          </div></>
        );
    }
}

const connectStateToProps = ({ sendReceive, userConfig, dashboard }) => {
  return { sendReceive, userProfile: userConfig.userProfileInfo, dashboard,twoFA:userConfig.twoFA }
}
const connectDispatchToProps = dispatch => {
  return {
      changeStep: (stepcode) => {
          dispatch(setStep(stepcode))
      },
      dispatch
  }
}

export default connect(connectStateToProps, connectDispatchToProps)(withRouter(YourPortfolio));
