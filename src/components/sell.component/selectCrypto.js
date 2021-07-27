import React, { Component } from 'react';
import { Typography, Button, Card, Input, Radio, Alert } from 'antd';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { Dropdown } from '../../Shared/Dropdown';
import { getSellamnt } from '../../components/buysell.component/api'
import { updatesellsaveObject } from '../buysell.component/crypto.reducer';
import WalletList from '../shared/walletList';

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
            usdamnt = obj.coinValueinNativeCurrency?obj.coinValueinNativeCurrency:0;
            cryptoamnt = obj.coinBalance?obj.coinBalance:0;
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
            this.setState({ ...this.state, errorMessage: 'Select wallet' })
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
            this.setState({ USDAmnt: this.state.isSwap ? parseFloat(res.data).toFixed(8) : obj.USDAmnt, CryptoAmnt: !this.state.isSwap ? res.data : obj.CryptoAmnt, isSwap: value })
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
             {this.state?.errorMessage!=null && <Alert showIcon type="error" message="Sell crypto" description={this.state?.errorMessage} />}
                {coinDetailData && <Card className="crypto-card select mb-36" bordered={false}>
                    <span className="d-flex align-center">
                        <span className={`coin lg ${coinDetailData.coin}`} />
                        <Text className="fs-24 text-white crypto-name ml-8">{coinDetailData.coinFullName}</Text>
                    </span>
                    <div className="crypto-details">
                        <Text className="crypto-percent text-white fw-700">{coinDetailData.percentage}<sup className="percent text-white fw-700">%</sup></Text>
                        <div className="fs-16 text-white-30 fw-200 crypto-amount">
                            <div>{coinDetailData.coinBalance} {coinDetailData.coin}</div>
                            <div>{coinDetailData.coinValueinNativeCurrency}</div>
                        </div>
                    </div>
                </Card>}
                <div className="p-relative">
                    <div className="enter-val-container">
                        <Text className="fs-36 fw-100 text-white-30 mr-4">{this.state.isSwap ? "USD" : coinDetailData.coin}</Text>
                        <Input className="fs-36 fw-100 text-white-30 text-center enter-val p-0"

                            bordered={false}
                            onChange={(e) => { this.setAmount(e, !this.state.isSwap ? 'CryptoAmnt' : 'USDAmnt', this.state.isSwap ? 'CryptoAmnt' : 'USDAmnt') }} value={!this.state.isSwap ? this.state.CryptoAmnt : this.state.USDAmnt}
                            style={{ width: 100, lineHeight: '55px', fontSize: 36, paddingRight: 30 }}
                            onBlur={(e) => e.currentTarget.value.length == 0 ? e.currentTarget.style.width = "100px" : ''}
                            onKeyPress={(e) => {
                                e.currentTarget.style.width = ((e.currentTarget.value.length + 8) * 20) + 'px'
                                e.currentTarget.value.length >= 8 ? e.currentTarget.style.fontSize = "30px" : e.currentTarget.style.fontSize = "36px"
                            }}
                        />
                    </div>
                    <Text className="fs-14 text-white-30 fw-200 text-center d-block mb-36">{!this.state.isSwap ? this.state.USDAmnt : this.state.CryptoAmnt} {!this.state.isSwap ? "USD" : coinDetailData.coin}</Text>
                    <span className="mt-8 val-updown  c-pointe">
                        <span className="icon sm uparw-o-white d-block c-pointer mb-4" onClick={() => this.state.isSwap ? this.swapChange(false) : ''} />
                        <span className="icon sm dwnarw-o-white d-block c-pointer" onClick={() => !this.state.isSwap ? this.swapChange(true) : ''} />
                    </span>
                </div>
                <Radio.Group defaultValue="min" buttonStyle="solid" className="round-pills">
                    <Translate value="min" content="min" component={Radio.Button} onClick={() => this.clickMinamnt('min')} />
                    <Translate value="half" content="half" component={Radio.Button} onClick={() => this.clickMinamnt('half')} />
                    <Translate value="max" content="all" component={Radio.Button} onClick={() => this.clickMinamnt('all')} />
                </Radio.Group>
                <WalletList isArrow={true} className="mb-4" onWalletSelect={(e) => this.handleWalletSelection(e)} />
                {/* <Dropdown label="Wallets" name="currencyCode" type="Wallets" dropdownData={this.props.sellData.MemberFiat} value={this.state.sellSaveData.walletName} onValueChange={(Value) => this.handleChange(Value)} field='WalletName'></Dropdown> */}
                <Translate content="preview" component={Button} size="large" block className="pop-btn mt-36" onClick={() => { this.previewSellData() }} />
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
