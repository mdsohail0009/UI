import React, { Component } from 'react'
import { List,Button, Empty, Menu,Dropdown,Input,Typography,Space,Drawer,Image } from 'antd';
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
import { getScreenName } from '../../reducers/feturesReducer';
const { Title, Paragraph, Text } = Typography;

class CockpitCharts extends Component {
    state = {
        reports: [],
        c: null,
        cumulativePNL: null,
        assetAlloction: null,
        dailyPnl: null,
        profits: null,
        assetnetWorth: null,
        isLoading:false,
        transactionData:this.props.dashboard.wallets.data,
        searchVal:[],
        fullViewData:[],
        marketCaps:[],
        dashBoardTransactions:this.props.dashboard.wallets.data,
        buyFiatDrawer: false,
        selctedVal: '',
        valNum: 1,
        showFuntransfer: false,
    }

    componentDidMount() {
        this.loadKpis();
        this.loadDashboards(30);
        this.cokpitKpiTrack();
    }
    cokpitKpiTrack = () => {
        apiCalls.trackEvent({ "Type": 'User', "Action": 'Cockpit KPI page view', "Username": this.props.userProfileInfo?.userName, "customerId": this.props.userProfileInfo?.id, "Feature": 'Cockpit', "Remarks": 'Cockpit KPI page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Cockpit' });
    }
    loadDashboards = async (Days) => {
        this.setState({ ...this.state, cumulativePNL: null, profits: null, dailyPnl: null, assetnetWorth: null, assetAlloction: null })
        await Promise.all([
            apiCalls.getdshcumulativePnl(Days).then(_response => {
                if (_response.ok) {
                    this.setState({ ...this.state, cumulativePNL: _response.data })
                }
            }),
            apiCalls.getprofits(Days).then(_res => {
                if (_res.ok) {
                    this.setState({ ...this.state, profits: _res.data })
                }
            }),
            apiCalls.getdailypnl(Days).then(_dailyPnlres => {
                if (_dailyPnlres.ok) {
                    this.setState({ ...this.state, dailyPnl: _dailyPnlres.data })
                }
            }),
            apiCalls.getAssetNetwroth(Days).then(assetnetWorthres => {
                if (assetnetWorthres.ok) {
                    this.setState({ ...this.state, assetnetWorth: assetnetWorthres.data })
                }
            }),
            apiCalls.getAssetAllowcation(Days).then(assetAlloctionres => {
                if (assetAlloctionres.ok) {
                    this.setState({ ...this.state, assetAlloction: assetAlloctionres.data })
                }
            }),
        ]);
    }
    loadData = async () => {
        let response = await apiCalls.getreports('getReports');
        if (response.ok) {
            this.setState({ reports: response.data })
        }
    }
    loadKpis = async () => {
        this.setState({...this.state,isLoading:true})
        let response = await apiCalls.getdshKpis();
        if (response.ok) {
            this.setState({ ...this.state, kpis: response.data })
            this.setState({...this.state,isLoading:false})

        }
    }

    viewReport = (elem) => {
        this.props.history.push('/cockpit/reportview/' + elem.name);
        apiCalls.trackEvent({ "Action": 'View Reports', "Feature": 'Dashboard', "Remarks": "View Reports", "FullFeatureName": 'Dashboard View Reports', "userName": this.props.userConfig.userName, id: this.props.userConfig.id });
    }
    showSendReceiveDrawer = (e, value) => {
        this.props.dispatch(setStep("step1"));
        const is2faEnabled =  this.props.userConfig?.twofactorVerified;
        if (!this.props?.userConfig?.isKYC) {
            this.props.history.push("/notkyc");
            return;
        }
        if (!is2faEnabled) {
            this.props.history.push("/enabletwofactor");
            return;
        }
        if (this.props?.userConfig?.isDocsRequested) {
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
            this.props.history.push(`/internaltransfer`)
        }
        
    }
    closeDrawer = () => {
        this.props.dispatch(getScreenName({getScreen:"dashboard"}))
        this.setState({
            buyFiatDrawer: false,
            transactions: false,
            showFuntransfer:false,
        })
    }
    handleSearch = ({ currentTarget: { value } }) => {
        if(value){
            let filterTransactionList =  this.props.dashboard?.wallets?.data.filter(item => item.walletCode.toLowerCase().includes(value.toLowerCase()));
            this.setState({...this.state,transactionData:filterTransactionList,searchVal:value})
        }else{
            this.setState({...this.state,transactionData:this.state.dashBoardTransactions}) 
        }
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
    render() {
        const { Search } = Input;
        const { wallets } = this.props.dashboard;
        return (<>
            <div className="main-container" >

           
            <div className='coinveiw-newpage'>
            <div className="backbtn-arrowmb"><Link className="icon md leftarrow c-pointer backarrow-mr" to="/" /><span className="back-btnarrow">Back</span></div>
            <div className='fait-wallets-style m-0 new-viewpage'>
            <Translate content="fait_walets" component={Title} className="db-titles" />
            <div className = 'search-box'>
              <Search
                             placeholder={apiCalls.convertLocalLang('search_currency')} 
                            onChange={(value)=>this.handleSearch(value)}
                            size="middle"
                            bordered={false}
                            className="search-text" />
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
              dataSource={this.state.transactionData}
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
                        onClick={() => this.showSendReceiveDrawer(1, item.walletCode)}
                      />
                      <Translate
                        content="withdraw"
                        component={Button}
                        type="primary"
                        onClick={() => { this.showSendReceiveDrawer(2, item.walletCode) }}
                        className="custom-btn sec"
                      />
                      
                      <Dropdown 
                                overlay={this.menuBar(item)}
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
                          prefix={""}
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
                            <Translate className="drawer-maintitle"  component={Paragraph} />
                            </div>
                        }
                        <span onClick={() => this.closeDrawer()} className="icon md close-white c-pointer" />
                    </div>]}
                    className="side-drawer"
                    visible={this.state.showFuntransfer}
                >
                    <OnthegoFundTransfer selectedCurrency={this.state.selectedCurrency} ontheGoType={"Onthego"} onClosePopup={() => this.closeDrawer()}  />
                </Drawer>
          </div>
        </>)

    }
}
const connectStateToProps = ({ breadCrumb, oidc, userConfig, sendReceive, dashboard }) => {
    return {dashboard,sendReceive, breadCrumb, oidc, userConfig: userConfig.userProfileInfo, }
}

export default connect(connectStateToProps, (dispatch) => { return { dispatch } })(CockpitCharts);
