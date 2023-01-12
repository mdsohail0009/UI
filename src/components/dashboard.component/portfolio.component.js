import React, { Component } from 'react';
import { Typography,Input, message, Spin,Button,Image,  } from 'antd';
import Translate from 'react-translate-component';
import { getData } from './api';
import NumberFormat from 'react-number-format';
import Loader from '../../Shared/loader';
import { connect } from 'react-redux';
import { withRouter,Link } from 'react-router-dom';
import { dashboardTransactionSub } from '../../utils/pubsub';
import TransactionsHistory from "../transactions.history.component";
import apiCalls from '../../api/apiCalls';
import { getcoinDetails } from './api';

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
            fullViewData:[]
        }
    }
    getTransactionData = async () => {
        debugger
        this.setState({ ...this.state, loading: true });
        let response = await getData();
        if (response.ok) {
            console.log(response.data)
            this.setState({ ...this.state, dashBoardTransactions:response.data, transactionData: response.data, loading: false });
        } else {
            message.destroy();

        }
    }
    // onSearch = ({ currentTarget: { value } }, isFullScreen) => {
    //     debugger
    //     let matches = this.state.transactionData.filter(item => item.copyType==value);
    //     this.setState({...this.state,searchVal:value})
    //     // searchVal(value)
    //     if (!isFullScreen) { 
    //         this.setState({...this.state,dashBoardTransactions:matches})
    //     } else {
    //         this.setState({...this.state,transactionData:matches})
    //     }

    // }
    onSearch = ({ currentTarget: { value } }) => {
        debugger
        let filterTransactionList;
        if (!value) {
            filterTransactionList = this.state.transactionData;
        } else {
            filterTransactionList =  this.state.transactionData.filter(item => item.wallet.toLowerCase().includes(value.toLowerCase()));
            this.setState({...this.state,searchVal:value})
        }
        this.setState({...this.state,transactionData:filterTransactionList})
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
        const { gridUrl, loading } = this.state;
        const { Search } = Input;
        return (<>
            <div className='market-panel-newstyle'></div>
                <div className="markets-panel transaction-panel">
                    <div className='trans-align'>
                    <div className='transaction-title'>
                    <Translate component={Title} content="transactions_history" className="db-titles" />
                    <div className = 'search-box'>
                        {/* <input className = "search-text" type="text" placeholder = "Search Anything" /> */}

                        <Search
                            placeholder="Search Transactions"
                            value={this.state.searchVal}
                            // addonAfter={<span className="icon md search-white" />}
                            onChange={(value) => this.onSearch(value)}
                            size="middle"
                            bordered={false}
                            className="search-text" />

                      <a  className = "search-btnexpand">
                      <span className="icon lg search-angle icon-space" />
                      </a>
                  </div> </div>
                    <Button className="dbchart-link"  >
                        <Link to="/transactions"><Translate content="cockpit" /></Link>
                    </Button></div>
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
                                        <th style={{width: "5%"}}></th>
                                        <th style={{width: "15%"}}>Wallet</th>
                                        {/* <th style={{width: "35%"}}>Type</th> */}
                                        <th style={{width: "18%"}}>Date</th>
                                        <th style={{width: "15%"}}>Value</th>
                                        <th style={{width: "15%"}}>Status</th>
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
                                   {this.state.transactionData.length > 0 ?
                                    <tbody>
                                        {this.state.transactionData?.map((item, idx) => {
                                            return (
                                                <>
                                                    {this.state.transactionData.length > 0 ? 
                                                    <>
                                                     <tr key={idx}>
                                                        <td style={{ width: "100px" }}><span className={``}></span></td>
                                                        {/* {`crypto-icon c-pointer ${item.coin}`} */}
                                                     <td><div className='ts-wallet'><Title className='ts-coin'>{item.wallet}</Title><Title className='ts-type'>{item.type}</Title></div></td>
                                                     <td style={{ width: "100px" }}>
                                                     <div className='ts-tbdate'><Title className='ts-date'>{item?.date }</Title></div>
                                                            </td>
                                                        
                                                        {/* <td style={{ width: "50px" }}>{item.type}</td> */}
                                                        
                                                        <td>{this.getNumberVal(item)}</td>
                                                        <td>{item.state} </td>
                                                    </tr>
                                                    </>
                                                        : <tr>
                                                            <td>No transaction details available.</td>
                                                        </tr>
                                                        }
                                                        </>
                                            )
                                        })}

                                        {loading && <tr>
                                            <td colSpan='5' className='text-center p-16'><Spin size='default' /></td></tr>}
                                    </tbody>:<tbody>
                          <tr>
                            <td
                              colSpan="8"
                              className="p-16 text-center"
                              style={{width: 300 }}
                            >
                             No transaction details available
                            </td>
                          </tr>{" "}
                        </tbody>}
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