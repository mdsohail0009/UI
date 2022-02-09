import React, { Component } from 'react';
import List from "../grid.component";
import { Typography, Button, Tooltip } from 'antd';
import Translate from 'react-translate-component';
import { connect } from "react-redux";
import Moment from 'react-moment';
import moment from 'moment';
const { Title, Text } = Typography;
class Payments extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.gridRef = React.createRef();
    }
    paymentsView = async (props) => {
        this.props.history.push(`/payments/${props.dataItem.id}/view`);
    }
    gridColumns = [
        {
            field: "createdDate", title: 'Date', filter: true, filterType: "date", customCell: (props) => (
                <td><div className="gridLink" onClick={() => this.paymentsView(props)}>
                    <Moment format="DD/MM/YYYY">{new Date(props.dataItem.createdDate).toLocaleDateString()}</Moment></div></td>)
        },
        { field: "currency", title: 'Currency', filter: true },
        { field: "totalAmount", title: 'Total Amount', filter: true },
        { field: "count", title: 'Count', filter: true },
        { field: "state", title: 'Status', filter: true },
    ];

    addPayment = () => {
        this.props.history.push(`/payments/00000000-0000-0000-0000-000000000000/add`)
    }

    render() {
        return (
            <>
                <div className="main-container">
                    <div className='d-flex align-center justify-content mb-16'>
                        <Title className="basicinfo mb-0"><Translate content="menu_payments" component={Text} className="basicinfo" /></Title>
                        <ul className="address-icons" style={{ listStyle: 'none', paddingLeft: 0, marginBottom: 0, display: 'flex' }}>
                            <li className="mr-16">
                                <Tooltip placement="top" title={<Translate content="add" />}>
                                    <span className="icon md add-icon mr-0 c-pointer" onClick={this.addPayment} />
                                </Tooltip>
                            </li>
                        </ul>
                    </div>
                    <div className="box basic-info text-white">
                        <List
                            showActionBar={false}
                            ref={this.gridRef}
                            url={process.env.REACT_APP_GRID_API + `MassPayments/UserPayments/${this.props.userConfig?.id}`}
                            columns={this.gridColumns}
                        />
                    </div>
                </div>
            </>
        )
    }
}

const connectStateToProps = ({ userConfig }) => {
    return { userConfig: userConfig.userProfileInfo };
};

export default connect(connectStateToProps, null)(Payments);