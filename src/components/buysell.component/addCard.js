import React, { Component } from 'react';

class addCard extends Component {
    state = {}
    render() {
        return (
            <>
                <form className="form">
                    <label className="input-label">Name on card</label>
                    <Input className="cust-input" defaultValue="Michael Quiapos" />
                    <label className="input-label">Card number</label>
                    <Input className="cust-input" defaultValue="5443 84000 0902 5339" />
                    <div className="d-flex justify-content align-center">
                        <div className="mr-16 ">
                            <label className="input-label">Expiry</label>
                            <div className="expiry-input">
                                <Input placeholder="MM" maxLength="2" bordered={false} className="fs-16 text-white-30 text-right" />/
                                <Input placeholder="YY" maxLength="2" bordered={false} className="fs-16 text-white-30" />
                            </div>
                        </div>
                        <div className="ml-16">
                            <label className="input-label">CVV</label>
                            <Input className="cust-input" defaultValue="544" />
                        </div>
                    </div>
                    <div className="text-center mt-16"><Link className="text-white fs-16"><u>Type your Billing Address</u></Link></div>
                </form>
                <Button size="large" block className="pop-btn" style={{ marginTop: '180px' }} onClick={this.billingAddress}>Confirm</Button>
            </>
        );
    }
}

export default addCard;