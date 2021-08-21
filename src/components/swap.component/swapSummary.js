import React, { Component } from 'react';
import { Typography, Button, notification, Alert, Spin } from 'antd';
import Translate from 'react-translate-component';
import { Link } from 'react-router-dom';
import { setStep, updateSwapdata } from '../../reducers/swapReducer';
import { connect } from 'react-redux';
import { fetchCurrConvertionValue, saveSwapData } from '../../components/swap.component/api'
import SuisseBtn from '../shared/butons';
import Summary from '../summary.component';

const LinkValue = (props) => {
    return (
        <Translate className="text-yellow text-underline c-pointer"
            content={props.content}
            component={Link}
        // to="./#"
        />
    )
}

class SwapSummary extends Component {
    state = {
        isLoading: false,
        loader: true,
        price: null,
        receiveValue: null,
        disableConfirm: false,
        errorMessage: null,
        agreeValue: false,
        swapSaveData: { "id": "00000000-0000-0000-0000-000000000000", "membershipId": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "fromWalletId": null, "fromWalletCode": null, "fromWalletName": null, "fromValue": 0, "toWalletId": null, "toWalletCode": null, "toWalletName": null, "toValue": 0, "description": null, "comission": 0, "exicutedPrice": 0, "totalAmount": 0 }
    }
    componentDidMount() {
        this.setOneCoinValue();
        this.setReceiveAmount();
        // this.updateTimer = setInterval(() => {
        //     this.setOneCoinValue();
        //     this.setReceiveAmount();
        //     this.setState({ ...this.state, disableConfirm: true});
        // },10000);
    }
    componentWillUnmount() {
        clearInterval(this.updateTimer);
    }
    agreePolicyChecked(e) {
        this.setState({ agreeValue: e.target.checked }, () => this.callBackFunction());
    }
    callBackFunction() {
        if (this.state.agreeValue) {
            this.setState({ ...this.state, errorMessage: null })
        }
    }

    async setOneCoinValue() {
        if (this.props.swapStore.coinDetailData.coin && this.props.swapStore.coinReceiveDetailData.coin) {
            let res = await fetchCurrConvertionValue(this.props.swapStore.coinDetailData.coin, this.props.swapStore.coinReceiveDetailData.coin, 1);
            if (res.ok) {
                this.setState({ ...this.state, price: res.data })
            }
        }
    }
    async setReceiveAmount(e) {
        let res = await fetchCurrConvertionValue(this.props.swapStore.coinDetailData.coin, this.props.swapStore.coinReceiveDetailData.coin, this.props.swapStore.fromCoinInputValue);
        if (res.ok) {
            this.setState({ ...this.state, receiveValue: res.data })
        }
    }
    confirmswapvalidation() {
        if (!this.state.agreeValue) {
            //notification.error({ message: "", description: 'Please agree to terms&conditions' });
            this.setState({...this.state,errorMessage: 'Please agree to all Term of Use'})
        }
        else if (!this.props.swapStore.coinDetailData.coinBalance) {
            //notification.error({ message: "", description: 'Insufficiant funds to swap' });
            this.setState({...this.state,errorMessage: 'Insufficiant funds to swap'})
        }
    }
    async confirmSwap() {
        
        if (!this.state.agreeValue) {
            //notification.error({ message: "", description: 'Please agree to terms&conditions' });
            this.setState({...this.state,errorMessage: 'Please agree to all Term of Use'})
        }
        else if (!this.props.swapStore.coinDetailData.coinBalance) {
            //notification.error({ message: "", description: 'Insufficiant funds to swap' });
            this.setState({...this.state,errorMessage: 'Insufficiant funds to swap'})
        }
        else {

            let obj = Object.assign({}, this.state.swapSaveData);
            obj.membershipId = this.props.userProfile.id;
            obj.fromWalletId = this.props.swapStore.coinDetailData.id
            obj.fromWalletCode = this.props.swapStore.coinDetailData.coin
            obj.fromWalletName = this.props.swapStore.coinDetailData.coinFullName
            obj.fromValue = this.props.swapStore.fromCoinInputValue
            obj.executedPrice = this.state.price

            obj.toWalletId = this.props.swapStore.coinReceiveDetailData.id
            obj.toWalletCode = this.props.swapStore.coinReceiveDetailData.coin
            obj.toWalletName = this.props.swapStore.coinReceiveDetailData.coinFullName
            obj.toValue = this.state.receiveValue
            obj.totalAmount = this.state.receiveValue
            this.setState({ ...this.state, isLoading:true})
            let res = await saveSwapData(obj);
            if (res.ok) {
                this.props.changeStep('confirm');
                this.setState({ ...this.state, loader: false, isLoading:false })
            } else {
                this.setState({ ...this.state, loader: false,isLoading:false, errorMessage:res.error })
            }
        }
    }

    render() {
        const { Paragraph, Text } = Typography;
        const link = <LinkValue content="terms_service" />;
        return (
            <>{(this.state.receiveValue &&this.state.price &&this.props.swapStore.fromCoinInputValue && this.props.swapStore?.coinDetailData?.coin)?<Summary
            loading={false}
            coin={this.props.swapStore?.coinReceiveDetailData?.coin}
            nativeCurrency={this.props.swapStore?.coinReceiveDetailData?.coin}
            oneCoinValue={this.state.price}
            amount={this.state.receiveValue}
            showEstimated={false}
            showEstimatedTotal={false}
            currencyPrefix=''
            exchangeCoin={this.props.swapStore?.coinDetailData?.coin}
            showConvert={true}
            convertValue={parseFloat(this.props.swapStore.fromCoinInputValue)}
            convertCoin={this.props.swapStore?.coinDetailData?.coin}
            error={{ valid: this.state.errorMessage?false:true,title:'Swap', message: this.state.errorMessage }} iButtonLoad={this.state.isLoading}
            onRefresh={() => {this.setOneCoinValue(); this.setReceiveAmount();}}
            onCancel={() => this.props.changeStep('step1')}
            onClick={() => this.confirmSwap()}
            onTermsChange={(checked)=>{this.setState({...this.state,agreeValue:checked})}}
            onErrorClose = {()=>this.setState({...this.state,errorMessage:null})}
            isButtonLoad = {this.state.isLoading}
        />:<div className="spinLoader">
        <Spin />
      </div>}
           {/* <>

                {this.state.errorMessage != null && <Alert
                    //message="this.state.errorMessage"
                     description={this.state.errorMessage}
                    type="error"
                    showIcon
                    closable={false}
                />}
                <div className="text-center">
                    <Text className="fs-36 fw-200 text-white-30">{this.state.receiveValue} {this.props.swapStore.coinReceiveDetailData?.coin}</Text>
                </div>
                <div className="pay-list fs-16">
                    <Translate className="fw-400 text-white" content="exchange_rate" component={Text} />
                    <Text className="fw-300 text-white-30">1 {this.props.swapStore?.coinDetailData?.coin} = {this.state.price} {this.props.swapStore?.coinReceiveDetailData?.coin}</Text>
                </div>
                <div className="pay-list fs-16 mb-16">
                    <Translate className="fw-400 text-white" content="convert" component={Text} />
                    <Text className="fw-300 text-white-30">{this.props.swapStore.fromCoinInputValue} {this.props.swapStore?.coinDetailData?.coin} </Text>
                </div>
                <Translate className="fs-14 text-white-30 text-center mb-36 fw-200" content="summary_hint_text" component={Paragraph} />
                
                <div className="d-flex p-16 mb-36 agree-check">
                    <label>
                        <input type="checkbox" id="agree-check" onChange={(e) => this.agreePolicyChecked(e)} />
                        <span for="agree-check" />
                    </label><Translate content="agree_to_suissebase" with={{ link }} component={Paragraph} className="fs-14 text-white-30 ml-16" style={{ flex: 1 }} />
                </div>
                <SuisseBtn className={"pop-btn"} onRefresh={() => { this.setOneCoinValue(); this.setReceiveAmount(); }} duration={1000} title={"confirm_swap"} disabled={this.state.isLoading} loading={this.state.isLoading} autoDisable={true} onClick={() => this.confirmSwap()} />
                
                <Translate size="large" block className="pop-btn" content="cancel" component={Button} style={{ marginTop: '10px' }} onClick={() => {this.props.changeStep('step1')}} />
                </>*/}</>
        )
    }
}
const connectStateToProps = ({ swapStore, oidc, userConfig }) => {
    return { swapStore, userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        updateSwapdataobj: (obj) => {
            dispatch(updateSwapdata(obj))
        },
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SwapSummary);

