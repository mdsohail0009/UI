import React, { Component } from 'react';
import { Drawer, Typography, Button, Card, Input, Radio } from 'antd';
import config from '../../config/config';
import WalletList from '../shared/walletList';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import { getMemberCoins, updateCoinDetails,setExchangeValue,setCoinWallet } from '../buysell.component/crypto.reducer'
import Loader from '../../Shared/loader'

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
        const { Title, Paragraph, Text } = Typography;
        return (
            <>
                {this.props.sellData.MemberCoins != null && this.props.sellData.MemberCoins.length != 0 && <div className="sellcrypto-container auto-scroll">
                    {this.props.sellData.MemberCoins.map((coin, idx) => <Card className="crypto-card mb-16 c-pointer" bordered={false} onClick={() => { this.props.changeStep('step10'); this.props.dispatch(updateCoinDetails(coin)); this.props.setSelectedCoin(coin);this.props.dispatch(setExchangeValue({ key: coin.coin, value: coin.coinValueinNativeCurrency })) }} >
                        <span className="d-flex align-center">
                            <span className={`coin lg ${coin.coin}`} />
                            <Text className="fs-24 text-white crypto-name ml-12">{coin.coinFullName}</Text>
                        </span>
                        <div className="crypto-details">
                            <Text className="crypto-percent text-white fw-700">{coin.percentage}<sup className="percent text-white fw-700">%</sup></Text>
                            <div className="fs-16 text-white-30 fw-200 crypto-amount">
                                <div>{coin.coinBalance} {coin.coin}</div>
                                <div>{coin.coinValueinNativeCurrency}</div>
                            </div>
                        </div>
                    </Card>)}
                </div>}
                {(this.props.sellData.MemberCoins.length == 0 || this.props.sellData.MemberCoins == null) && <Loader />}
            </>
        )
    }
}
const connectStateToProps = ({ buySell, sellData, userConfig }) => {
    return { buySell, sellData, member: userConfig.userProfileInfo }
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
            dispatch(setCoinWallet(coinWallet));
        },
        setExchangeValue: ({ key, value }) => {
            dispatch(setExchangeValue({ key, value }))
        },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SellToggle);
