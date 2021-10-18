import React, { Component } from 'react';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import { getSellPreviewData, savesellData } from '../buy.component/api'
import Summary from '../summary.component';
import { fetchDashboardcalls } from '../../reducers/dashboardReducer';
import { appInsights } from "../../Shared/appinsights";
import { message } from 'antd';
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
        this.setState({ ...this.state, loader: true })
        this.fetchPreviewData()
    }
    async saveSellData() {
        this.setState({ ...this.state, error: {valid:true,message:''} })
        if (!this.state.isTermsAgree) {
            this.setState({ ...this.state, error:{valid:false,message: 'Please accept terms of service'} })
            
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
                this.props.fetchDashboardData(this.props.member.id)
                appInsights.trackEvent({
                    name: 'Sell', properties: {"Type": 'User',"Action": 'Save',"Username":this.props.member.userName,"MemeberId": this.props.member.id,"Feature": 'Sell',"Remarks": obj.fromValue+" "+this.state.sellpreviewData.coin+" selled","Duration": 1,"Url": window.location.href,"FullFeatureName": 'sell Crypto'}
                });
            } else {
                message.destroy()
                message.error({ content: res.data , className:'custom-msg'});
                this.setState({ ...this.state, loader: false, disableConfirm: false })
            }
        }
    }
    render() {
        const { sellpreviewData } = this.state;
        const {amount,amountNativeCurrency,oneCoinValue,coin,currency} = sellpreviewData;

        return <Summary
            loading={this.state.loader}
            coin={coin}
            oneCoinValue={oneCoinValue}
            amount={amount}
            amountNativeCurrency={amountNativeCurrency}
            nativeCurrency={currency?currency:"USD"}
            error={this.state.error} iButtonLoad={this.state.isLoading}
            onRefresh={() => {this.refreshPage()}}
            onCancel={() => this.props.changeStep('step1')}
            onClick={() => this.saveSellData()}
            okBtnTitle={"confirm_now"}
            onTermsChange={(checked) => { this.setState({ ...this.state, isTermsAgree: checked }) }}
            onErrorClose = {()=>this.setState({...this.state,error:{valid:true,message:null}})}/>
    }
}

const connectStateToProps = ({ buySell, sellInfo,userConfig }) => {
    return { buySell, sellData:sellInfo, member: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        fetchDashboardData: (member_id) => {
            dispatch(fetchDashboardcalls(member_id))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SellSummary);

