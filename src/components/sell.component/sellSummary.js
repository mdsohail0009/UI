import React, { Component } from 'react';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import { getSellPreviewData, savesellData } from '../buy.component/api'
import Summary from '../summary.component';
import { fetchDashboardcalls, fetchMarketCoinData } from '../../reducers/dashboardReducer';
import { appInsights } from "../../Shared/appinsights";
import { message } from 'antd';
import { setSellFinalRes } from '../../reducers/sellReducer'
import apicalls from '../../api/apiCalls';
class SellSummary extends Component {
    state = { sellpreviewData: {}, loader: true, disableConfirm: false, isTermsAgree: false, error: { valid: true, message: null } }
    componentDidMount() {
        this.fetchPreviewData()
        setTimeout(() => this.setState({ ...this.state, disableConfirm: true }), 12000)
        this.EventTrack();
    }
    EventTrack = () => {
        apicalls.trackEvent({
            "Type": 'User', "Action": 'Sell summary page view', "Username": this.props.member?.userName, "MemeberId": this.props.member?.id, "Feature": 'Sell', "Remarks": 'Sell Crypto coin summary page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Sell Crypto'
        });
    }
    async fetchPreviewData() {
        let res = await getSellPreviewData(this.props.sellData.sellsaveObject);
        if (res.ok) {
            this.setState({ sellpreviewData: res.data, loader: false, disableConfirm: false })
        }
    }
    refreshPage() {
        if (!this.state.isTermsAgree) {
            this.setState({ ...this.state, error: { valid: false, message: 'Please accept terms of service' } })

        } else {
            this.setState({ ...this.state, loader: true, error: { valid: true, message: '' } })
            this.fetchPreviewData()
        }
    }
    async saveSellData() {
        this.setState({ ...this.state, error: { valid: true, message: '' } })
        if (!this.state.isTermsAgree) {
            this.setState({
                ...this.state, error: {
                    valid: false, message: apicalls.convertLocalLang('accept_terms'), title: apicalls.convertLocalLang('sellCrypto')
                }
            })

        } else {
            this.setState({ ...this.state, loader: true, error: { valid: true, message: '' } })
            let obj = Object.assign({}, this.props.sellData.sellsaveObject)
            obj.fromValue = this.state.sellpreviewData.amount
            obj.toValue = this.state.sellpreviewData.amountNativeCurrency
            obj.exicutedPrice = this.state.sellpreviewData.oneCoinValue
            obj.totalAmount = this.state.sellpreviewData.amountNativeCurrency + this.props.sellData.sellsaveObject.comission;
            obj.comission = this.props.sellData.sellsaveObject.comission;
            obj.isCrypto = this.state.sellpreviewData?.isCrypto;
            this.props.trackAuditLogData.Action = 'Save';
            this.props.trackAuditLogData.Remarks = obj.fromValue + " " + this.state.sellpreviewData.coin + " selled"
            obj.info = JSON.stringify(this.props.trackAuditLogData)
            let res = await savesellData(obj);
            if (res.ok) {
                this.props.sellResData(res.data);
                this.props.changeStep('sellsuccess')
                this.setState({ ...this.state, loader: false, disableConfirm: false })
                this.props.fetchDashboardData(this.props.member.id)
                this.props.fetchMarketCoinDataValue();
                appInsights.trackEvent({
                    name: 'Sell', properties: { "Type": 'User', "Action": 'Save', "Username": this.props.member.userName, "MemeberId": this.props.member.id, "Feature": 'Sell', "Remarks": obj.fromValue + " " + this.state.sellpreviewData.coin + " selled", "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Sell Crypto' }
                });
            } else {
                this.setState({ ...this.state, loader: false, disableConfirm: false, error: { valid: false, message: res.data, title: apicalls.convertLocalLang('sellCrypto') } })
            }
        }
    }
    render() {
        const { sellpreviewData } = this.state;
        const { amount, amountNativeCurrency, oneCoinValue, coin, currency } = sellpreviewData;

        return <Summary
            loading={this.state.loader}
            coin={coin}
            oneCoinValue={oneCoinValue}
            amount={amount}
            amountNativeCurrency={amountNativeCurrency}
            nativeCurrency={currency ? currency : "USD"}
            error={this.state.error} iButtonLoad={this.state.isLoading}
            onRefresh={() => { this.refreshPage() }}
            onCancel={() => this.props.changeStep('step1')}
            onClick={() => this.saveSellData()}
            okBtnTitle={"sell"}
            onTermsChange={(checked) => { this.setState({ ...this.state, isTermsAgree: checked }) }}
            onCheked={this.state.isTermsAgree}
            onErrorClose={() => this.setState({ ...this.state, error: { valid: true, message: null } })} />
    }
}

const connectStateToProps = ({ buySell, sellInfo, userConfig }) => {
    return { buySell, sellData: sellInfo, member: userConfig.userProfileInfo, trackAuditLogData: userConfig.trackAuditLogData }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        fetchDashboardData: (member_id) => {
            dispatch(fetchDashboardcalls(member_id))
        },
        fetchMarketCoinDataValue: () => {
            dispatch(fetchMarketCoinData(true))
        },
        sellResData: (data) => {
            dispatch(setSellFinalRes(data))
        },

    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SellSummary);

