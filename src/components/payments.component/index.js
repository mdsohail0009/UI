import React, { Component } from 'react';
import List from "../grid.component";
import { Typography, Button, Tooltip } from 'antd';
import Translate from 'react-translate-component';
import { connect } from "react-redux";

class Payments extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.gridRef = React.createRef();
    }
    paymentsView = async (props) => {
        this.props.history.push(`payments/${props.dataItem.id}/view`);
    }
    gridColumns = [
        {
            field: "", title: 'Date', filter: true, width: 180, filterType: "date", customCell: (props) => (
                <td><div className="gridLink" onClick={() => this.paymentsView(props)}>{new Date(props.dataItem.createdDate).toLocaleDateString()}</div></td>)
        },
        { field: "currency", title: 'Currency', filter: true, width: 180 },
        { field: "totalAmount", title: 'Total Amount', width: 200, filter: true },
        { field: "count", title: 'Count', width: 130, filter: true },
        { field: "modifiedDate", title: 'Modified Date', filterType: "date", filter: true, width: 180 },
        { field: "modifiedBy", title: 'Modified By', filter: true, width: 200 },
        { field: "state", title: 'State', filter: true, width: 160 },
    ];

    addPayment = () => {
        this.props.history.push(`payments/00000000-0000-0000-0000-000000000000/add`)
    }

    render() {
        const { Title, Paragraph, Text } = Typography;
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