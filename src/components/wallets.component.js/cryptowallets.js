import React, { Component } from 'react';
import { List, Typography, Empty} from 'antd';
import Translate from 'react-translate-component';
import BuySell from '../buy.component';
import ConnectStateProps from '../../utils/state.connect';
import { fetchYourPortfoliodata,fetchMarketCoinData } from '../../reducers/dashboardReducer';
import Currency from '../shared/number.formate';
import { fetchSelectedCoinDetails, setExchangeValue, setCoin } from '../../reducers/buyReducer';
import { setStep } from '../../reducers/buysellReducer';
import { updateCoinDetail } from '../../reducers/sellReducer'
import { convertCurrency } from '../buy.component/buySellService';
import { withRouter } from 'react-router-dom';
import apiCalls from '../../api/apiCalls';
class CryptoWallets extends Component {
    state = {
        loading: true,
        initLoading: true,
        portfolioData: [], buyDrawer: false
    }
    componentDidMount() {
       
        this.loadCryptos();
    }
    loadCryptos = () => {
        if (this.props.userProfile) {
            this.props.dispatch(fetchYourPortfoliodata());
        }
    }
    showBuyDrawer = (item, key) => {
        if (this.props?.userProfile?.isDocsRequested) {
            this.props.history.push("/docnotices");
            return;
        }
        if (!this.props?.userProfile?.isKYC) {
            this.props.history.push("/notkyc");
            return;
        }
        if (key === "buy") {
            this.props.dispatch(fetchSelectedCoinDetails(item.coin, this.props.userProfile?.id));
            this.props.dispatch(setCoin({ ...item, toWalletCode: item.coin, toWalletId: item.id, toWalletName: item.coinFullName }));
            convertCurrency({ from: item.coin, to: "USD", value: 1, isCrypto: false, customer_id: this.props.userProfile?.id, screenName: null }).then(val => {
                this.props.dispatch(setExchangeValue({ key: item.coin, value: val }));
            });
            this.props.dispatch(setStep("step2"));
        } else if (key === "sell") {
            this.props.dispatch(setCoin(item));
            this.props.dispatch(setExchangeValue({ key: item.coin, value: item.oneCoinValue }));
            this.props.dispatch(updateCoinDetail(item))
            this.props.dispatch(setStep("step10"));
        }
        this.setState({
            buyDrawer: true
        })
    }
    closeDrawer = () => {
        this.setState({
            buyDrawer: false,
        })
    }
    showCoinDetails = (item) => {
        if (this.props.onClose) {
            this.props.onClose();
        }
        this.props.history.push(
                  "/coindetails/" + item.coinFullName.toLowerCase()
                )
                this.props.dispatch(fetchMarketCoinData(true))
    }
    render() {
        const { Title } = Typography;
        const { cryptoPortFolios } = this.props.dashboard
        return (
            <div className="crypto-wallets">
                <div className="wallet-head">
                    <Translate content="crypto" component={Title} className="fs-20 m-0 fw-500 text-white" />
                </div>
                <List className="mobile-list mb-list"
                    itemLayout="horizontal"
                    dataSource={cryptoPortFolios.data}
                    loading={cryptoPortFolios.loading}
                    locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={apiCalls.convertLocalLang('No_data')} /> }}
                    renderItem={item => (
                        <List.Item extra={
                            <div className="text-right wallet-mb">
                                <Currency defaultValue={item.coinBalance} type={"text"} prefix={""} className="text-white-30" />
                                <Currency defaultValue={item.coinValueinNativeCurrency} type={"text"} className={`fs-16 ${item.coinValueinNativeCurrency > 0 ? "text-green" : "text-red"}`} />
                            </div>
                        }>
                            <List.Item.Meta
                                avatar={
                                    <span
                                      className={`coin c-pointer ${item.coin}`}
                                      onClick={() => this.showCoinDetails(item)}
                                    />
                                  }
                                title={<div className="fs-18 fw-500 text-upper text-white-30 mt-12 mb-0">{item.coin}</div>}
                            />
                        </List.Item>
                    )}
                />
                <BuySell showDrawer={this.state.buyDrawer} onClose={() => this.closeDrawer()} />
            </div>
        );
    }
}

export default ConnectStateProps(withRouter(CryptoWallets));
