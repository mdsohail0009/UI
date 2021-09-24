import React, { Component } from 'react';
import { Typography, Card } from 'antd';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import {  setCoinWallet,updateCoinDetails } from '../../reducers/buy.reducer';   // do not remove this line time being i will check // subbareddy
import Loader from '../../Shared/loader'
import { getMemberCoins,updateCoinDetail } from '../../reducers/sellReducer';
import { setCoin, setExchangeValue } from '../../reducers/buyReducer';
import Currency from '../shared/number.formate';
import { appInsights } from "../../Shared/appinsights";

class SellToggle extends Component {
    componentDidMount() {
        this.props.fetchMemberCoins(this.props.member?.id)
        this.trackevent()
    }
    trackevent =() =>{
        appInsights.trackEvent({
            name: 'Sell', properties: {"Type": 'User',"Action": 'Page view',"Username":this.props.member.userName,"MemeberId": this.props.member.id,"Feature": 'Sell',"Remarks": "Sell page view","Duration": 1,"Url": window.location.href,"FullFeatureName": 'Sell Crypto'}
        });
    }
    handleBuySellToggle = e => {
        this.setState({
            buyToggle: e.target.value,
        });
    };
    render() {
        const { Text } = Typography;
        if(this.props.sellData?.memberCoins?.loading){return <Loader/>}
        return (
            <>
               <div className="sellcrypto-container auto-scroll">
                    {this.props.sellData?.memberCoins?.data?.map((coin, idx) => <Card key={idx} className="crypto-card mb-16 c-pointer" bordered={false} onClick={() => { this.props.changeStep('step10'); this.props.setSelectedCoin(coin);this.props.setExchangeValue({ key: coin.coin, value: coin.oneCoinValue }) }} >
                        <span className="d-flex align-center">
                            <span className={`coin lg ${coin.coin}`} />
                            <Text className="fs-24 textc-white crypto-name ml-12">{coin.coinFullName}</Text>
                        </span>
                        <div className="crypto-details">
                            <Text className="crypto-percent textc-white fw-700">{coin.percentage}<sup className="percent textc-white fw-700">%</sup></Text>
                            <div className="fs-16 textc-white fw-200 crypto-amount">
                                {/* <div>{coin.coinBalance?.toFixed(8)} {coin.coin}</div>
                                <div>$ {coin.coinValueinNativeCurrency?.toFixed(2)}</div> */}
                                <Currency prefix={""} defaultValue={coin.coinBalance} suffixText={coin.coin} />
                                <Currency prefix={"$ "} defaultValue={coin.coinValueinNativeCurrency} suffixText="" />
                            </div>
                        </div>
                    </Card>)}
                </div>
            </>
        )
    }
}
const connectStateToProps = ({ buySell, sellInfo, userConfig }) => {
    return { buySell, sellData:sellInfo, member: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        fetchMemberCoins: (memberId) => {
            dispatch(getMemberCoins(memberId))
        },
        setSelectedCoin:(coinWallet)=>{
            dispatch(setCoin(coinWallet));
            dispatch(updateCoinDetail(coinWallet))
        },
        setExchangeValue: ({ key, value }) => {
            dispatch(setExchangeValue({ key, value }))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SellToggle);
