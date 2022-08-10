import React, { Component } from 'react';
import { Typography, Radio, message, Spin,Button } from 'antd';
import Translate from 'react-translate-component';
import { getData } from './api';
import NumberFormat from 'react-number-format';
import Loader from '../../Shared/loader';
import { connect } from 'react-redux';
import { dashboardTransactionSub } from '../../utils/pubsub';
import TransactionsHistory from "../transactions.history.component";

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
        this.setState({ ...this.state, transactions: true});
    }
    closeDrawer = () => {
        this.setState({transactions: false});
    }
    render() {
        const { Title } = Typography;

        const { gridUrl, loading } = this.state;
        return (
            <div className="mb-24">
                <div>
                    <Translate content="menu_transactions_history" className="basicinfo" />
                    <span>
                       <Translate
                        content="search"
                        component={Button}
                        type="primary"
                        className="dbchart-link fs-14 fw-500"
                        onClick={()=> this.transactionDrawer()}
                      />
                       </span> 
                       <TransactionsHistory
                        showDrawer={this.state.transactions}
                        onClose={() => {
                            this.closeDrawer();
                        }}
                    />
                       </div>
                   
                    <div className="mt-16">

                        <div className="box basic-info responsive_table bg-none ">
                            <table className='pay-grid view mb-view'>
                                <thead>
                                    <tr>
                                        <th>Date</th>
                                        <th>Type</th>
                                        <th>Wallet</th>
                                        <th>Value</th>
                                        <th>State</th>
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
                                                        <td>{item?.date}</td>
                                                        <td style={{ width: "100px" }}>{item.type}</td>
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
                              style={{ color: "white", width: 300 }}
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
const connectDispatchToProps = dispath => {
    return { dispath }
}
const connectStateToProps = ({ userConfig }) => {
    return { userProfileInfo: userConfig.userProfileInfo }
}
export default connect(connectStateToProps, connectDispatchToProps)(Portfolio);