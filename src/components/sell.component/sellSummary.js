import React, { Component } from 'react';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import { getSellPreviewData, savesellData } from '../buy.component/api'
import Summary from '../summary.component';
import { fetchDashboardcalls, fetchMarketCoinData } from '../../reducers/dashboardReducer';
import { appInsights } from "../../Shared/appinsights";
import {Alert} from 'antd'
import { setSellFinalRes } from '../../reducers/sellReducer'
import apicalls from '../../api/apiCalls';
import { setCurrentAction } from '../../reducers/actionsReducer';
import {setSellHeaderHide} from '../../reducers/buysellReducer';


class SellSummary extends Component {
    state = {
         sellpreviewData: {},
          loader: true,
          isLoading: false,
           disableConfirm: false,
            isTermsAgree: false,
            permissions:{},
             error: { valid: true, message: null,agreeRed:true } }
    componentDidMount() {
        this.fetchPreviewData()
        setTimeout(() => this.setState({ ...this.state, disableConfirm: true }), 12000)
        this.EventTrack();
        this.permissionsInterval = setInterval(this.loadPermissions, 200);
    }
    EventTrack = () => {
        apicalls.trackEvent({
            "Type": 'User', "Action": 'Sell summary page view', "Username": this.props.customer?.userName, "customerId": this.props.customer?.id, "Feature": 'Sell', "Remarks": 'Sell Crypto coin summary page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Sell Crypto'
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
        this.setState({ ...this.state,loader:true, error: { valid: true, message: '',agreeRed:true } })
        if (!this.state.isTermsAgree) {
            this.setState({
                ...this.state, error: {
                    valid: false, message: apicalls.convertLocalLang('accept_terms'), title: apicalls.convertLocalLang('sellCrypto'),agreeRed:false
                }
            })

        } else {
            this.setState({ ...this.state, isLoading: true, error: { valid: true, message: '',agreeRed:true } })
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
                //this.props.sellTitleHide(true);
                this.props.changeStep('sellsuccess')
                this.setState({ ...this.state, loader: false,isLoading: false, disableConfirm: false })
                this.props.fetchDashboardData(this.props.customer.id)
                this.props.fetchMarketCoinDataValue();
                // appInsights.trackEvent({
                //     name: 'Sell', properties: { "Type": 'User', "Action": 'Save', "Username": this.props.customer.userName, "MemeberId": this.props.customer.id, "Feature": 'Sell', "Remarks": obj.fromValue + " " + this.state.sellpreviewData.coin + " selled", "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Sell Crypto' }
                // });
            } else {
                this.setState({ ...this.state, loader: false,isLoading: false, disableConfirm: false, error: { valid: false, message: this.isErrorDispaly(res),title: apicalls.convertLocalLang('sellCrypto'),agreeRed:false }  } )
            }
        }
    }
    isErrorDispaly = (objValue) => {
        if (objValue.data && typeof objValue.data === "string") {
          return objValue.data;
        } else if (
          objValue.originalError &&
          typeof objValue.originalError.message === "string"
        ) {
          return objValue.originalError.message;
        } else {
          return "Something went wrong please try again!";
        }
      };
      loadPermissions = () => {
		if (this.props.buySellPermissions) {
			clearInterval(this.permissionsInterval);
			let _permissions = {};
			for (let action of this.props.buySellPermissions?.actions) {
				_permissions[action.permissionName] = action.values;
			}
			this.setState({ ...this.state, permissions: _permissions });
		}
	}
    onSellCancel () {
        this.props.dispatch(setSellHeaderHide(true));
        this.props.changeStep('step1');
    }
    render() {
        const { sellpreviewData } = this.state;
        const { amount, amountNativeCurrency, oneCoinValue, coin, currency } = sellpreviewData;
        {this.state.error !== null && (
            <Alert
                closable
                type="error"
                message={apicalls.convertLocalLang('sellCrypto')}
                description={this.state.error}
                onClose={() => this.setState({error:null})}
                showIcon
            />
        )}
      
        return <Summary
        permissions={this.state.permissions?.Sell}
         loading={this.state.loader}
            coin={coin}
            oneCoinValue={oneCoinValue}
            amount={amount}
            amountNativeCurrency={amountNativeCurrency}
            nativeCurrency={currency ? currency : "USD"}
            error={this.state.error} 
            isButtonLoad={this.state.isLoading}
            onRefresh={() => { this.refreshPage() }}
            onCancel={() => this.onSellCancel()}
            onClick={() => this.saveSellData()}
            okBtnTitle={"sell"}

            onTermsChange={(checked) => { this.setState({ ...this.state, isTermsAgree: checked }) }}
            onCheked={this.state.isTermsAgree}
            onErrorClose={() => this.setState({ ...this.state, error: { valid: true, message: null } })} />
    }
}

const connectStateToProps = ({ buySell, sellInfo, userConfig,menuItems }) => {
    return { buySell, sellData: sellInfo, customer: userConfig.userProfileInfo,buySellPermissions: menuItems?.featurePermissions?.trade_sell, trackAuditLogData: userConfig.trackAuditLogData }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        fetchDashboardData: (customer_id) => {
            dispatch(fetchDashboardcalls(customer_id))
        },
        fetchMarketCoinDataValue: () => {
            dispatch(fetchMarketCoinData(true))
        },
        sellResData: (data) => {
            dispatch(setSellFinalRes(data))
        },
        // sellTitleHide: (val) => {
        //     dispatch(setSellTitleHide(val))
        // },
        setAction: (val) => {
			dispatch(setCurrentAction(val))
		  },
          dispatch

    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SellSummary);

