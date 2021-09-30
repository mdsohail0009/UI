import React, { Component } from 'react';
import { setStep, updateSwapdata } from '../../reducers/swapReducer';
import { connect } from 'react-redux';
import { fetchCurrConvertionValue, saveSwapData } from '../../components/swap.component/api';
import Summary from '../summary.component';
import { fetchDashboardcalls } from '../../reducers/dashboardReducer';
import { appInsights } from "../../Shared/appinsights";
import Loader from '../../Shared/loader';

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
    useDivRef = React.createRef();
    componentDidMount() {
        this.setOneCoinValue();
        this.setReceiveAmount();
        
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
            let res = await fetchCurrConvertionValue(this.props.swapStore.coinDetailData.coin, this.props.swapStore.coinReceiveDetailData.coin, 1, this.props.userProfile.id);
            if (res.ok) {
                this.setState({ ...this.state, price: res.data })
            }
        }
    }
    async setReceiveAmount(e) {
        let res = await fetchCurrConvertionValue(this.props.swapStore.coinDetailData.coin, this.props.swapStore.coinReceiveDetailData.coin, this.props.swapStore.fromCoinInputValue,this.props.userProfile.id,'swap');
        if (res.ok) {
            this.setState({ ...this.state, receiveValue: res.data })
        }
    }
    confirmswapvalidation() {
        if (!this.state.agreeValue) {
            this.setState({...this.state,errorMessage: 'Please agree to all Term of Use'})
        }
        else if (!this.props.swapStore.coinDetailData.coinBalance) {
            this.setState({...this.state,errorMessage: 'Insufficiant funds to swap'})
        }
    }
    async confirmSwap() {
        
        if (!this.state.agreeValue) {
            this.setState({...this.state,errorMessage: 'Please agree to all Term of Use'})
            this.useDivRef.current.scrollIntoView()
        }
        else if (!this.props.swapStore.coinDetailData.coinBalance) {
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
                this.props.dispatch(fetchDashboardcalls(this.props.userProfile.id))
                appInsights.trackEvent({
                    name: 'Swap', properties: {"Type": 'User',"Action": 'Save swap',"Username": this.props.userProfile.userName,"MemeberId": this.props.userProfile.id,"Feature": 'Swap',"Remarks": (obj.fromValue +" "+obj.fromWalletName+" to "+obj.toValue +" "+obj.toWalletName),"Duration": 1,"Url": window.location.href,"FullFeatureName": 'Swap Crypto'}
                });
            } else {
                this.setState({ ...this.state, loader: false,isLoading:false, errorMessage:res.error })
            }
        }
    }

    render() {
        return (
            <><div ref={this.useDivRef}></div>{(this.state.receiveValue &&this.state.price &&this.props.swapStore.fromCoinInputValue && this.props.swapStore?.coinDetailData?.coin)?<Summary
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
        />:<Loader />}
           </>
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
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SwapSummary);

