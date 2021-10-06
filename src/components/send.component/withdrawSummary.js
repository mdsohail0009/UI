import React, { Component } from 'react';
import { Typography, Button, Input } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import Loader from '../../Shared/loader';
import SuisseBtn from '../shared/butons';
import Currency from '../shared/number.formate';
import { convertCurrency } from '../buy.component/buySellService';

const LinkValue = (props) => {
    return (
        <Translate className="text-defaultylw textpure-yellow text-underline c-pointer"
            content={props.content}
            component={Link}
            onClick={()=>window.open("https://www.iubenda.com/terms-and-conditions/42856099",'_blank')}
        />
    )
}
class WithdrawSummary extends Component {
    state = {
        onTermsChange:false,
        isButtonLoad:false,
        usdAmount:0,
        OneusdAmount:0
    }
    componentDidMount(){
        this.loadOneCoinData();
        this.loadData();
    }
    loadData = async() =>{
        const value = await convertCurrency({ from: this.props.sendReceive.withdrawCryptoObj?.walletCode, to: "USD", value: this.props.sendReceive.withdrawCryptoObj?.totalValue, isCrypto: false ,memId:this.props.userProfile.id,screenName:''})
        this.setState({...this.state,usdAmount:value})
    }
    loadOneCoinData = async() =>{
        const value = await convertCurrency({ from: this.props.sendReceive.withdrawCryptoObj?.walletCode, to: "USD", value: 1, isCrypto: false ,memId:this.props.userProfile.id,screenName:''})
        this.setState({...this.state,OneusdAmount:value})
    }
    onRefresh = () =>{

    }
    onCancel = () =>{
        this.props.changeStep('withdraw_crypto_selected');
    }
    onClick = () =>{

    }
    render() {
        const { Paragraph, Text } = Typography;
        const link = <LinkValue content="terms_service" />;
        return (
            <>
            {/* {!error?.valid && <Alert showIcon type="info" message={error?.title || "Buy crypto"} description={error?.message} closable onClose={() => onErrorClose ? onErrorClose() : ""} />} */}
                <div className="cryptosummary-container auto-scroll">
                    <div className="fs-36 text-white-30 fw-200 text-center" style={{ lineHeight: '36px' }}><Currency prefix={""} decimalPlaces={8} defaultValue={this.props.sendReceive.withdrawCryptoObj?.totalValue} suffixText={this.props.sendReceive.withdrawCryptoObj?.walletCode} /> </div>
                    <div className="pay-list fs-14">
                        <Translate className="fw-400 text-white" content="exchange_rate" component={Text} />
                        <Currency defaultValue={this.state.OneusdAmount} decimalPlaces={8} prefix={""} className="fw-300 text-white-30" prefixText={`1 ${this.props.sendReceive.withdrawCryptoObj?.walletCode} = ${'USD'}`}
                        />
                        
                    </div>
                    <div className="pay-list fs-14">
                        <Translate className="fw-400 text-white" content="amount" component={Text} />
                        <Currency prefix={""} decimalPlaces={8} defaultValue={this.props.sendReceive.withdrawCryptoObj?.totalValue} suffixText={this.props.sendReceive.withdrawCryptoObj?.walletCode} />
                    </div>

                    <div className="fs-12 text-white-30 text-center my-16">Your final amount might be changed with in
                        10 seconds.</div>
                        <div className="p-16 mt-16 mb-0 text-center">
                    <Translate className="fs-16 text-white-30 text-center mb-0" content="withdraw_to" component={Paragraph} />
                    {this.props.sendReceive.withdrawCryptoObj?.walletCode} Coin Address
                    <Paragraph className="fs-16 text-white-30 text-center mb-0">
                        {this.props.sendReceive.withdrawCryptoObj?.toWalletAddress}
                    </Paragraph>
                </div>
                    <div className="d-flex p-16 mb-36 agree-check">
                        <label>
                        
                            <input type="checkbox" id="agree-check" onChange={({ currentTarget: { checked } }) => { this.setState({onTermsChange:checked?true:false}) }} />
                            <span for="agree-check" />
                        </label>
                        <Paragraph className="fs-14 text-white-30 ml-16 mb-0" style={{ flex: 1 }} >
                            I agree to Suissebase’s <a className="textpure-yellow" href="https://www.iubenda.com/terms-and-conditions/42856099" target="_blank">Terms of Service</a> and its return, refund and cancellation policy.
                        </Paragraph>
                    </div>
                    <SuisseBtn className={"pop-btn"} onRefresh={() => this.onRefresh()} title={'Confirm'} loading={this.state.isButtonLoad} autoDisable={true} onClick={() => this.onClick()} />
                    <div className="text-center mt-16">
                        <Translate content="cancel" component={Button} onClick={() => this.onCancel()} type="text" size="large" className="text-white-30 pop-cancel fw-400" />
                    </div>
                </div>
                </>
        )
    }
}

const connectStateToProps = ({ sendReceive,userConfig }) => {
    return { sendReceive, userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(WithdrawSummary);

