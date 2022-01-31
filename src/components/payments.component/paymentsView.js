import React, { Component } from 'react';
import { getPaymentsData } from './api';
import { Typography, Button, Spin } from 'antd';
import Translate from 'react-translate-component';
import NumberFormat from 'react-number-format';
import { connect } from "react-redux";

class PaymentsView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            paymentsData: [],
            loading: false
        }
    }
    componentDidMount() {
        this.getPaymentsViewData();
    }
    getPaymentsViewData = async () => {
        this.setState({ ...this.state, loading: true });
        let response = await getPaymentsData(this.props.match.params.id, this.props.userConfig?.userId);
        if (response.ok) {
            this.setState({ ...this.state, paymentsData: response.data.paymentsDetails, loading: false });
        }
    }
    backToPayments = () => {
        this.props.history.push('/payments')
    }
    render() {
        const { paymentsData, loading } = this.state;
        const { Title, Text } = Typography;
        return (
            <>
                <div className="main-container hidden-mobile">
                    <Title className="basicinfo mb-16"><Translate content="menu_payments" component={Text} className="basicinfo" /></Title>
                    <div className="box basic-info">
                        <table className='pay-grid view'>
                            <thead>
                                <tr>
                                    <th>Bank Name</th>
                                    <th>Account Number</th>
                                    <th>Amount</th>
                                </tr>
                            </thead>
                            <tbody>
                                {paymentsData?.map((item, idx) => {
                                    return (
                                        <>
                                            <tr key={idx}>
                                                <td>{item.bankname}</td>
                                                <td>{item.accountnumber}</td>
                                                <td>
                                                    <NumberFormat
                                                        value={item.amount}
                                                        thousandSeparator={true}
                                                        displayType={'text'}
                                                        renderText={value => value}
                                                    />
                                                </td>
                                            </tr>
                                        </>
                                    )
                                })}
                                {paymentsData.length === 0 && loading && <tr>
                                    <td colSpan='3' className='text-center p-16'><Spin size='default' /></td></tr>}
                            </tbody>
                        </table>
                        <div className="text-right mt-36">
                            <Button
                                className="pop-btn px-36"
                                style={{ margin: "0 8px" }}
                                onClick={this.backToPayments}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            </>
        )
    }
}

const connectStateToProps = ({ userConfig }) => {
    return { userConfig: userConfig.userProfileInfo };
};
export default connect(connectStateToProps, null)(PaymentsView);