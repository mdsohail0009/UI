import React, { Component } from 'react';
import { Typography, Card } from 'antd';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import {  setCoinWallet,updateCoinDetails } from '../../reducers/buy.reducer';   // do not remove this line time being i will check // subbareddy
import Loader from '../../Shared/loader'
import { getMemberCoins,updateCoinDetail } from '../../reducers/sellReducer';
import { setCoin, setExchangeValue } from '../../reducers/buyReducer';

class SellToggle extends Component {
    componentDidMount() {
        this.props.fetchMemberCoins(this.props.member?.id)
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
                            <Text className="fs-24 text-white crypto-name ml-12">{coin.coinFullName}</Text>
                        </span>
                        <div className="crypto-details">
                            <Text className="crypto-percent text-white fw-700">{coin.percentage}<sup className="percent text-white fw-700">%</sup></Text>
                            <div className="fs-16 text-white-30 fw-200 crypto-amount">
                                <div>{coin.coinBalance?.toFixed(8)} {coin.coin}</div>
                                <div>$ {coin.coinValueinNativeCurrency?.toFixed(2)}</div>
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
