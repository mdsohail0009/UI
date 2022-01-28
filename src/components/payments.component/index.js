import React, { Component } from 'react';
import { Typography, Button, Tooltip, Modal, Alert } from 'antd';
import Translate from 'react-translate-component';

class Payments extends Component {
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
                            <li className="mr-16">
                                <Tooltip placement="top" title={<Translate content="edit" />}>
                                    <span className="icon md eye-icon mr-0" />
                                </Tooltip>
                            </li>
                        </ul>
                    </div>
                    <div className="box basic-info text-white">
                        Payments Master grid
                    </div>
                </div>
            </>
        )
    }
}

export default Payments;