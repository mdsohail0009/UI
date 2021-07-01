import React, { Component } from 'react';
import { Typography,Button, Tooltip } from 'antd';
import { Link } from 'react-router-dom';

class BillType extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }
    depositCrypto = () => {
       console.log(this.state);
    }
    showCardDrawer = () => {
        console.log(this.state);
     }
 

    render() {
        const { Title, Paragraph, Text } = Typography;
        return (
            <>
                  <div className="d-flex align-center mb-24 mt-36 c-pointer" onClick={this.showCardDrawer}>
                        <span className="coin btc" />
                        <div className="ml-24">
                            <Paragraph className="mb-0 fs-14 text-white-30 fw-300">Credit Card</Paragraph>
                            <Paragraph className="mb-0 fs-12 text-white-30 fw-300"> Use a credit or debit card</Paragraph>
                        </div>
                    </div>
                    <div className="d-flex align-center c-pointer" onClick={this.depositCrypto}>
                        <span className="coin btc" />
                        <div className="ml-24">
                            <Paragraph className="mb-0 fs-14 text-white-30 fw-300">Deposit</Paragraph>
                            <Paragraph className="mb-0 fs-12 text-white-30 fw-300" >Deposit from an address or existing wallet</Paragraph>
                        </div>
                    </div>
                    </>
        )
    }
}

export default BillType;