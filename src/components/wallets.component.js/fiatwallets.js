import React, { Component } from 'react';
import { Typography, List,Image } from 'antd';
import Translate from 'react-translate-component';
import SuissebaseFiat from '../buyfiat.component/suissebaseFiat';
import { fetchMemberWalletsData } from '../../reducers/dashboardReducer';
import ConnectStateProps from '../../utils/state.connect';
import Currency from '../shared/number.formate';
import MassPayment from '../buyfiat.component'
import { withRouter } from 'react-router-dom';
import apicalls from '../../api/apiCalls';
import { setWithdrawfiatenaable, setWithdrawfiat } from '../../reducers/sendreceiveReducer'
import { setdepositCurrency, getCurrencieswithBankDetails } from '../../reducers/depositReducer'
const { Title, Paragraph } = Typography;

class FiatWallets extends Component {
    state = {
        sendReceiveDrawer: false,
        valNum: 1,
        wallets: [], loading: true,
        buyFiatDrawer: false,
        selctedVal: ''
    }
    componentDidMount() {
        this.fetchWallets();
        this.props.dispatch(getCurrencieswithBankDetails());
        this.trackEvent()

    }
    async fetchWallets() {
        this.props.dispatch(fetchMemberWalletsData(this.props.userProfile.id))
    }
    trackEvent = () => {
        apicalls.trackEvent({
            "Type": 'User', "Action": 'Balances page view', "Username": this.props.userProfile.userName, "customerId": this.props.userProfile.id, "Feature": 'Balances', "Remarks": 'Balances page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Balances'
        });
    }
    showDocsError() {
        this.props.history.push("/docnotices");
    }
    showSendReceiveDrawer = (e, value) => {
        if (this.props?.userProfile?.isDocsRequested) {
            this.props.history.push("/docnotices");
            return;
        }
        if (!this.props?.userProfile?.isKYC) {
            this.props.history.push("/notkyc");
            return;
        }
        const isDocsRequested = this.props.userProfile.isDocsRequested;
        if (isDocsRequested) {
            this.showDocsError();
            return;
        }
        if (e === 2) {
            this.props.dispatch(setWithdrawfiatenaable(true))
            this.props.dispatch(setWithdrawfiat({ walletCode: value }))
        } else {
            this.props.dispatch(setdepositCurrency(value))
        }
        this.setState({
            valNum: e
        }, () => {
            this.setState({
                ...this.state,
                buyFiatDrawer: true,
                selctedVal: value
            })

        })
    }
    closeDrawer = () => {
        this.setState({
            buyFiatDrawer: false
        })
    }
    render() {
        const { wallets } = this.props.dashboard;
        return (
            <>
                <div className="wallet-head">
                    <Translate content="tab_fiat" component={Title} className="fs-20 m-0 fw-500 text-white" />
                </div>
                <List
                    itemLayout="horizontal"
                    dataSource={wallets.data}
                    bordered={false}
                    className="mobile-list mb-list"
                    loading={wallets.loading}
                    renderItem={item =>
                        <List.Item className="py-10 px-0">
                            <List.Item.Meta
                                avatar={<Image preview={false} src={item.imagePath} />}
                                title={<div className="fs-16 mt-12 fw-600 text-upper text-white-30 l-height-normal">{item.walletCode}</div>}
                            />
                            <div className="text-right wallet-mb">
                                <Currency className="fs-14 text-white-30 m-0" defaultValue={item.amount} prefix={(item?.walletCode == "USD" ? "$" : null) || (item?.walletCode == "GBP" ? "£" : null) || (item?.walletCode == "EUR" ? "€" : null)} decimalPlaces={8} type={"text"} style={{ lineHeight: '12px' }} />
                            </div>
                        </List.Item>}
                />
                <SuissebaseFiat showDrawer={this.state.sendReceiveDrawer} valNum={this.state.valNum} onClose={() => this.closeDrawer()} />
                {this.state.buyFiatDrawer && <MassPayment showDrawer={this.state.buyFiatDrawer} tabData={{ tabVal: this.state.valNum, walletCode: this.state.selctedVal }} onClose={() => this.closeDrawer()} />}
            </>
        );
    }
}

export default ConnectStateProps(withRouter(FiatWallets));