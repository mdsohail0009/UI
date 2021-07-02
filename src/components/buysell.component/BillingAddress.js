import React, { Component } from 'react';
import { Typography,Button, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';

class BillingAddress extends Component {
    constructor(props) {
        super(props);
        this.state = {
           
        }
    }
    showPayDrawer = () => {
       console.log(this.state);
    }

    render() {
        const { Title, Paragraph, Text } = Typography;
        return (
            <>
                <Title className="fs-36 text-white-30 fw-200 mb-36" level={3}>Billing Address</Title>
                    <div className="billing-address text-white fs-16 fw-200">
                        <div className="mb-16">Your delivary address</div>
                        <div className="mb-16">UNIT 527 TOWER 4, SMDC Grace Residences, Cayetano Blvd. Brgy. Ususan, Taguig City 1630 PH</div>
                    </div>
                    <Button size="large" block className="pop-btn" style={{ marginTop: '190px' }}onClick={()=>this.props.changeStep('step5') }>CONFIRM BILLING ADDRESS</Button>
                    <Button type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block>Cancel</Button>
               </>
        )
    }
}
const connectStateToProps = ({ buySell, oidc }) => {
    return { buySell }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(BillingAddress);
