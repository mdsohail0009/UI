import React, { Component } from 'react';
import { Typography, Button, Tooltip, Modal, Alert } from 'antd';
import Translate from 'react-translate-component';

class PaymentDetails extends Component {

    backToPayments = () => {
        this.props.history.push('/payments')
    }
    render() {
        const { Title, Paragraph, Text } = Typography;
        return (
            <>
                <div className="main-container hidden-mobile">
                    <div className='mb-16'>
                        <Title className="basicinfo mb-0"><Translate content="menu_payments" component={Text} className="basicinfo" /></Title>
                    </div>
                    <div className="box basic-info text-white">
                        add payments grid
                        <Button
                            style={{ width: '100px', border: '1px solid #f2f2f2' }}
                            className=" pop-cancel"
                            onClick={this.backToPayments}
                        >
                            Cancel
                        </Button>
                    </div>
                </div>
            </>
        )
    }
}

export default PaymentDetails;