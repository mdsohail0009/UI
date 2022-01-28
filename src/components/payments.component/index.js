import React, { Component } from 'react';
import List from "../grid.component";
import apiCalls from '../../api/apiCalls';
import { Typography, Button, Tooltip, Modal, Alert } from 'antd';
import Translate from 'react-translate-component';
import counterpart from 'counterpart';
class Payments extends Component {
    constructor(props) {
        super(props);
   this.state = {
      // SwapGridURL: process.env.REACT_APP_GRID_API + "Swap/Accounts"
    }
    this.gridRef = React.createRef();
}
addPayment = () => {
    this.props.history.push('payments/add')
}
gridColumns = [
    { field: "firstName", title:'First name', filter: true, isShowTime: true, filterType: "date", width: 150 },
    { field: "lastName", title: 'Last name', filter: true, width: 150 },
    { field: "Currency", title: 'Currency', filter: true, width: 150 },
    { field: "totalAmount", title: 'Total Amount', width: 150, filter: true },
    { field: "count", title: 'Count', width: 150, filter: true },
    { field: "createdDate", title:'Created date', width: 150, filter: true },
    { field: " createdBy", title:'created by', filter: true, width: 150 },
    { field: " modifiedDate", title:'modified date', filter: true, width: 150 },
    { field: " modifiedBy", title:'modified by', filter: true, width: 150 },
    { field: " state", title:'State', filter: true, width: 150 },
    
  ];
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
                            <li className="mr-16">
                                <Tooltip placement="top" title={<Translate content="edit" />}>
                                    <span className="icon md eye-icon mr-0" />
                                </Tooltip>
                            </li>
                        </ul>
                    </div>
                    <div className="box basic-info text-white">
                        Payments Master grid
                        <List
                            showActionBar={true}
                            //onActionClick={(key) => this.onActionClick(key)}
                            // pKey={"payments"}
                            ref={this.gridRef}
                            url={process.env.REACT_APP_GRID_API + "MassPayments/UserPayments/85c6f93c-bcdf-4609-817f-1218f5ac32d0"}
                            columns={this.gridColumns}
/>
                    </div>
                </div>
            </>
        )
    }
}

export default Payments;