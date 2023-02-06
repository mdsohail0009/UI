import React, { Component } from 'react';
import { Typography,Input, message, Spin,Button,Alert  } from 'antd';
import Translate from 'react-translate-component';
import { getData } from './api';
import NumberFormat from 'react-number-format';
import Loader from '../../Shared/loader';
import { connect } from 'react-redux';
import { withRouter,Link } from 'react-router-dom';
import { dashboardTransactionSub } from '../../utils/pubsub';
import TransactionsHistory from "../transactions.history.component";
import apicalls from '../../api/apiCalls';


class Portfolio extends Component {
    chart;
    constructor (props) {
        super(props);
        this.state = {
            transactions: false,
            alert: false,
            errorMessage: "",
            allDocs: false,
            selection: [],
            portfolioData: null,
            info: {},
            loading: true,
            transactionData: [],
            searchVal:[],
            fullViewData:[],
            marketCaps:[],
            dashBoardTransactions:[],
            errorMessage:null
        }
    }
    getTransactionData = async () => {
        this.setState({ ...this.state, loading: true ,errorMessage:null});
        let response = await getData();
        if (response.ok) {
            this.setState({ ...this.state, dashBoardTransactions:response.data, transactionData: response.data, loading: false ,errorMessage:null});
        } else {
            this.setState({...this.state,errorMessage:apicalls.isErrorDispaly(response),loading: false})
            message.destroy();

        }
    }
   
   
    handleSearch = ({ currentTarget: { value } }) => {
        if(value){
            let filterTransactionList =  this.state.transactionData.filter(item => item.wallet.toLowerCase().includes(value.toLowerCase()));
            this.setState({...this.state,transactionData:filterTransactionList,searchVal:value})
        }else{
            this.setState({...this.state,transactionData:this.state.dashBoardTransactions}) 
        }
    }
    componentWillUnmount() {
        this.transSub.unsubscribe();
    }
    componentDidMount() {
        this.getTransactionData()
        this.transSub = dashboardTransactionSub.subscribe(() => {
            this.getTransactionData()
        })
    }
    getNumberVal(item){
        if (item.value.indexOf("/") > -1) {
          let list = item.value.split("/");
          return (
            <>
              <NumberFormat
                value={list[0]}
                decimalSeparator="."
                displayType={"text"}
                thousandSeparator={true}
              />/
              <NumberFormat
                value={list[1]}
                decimalSeparator="."
                displayType={"text"}
                thousandSeparator={true}
              />
            </>
          );
        } else {
          return (
            <NumberFormat
              value={item.value}
              decimalSeparator="."
              displayType={"text"}
              thousandSeparator={true}
            />
          );
        }
    }
    transactionDrawer =() => {
        this.setState({ ...this.state, transactions: true});
    }
    closeDrawer = () => {
        this.setState({transactions: false});
    }
  
    render() {
        const { Title } = Typography;
        const {  loading } = this.state;
        const { Search } = Input;
       
        return (<>
         {this.state.errorMessage != null && <Alert
            description={this.state.errorMessage}
            type="error"
            showIcon
            closable={false}
        />}
            <div className='market-panel-newstyle'></div>
                <div className="markets-panel transaction-panel">
                    <div className='trans-align'>
                    <div className='transaction-title'>
                    <Translate component={Title} content="transactions_history" className="db-titles" />
                    <div className = 'search-box mobile-hide'>
                        <Search
                            placeholder="Search Wallet"
                            onChange={(value)=>this.handleSearch(value)}
                            size="middle"
                            bordered={false}
                            className="search-text" />
                      <div className = "search-btnexpand">
                      <span className="icon lg search-angle icon-space" />
                      </div>
                  </div> 
                  </div>
                    <Button className="dbchart-link"  >
                        <Link to="/transactions"><Translate content="cockpit" /></Link>
                    </Button></div>
                    <div className = 'search-box mobile-search'>
                        <Search
                            placeholder="Search Wallet"
                            onChange={(value)=>this.handleSearch(value)}
                            size="middle"
                            bordered={false}
                            className="search-text" />
                      <div className = "search-btnexpand">
                      <span className="icon lg search-angle icon-space" />
                      </div>
                  </div> 
                       {this.state.transactions &&
                       <TransactionsHistory
                        showDrawer={this.state.transactions}
                        onClose={() => {
                            this.closeDrawer();
                        }}
                    />
                       }
                      
                   
                    <div className='transaction-custom-table'>

                        <div className="responsive_table db-ts-grid">
                            <table className='pay-grid view mb-view'>
                                <thead>
                                    <tr>
                                        <th style={{width: "18%"}}>Date</th>
                                        <th style={{width: "15%"}}>Wallet</th>
                                       
                                        <th style={{width: "15%"}}>Value</th>
                                        <th style={{width: "15%"}}>State</th>
                                    </tr>
                                </thead>
                                {loading ? (
                                    <tbody>
                                        <tr>
                                            <td colSpan="8" className="p-16 text-center">
                                                <Loader />
                                            </td>
                                        </tr>{" "}
                                    </tbody>
                                ) : (
                                    <>
                                   {this.state.transactionData.length > 0 &&
                                    <tbody>
                                        {this.state.transactionData?.map((item, idx) => {
                                            return (
                                                <>
                                                    {this.state.transactionData.length > 0 ? 
                                                    <>
                                                     <tr key={idx}>
                                                        {/* <td style={{ width: "100px" }}><span className={``}></span></td> */}
                                                        
                                                        <td style={{ width: "100px" }}>
                                                     <div className='ts-tbdate'>
                                                        <Title className='ts-date'>{item?.date }</Title></div>
                                                            </td>
                                                     <td><div className='ts-wallet'>
                                                        <Title className='ts-coin'>{item.wallet}</Title>
                                                     <Title className='ts-type'>{item.type}</Title></div></td>

                                                        <td>{this.getNumberVal(item)}</td>
                                                        <td>{item.state} </td>
                                                    </tr>
                                                    </>
                                                        : <tr>
                                                            <td  style={{padding:"13px"}}>No transaction details available.</td>
                                                        </tr>
                                                        }
                                                        </>
                                            )
                                        })}

                                        {loading && <tr>
                                            <td colSpan='5' className='text-center p-16'><Spin size='default' /></td></tr>}
                                    </tbody>}
                                    {!(this.state.transactionData.length > 0) &&
                                    <tbody>
                          <tr>
                            <td
                              colSpan="8"
                              className="p-16 text-center no-transaction"
                              style={{width: 300 }}
                            >
                             No transaction details available
                            </td>
                          </tr>{" "}
                        </tbody>
                        }
                                    </>
                                    )}
                            </table>
                        </div>
                    </div>
            </div>
       </> );
    }
}

const connectStateToProps = ({ userConfig }) => {
    return { userProfileInfo: userConfig.userProfileInfo, twoFA:userConfig.twoFA }
}
const connectDispatchToProps = dispath => {
    return { dispath }
}
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(Portfolio));