import React, { Component } from 'react';
import List from "../grid.component";
import apiCalls from '../../api/apiCalls';
import { Typography, Button, Tooltip, Modal, Alert } from 'antd';
import Translate from 'react-translate-component';
import { connect } from "react-redux";

class Payments extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
        this.gridRef = React.createRef();
    }
    gridColumns = [
        { field: "firstName", title: 'First Name', filter: true, isShowTime: true, filterType: "date", width: 150 },
        { field: "lastName", title: 'Last Name', filter: true, width: 150 },
        { field: "Currency", title: 'Currency', filter: true, width: 150 },
        { field: "totalAmount", title: 'Total Amount', width: 150, filter: true },
        { field: "count", title: 'Count', width: 150, filter: true },
        { field: "createdDate", title: 'Created Date', width: 150, filter: true },
        { field: "createdBy", title: 'Created By', filter: true, width: 150 },
        { field: "modifiedDate", title: 'Modified Date', filter: true, width: 150 },
        { field: "modifiedBy", title: 'Modified By', filter: true, width: 150 },
        { field: "state", title: 'State', filter: true, width: 150 },

    ];

    addPayment = () => {
        this.props.history.push('payments/add')
    }

    render() {
        const { Title, Paragraph, Text } = Typography;
        return (
            <>
                <div className="main-container hidden-mobile">
                    <div className='d-flex align-center justify-content mb-16'>
                        <Title className="basicinfo mb-0"><Translate content="menu_payments" component={Text} className="basicinfo" /></Title>
                        <ul className="address-icons" style={{ listStyle: 'none', paddingLeft: 0, marginBottom: 0, display: 'flex' }}>
                            <li className="mr-16">
                                <Tooltip placement="top" title={<Translate content="add" />}>
                                    <span className="icon md add-icon mr-0" onClick={this.addPayment} />
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