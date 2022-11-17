import React, { Component } from 'react';
import { Typography, Radio, message, Spin,Button } from 'antd';
import Translate from 'react-translate-component';
import { getData } from './api';
import NumberFormat from 'react-number-format';
import Loader from '../../Shared/loader';
import { connect } from 'react-redux';
import { withRouter, Link } from 'react-router-dom';
import { dashboardTransactionSub } from '../../utils/pubsub';
import TransactionsHistory from "../transactions.history.component";
import apiCalls from "../../api/apiCalls";
import Moment from "react-moment";
import moment from 'moment';
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
            transactionData: []
        }
        // this.gridRef = React.createRef();
    }
    getTransactionData = async () => {
        this.setState({ ...this.state, loading: true });
        let response = await getData(this.props.userProfileInfo?.id);
        if (response.ok) {
            this.setState({ ...this.state, transactionData: response.data, loading: false });
        } else {
            message.destroy();

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
                // style={{ color: "white" }}
                value={list[0]}
                decimalSeparator="."
                displayType={"text"}
                thousandSeparator={true}
              />/
              <NumberFormat
                // style={{ color: "white" }}
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
            //   style={{ color: "white" }}
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
        return (
            <div className="mb-16">
                <div className='mb-12 mt-4'>
                    <Translate content="menu_transactions_history" className="basicinfo" />
                    {/* <span>
                       <Translate
                        content="search"
                        component={Button}
                        type="primary"
                        className="dbchart-link fs-14 fw-500"
                        onClick={()=> this.transactionDrawer()}
                      />
                       <span className="icon sm search-angle ml-4" />
                       </span>  */}
                    <Button
                        onClick={() => this.transactionDrawer()}
                        className="pop-btn dbchart-link fs-14 fw-500" style={{ height: 36,}}
                        >
                           <Translate content="search" />
                        <span className="icon sm search-angle ml-8"></span>
                    </Button>
                     {/* <div onClick={() => this.transactionDrawer()} className="dbchart-link fs-14 fw-500 c-pointer">
                       
                        <Translate content="search" />
                        <span className="icon sm search-angle ml-4" />
                      
                    </div> */}
                       {this.state.transactions &&
                       <TransactionsHistory
                        showDrawer={this.state.transactions}
                        onClose={() => {
                            this.closeDrawer();
                        }}
                    />
                       }
                       </div>
                   
                    <div>

                        <div className="box dash-info basic-info responsive_table bg-none mb-0 ">
                            <table className='pay-grid view mb-view'  style={{width: "100%"}}>
                                <thead>
                                    <tr>
                                        <th style={{width: "18%"}}>Date</th>
                                        <th style={{width: "35%"}}>Transaction</th>
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
                                   {this.state.transactionData.length > 0 ?
                                    <tbody>
                                        {this.state.transactionData?.map((item, idx) => {
                                            return (
                                                <>
                                                    {this.state.transactionData.length > 0 ? 
                                                    <>
                                                     <tr key={idx}>
                                                     <td style={{ width: "100px" }}>
                                                            {item?.date }
                                                            {/* <Moment format="DD/MM/YYYY hh:mm:ss A">{item?.date  ? apiCalls.convertUTCToLocalTime(item?.date ) : item?.date }</Moment> */}
                                                            </td>
                                                        
                                                        <td style={{ width: "50px" }}>{item.type}</td>
                                                        <td>{item.wallet}</td>
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
        );
    }
}

const connectStateToProps = ({ userConfig }) => {
    return { userProfileInfo: userConfig.userProfileInfo, twoFA:userConfig.twoFA }
}
const connectDispatchToProps = dispath => {
    return { dispath }
}
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(Portfolio));