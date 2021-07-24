import React, { Component } from 'react';
import { Typography, Button, Input } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/swapReducer';
import { connect } from 'react-redux';
import sacnner from '../../assets/images/sacnner.png';
import Translate from 'react-translate-component';
import { fetchCurrConvertionValue } from '../../components/swap.component/api'

class SwapCoins extends Component {
    state = {
        fromCoin : null,
        receiveCoin : null,
        price : null,
        fromValue : null,
        receiveValue : null
    }
    componentDidMount(){
       this.setOneCoinValue();
    }
    async setOneCoinValue(){
        let res = await fetchCurrConvertionValue(this.props.swapStore.coinDetailData.coin, this.props.swapStore.coinReceiveDetailData.coin,1);
        if (res.ok) {
            this.setState({...this.state,price: res.data })
        }
   }
    async setReceiveAmount(e){
        this.state.fromValue = e.target.value;
        let res = await fetchCurrConvertionValue(this.props.swapStore.coinDetailData.coin, this.props.swapStore.coinReceiveDetailData.coin,e.target.value);
        if (res.ok) {
            this.setState({...this.state,receiveValue: res.data })
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
        const {coinDetailData} = this.props.swapStore;
        const {coinReceiveDetailData} = this.props.swapStore;

        return (
            <div>
                {coinDetailData&&<div className="swap swapfrom-card p-relative">
                    <div>
                        <Translate className="text-purewhite fs-14 fw-100" content="swap_from" component={Text} />
                        <Input className="card-input" defaultValue="0" value={this.state.fromValue} onChange={value=>this.setReceiveAmount(value)} bordered={false} placeholder="0.0" />
                        <Text className="text-purewhite mt-4 fs-12 fw-100">Balance - {coinDetailData.coinBalance} {coinDetailData.coin}</Text>
                    </div>
                    <div className="d-flex justify-content align-center c-pointer" onClick={() => this.props.changeStep('step3')} >
                        <div className="text-center crypto-coin">
                            <span className="coin md btc-white"></span>
                            <Paragraph className="mb-0 text-purewhite fs-14 fw-100 mt-4" style={{ lineHeight: 'normal' }}>{coinDetailData.coinFullName}</Paragraph>
                        </div>
                        <span className="icon sm rightarrow swap-arrow"></span>
                        <span className="icon swapfrom-arrow"></span>
                    </div>
                </div>}
                {coinReceiveDetailData&&<div className="swap swapreceive-card p-relative">
                    <div>
                        <Translate className="text-purewhite fs-14 fw-100" content="swap_to" component={Text} />
                        <Input className="card-input" defaultValue="0" value={this.state.receiveValue} onChange={value=>this.setFromAmount(value)} bordered={false} placeholder="0.0" />
                        <Text className="text-purewhite mt-4 fs-12 fw-100">Balance - {coinReceiveDetailData.coinBalance} {coinReceiveDetailData.coin}</Text>
                    </div>
                    <div className="d-flex justify-content align-center c-pointer" onClick={() => this.props.changeStep('step4')} >
                        <div className="text-center crypto-coin">
                            <span className="icon swapto-arrow"></span>
                            <span className="coin md eth-white"></span>
                            <Paragraph className="mb-0 text-purewhite fs-14 fw-100 mt-4" style={{ lineHeight: 'normal' }}>{coinReceiveDetailData.coinFullName}</Paragraph>
                        </div>
                        <span className="icon sm rightarrow swap-arrow"></span>
                    </div>
                </div>}
                <div className="p-16 mt-24 text-center fw-200">
                    <Paragraph className="fs-16 text-white-30 mb-0 l-height-normal">
                        Available {this.state.fromValue} {coinDetailData.coin}
                    </Paragraph>
                    <Paragraph className="fs-16 text-white-30 l-height-normal">
                        Price 1{coinDetailData.coin} = {this.state.price} {coinReceiveDetailData.coin}
                    </Paragraph>
                </div>
                <Translate size="large" block className="pop-btn" style={{ marginTop: '100px' }} content="preview_swap" component={Button} onClick={() => this.props.changeStep('step2')} />
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
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SwapCoins);
