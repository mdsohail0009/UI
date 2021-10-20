import React, { Component } from 'react';
import { changeStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import { fetchPreview } from '../../reducers/buyReducer';
import { buyCrypto } from './api';
import Summary from '../summary.component';
import Loader from '../../Shared/loader';
import { fetchDashboardcalls } from '../../reducers/dashboardReducer';
import { appInsights } from "../../Shared/appinsights";
class BuySummary extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            disablePay: false,
            error: { valid: true, error: null },
            isTermsAgreed:false
        }
    }
    pay = async () => {
        this.setState({ ...this.state, error: { valid: true, message: null } });
        if (this.state.isTermsAgreed) {
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
                "exicutedPrice": this.props.sellData?.previewDetails?.data?.oneCoinValue,
                "totalAmount": this.props.sellData.previewDetails?.data?.amount

            }
            obj.toWalletId = obj.toWalletId?obj.toWalletId:this.props.sellData?.id;
            obj.toWalletCode = obj.toWalletCode?obj.toWalletCode:this.props.sellData?.coinWallet?.coin;
            obj.toWalletName = obj.toWalletName?obj.toWalletName:this.props.sellData?.coinWallet?.coinFullName;
            this.setState({ isLoading: true });
            const response = await buyCrypto(obj);
            if (response.ok) {
                this.props.setStep('success')
                this.props.fetchDashboardData(this.props.member.id)
                appInsights.trackEvent({
                    name: 'Buy', properties: {"Type": 'User',"Action": 'Save ',"Username": this.props?.member.userName,"MemeberId": this.props?.member.id,"Feature": 'Buy',"Remarks": obj.toValue +' '+ obj.toWalletName+' buy success' ,"Duration": 1,"Url": window.location.href,"FullFeatureName": 'Buy crypto'}
                });
            } else {
                this.setState({ ...this.state, error: { valid: false, message: response.data || response.originalError.message } })
            }
            this.setState({ isLoading: false })
        } else {
            this.setState({ ...this.state, error: { valid: false, message: "Please agree to terms & conditions" } })
        }
    }
    render() {
        if (this.props.sellData?.previewDetails?.loading || !this.props.sellData?.previewDetails?.data) {
            return <Loader />
        }
        const { coin, oneCoinValue, amount, amountNativeCurrency,isCrypto } = this.props.sellData?.previewDetails?.data;
        return <Summary
            loading={this.props.sellData?.previewDetails?.loading || !this.props.sellData?.previewDetails?.data}
            coin={coin}
            oneCoinValue={oneCoinValue}
            amount={amount}
            amountNativeCurrency={amountNativeCurrency}
            nativeCurrency={this.props.sellData?.selectedWallet?.currencyCode}
            error={this.state.error} iButtonLoad={this.state.isLoading}
            onRefresh={() => this.props.refreshDetails(this.props.sellData?.selectedWallet, coin, isCrypto?amountNativeCurrency:amount,isCrypto)}
            onCancel={() => this.props.setStep('step1')}
            onClick={() => this.pay()}
            onTermsChange={(checked)=>{this.setState({...this.state,isTermsAgreed:checked})}}
            onCheked = {this.state.isTermsAgreed}
            isButtonLoad={this.state.isLoading}
            onErrorClose = {()=>this.setState({...this.state,error:{valid:true,message:null}})}
        />
    }
}
const connectStateToProps = ({ buySell, buyInfo, userConfig }) => {
    return { buySell, sellData:buyInfo, member: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        setStep: (stepcode) => {
            dispatch(changeStep(stepcode))
        },
        refreshDetails: (wallet, coin, amount,isCrypto) => {
            dispatch(fetchPreview({ coin, wallet, amount,isCrypto }))
        },
        fetchDashboardData: (member_id) => {
            dispatch(fetchDashboardcalls(member_id))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(BuySummary);