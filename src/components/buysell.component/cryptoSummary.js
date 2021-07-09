import React, { Component } from 'react';
import { Typography, Button, Tooltip } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';

class Summary extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    showPayCardDrawer = () => {
        console.log(this.state);
    }

    render() {
        const { Title, Paragraph, Text } = Typography;
        return (
            <>
                <div className="fs-36 text-white-30 fw-200 text-center" style={{ lineHeight: '36px' }}>0,0070 ETH</div>
                <div className="text-white-50 fw-300 text-center fs-14 mb-16">USD 20,00</div>
                <div className="pay-list fs-14">
                    <Translate className="fw-400 text-white" content="exchange_rate" component={Text} />
                    <Text className="fw-300 text-white-30">1 ETH = USD 2.849.76</Text>
                </div>
                <div className="pay-list fs-14">
                    <Translate className="fw-400 text-white" content="amount" component={Text} />
                    <Text className="fw-300 text-white-30">ETH 0,0070125</Text>
                </div>
                <div className="pay-list fs-14">
                    {/*  */}
                    <Translate className="fw-400 text-white" content={`suissebase_fee`} component={Text} ><Tooltip title="Suissebase Fee"><span className="icon md info c-pointer ml-4" /></Tooltip></Translate>
                    <Text className="text-darkgreen fw-400">USD 0,000</Text>
                </div>
                <div className="pay-list fs-14">
                    <Translate className="fw-400 text-white" content="estimated_total" component={Text} />
                    <Text className="fw-300 text-white-30">0.0070125 ETH (USD 20,00)</Text>
                </div>
                <Translate className="fs-12 text-white-30 text-center my-16" content="summary_hint_text" component={Paragraph} />
                <div className="d-flex p-16 mb-36">
                    <span className="icon lg check-ylw"/>
                    <Text className="fs-14 text-white-30 ml-16" style={{ flex: 1 }}>
                        I agree to Suissebase’s <Link to="" className="text-white-30"><u>Terms of Service</u></Link> and its return, refund and cancellation policy.
                    </Text>
                </div>
                <Button size="large" block className="pop-btn" onClick={() => this.props.changeStep('step4')} >Pay 0,00701 ETH</Button>
                <Translate content="cancel" component={Button} onClick={() => this.props.changeStep('step1')} type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block />
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
export default connect(connectStateToProps, connectDispatchToProps)(Summary);