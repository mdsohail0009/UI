import React, { Component } from 'react'
import { Card,List,Button, Row, Col,Empty, Menu,Dropdown,Input,Typography, Radio, Spin,Space,Drawer } from 'antd';
import apiCalls from "../../api/apiCalls";
import { connect } from 'react-redux';
import PieChart from '../trading.components/piechart';
import { Link } from 'react-router-dom';
import BChart from '../trading.components/bar.Chart';
import LChart from '../trading.components/line.Chart';
import Translate from 'react-translate-component';
import Loader from "../../Shared/loader";
import SendReceive from '../send.component'
import Currency from '../shared/number.formate';
import BuySell from '../buy.component';
import TransactionsHistory from "../transactions.history.component";
import { setWithdrawfiatenaable, setStep } from '../../reducers/sendreceiveReducer'
import {setReceiveFiatHead, setSendFiatHead} from '../../reducers/buyFiatReducer';
import { setdepositCurrency, getCurrencieswithBankDetails } from '../../reducers/depositReducer'
import OnthegoFundTransfer from '../onthego.transfer';
import SuissebaseFiat from '../buyfiat.component/suissebaseFiat';
import MassPayment from '../buyfiat.component'
import { buyFiatSteps as config } from '../buyfiat.component/config';
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
    closeDrawer = () => {
        this.setState({
            buyFiatDrawer: false,
            transactions: false
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
           
            <div className='coinveiw-newpage'>
            <div className="backbtn-arrowmb"><Link className="icon md leftarrow c-pointer backarrow-mr" to="/" /><span className="back-btnarrow">Back</span></div>
            <div className='fait-wallets-style m-0 new-viewpage'>
            <Translate content="fait_walets" component={Title} className="db-titles" />
            <div className = 'search-box'>
              {/* <input className = "search-text" type="text" placeholder = "Search Anything" /> */}
              <Search
                            placeholder="Search Transactions"
                            onChange={(value)=>this.handleSearch(value)}
                            size="middle"
                            bordered={false}
                            className="search-text" />
                      <div className = "search-btnexpand">
                      <span className="icon lg search-angle icon-space" />
                      </div>
                  </div> 
              {/* <Button className="dbchart-link"  onClick={() => this.cockpitCharts()} >
                  <Translate content="cockpit" />
              </Button>   
                     */}
                     
              </div>
                {wallets?.loading ? (
               <Loader />
        ) : (
            <List
              className="mobile-list"
              itemLayout="horizontal"
              dataSource={this.state.transactionData}
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
                  className="cytpo-list-style"
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
                  <List.Item.Meta
                    avatar={<div className='crypto-bg'>
                      <span
                        className={`crypto-icon c-pointer ${item.walletCode.toLowerCase()}`}
                        onClick={() =>
                          this.props.history.push(
                            "/coindetails/" + item.walletCode.toLowerCase()
                          )
                        }
                      />
                      </div>
                    }
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
                        <Currency
                            defaultValue={item.amount}
                            type={"text"}
                            className={`lg-fontsize ${
                              item.amount > 0
                                ? "text-green pg-text"
                                : "text-red red-text"
                            }`}
                          />
                          <span className={`icon sm  ${
                              item.amount > 0
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
                        <span onClick={() => this.setState({ ...this.state, showFuntransfer: false })} className="icon md close-white c-pointer" />
                    </div>]}
                    className="side-drawer"
                    visible={this.state.showFuntransfer}
                >
                    <OnthegoFundTransfer selectedCurrency={this.state.selectedCurrency} ontheGoType={"Onthego"} onClosePopup={() => this.setState({ ...this.state, showFuntransfer: false })}  />
                </Drawer>
          </div>
            {/* <Row gutter={16}>
                {this.state.reports && <>{this.state.reports.map(elem => (
                    <Col xs={24} sm={24} md={24} lg={12} xl={12} xxl={8}>
                        <Card className="db-card" onClick={() => this.viewReport(elem)}>
                            <div className="d-flex">
                                <span className='icon lg dashboard mr-16' />
                                <div style={{ flex: 1 }}>
                                    <Title className="fs-20 fw-600 mb-0 text-white-30">{elem.name}</Title>
                                    <Paragraph className="text-white-30 fs-14 fw-200 mb-0">{elem.description}</Paragraph>
                                </div>
                            </div>
                        </Card>
                    </Col>
                ))}</>}
            </Row> */}


        </>)

    }
}
const connectStateToProps = ({ breadCrumb, oidc, userConfig, sendReceive, dashboard }) => {
    return {dashboard,sendReceive, breadCrumb, oidc, userConfig: userConfig.userProfileInfo, }
}

export default connect(connectStateToProps, (dispatch) => { return { dispatch } })(CockpitCharts);
