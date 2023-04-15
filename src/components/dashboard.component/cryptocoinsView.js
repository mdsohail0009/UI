import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { List, Button,Input, Typography, Empty,Dropdown, Menu, Space,Alert } from 'antd';
import Translate from 'react-translate-component';
import BuySell from '../buy.component';
import SendReceive from '../send.component'
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

const CryptocoinsView=(props)=> {
   const [state,setState]=useState({
        loading: true,
        initLoading: true,
        portfolioData: [], 
        buyDrawer: false, 
        sendDrawer: false,
        selectedWallet: '',
        searchVal:[],
        coinData:[],
        transactionData: props.dashboard.cryptoPortFolios.data,
        fullViewData:[],
        marketCaps:[],
        dashBoardTransactions:props.dashboard.cryptoPortFolios.data,
        errorMessage:null})
    useEffect(()=>{
if(props.dashboard.cryptoPortFolios.data!==state.transactionData){
  setState({...state,transactionData:props.dashboard.cryptoPortFolios.data})

}
    },[props.dashboard.cryptoPortFolios.data])  
    const  showBuyDrawer = (item, key) => {
        if (!props?.userProfile?.isKYC) {
            props.history.push("/notkyc");
            return;
        }
        else if (!props.twoFA?.isEnabled) {
            props.history.push("/enabletwofactor");
            return;
        }
        else if (props?.userProfile?.isDocsRequested) {
            props.history.push("/docnotices");
            return;
        }

        if (key === "buy") {
            props.dispatch(fetchSelectedCoinDetails(item.coin));
            props.dispatch(setCoin({ ...item, toWalletCode: item.coin, toWalletId: item.id, toWalletName: item.coinFullName }));
            convertCurrency({ from: item.coin, to: "USD", value: 1, isCrypto: false, customer_id: props.userProfile?.id, screenName: null }).then(val => {
                props.dispatch(setExchangeValue({ key: item.coin, value: val }));
            });
            props.dispatch(setSellHeaderHide(false));
            props.dispatch(getScreenName({getScreen:"menu_buy_sell"}))
            props.dispatch(setStep("step2"));
        } else if (key === "sell") {
          props.dispatch(setSellHeaderHide(false));
            props.dispatch(setCoin(item));
            props.dispatch(setExchangeValue({ key: item.coin, value: item.oneCoinValue }));
            props.dispatch(updateCoinDetail(item))
            props.dispatch(getScreenName({getScreen:"menu_buy_sell"}))
            props.dispatch(setStep("step10"));
        }
        setState({
            buyDrawer: true
        })
    }
    const showInternalTransfer=()=>{
      if(!props?.twoFA?.isEnabled){
        props.history.push("/enabletwofactor");
        return;
    }
      if (props?.userProfile?.isDocsRequested) {
        props.history.push("/docnotices");
    }
   else if (!props?.userProfile?.isKYC) {
        props.history.push("/notkyc");
        return;
    }else{
      props.dispatch(getScreenName({getScreen:"dashboard"}))
      props.history.push(`/internalTransfer`)
    }}
  const showDocsError=()=> {
    props.history.push("/docnotices");
  }
    const showSendReceiveDrawer = async(e, value) => {
      setState({...state,errorMessage:null})
      let selectedObj = { ...value };
      selectedObj.coin = selectedObj.coin?.toUpperCase();
      props.dispatch(fetchWithDrawWallets({ customerId: props?.userProfile?.id }));
      props.dispatch(handleSendFetch({ key: "cryptoWithdraw", activeTab: null }));
      props.dispatch(setSubTitle(apiCalls.convertLocalLang("wallet_address")));
      let coin = value.coin?.toUpperCase();
      if (!props?.userProfile?.isKYC) {
          props.history.push("/notkyc");
          return;
      }
      if(!props?.twoFA?.isEnabled){
          props.history.push("/enabletwofactor");
          return;
      }
      if (props?.userProfile?.isDocsRequested) {
          props.history.push("/docnotices");
          return;
      }
      if (!props?.userProfile?.isKYC) {
          props.history.push("/notkyc");
          return;
      }
      const isDocsRequested = props.userProfile.isDocsRequested;
      if (isDocsRequested) {
          showDocsError();
          return;
      }
      if (e === 2) {
          props.dispatch(setWithdrawfiatenaable(true))
          props.dispatch(setWithdrawfiat({ walletCode: coin }))
          props.dispatch(setSelectedWithDrawWallet(selectedObj));
          props.dispatch(setSendCrypto(true));
          props.changeStep('withdraw_crypto_selected');
          props.dispatch(getScreenName({getScreen:"withdraw"}))
          console.log(state)
      } else {
        props.dispatch(setSendCrypto(false));
        props.dispatch(setWithdrawfiatenaable(false));
        props.dispatch(hideSendCrypto(false));
          props.dispatch(setSelectedWithDrawWallet(selectedObj));
          props.dispatch(getScreenName({getScreen:"deposit"}))
          props.dispatch(setStep("step7"));
          props.dispatch(setSubTitle(`${coin}` + " " + "balance" +" "+ ":" +" "+ `${selectedObj.coinBalance ?  selectedObj.coinBalance : '0'}`+`${" "}`+`${coin}`));
             const response = await createCryptoDeposit({ customerId: props.userProfile?.id, walletCode: coin, network: selectedObj?.netWork });
             if (response.ok) {
                props.dispatch(setWalletAddress(response.data));
                setState({...state,errorMessage:null})
             }else{
              setState({...state,errorMessage:apiCalls.isErrorDispaly(response)})
  
          }

          setState({
              ...state,
              sendDrawer: true
          })
      }
      setState(prevState => ({
        ...prevState,
        sendDrawer: true,
        selctedVal: coin
     }));
  }
  const closeDrawer = () => {
      props.dispatch(getScreenName({getScreen:"dashboard"}))
      props.dispatch(rejectWithdrawfiat())
      setState({
          buyDrawer: false,
          sendDrawer: false,
          transactions: false
      })
  }
   const menuBar = (item) => (
      <Menu>
          <ul className="drpdwn-list">
              <li onClick={() => showBuyDrawer(item, "buy")}>
                  <Link  value={2} className="c-pointer">
                  <Translate content="buy" />
                  </Link>
              </li>
              <li onClick={() => showBuyDrawer(item, "sell")}>
                    <Link  value={4} className="c-pointer">
                    <Translate content="sell" />
                    </Link>
                </li>
                <li onClick={() => showInternalTransfer()}>
                  <Link  value={5} className="c-pointer">
                  <Translate content="menu_internal_transfer" />
                  </Link>
              </li>
              
          </ul>
      </Menu>
  )
  const handleSearch = ({ currentTarget: { value } }) => {
    if(value){
        let filterTransactionList =  props.dashboard?.cryptoPortFolios?.data.filter(item => item.coin.toLowerCase().includes(value.toLowerCase()));
        setState({...state,transactionData:filterTransactionList,searchVal:value})
    }else{
        setState({...state,transactionData:state.dashBoardTransactions}) 
    }
}
        const { Text,Title } = Typography;
        const { cryptoPortFolios } = props.dashboard
        const { Search } = Input;
       
        return (
          <div className="main-container" >
             {state.errorMessage != null && <Alert
          description={state.errorMessage}
          type="error"
          showIcon
          closable={false}
      />}
            {cryptoPortFolios?.loading ? (
               <Loader />
        ) : (
            <div className='coinveiw-newpage'>
            <div className="backbtn-arrowmb"><Link  to="/cockpit"><span className="icon md leftarrow c-pointer backarrow-mr"></span><span className="back-btnarrow c-pointer">Back</span></Link></div>
            <div className='fait-wallets-style m-0 new-viewpage'>
            <Translate content="suissebase_title" component={Title} className="db-titles" />
            <div className = 'search-box'>
              <Search
                             placeholder={apiCalls.convertLocalLang('search_currency')} 
                            onChange={(value)=>handleSearch(value)}
                            size="middle"
                            bordered={false}
                            className="search-text search-view" />
                      <div className = "search-btnexpand">
                      <span className="icon lg search-angle icon-space" />
                      </div>
                  </div> 
                     
              </div>
            <List
              className="mobile-list"
              itemLayout="horizontal"
              dataSource={state.transactionData || cryptoPortFolios.data}
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
                        onClick={() => showSendReceiveDrawer(1, item)}
                      />
                      <Translate
                        content="withdraw"
                        component={Button}
                        type="primary"
                        onClick={() => showSendReceiveDrawer(2, item)}
                        className="custom-btn sec"
                        disabled={item.coinBalance > 0 ? false : true} 
                      />
                      
                      <Dropdown overlay={menuBar(item)} trigger={['click']} placement="bottomCenter" arrow overlayClassName="secureDropdown depwith-drpdown" >
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
                        className={`crypto-icon ${item.coin}`}
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
            
      
        </div>)}
            <BuySell
              showDrawer={state.buyDrawer}
              onClose={() => closeDrawer()}
            />
            {console.log(state.sendDrawer,"state.sendDrawer")}
            <SendReceive showDrawer={state.sendDrawer} onClose={() => closeDrawer()} />
            {state.transactions && <TransactionsHistory
              showDrawer={state.transactions}
              selectWallet={state.selectedWallet}
              onClose={() => {
                closeDrawer();
              }}
            />}
          </div>
        );
    // }
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

export default connect(connectStateToProps, connectDispatchToProps)(withRouter(CryptocoinsView));
