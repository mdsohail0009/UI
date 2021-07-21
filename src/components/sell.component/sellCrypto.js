import React, { Component } from 'react';
import { Drawer, Typography, Button, Card, Input, Radio } from 'antd';
import config from '../../config/config';
import WalletList from '../shared/walletList';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import {getMemberCoins,updateCoinDetails} from '../buysell.component/crypto.reducer'


class SellToggle extends Component {
    componentDidMount(){
        this.props.fetchMemberCoins()
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
                {this.props.sellData.MemberCoins!=null&&this.props.sellData.MemberCoins.length!=0&&<div className="sellcrypto-container auto-scroll">
                    {this.props.sellData.MemberCoins.map((coin,idx) => <Card className="crypto-card select mb-16 c-pointer" bordered={false} onClick={() => {this.props.changeStep('step10');this.props.dispatch(updateCoinDetails(coin))}} >
                        <span className="d-flex align-center">
                            <span className="coin lg btc-white" />
                            <Text className="fs-24 text-white crypto-name ml-8">{coin.coinFullName}</Text>
                        </span>
                        <div className="crypto-details">
                            <Text className="crypto-percent text-white fw-700">{coin.percentage}<sup className="percent text-white fw-700">%</sup></Text>
                            <div className="fs-16 text-white-30 fw-200 crypto-amount">
                                <div className="text-yellow">{coin.coinBalance}<Text className="text-secondary"> {coin.coin}</Text></div>
                                <div className="text-yellow"><Text className="text-secondary">$</Text> {coin.coinValueinNativeCurrency}</div>
                            </div>
                        </div>
                    </Card>)}
                </div>}
            </>
        )
    }
}
const connectStateToProps = ({ buySell, sellData }) => {
    return { buySell,sellData }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        fetchMemberCoins:()=>{
            dispatch(getMemberCoins())
        },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SellToggle);
