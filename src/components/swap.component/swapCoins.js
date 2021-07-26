import React, { Component } from 'react';
import { Typography, Button, Input } from 'antd';
import { setStep , updateFromCoinInputValue , updateCoinDetails , updateReceiveCoinDetails } from '../../reducers/swapReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { fetchCurrConvertionValue } from '../../components/swap.component/api'
import * as _ from 'lodash';

class SwapCoins extends Component {
    state = {
        fromCoin : null,
        receiveCoin : null,
        price : null,
        fromValue : null,
        receiveValue : null,
        errorMessage : null
    }
    componentDidMount(){
       this.setOneCoinValue();
    }
    async setOneCoinValue(){
        if(this.props.swapStore.coinDetailData.coin && this.props.swapStore.coinReceiveDetailData.coin){
            let res = await fetchCurrConvertionValue(this.props.swapStore.coinDetailData.coin, this.props.swapStore.coinReceiveDetailData.coin,1);
            if (res.ok) {
                this.setState({...this.state,price: res.data })
            }    
        }
   }
   async setSwapOneCoinValue(fromCoin,toCoin){
        let res = await fetchCurrConvertionValue(fromCoin,toCoin,1);
        if (res.ok) {
            this.setState({...this.state,price: res.data })
        }    
    }
    async setReceiveAmount(e){
        this.state.fromValue = e.target.value;
        if(this.state.fromValue){
            this.setState({ ...this.state, errorMessage: null })
        }
        if(this.props.swapStore.coinDetailData.coin && this.props.swapStore.coinReceiveDetailData.coin){
            let res = await fetchCurrConvertionValue(this.props.swapStore.coinDetailData.coin, this.props.swapStore.coinReceiveDetailData.coin,e.target.value);
            if (res.ok) {
                this.setState({...this.state,receiveValue: res.data })
            }
        }
        this.props.insertFromCoinInputValue(e.target.value);
    }
    previewClick(){
        if(!this.props.swapStore.coinDetailData.coin){
            this.setState({ ...this.state, errorMessage: 'Select From Swap Coin' })
        }
        else if(!this.props.swapStore.coinReceiveDetailData.coin){
            this.setState({ ...this.state, errorMessage: 'Select Receive Swap Coin' })
        }
        else if(!this.state.fromValue){
            this.setState({ ...this.state, errorMessage: 'Enter Swap From Value' })
        }
        else{
            this.setState({ ...this.state, errorMessage: null })
            this.props.changeStep('step2');
        }
    }
    swapingCurr(){
        // alert('cal')
        if(this.props){
            let objFrom = Object.assign({},this.props.swapStore.coinDetailData)
            let objReceive = Object.assign({},this.props.swapStore.coinReceiveDetailData)
            let v1 = _.cloneDeep(this.state.fromValue);
            let v2 = _.cloneDeep(this.state.receiveValue);

            this.setState({ ...this.state, fromValue: v2 , receiveValue:v1})
    
            objReceive.coinBalance = this.props.swapStore.coinDetailData.coinBalance
            objReceive.coin = this.props.swapStore.coinDetailData.coin
            objReceive.coinFullName = this.props.swapStore.coinDetailData.coinFullName
    
            objFrom.coinBalance = this.props.swapStore.coinReceiveDetailData.coinBalance
            objFrom.coin = this.props.swapStore.coinReceiveDetailData.coin
            objFrom.coinFullName = this.props.swapStore.coinReceiveDetailData.coinFullName
    
            this.props.fromObjSwap(objFrom);
            this.props.receiveObjSwap(objReceive);
            this.setSwapOneCoinValue(objFrom.coin,objReceive.coin);
        }
    }
    async setFromAmount(e){
        this.state.receiveValue = e.target.value;
        let res = await fetchCurrConvertionValue(this.props.swapStore.coinReceiveDetailData.coin, this.props.swapStore.coinDetailData.coin,e.target.value);
        if (res.ok) {
            this.setState({...this.state,fromValue: res.data })
        }
    }
    render() {
        const { Paragraph, Text } = Typography;
        const { coinDetailData } = this.props.swapStore;
        const { coinReceiveDetailData } = this.props.swapStore;

        return (
            <div>
                {this.state.errorMessage!=null&& <Text className="fs-15 text-red crypto-name ml-8 mb-8">{this.state.errorMessage}</Text>}
                {coinDetailData&&<div className="swap swapfrom-card p-relative">
                    <div>
                        <Translate className="text-purewhite fs-14 fw-100" content="swap_from" component={Text} />
                        <Input className="card-input" defaultValue="0" value={this.state.fromValue} onChange={value=>this.setReceiveAmount(value)} bordered={false} placeholder="0.0" />
                        {coinDetailData.coinBalance&&<Text className="text-purewhite mt-4 fs-12 fw-100">Balance - {coinDetailData.coinBalance} {coinDetailData.coin}</Text>}
                    </div>
                    <div className="d-flex justify-content align-center c-pointer" onClick={() => this.props.changeStep('step3')} >
                        <div className="text-center crypto-coin">
                            <span className="coin md btc-white"></span>
                            <Paragraph className="mb-0 text-purewhite fs-14 fw-100 mt-4" style={{ lineHeight: 'normal' }}>{coinDetailData.coinFullName}</Paragraph>
                        </div>
                        <span className="icon sm rightarrow swap-arrow"></span>
                    </div>
                    <span className="icon swapfrom-arrow c-pointer" onClick={()=>this.swapingCurr()}></span>
                    <div className="mt-16 swap-updown" onClick={this.swapingCurr}>
                            <span className="icon sm uparw-o-white d-block c-pointer" />
                            <span className="icon sm dwnarw-o-white d-block c-pointer" />
                    </div>
                </div>
                }
                
                {coinReceiveDetailData&&<div className="swap swapreceive-card p-relative">
                    <div>
                        <Translate className="text-purewhite fs-14 fw-100" content="swap_to" component={Text} />
                        <Input className="card-input" defaultValue="0" value={this.state.receiveValue} onChange={value=>this.setFromAmount(value)} bordered={false} placeholder="0.0" />
                        {coinReceiveDetailData.coinBalance&&<Text className="text-purewhite mt-4 fs-12 fw-100">Balance - {coinReceiveDetailData.coinBalance} {coinReceiveDetailData.coin}</Text>}
                    </div>
                    <div className="d-flex justify-content align-center c-pointer" onClick={() => this.props.changeStep('step4')} >
                        <div className="text-center crypto-coin">
                            <span className="coin md eth-white"></span>
                            <Paragraph className="mb-0 text-purewhite fs-14 fw-100 mt-4" style={{ lineHeight: 'normal' }}>{coinReceiveDetailData.coinFullName}</Paragraph>
                        </div>
                        <span className="icon sm rightarrow swap-arrow"></span>
                    </div>
                    <span className="icon swapto-arrow c-pointer" onClick={()=>this.swapingCurr()}></span>
                </div>}
                <div className="p-16 mt-24 text-center fw-200">
                    {coinDetailData.coinBalance&&<Paragraph className="fs-16 text-white-30 mb-0 l-height-normal">
                        Available {coinDetailData.coinBalance} {coinDetailData.coin}
                    </Paragraph>}
                    {this.state.price&&<Paragraph className="fs-16 text-white-30 l-height-normal">
                    Exchange Rate 1{coinDetailData.coin} = {this.state.price} {coinReceiveDetailData.coin}
                    </Paragraph>}
                </div>
                <Translate size="large" block className="pop-btn" style={{ marginTop: '100px' }} content="preview_swap" component={Button} onClick={() => {this.previewClick()}} />
            </div>
        )
    }
}

const connectStateToProps = ({ swapStore, oidc }) => {
    return { swapStore }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        insertFromCoinInputValue:(value)=>{
            dispatch(updateFromCoinInputValue(value))
        },
        fromObjSwap:(obj)=>{
            dispatch(updateCoinDetails(obj))
        },
        receiveObjSwap:(obj)=>{
            dispatch(updateReceiveCoinDetails(obj))
        },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SwapCoins);
