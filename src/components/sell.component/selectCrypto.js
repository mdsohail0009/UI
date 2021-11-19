import React, { Component } from 'react';
import { Typography, Card, Radio, Alert } from 'antd';
import { setStep, setTab } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { getSellamnt } from '../buy.component/api'
import WalletList from '../shared/walletList';
import LocalCryptoSwap from '../shared/local.crypto.swap';
import SuisseBtn from '../shared/butons';
import { updatesellsaveObject } from '../../reducers/sellReducer'
import Currency from '../shared/number.formate';
import apicalls from '../../api/apiCalls';
class SelectSellCrypto extends Component {
    myRef = React.createRef();
    constructor(props) {
        super(props);
        this.swapRef = React.createRef();
    }
    state = {
        USDAmnt: "", CryptoAmnt: "", sellSaveData: { "id": "00000000-0000-0000-0000-000000000000", "membershipId": null, "fromWalletId": null, "fromWalletCode": null, "fromWalletName": null, "fromValue": 0, "toWalletId": null, "toWalletCode": null, "toWalletName": null, "toValue": 0, "description": null, "comission": 0, "exicutedPrice": 0, "totalAmount": 0 }, isSwap: false
        , errorMessage: null, minmaxTab: 'min'
    }
    componentDidMount() {
        this.fetchdefaultMinAmntValues();
        this.props.dispatch(setTab(2));
    }
    fetchdefaultMinAmntValues = async () => {
        this.setState({ ...this.state, CryptoAmnt: this.props.sellData.coinDetailData?.sellMinValue })
        let res = await getSellamnt(this.props.sellData.coinDetailData?.sellMinValue, true, this.props.sellData?.coinDetailData?.coin, false, this.props.member?.id, null, this.state.sellSaveData.toWalletCode ? this.state.sellSaveData.toWalletCode : "USD");
        if (res.ok) {
            this.setState({ CryptoAmnt: this.props.sellData.coinDetailData?.sellMinValue, USDAmnt: res.data, isSwap: false }, () => {
                this.swapRef.current.changeInfo({ localValue: this.state.USDAmnt, cryptoValue: this.state.CryptoAmnt });
            })
        }
    }
    setAmount = async ({ currentTarget }, fn, fnRes) => {
        this.setState({ ...this.state, [fn]: currentTarget.value })
        let res = await getSellamnt(currentTarget.value, !this.state.isSwap, this.props.sellData.coinDetailData?.coin, this.props.member?.id, null);
        if (res.ok) {
            this.setState({ ...this.state, [fnRes]: res.data })
        }
    }
    clickMinamnt(type) {
        let usdamnt; let cryptoamnt;
        let obj = Object.assign({}, this.props.sellData.coinDetailData)
        if (type === 'half') {
            usdamnt = (obj.coinValueinNativeCurrency / 2).toString();
            cryptoamnt = (obj.coinBalance / 2)
            this.setState({ USDAmnt: usdamnt, CryptoAmnt: cryptoamnt });
            this.swapRef.current.changeInfo({ localValue: usdamnt, cryptoValue: cryptoamnt });
        } else if (type === 'all') {
            usdamnt = obj.coinValueinNativeCurrency ? obj.coinValueinNativeCurrency : 0;
            cryptoamnt = obj.coinBalance ? obj.coinBalance : 0;
            this.setState({ USDAmnt: usdamnt, CryptoAmnt: cryptoamnt });
            this.swapRef.current.changeInfo({ localValue: usdamnt, cryptoValue: cryptoamnt });
        } else {
            this.fetchdefaultMinAmntValues()
        }
        this.setState({ ...this.state, minmaxTab: type })
    }
    previewSellData() {
        this.setState({ ...this.state, errorMessage: '' })
        let obj = Object.assign({}, this.state.sellSaveData);
        let { sellMinValue } = this.props.sellData.coinDetailData;
        if ((!this.state.USDAmnt && !this.state.CryptoAmnt) || (parseFloat(this.state.USDAmnt) === 0 || parseFloat(this.state.CryptoAmnt) === 0)) {
            this.setState({
                ...this.state, errorMessage: apicalls.convertLocalLang('enter_amount')
            })
            this.myRef.current.scrollIntoView();
        }
        else if (!obj.toWalletId) {
            this.setState({
                ...this.state, errorMessage: apicalls.convertLocalLang('pleaseSelectWallet')
            })
            this.myRef.current.scrollIntoView();
            return;
        } 
        else if ( this.state.CryptoAmnt > this.props.sellData.coinDetailData.coinBalance) {
            this.setState({ ...this.state, errorMessage: apicalls.convertLocalLang('available_balance_less') })
            this.myRef.current.scrollIntoView();
            return;
        } else if (parseFloat(this.state.CryptoAmnt) < sellMinValue) {
            this.myRef.current.scrollIntoView();
            this.setState({ ...this.state, errorMessage: apicalls.convertLocalLang('enter_minvalue') + sellMinValue })
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
            obj.isSwap = this.state.isSwap
            obj.exicutedPrice = this.props.sellData.coinDetailData.oneCoinValue
            this.props.changeStep('step11');
            this.props.dispatch(updatesellsaveObject(obj))
        }
    }

    handleWalletSelection = (walletId) => {
        let obj = Object.assign({}, this.state.sellSaveData);
        for (var k in this.props.sellData.memberFiat.data) {
            if (this.props.sellData.memberFiat.data[k].id === walletId) {
                obj.toWalletId = this.props.sellData.memberFiat.data[k].id;
                obj.toWalletCode = this.props.sellData.memberFiat.data[k].currencyCode;
                obj.toWalletName = this.props.sellData.memberFiat.data[k].currencyCode;
            }
        }
        this.setState({ ...this.state, sellSaveData: obj }, () => {
            this.swapRef.current.handleWalletChange({ localValue: this.state.USDAmnt, cryptoValue: this.state.CryptoAmnt, locCurrency: obj.toWalletCode });
        })
    }
    refreshAmnts = async () => {
        if ((!this.state.USDAmnt && !this.state.CryptoAmnt) || (parseFloat(this.state.USDAmnt) === 0 || parseFloat(this.state.CryptoAmnt) === 0)) {
            this.setState({ ...this.state, errorMessage: 'Please enter amount' })
            this.myRef.current.scrollIntoView();
        } else {
            this.setState({ ...this.state, CryptoAmnt: this.state.CryptoAmnt, errorMessage: '' })
            let res = await getSellamnt(this.state.CryptoAmnt, true, this.props.sellData?.coinDetailData?.coin, false, this.props.member?.id, null, this.state.sellSaveData.toWalletCode ? this.state.sellSaveData.toWalletCode : "USD");
            if (res.ok) {
                this.setState({ CryptoAmnt: this.state.CryptoAmnt, USDAmnt: res.data, isSwap: false }, () => {
                    this.swapRef.current.changeInfo({ localValue: this.state.USDAmnt, cryptoValue: this.state.CryptoAmnt });
                })
            }
        }
    }
    render() {
        const { Text, Paragraph } = Typography;
        const { coinDetailData } = this.props.sellData;
        return (
            <>
                <div ref={this.myRef}>  {this.state?.errorMessage !== null && this.state?.errorMessage !== '' && <Alert onClose={() => this.setState({ ...this.state, errorMessage: null })} showIcon type="info" message={apicalls.convertLocalLang('sellCrypto')} description={this.state?.errorMessage} closable />}
                    {coinDetailData && <Card className="crypto-card select mb-36" bordered={false}>
                        <span className="d-flex align-center">
                            <span className={`coin lg ${coinDetailData.coin}`} />
                            <Text className="fs-24 textc-white crypto-name ml-8">{coinDetailData.coinFullName}</Text>
                        </span>
                        <div className="crypto-details">
                            <Text className="crypto-percent textc-white fw-700">{coinDetailData.percentage}<sup className="percent textc-white fw-700">%</sup></Text>
                            <div className="fs-16 textc-white fw-200 crypto-amount">
                                <Currency prefix={""} defaultValue={coinDetailData.coinBalance} suffixText={coinDetailData.coin} />
                                <Currency prefix={"$ "} defaultValue={coinDetailData.coinValueinNativeCurrency} suffixText="" />
                            </div>
                        </div>
                    </Card>}
                    <LocalCryptoSwap ref={this.swapRef}
                        cryptoAmt={this.state.CryptoAmnt}
                        localAmt={this.state.USDAmnt}
                        cryptoCurrency={coinDetailData?.coin}
                        localCurrency={this.state.sellSaveData.toWalletCode ? this.state.sellSaveData.toWalletCode : "USD"}
                        selectedCoin={coinDetailData?.coin}
                        onChange={({ localValue, cryptoValue, isSwaped }) => { this.setState({ ...this.state, CryptoAmnt: cryptoValue, USDAmnt: localValue, isSwap: isSwaped }) }} memberId={this.props.member?.id} screenName='sell' />
                    <Radio.Group defaultValue='min' buttonStyle="solid" className="round-pills">
                        <Translate value="min" content="min" component={Radio.Button} onClick={() => this.clickMinamnt('min')} />
                        <Translate value="half" content="half" component={Radio.Button} onClick={() => this.clickMinamnt('half')} />
                        <Translate value="max" content="all" component={Radio.Button} onClick={() => this.clickMinamnt('all')} />
                    </Radio.Group>
                    <Translate content="find_with_wallet" component={Paragraph} className="text-upper fw-600 mb-4 text-white-50" />
                    <WalletList isArrow={true} className="mb-4" onWalletSelect={(e) => this.handleWalletSelection(e)} />
                    <div className="mt-24">
                        <SuisseBtn autoDisable={true} title="preview" className="pop-btn" onClick={() => { this.previewSellData() }} onRefresh={() => { this.refreshAmnts(); }} />
                    </div></div>
            </>

        )
    }
}
const connectStateToProps = ({ buySell, sellInfo, userConfig }) => {
    return { buySell, sellData: sellInfo, member: userConfig.userProfileInfo }
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
