import React, { Component } from 'react';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import { getSellPreviewData, savesellData } from '../buy.component/api'
import Summary from '../summary.component';
class SellSummary extends Component {
    state = { sellpreviewData: {}, loader: true, disableConfirm: false, isTermsAgree: false, error: {valid:true,message:null} }
    componentDidMount() {
        this.fetchPreviewData()
        setTimeout(() => this.setState({ ...this.state, disableConfirm: true }), 12000)
    }
    async fetchPreviewData() {
        let res = await getSellPreviewData(this.props.sellData.sellsaveObject);
        if (res.ok) {
            this.setState({ sellpreviewData: res.data, loader: false, disableConfirm: false })
        }
    }
    refreshPage() {
        this.fetchPreviewData()
    }
    async saveSellData() {
        this.setState({ ...this.state, error: {valid:true,message:''} })
        if (!this.state.isTermsAgree) {
            this.setState({ ...this.state, error:{valid:false,message: 'Please accept terms of service'} })
            return;
        } else {
            this.setState({ ...this.state, loader: true, error: {valid:true,message:''} })
            let obj = Object.assign({}, this.props.sellData.sellsaveObject)
            obj.fromValue = this.state.sellpreviewData.amount
            obj.toValue = this.state.sellpreviewData.amountNativeCurrency
            obj.exicutedPrice = this.state.sellpreviewData.oneCoinValue
            obj.totalAmount = this.state.sellpreviewData.amountNativeCurrency + this.props.sellData.sellsaveObject.comission;
            let res = await savesellData(obj);
            if (res.ok) {
                this.props.changeStep('success')
                this.setState({ ...this.state, loader: false, disableConfirm: false })
            } else {
                this.setState({ ...this.state, loader: false, disableConfirm: false })
            }
        }
    }
    render() {
        const { sellpreviewData } = this.state;
        const {amount,amountNativeCurrency,oneCoinValue,coin} = sellpreviewData;

        return <Summary
            loading={this.state.loader}
            coin={coin}
            oneCoinValue={oneCoinValue}
            amount={amount}
            amountNativeCurrency={amountNativeCurrency}
            nativeCurrency={"USD"}
            error={this.state.error} iButtonLoad={this.state.isLoading}
            onRefresh={() => {}}
            onCancel={() => this.props.changeStep('step1')}
            onClick={() => this.saveSellData()}
            okBtnTitle={"confirm_now"}
            onTermsChange={(checked) => { this.setState({ ...this.state, isTermsAgree: checked }) }}
            onErrorClose = {()=>this.setState({...this.state,error:{valid:true,message:null}})}/>
    }
}

const connectStateToProps = ({ buySell, sellInfo }) => {
    return { buySell, sellData:sellInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SellSummary);

