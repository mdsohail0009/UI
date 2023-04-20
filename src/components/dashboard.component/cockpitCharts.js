import React, { useState,useEffect } from 'react'
import { List,Button, Empty, Menu,Dropdown,Input,Typography,Space,Drawer,Image,Alert } from 'antd';
import apiCalls from "../../api/apiCalls";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import Translate from 'react-translate-component';
import Loader from "../../Shared/loader";
import Currency from '../shared/number.formate';
import TransactionsHistory from "../transactions.history.component";
import { setWithdrawfiatenaable, setStep } from '../../reducers/sendreceiveReducer'
import {setReceiveFiatHead, setSendFiatHead} from '../../reducers/buyFiatReducer';
import { setdepositCurrency } from '../../reducers/depositReducer'
import OnthegoFundTransfer from '../onthego.transfer';
import SuissebaseFiat from '../buyfiat.component/suissebaseFiat';
import MassPayment from '../buyfiat.component'
import { buyFiatSteps as config } from '../buyfiat.component/config';
import { getScreenName } from '../../reducers/feturesReducer';
import PersonalInternalTransferComponent from '../personalInternalTransfer.component';
const { Title, Paragraph, Text } = Typography;

const CockpitCharts=(props)=> {
 const [state,setState] = useState({
        reports: [],
        c: null,
        cumulativePNL: null,
        assetAlloction: null,
        dailyPnl: null,
        profits: null,
        assetnetWorth: null,
        isLoading:false,
        transactionData:props.dashboard.wallets.data,
        searchVal:[],
        fullViewData:[],
        marketCaps:[],
        dashBoardTransactions:props.dashboard.wallets.data,
        buyFiatDrawer: false,
        selctedVal: '',
        valNum: 1,
        showFuntransfer: false,
        errorMessage:null,
        personalTransafershowDrawer:false
    })
    useEffect(()=>{
        if(props.dashboard.wallets.data!==state.transactionData){
          setState({...state,transactionData:props.dashboard.wallets.data})
        }
    },[props.dashboard.wallets.data])
  const showSendReceiveDrawer = (e, value) => {
        props.dispatch(setStep("step1"));
        const is2faEnabled =  props?.twoFA?.isEnabled;
        if (!props?.userConfig?.isKYC) {
            props.history.push("/notkyc");
            return;
        }
        if (!is2faEnabled) {
            props.history.push("/enabletwofactor");
            return;
        }
        if (props?.userConfig?.isDocsRequested) {
            props.history.push("/docnotices");
            return;
        }

        if (e === 2) {
            props.dispatch(setReceiveFiatHead(false));
            props.dispatch(setSendFiatHead(false));
            props.dispatch(getScreenName({getScreen:"withdraw"}));
            setState(prevState => ({
                ...prevState,
                showFuntransfer: true, selectedCurrency:value,
             }));
        } else if (e === 1) {
            props.dispatch(setReceiveFiatHead(true));
            props.dispatch(setWithdrawfiatenaable(false))
            props.dispatch(setdepositCurrency(value))
            props.dispatch(getScreenName({getScreen:"deposit"}))
            setState(prevState => ({
              ...prevState,
              buyFiatDrawer: true, selctedVal:value
           }));
        }else if(e===3){
            props.history.push(`/payments/${value.walletCode}`)
        }else if(e===4){
            props.dispatch(getScreenName({getScreen:"dashboard"}))
            setState({ ...setState, personalTransafershowDrawer: true, selctedVal: value.walletCode })
          
        }else {
            props.dispatch(getScreenName({getScreen:"dashboard"}))
            props.history.push(`/internaltransfer`)
        }
        
    }
   const closeDrawer = () => {
        props.dispatch(getScreenName({getScreen:"dashboard"}))
        setState({
            buyFiatDrawer: false,
            transactions: false,
            showFuntransfer:false,
            personalTransafershowDrawer:false
        })
    }
   const handleSearch = ({ currentTarget: { value } }) => {
        if(value){
            let filterTransactionList =  props.dashboard?.wallets?.data.filter(item => item.walletCode.toLowerCase().includes(value.toLowerCase()));
            setState({...state,transactionData:filterTransactionList,searchVal:value})
        }else{
            setState({...state,transactionData:state.dashBoardTransactions}) 
        }
    }
   const menuBar = (item) => (
        <Menu>
            <ul className="drpdwn-list">
                <li onClick={() => showSendReceiveDrawer(3, item)}>
                    <Link value={3} className="c-pointer">
                    <Translate content="menu_payments" />
                    </Link>
                </li>
                <li 
                >

                    <Link to="/transactions" value={4} className="c-pointer"><Translate content="transactions_history" /></Link>
                   
                </li>
                
                {item?.walletCode==="EUR" && process.env.REACT_APP_PERSONAL_IBAN==="personal"&&<li onClick={() => showSendReceiveDrawer(4, item)}>
                    <Link value={5} className="c-pointer">
                    <Translate content="personal_iban_transafer" />
                    </Link>
                </li>}
            </ul>
        </Menu>
    )

        const { Search } = Input;
        const { wallets } = props.dashboard;
        const {transactionData}=state;
        
        return (<>
        {state.errorMessage != null && <Alert
            description={state.errorMessage}
            type="error"
            showIcon
            closable={false}
        />}
            <div className="main-container" >

           
            <div className='coinveiw-newpage'>
            <div className="backbtn-arrowmb"><Link  to="/cockpit"><span className="icon md leftarrow c-pointer backarrow-mr"></span><span className="back-btnarrow c-pointer">Back</span></Link></div>
            <div className='fait-wallets-style m-0 new-viewpage'>
            <Translate content="fait_walets" component={Title} className="db-titles" />
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
                {wallets?.loading ? (
               <Loader />
        ) : (
            <List
              className="mobile-list"
              itemLayout="horizontal"
              dataSource={transactionData || wallets.data}
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
                        onClick={() => showSendReceiveDrawer(1, item.walletCode)}
                      />
                      <Translate
                        content="withdraw"
                        component={Button}
                        type="primary"
                        onClick={() => { showSendReceiveDrawer(2, item.walletCode) }}
                        className="custom-btn sec"
                        disabled={item.amount > 0 ? false : true}
                      />
                      
                      <Dropdown 
                                overlay={menuBar(item)}
                                 trigger={['click']} placement="bottomCenter" arrow overlayClassName="secureDropdown depwith-drpdown" >
                            <a onClick={e => e.preventDefault()}>
                              <Space>
                              <span class="icon lg menu-bar p-relative"></span>

                            </Space>
                          </a>
                        </Dropdown>
                 
                    </div>
                  }
                >
                  <List.Item.Meta
                     avatar={<Image preview={false} src={item.imagePath} />}
                    title={
                      <div className="crypto-card-design">
                        <div className='crypto-values'>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Text className="coin-style">
                            {item.walletCode}
                          </Text>
                        </div>
                        <Currency
                          defaultValue={item.amount}
                          className="coinbal-style"
                          type={"text"}
                          prefix={
                            (item?.walletCode == "USD" ? "$" : null) ||
                            (item?.walletCode == "EUR" ? "€" : null)||
                            (item?.walletCode == "GBP" ? "£" : null)||
                            (item?.walletCode == "CHF" ? "₣" : null) ||
                            (item?.walletCode == "SGD" ? "S$" : null)
                          }
                        />
                        </div>
                        <div  className={` ${
                              item.amount > 0
                                ? "price-valgreen"
                                : "price-valred"
                            }`}>
                            </div>
                      </div>
                    }
                  />
                 
                </List.Item>
              )}
            />
            
        )}
        </div>
        <SuissebaseFiat showDrawer={state.sendReceiveDrawer} valNum={state.valNum} onClose={() => closeDrawer()} />
                {state.buyFiatDrawer && <MassPayment showDrawer={state.buyFiatDrawer} tabData={{ tabVal: state.valNum, walletCode: state.selctedVal }} onClose={() => closeDrawer()} />}
                {state.transactions && <TransactionsHistory
                    showDrawer={state.transactions} selectWallet={state.selectedWallet}
                    onClose={() => {
                        closeDrawer();
                    }}
                />}
                {process.env.REACT_APP_PERSONAL_IBAN==="personal" &&state.personalTransafershowDrawer && <PersonalInternalTransferComponent showDrawer={state.personalTransafershowDrawer}  walletCode={state.selctedVal} onClose={() => {
                        closeDrawer();
                    }}/>}
                <Drawer
                    destroyOnClose={true}
                    title={[<div className="side-drawer-header">
                        <span></span>
                        {!props.buyFiat?.sendFiatHeader && <div className="text-center">
                            <Translate className="drawer-maintitle" content={props.buyFiat.stepTitles[config[props.buyFiat.stepcode]]} component={Paragraph} />
                            </div>
                        }
                          
                        <span onClick={() => closeDrawer()} className="icon md close-white c-pointer" />
                    </div>]}
                    className="side-drawer"
                    visible={state.showFuntransfer}
                >
                    <OnthegoFundTransfer selectedCurrency={state.selectedCurrency} ontheGoType={"Onthego"} onClosePopup={() => closeDrawer()}  />
                </Drawer>
          </div>
        </>)

    
}
const connectStateToProps = ({ breadCrumb, oidc, userConfig, sendReceive, dashboard,buyFiat }) => {
    return {dashboard,sendReceive, breadCrumb, oidc, userConfig: userConfig.userProfileInfo,buyFiat,twoFA:userConfig.twoFA }
}

export default connect(connectStateToProps, (dispatch) => { return { dispatch } })(CockpitCharts);
