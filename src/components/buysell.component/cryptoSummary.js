import React, { Component, useEffect, useState } from 'react';
import { Typography, Button, Tooltip, Checkbox, notification, Alert } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import Loader from '../../Shared/loader';
import { fetchPreview } from './crypto.reducer';
import { buyCrypto } from './api';
import SuisseBtn from '../shared/butons';
import NumberFormat from 'react-number-format';
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
            isLoading: false,
            disablePay: false,
            error: { valid: true, error: null }
        }
    }
    componentDidMount() {
        setTimeout(this.disablePay, 12000);
    }
    startCounter = () => {
        setTimeout(this.disablePay, 12000);
    }
    disablePay = () => {
        this.setState({ ...this.state, disablePay: true });
    }
    showPayCardDrawer = () => {
        console.log(this.state);
    }
    pay = async () => {
        this.setState({ ...this.state, error: { valid: true, message: null } });
        const isTermsAgreed = document.getElementById("agree-check").checked;
        if (isTermsAgreed) {
            const { id: toWalletId, walletName: toWalletName, walletCode: toWalletCode } = this.props.sellData?.coinWallet;
            const { id: fromWalletId, bankName: fromWalletName, currencyCode: fromWalletCode } = this.props.sellData?.selectedWallet;
            const obj = {
                "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
                "membershipId": this.props?.member?.id,
                fromWalletId,
                fromWalletCode,
                fromWalletName,
                "fromValue": this.props.sellData.previewDetails?.data?.amountNativeCurrency,
                toWalletId,
                toWalletCode,
                toWalletName,
                "toValue": this.props.sellData.previewDetails?.data?.amount,
                "description": "Buy Crypto",
                "comission": 0,
                "exicutedPrice": 0,
                "totalAmount": this.props.sellData.previewDetails?.data?.amount

            }
            this.setState({ isLoading: true });
            const response = await buyCrypto(obj);
            if (response.ok) {
                this.props.changeStep('success')
            } else {
                this.setState({ ...this.state, error: { valid: false, message: response.data || response.originalError.message } })
                // notification.error({ message: "Buy Crypto", description: response.data || response.originalError.message })
            }
            this.setState({ isLoading: false })
        } else {
            this.setState({ ...this.state, error: { valid: false, message: "Please agree to terms & conditions" } })
            //notification.warn({ message: "Terms&Conditions", description: "Please agree to terms&conditions" })
        }
    }
    render() {
        if (this.props.sellData?.previewDetails?.loading || !this.props.sellData?.previewDetails?.data) {
            return <Loader />
        }
        const { Paragraph, Text } = Typography;
        const { coin, oneCoinValue, amount, amountNativeCurrency } = this.props.sellData?.previewDetails?.data;
        const link = <LinkValue content="terms_service" />;
        // const [seconds, setSeconds] = React.useState(10);
        return (
            <>
                {!this.state?.error?.valid && <Alert showIcon type="info" message="Buy crypto" description={this.state.error?.message} closable />}
                <div className="cryptosummary-container auto-scroll">
                    <div className="fs-36 text-white-30 fw-200 text-center" style={{ lineHeight: '36px' }}>{amount} {coin}</div>
                    <div className="text-white-50 fw-300 text-center fs-14 mb-16"><NumberFormat value={amountNativeCurrency} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={(value, props) => <div {...props} >{this.props.sellData?.selectedWallet?.currencyCode} {value}</div>} /></div>
                    <div className="pay-list fs-14">
                        <Translate className="fw-400 text-white" content="exchange_rate" component={Text} />
                        <NumberFormat value={oneCoinValue} displayType={'text'} thousandSeparator={true}
                            renderText={(value, props) => <div {...props} className="fw-300 text-white-30">1 {coin} = {this.props.sellData?.selectedWallet?.currencyCode} {value}</div>} />

                    </div>
                    <div className="pay-list fs-14">
                        <Translate className="fw-400 text-white" content="amount" component={Text} />
                        <NumberFormat value={amount} displayType={'text'} thousandSeparator={true}
                            renderText={(value, props) => <div {...props} className="fw-300 text-white-30">{coin} {value}</div>} />

                    </div>
                    {/* <div className="pay-list fs-14">
                    <Translate className="fw-400 text-white" content={`suissebase_fee`} component={Text} ><Tooltip title="Suissebase Fee"><span className="icon md info c-pointer ml-4" /></Tooltip></Translate>
                    <Text className="text-darkgreen fw-400">USD 0,000</Text>
                </div> */}
                    <div className="pay-list fs-14">
                        <Translate className="fw-400 text-white" content="estimated_total" component={Text} />
                        
                        <NumberFormat value={amountNativeCurrency} displayType={'text'} thousandSeparator={true}
                            renderText={(value, props) => <div {...props} className="fw-300 text-white-30">{amount} {coin} ({this.props.sellData?.selectedWallet?.currencyCode} {value})</div>} />
                    </div>
                    {/* <Translate className="fs-12 text-white-30 text-center my-16" content="summary_hint_text" component={Paragraph} /> */}
                    <div className="fs-12 text-white-30 text-center my-16">Your final amount might be changed with in
                        {/* {seconds}  */}
                        10 seconds.</div>
                    {/* <div className="text-center text-underline text-white"><Link onClick={() => { this.startCounter(); this.setState({ ...this.state, disablePay: false }) }} className="text-yellow">Click to see the new rate.</Link></div> */}
                    <div className="d-flex p-16 mb-36 agree-check">
                        <label>
                            <input type="checkbox" id="agree-check" />
                            <span for="agree-check" />
                        </label>
                        <Translate content="agree_to_suissebase" with={{ link }} component={Paragraph} className="fs-14 text-white-30 ml-16 mb-0" style={{ flex: 1 }} />
                    </div>
                    <SuisseBtn className={"pop-btn"} onRefresh={() => this.props.refreshDetails(this.props.sellData?.selectedWallet, coin, amount)} title={"pay"} loading={this.state.isLoading} autoDisable={true} onClick={() => this.pay()} />
                    <Translate content="cancel" component={Button} onClick={() => this.props.changeStep('step1')} type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block />
                </div>

            </>
        )
    }
}
const connectStateToProps = ({ buySell, oidc, sellData, userConfig }) => {
    return { buySell, sellData, member: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        refreshDetails: (wallet, coin, amount) => {
            dispatch(fetchPreview({ coin, wallet, amount }))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(Summary);