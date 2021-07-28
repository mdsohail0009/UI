import React, { Component } from 'react';
import { Typography, Button, Card, Input, Radio, Alert } from 'antd';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { Dropdown } from '../../Shared/Dropdown';
import { getSellamnt } from '../../components/buysell.component/api'
import { updatesellsaveObject } from '../buysell.component/crypto.reducer';
import WalletList from '../shared/walletList';
import LocalCryptoSwap from '../shared/local.crypto.swap';
import SuisseBtn from '../shared/butons';

class SelectSellCrypto extends Component {
    state = {
        USDAmnt: null, CryptoAmnt: null, sellSaveData: { "id": "00000000-0000-0000-0000-000000000000", "membershipId": null, "fromWalletId": null, "fromWalletCode": null, "fromWalletName": null, "fromValue": 0, "toWalletId": null, "toWalletCode": null, "toWalletName": null, "toValue": 0, "description": null, "comission": 0, "exicutedPrice": 0, "totalAmount": 0 }, isSwap: false
        , errorMessage: null
    }
    componentDidMount() {
        this.fetchdefaultMinAmntValues()
    }
    fetchdefaultMinAmntValues = async () => {
        this.setState({ ...this.state, CryptoAmnt: this.props.sellData.coinDetailData?.sellMinValue })
        let res = await getSellamnt(this.props.sellData.coinDetailData?.sellMinValue, true, this.props.sellData?.coinDetailData?.coin);
        if (res.ok) {
            this.setState({ CryptoAmnt: this.props.sellData.coinDetailData?.sellMinValue, USDAmnt: res.data, isSwap: false })
        }
    }
    setAmount = async ({ currentTarget }, fn, fnRes) => {
        this.setState({ ...this.state, [fn]: currentTarget.value })
        let res = await getSellamnt(currentTarget.value, !this.state.isSwap, this.props.sellData.coinDetailData?.coin);
        if (res.ok) {
            this.setState({ ...this.state, [fnRes]: res.data })
        }
    }
    clickMinamnt(type) {
        let usdamnt; let cryptoamnt;
        let obj = Object.assign({}, this.props.sellData.coinDetailData)
        if (type == 'half') {
            usdamnt = (obj.coinValueinNativeCurrency / 2).toString();
            cryptoamnt = (obj.coinBalance / 2)
            this.setState({ USDAmnt: usdamnt, CryptoAmnt: cryptoamnt })
        } else if (type == 'all') {
            usdamnt = obj.coinValueinNativeCurrency ? obj.coinValueinNativeCurrency : 0;
            cryptoamnt = obj.coinBalance ? obj.coinBalance : 0;
            this.setState({ USDAmnt: usdamnt, CryptoAmnt: cryptoamnt })
        } else {
            this.fetchdefaultMinAmntValues()
        }
    }
    previewSellData() {
        this.setState({ ...this.state, errorMessage: '' })
        let obj = Object.assign({}, this.state.sellSaveData);
        let { sellMinValue } = this.props.sellData.coinDetailData;
        if (!this.state.USDAmnt && !this.state.CryptoAmnt) {
            this.setState({ ...this.state, errorMessage: 'Enter amount' })
            return;
        }
        else if (!obj.toWalletId) {
            this.setState({ ...this.state, errorMessage: 'Please select wallet' })
            return;
        } else if (!this.state.isSwap && this.state.USDAmnt > this.props.sellData.coinDetailData.coinValueinNativeCurrency) {
            this.setState({ ...this.state, errorMessage: 'Entered amount should be less than available amount' })
            return;
        }
        else if (this.state.isSwap && this.state.CryptoAmnt > this.props.sellData.coinDetailData.coinBalance) {
            this.setState({ ...this.state, errorMessage: 'Entered amount should be less than balance' })
            return;
        } else if (!this.state.isSwap && parseFloat(this.state.CryptoAmnt) < sellMinValue) {
            this.setState({ ...this.state, errorMessage: 'Please enter min value' })
            return;
        }
        else if (this.state.isSwap && parseFloat(this.state.USDAmnt) < sellMinValue) {
            this.setState({ ...this.state, errorMessage: 'Please enter min value' })
            return;
        }
        else {
            this.setState({ ...this.state, errorMessage: '' })
            obj.membershipId = this.props.member?.id;
            obj.fromWalletId = this.props.sellData.coinDetailData.id
            obj.fromWalletCode = this.props.sellData.coinDetailData.coin
            obj.fromWalletName = this.props.sellData.coinDetailData.coinFullName
            obj.fromValue = this.state.CryptoAmnt
            obj.toValue = this.state.USDAmnt
            obj.exicutedPrice = this.props.sellData.coinDetailData.oneCoinValue
            this.props.changeStep('step11');
            this.props.dispatch(updatesellsaveObject(obj))
        }
    }
    // handleChange(e) {
    //     let obj = Object.assign({}, this.state.sellSaveData);
    //     for (var k in this.props.sellData.MemberFiat) {
    //         if (this.props.sellData.MemberFiat[k].currencyCode == e) {
    //             obj.toWalletId = this.props.sellData.MemberFiat[k].id;
    //             obj.toWalletCode = this.props.sellData.MemberFiat[k].currencyCode;
    //         }
    //     }
    //     this.setState({ ...this.state, sellSaveData: obj })
    // }
    async swapChange(value) {
        let obj = Object.assign({}, this.state);
        this.setState({ isSwap: value })
        let res = await getSellamnt(!this.state.isSwap ? obj.CryptoAmnt : obj.USDAmnt, value, this.props.sellData.coinDetailData?.coin);
        if (res.ok) {
            this.setState({ USDAmnt: this.state.isSwap ? res.data ? parseFloat(res.data).toFixed(8) : 0 : obj.USDAmnt, CryptoAmnt: !this.state.isSwap ? res.data ? res.data : 0 : obj.CryptoAmnt, isSwap: value })
        }
    }
    handleWalletSelection = (walletId) => {
        let obj = Object.assign({}, this.state.sellSaveData);
        for (var k in this.props.sellData.memberFiat.data) {
            if (this.props.sellData.memberFiat.data[k].id == walletId) {
                obj.toWalletId = this.props.sellData.memberFiat.data[k].id;
                obj.toWalletCode = this.props.sellData.memberFiat.data[k].currencyCode;
            }
        }
        this.setState({ ...this.state, sellSaveData: obj })
    }
    render() {
        const { Text } = Typography;
        const { coinDetailData } = this.props.sellData;
        return (
            <>
                {this.state?.errorMessage != null && this.state?.errorMessage != '' && <Alert showIcon type="info" message="Sell crypto" description={this.state?.errorMessage} closable />}
                {coinDetailData && <Card className="crypto-card select mb-36" bordered={false}>
                    <span className="d-flex align-center">
                        <span className={`coin lg ${coinDetailData.coin}`} />
                        <Text className="fs-24 text-white crypto-name ml-8">{coinDetailData.coinFullName}</Text>
                    </span>
                    <div className="crypto-details">
                        <Text className="crypto-percent text-white fw-700">{coinDetailData.percentage}<sup className="percent text-white fw-700">%</sup></Text>
                        <div className="fs-16 text-white-30 fw-200 crypto-amount">
                            <div>{coinDetailData.coinBalance?.toFixed(8)} {coinDetailData.coin}</div>
                            <div>{coinDetailData.coinValueinNativeCurrency?.toFixed(2)}</div>
                        </div>
                    </div>
                </Card>}
                <LocalCryptoSwap 
                cryptoAmt={this.state.CryptoAmnt} 
                localAmt={this.state.USDAmnt} 
                cryptoCurrency={coinDetailData?.coin} 
                localCurrency={"USD"} 
                selectedCoin={coinDetailData?.coin}
                onChange={({localValue,cryptoValue,isSwaped})=>{this.setState({...this.state,CryptoAmnt:cryptoValue,USDAmnt:localValue,isSwap:isSwaped})}}/>
                <Radio.Group defaultValue="min" buttonStyle="solid" className="round-pills">
                    <Translate value="min" content="min" component={Radio.Button} onClick={() => this.clickMinamnt('min')} />
                    <Translate value="half" content="half" component={Radio.Button} onClick={() => this.clickMinamnt('half')} />
                    <Translate value="max" content="all" component={Radio.Button} onClick={() => this.clickMinamnt('all')} />
                </Radio.Group>
                <WalletList isArrow={true} className="mb-4" onWalletSelect={(e) => this.handleWalletSelection(e)} />
                {/* <Dropdown label="Wallets" name="currencyCode" type="Wallets" dropdownData={this.props.sellData.MemberFiat} value={this.state.sellSaveData.walletName} onValueChange={(Value) => this.handleChange(Value)} field='WalletName'></Dropdown> */}
                <SuisseBtn autoDisable={true} title="preview" className="pop-btn mt-36" onClick={() => { this.previewSellData() }} />
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
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SelectSellCrypto);
