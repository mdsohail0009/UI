import React, { Component } from 'react';
import { Typography, Card, Empty,Image } from 'antd';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import { setCoinWallet, updateCoinDetails } from '../../reducers/buy.reducer';   // do not remove this line time being i will check // subbareddy
import Loader from '../../Shared/loader'
import { getMemberCoins, updateCoinDetail } from '../../reducers/sellReducer';
import { setCoin, setExchangeValue } from '../../reducers/buyReducer';
import Currency from '../shared/number.formate';
import { getSelectedCoinDetails } from '../buy.component/api'
import apicalls from '../../api/apiCalls';
import CryptoList from '../shared/cryptolist';

class SellToggle extends Component {
    state = {
        loading: false,
    }
    componentDidMount() {
        this.props.fetchMemberCoins(this.props.customer?.id)
    }
    handleBuySellToggle = e => {
        this.setState({
            buyToggle: e.target.value,
        });
    };
    setCoinDetailData = async (coin) => {
        this.setState({ ...this.state, loading: true });
        let res = await getSelectedCoinDetails(coin.coin, this.props.customer?.id);
        if (res.ok) {
            this.props.setSelectedCoin(res.data); this.props.changeStep('step10');
        }
        this.setState({ ...this.state, loading: false })
    }
    render() {
        const { Text } = Typography;
        if (this.props.sellData?.memberCoins?.loading||this.state.loading) { return <Loader /> }
        return (
            <>
                {!this.props?.sellData?.memberCoins?.loading && (!this.props.sellData?.memberCoins?.data || this.props.sellData?.memberCoins?.data?.length == 0)
                    && <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description={apicalls.convertLocalLang('No_data')} />}

                <div className="sellcrypto-container auto-scroll">

                    {/* {this.props.sellData?.memberCoins?.data?.map((coin, idx) => <Card key={idx} className="crypto-card mb-16 c-pointer" bordered={false} onClick={() => { this.setCoinDetailData(coin); this.props.setExchangeValue({ key: coin.coin, value: coin.oneCoinValue }); }} >
                    <div className="crypto-details d-flex">
                    <div>
                        <span className="d-flex align-center mb-4">
                            <Image preview={false} src={coin.impageWhitePath}/>
                            <div className="crypto-percent">{coin.percentage}<sup className="percent textc-white fw-700">%</sup></div>

                        </span> 
                        
                       
                        <Text className="fs-24 textc-white crypto-name ml-4 mt-8">{coin.coinFullName}</Text>
                        </div>
                            <div className="fs-16 textc-white fw-200 crypto-amount ">
                                <Currency prefix={""} defaultValue={coin.coinBalance} suffixText={coin.coin} />
                                <Currency prefix={"$ "} defaultValue={coin.coinValueinNativeCurrency} suffixText="" />
                            </div>
                        </div>
                    </Card>)} */}

    <CryptoList ref={this.ref} isLoading={this.state?.loading} showSearch={true} coinList={this.props?.sellData?.memberCoins?.data} coinType="Sell" onCoinSelected={(coin) => this.setCoinDetailData(coin)} />
                </div>
            </>
        )
    }
}
const connectStateToProps = ({ buySell, sellInfo, userConfig }) => {
    return { buySell, sellData: sellInfo, customer: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        fetchMemberCoins: (customer_id) => {
            dispatch(getMemberCoins(customer_id))
        },
        setSelectedCoin: (coinWallet) => {
            dispatch(setCoin(coinWallet));
            dispatch(updateCoinDetail(coinWallet))
        },
        setExchangeValue: ({ key, value }) => {
            dispatch(setExchangeValue({ key, value }))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SellToggle);
