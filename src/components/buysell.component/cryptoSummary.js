import React, { Component, useEffect, useState } from 'react';
import { Typography, Button, Tooltip, Checkbox } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import Loader from '../../Shared/loader';

const LinkValue = (props) => {
    return (
        <Translate className="text-yellow text-underline c-pointer"
            content={props.content}
            component={Link}
            to="./#"
        />
    )
}

class Summary extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    showPayCardDrawer = () => {
        console.log(this.state);
    }
    // React.useEffect(() => {
    //     if (seconds > 0) {
    //       setTimeout(() => setSeconds(seconds - 1), 1000);
    //     } else {
    //       setSeconds('BOOOOM!');
    //     }
    //   });
    render() {
        if(this.props.sellData?.previewDetails?.loading){
            return <Loader/>
        }
        const { Title, Paragraph, Text } = Typography;
        const {coin,oneCoinValue,amount,amountNativeCurrency} = this.props.sellData?.previewDetails?.data;
        const link = <LinkValue content="terms_service" />;
        // const [seconds, setSeconds] = React.useState(10);
        return (
            <>
                <div className="fs-36 text-white-30 fw-200 text-center" style={{ lineHeight: '36px' }}>{amount} {coin}</div>
                <div className="text-white-50 fw-300 text-center fs-14 mb-16">USD {amountNativeCurrency}</div>
                <div className="pay-list fs-14">
                    <Translate className="fw-400 text-white" content="exchange_rate" component={Text} />
                    <Text className="fw-300 text-white-30">1 {coin} = USD {oneCoinValue}</Text>
                </div>
                <div className="pay-list fs-14">
                    <Translate className="fw-400 text-white" content="amount" component={Text} />
                    <Text className="fw-300 text-white-30">{coin}{amount}</Text>
                </div>
                {/* <div className="pay-list fs-14">
                    <Translate className="fw-400 text-white" content={`suissebase_fee`} component={Text} ><Tooltip title="Suissebase Fee"><span className="icon md info c-pointer ml-4" /></Tooltip></Translate>
                    <Text className="text-darkgreen fw-400">USD 0,000</Text>
                </div> */}
                <div className="pay-list fs-14">
                    <Translate className="fw-400 text-white" content="estimated_total" component={Text} />
                    <Text className="fw-300 text-white-30">{amount} {coin} (USD {amountNativeCurrency})</Text>
                </div>
                {/* <Translate className="fs-12 text-white-30 text-center my-16" content="summary_hint_text" component={Paragraph} /> */}
                <div className="fs-12 text-white-30 text-center my-16">Your final amount might be changed with in 
                {/* {seconds}  */}
                10 seconds.</div>
                <div className="text-center text-underline text-white"><Link className="text-white">Click to see the new rate.</Link></div>
                <div className="d-flex p-16 mb-36 agree-check">
                    <label>
                        <input type="checkbox" id="agree-check" />
                        <span for="agree-check" />
                    </label>
                    <Translate content="agree_to_suissebase" with={{ link }} component={Paragraph} className="fs-14 text-white-30 ml-16" style={{ flex: 1 }} />

                </div>
                <Button title={"Pay "+amountNativeCurrency} size="large" block className="pop-btn" onClick={() => this.props.changeStep('step4')} />
                <Button title="Cancel" onClick={() => this.props.changeStep('step1')} type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block />
            </>
        )
    }
}
const connectStateToProps = ({ buySell, oidc,sellData }) => {
    return { buySell,sellData }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(Summary);