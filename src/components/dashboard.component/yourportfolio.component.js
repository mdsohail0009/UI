import React, { Component } from 'react';
import { List, Button, Typography, Empty, Image } from 'antd';
import Translate from 'react-translate-component';
import BuySell from '../buy.component';
import ConnectStateProps from '../../utils/state.connect';
import { fetchYourPortfoliodata } from '../../reducers/dashboardReducer';
import Currency from '../shared/number.formate';
import { fetchSelectedCoinDetails, setExchangeValue, setCoin } from '../../reducers/buyReducer';
import { setStep } from '../../reducers/buysellReducer';
import { updateCoinDetail } from '../../reducers/sellReducer'
import { convertCurrency } from '../buy.component/buySellService';
import { withRouter, Link } from 'react-router-dom';
import apiCalls from '../../api/apiCalls';

class YourPortfolio extends Component {
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
            this.props.dispatch(fetchYourPortfoliodata(this.props.userProfile.id));
        }
    }
    showBuyDrawer = (item, key) => {
        if (!this.props?.userProfile?.isKYC) {
            this.props.history.push("/notkyc");
            return;
        }
        else if (!this.props.twoFA?.isEnabled) {
            this.props.history.push("/enabletwofactor");
            return;
        }
        else if (this.props?.userProfile?.isDocsRequested) {
            this.props.history.push("/docnotices");
            return;
        }

        if (key === "buy") {
            this.props.dispatch(fetchSelectedCoinDetails(item.coin, this.props.userProfile?.id));
            this.props.dispatch(setCoin({ ...item, toWalletCode: item.coin, toWalletId: item.id, toWalletName: item.coinFullName }));
            convertCurrency({ from: item.coin, to: "USD", value: 1, isCrypto: false, memId: this.props.userProfile?.id, screenName: null }).then(val => {
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
    render() {
        const { Title, Text } = Typography;
        const { cryptoPortFolios } = this.props.dashboard
        const { totalCryptoValue, totalFiatValue } = this.props.dashboard.portFolio.data;

        return (
          <div className="portfolio-list">
           
           <div  className="portfolio-title mb-16">
           <div className='portfolio-data' >
            <Translate
              content="your_portfolio"
              component={Title}
              className="fs-24 text-white mb-0 fw-600 mr-8"
            />
            <Currency prefix={"$"} defaultValue={totalCryptoValue}  className={`text-white-30 fs-16 m-0 ${totalCryptoValue < 0 ? 'text-red' : 'text-green'}`} style={{ lineHeight: '18px' }} />
            </div>
              <div>
              <Link to="/cockpitCharts" className="dbchart-link fs-14 fw-500">
                <Translate content="cockpit" />
                <span className="icon sm right-angle ml-4" />
              </Link></div>
            </div>
            <List
              className="mobile-list"
              itemLayout="horizontal"
              dataSource={cryptoPortFolios.data}
              loading={cryptoPortFolios.loading}
              locale={{
                emptyText: (
                  <Empty
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                    description={apiCalls.convertLocalLang("No_data")}
                  />
                )
              }}
              renderItem={(item) => (
                <List.Item
                  className=""
                  extra={
                    <div className='crypto-btns'>
                      <Translate
                        content="buy"
                        component={Button}
                        type="primary"
                        onClick={() => this.showBuyDrawer(item, "buy")}
                        className="custom-btn prime"
                      />
                      <Translate
                        content="sell"
                        component={Button}
                        className="custom-btn sec ml-16"
                        onClick={() => this.showBuyDrawer(item, "sell")}
                      />
                    </div>
                  }
                >
                  {/* to={"/coindetails/" + item.coinFullName.toLowerCase()} */}
                  <List.Item.Meta
                    avatar={
                      <span
                        className={`coin c-pointer ${item.coin}`}
                        onClick={() =>
                          this.props.history.push(
                            "/coindetails/" + item.coinFullName.toLowerCase()
                          )
                        }
                      />
                    }
                    title={
                      <div className="mr-16">
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <Text className="fs-18 fw-400 text-upper text-white">
                            {item.coin}
                          </Text>
                          <Text className="fs-14 px-16 text-secondary">|</Text>
                          <Currency
                            defaultValue={item.coinValueinNativeCurrency}
                            type={"text"}
                            className={`fs-14 ${
                              item.coinValueinNativeCurrency > 0
                                ? "text-green"
                                : "text-red"
                            }`}
                          />
                        </div>
                        <Currency
                          defaultValue={item.coinBalance}
                          className="text-white fs-20 text-left"
                          type={"text"}
                          prefix={""}
                        />
                      </div>
                    }
                  />
                  {/* <div className='text-right fs-20 text-white'>
                                <Currency defaultValue={item.coinBalance} type={"text"} prefix={""} />
                                <Currency defaultValue={item.coinValueinNativeCurrency} type={"text"} className={`fs-16 ${item.coinValueinNativeCurrency > 0 ? "text-green" : "text-red"}`} />
                            </div> */}
                </List.Item>
              )}
            />
            <BuySell
              showDrawer={this.state.buyDrawer}
              onClose={() => this.closeDrawer()}
            />
          </div>
        );
    }
}

export default ConnectStateProps(withRouter(YourPortfolio));
