import React, { Component } from 'react';
import { connect } from 'react-redux';
import { List, Button, Typography, Empty, Image,Dropdown, Menu, Space } from 'antd';
import Translate from 'react-translate-component';
import BuySell from '../buy.component';
import SendReceive from '../send.component'
import ConnectStateProps from '../../utils/state.connect';
import { fetchYourPortfoliodata,fetchMarketCoinData,fetchDashboardcalls } from '../../reducers/dashboardReducer';
import Currency from '../shared/number.formate';
import { fetchSelectedCoinDetails, setExchangeValue, setCoin } from '../../reducers/buyReducer';
import { setStep, setSellHeaderHide } from '../../reducers/buysellReducer';
import { updateCoinDetail } from '../../reducers/sellReducer'
import { convertCurrency } from '../buy.component/buySellService';
import { withRouter, Link } from 'react-router-dom';
import apiCalls from '../../api/apiCalls';
import { fetchWithDrawWallets, handleSendFetch, setSelectedWithDrawWallet, setSubTitle, setWithdrawfiatenaable,rejectWithdrawfiat, setWithdrawfiat,setWalletAddress, setSendCrypto, hideSendCrypto } from "../../reducers/sendreceiveReducer";
import { getcoinDetails } from './api';
import {createCryptoDeposit} from "../deposit.component/api";
import TransactionsHistory from "../transactions.history.component";
import Loader from "../../Shared/loader";

class YourPortfolio extends Component {
    state = {
        loading: true,
        initLoading: true,
        portfolioData: [], buyDrawer: false, coinData: null,sendDrawer: false,
        selectedWallet: ''
    }
    componentDidMount() {
        this.loadCryptos();
        this.loadCoinDetailData();
    }
    loadCoinDetailData = async () => {
      this.setState({ ...this.state, loading: true})
      this.props.dispatch(fetchMarketCoinData(false))
      const response = await getcoinDetails(this.props.match.params?.coinName,this.props.userProfile?.id);
      if (response.ok) {
          this.setState({ ...this.state, coinData: response.data },
              //  () => {this.coinChartData(1); }
          )
      }
      this.setState({ ...this.state, loading: false})
  }
    loadCryptos = () => {
        if (this.props.userProfile) {
            this.props.dispatch(fetchYourPortfoliodata(this.props.userProfile.id));
        }
    }
    cockpitCharts=()=>{
      this.props.history.push("/cockpitCharts");
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
            this.props.dispatch(fetchSelectedCoinDetails(item.coin, this.props.userProfile?.id));
            this.props.dispatch(setCoin({ ...item, toWalletCode: item.coin, toWalletId: item.id, toWalletName: item.coinFullName }));
            convertCurrency({ from: item.coin, to: "USD", value: 1, isCrypto: false, customer_id: this.props.userProfile?.id, screenName: null }).then(val => {
                this.props.dispatch(setExchangeValue({ key: item.coin, value: val }));
            });
            this.props.dispatch(setSellHeaderHide(false));
            this.props.dispatch(setStep("step2"));
        } else if (key === "sell") {
          this.props.dispatch(setSellHeaderHide(false));
            this.props.dispatch(setCoin(item));
            this.props.dispatch(setExchangeValue({ key: item.coin, value: item.oneCoinValue }));
            this.props.dispatch(updateCoinDetail(item))
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
      if (e == 2) {
          this.props.dispatch(setWithdrawfiatenaable(true))
          this.props.dispatch(setWithdrawfiat({ walletCode: coin }))
          this.props.dispatch(setSelectedWithDrawWallet(selectedObj));
          this.props.dispatch(setSendCrypto(true));
          this.props.changeStep('withdraw_crypto_selected');
        //   this.setState({
        //     ...this.state,
        //     sendDrawer: true
        // })
      } else {
        this.props.dispatch(setSendCrypto(false));
        this.props.dispatch(setWithdrawfiatenaable(false));
        this.props.dispatch(hideSendCrypto(false));
          this.props.dispatch(setSelectedWithDrawWallet(selectedObj));
         // this.props.dispatch(setSubTitle(`${selectedObj.coinBalance ? selectedObj.coinBalance : '0'} ${selectedObj.coin}` + " " + apiCalls.convertLocalLang('available')));
          this.props.dispatch(setStep("step7"));
          this.props.dispatch(setSubTitle(` ${coin}` + " " + "balance" +" "+ ":" +" "+ `${selectedObj.coinBalance ?  selectedObj.coinBalance : '0'}`+`${" "}`+`${coin}`
            ));
             const response = await createCryptoDeposit({ customerId: this.props.userProfile?.id, walletCode: coin, network: selectedObj?.netWork });
             if (response.ok) {
                this.props.dispatch(setWalletAddress(response.data));
               // this.props.dispatch(fetchDashboardcalls(this.props.userProfile?.id));
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
          <ul className="pl-0 drpdwn-list">
              {/* <li  onClick={() =>  this.showSendReceiveDrawer(1, item)}>
                  <Link value={1} className="c-pointer">Receive</Link>
              </li> */}
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
        const { Title, Text } = Typography;
        const { cryptoPortFolios } = this.props.dashboard
        const { totalCryptoValue, totalFiatValue } = this.props.dashboard.portFolio.data;
        const { coinData } = this.state;
        return (
          <div className="" style={{borderTop:'1px solid #c2c2c2'}}>
{/*            
           <div  className="portfolio-title mb-8">
           <div className='portfolio-data' >
            <Translate
              content="your_portfolio"
              component={Title}
              className="fs-24 text-white mb-0 fw-600 mr-8"
            />
            <Currency prefix={"$"} defaultValue={totalCryptoValue}  className={`text-white-30 fs-16 m-0 ${totalCryptoValue < 0 ? 'text-red' : 'text-green'}`} style={{ lineHeight: '18px' }} />
            </div>
              <div>
              <Link to="/cockpitCharts" className="dbchart-link fs-14 fw-500">
                <Translate content="cockpit" />
                <span className="icon sm right-angle ml-4" />
              </Link>

               <Button className="pop-btn dbchart-link fs-14 fw-500" style={{ height: 36,}} onClick={() => this.cockpitCharts()} >
                  <Translate content="cockpit" />
                  <span className="icon sm right-angle ml-4" />
              </Button> 
                    
              </div>
            </div> */}
        {cryptoPortFolios?.loading ? (
               <Loader />
        ) : (
            <List
              className="mobile-list dash-mobile-list"
              itemLayout="horizontal"
              dataSource={cryptoPortFolios.data}
              //loading={cryptoPortFolios.loading}
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
                  className=""
                  extra={
                    <div className='crypto-btns'>
                      
                      {/* <Translate
                        content="sell"
                        component={Button}
                        className="custom-btn sec ml-16"
                        onClick={() => this.showBuyDrawer(item, "sell")}
                      /> */}
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
                      />
                      
                      <Dropdown overlay={this.menuBar(item)} trigger={['click']} placement="bottomCenter" arrow overlayClassName="secureDropdown depwith-drpdown" >
                        <a onClick={e => e.preventDefault()}>
                          <Space>
                          <span class="icon md menu-bar ml-4 p-relative"></span>
                          {/* <DownOutlined /> */}
                        </Space>
                      </a>
                    </Dropdown>
                     {/* <span class="icon md bell ml-4 p-relative"></span> */}
                     {/* <Dropdown overlay={this.depostWithdrawMenu} trigger={['click']} placement="bottomCenter" arrow overlayClassName="secureDropdown depwith-drpdown" >
                     <span class="icon md bell ml-4 p-relative"></span>
                    </Dropdown> */}
                    </div>
                  }
                >
                  {/* to={"/coindetails/" + item.coinFullName.toLowerCase()} */}
                  <List.Item.Meta
                    avatar={
                      <span
                        className={`coin c-pointer ${item.coin}`}
                        onClick={() =>
                          this.props.history.push(
                            "/coindetails/" + item.coinFullName.toLowerCase()
                          )
                        }
                      />
                    }
                    title={
                      <div className="mr-16">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Text className="fs-16 fw-600 text-upper text-white">
                            {item.coin}
                          </Text>
                          <Text className="fs-14 px-8 text-secondary">|</Text>
                          <Currency
                            defaultValue={item.coinValueinNativeCurrency}
                            type={"text"}
                            className={`lg-fontsize ${
                              item.coinValueinNativeCurrency > 0
                                ? "text-green"
                                : "text-red"
                            }`}
                          />
                        </div>
                        <Currency
                          defaultValue={item.coinBalance}
                          className="text-white fs-18 text-left"
                          type={"text"}
                          prefix={""}
                        />
                      </div>
                    }
                  />
                  {/* <div className='text-right fs-20 text-white'>
                                <Currency defaultValue={item.coinBalance} type={"text"} prefix={""} />
                                <Currency defaultValue={item.coinValueinNativeCurrency} type={"text"} className={`fs-16 ${item.coinValueinNativeCurrency > 0 ? "text-green" : "text-red"}`} />
                            </div> */}
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
          </div>
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
//export default ConnectStateProps(withRouter(YourPortfolio));
