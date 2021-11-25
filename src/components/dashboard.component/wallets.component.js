import React, { Component } from 'react';
import { Typography, List, Button } from 'antd';
import Translate from 'react-translate-component';
import SuissebaseFiat from '../buyfiat.component/suissebaseFiat';
import { fetchMemberWalletsData } from '../../reducers/dashboardReducer';
import ConnectStateProps from '../../utils/state.connect';
import Currency from '../shared/number.formate';
import MassPayment from '../buyfiat.component'
import { withRouter } from 'react-router-dom';
import { setWithdrawfiatenaable, setWithdrawfiat } from '../../reducers/sendreceiveReducer'
import { setdepositCurrency, getCurrencieswithBankDetails } from '../../reducers/depositReducer'
const { Title, Paragraph } = Typography;

class Wallets extends Component {
    state = {
        sendReceiveDrawer: false,
        valNum: 1,
        wallets: [], loading: true,
        buyFiatDrawer: false,
        selctedVal: ''
    }
    componentDidMount() {
        this.fetchWallets();
        this.props.dispatch(getCurrencieswithBankDetails())
    }
    async fetchWallets() {
        this.props.dispatch(fetchMemberWalletsData(this.props.userProfile.id))
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
                <Translate content="suissebase_title" component={Title} className="fs-24 fw-600 mb-0 text-white" />
                <Translate content="suissebase_subtitle" component={Paragraph} className="text-white-30 fs-16 mb-16" />
                <List
                    itemLayout="horizontal"
                    dataSource={wallets.data}
                    bordered={false}
                    className="mobile-list"
                    loading={wallets.loading}
                    renderItem={item =>
                        <List.Item className="py-10 px-0">
                            <List.Item.Meta
                                avatar={<span className={`coin ${item?.walletCode.toLowerCase()} mr-4`} />}
                                title={<div className="fs-16 fw-600 text-upper text-white-30 l-height-normal">{item.walletCode}</div>}
                                description={<Currency className="fs-16 text-white-30 m-0" defaultValue={item.amount} prefix={(item?.walletCode == "USD" ? "$" : null) || (item?.walletCode == "GBP" ? "£" : null) || (item?.walletCode == "EUR" ? "€" : null)} decimalPlaces={8} type={"text"} style={{ lineHeight: '12px' }} />}
                            />
                            <div className="crypto-btns">
                                <Translate content="deposit" onClick={() => this.showSendReceiveDrawer(1, item.walletCode)} component={Button} type="primary" className="custom-btn prime" />
                                <Translate content="withdraw" onClick={() => this.showSendReceiveDrawer(2, item.walletCode)} component={Button} className="custom-btn sec outline ml-16" disabled={item.amount > 0 ? false : true} />
                            </div>
                        </List.Item>}
                />
                <SuissebaseFiat showDrawer={this.state.sendReceiveDrawer} valNum={this.state.valNum} onClose={() => this.closeDrawer()} />
                {this.state.buyFiatDrawer && <MassPayment showDrawer={this.state.buyFiatDrawer} tabData={{ tabVal: this.state.valNum, walletCode: this.state.selctedVal }} onClose={() => this.closeDrawer()} />}
            </>
        );
    }
}

export default ConnectStateProps(withRouter(Wallets));