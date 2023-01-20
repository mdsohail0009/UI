import React, { Component } from 'react';
import { Typography, Card, Radio, Alert,Image } from 'antd';
import { setStep, setTab } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { getSellamnt } from '../buy.component/api'
import WalletList from '../shared/walletList';
import LocalCryptoSwapperCmp from '../shared/local.crypto.swap/swap';
import SuisseBtn from '../shared/butons';
import { updatesellsaveObject } from '../../reducers/sellReducer'
import Currency from '../shared/number.formate';
import apicalls from '../../api/apiCalls';
import { convertCurrencyDuplicate } from '../buy.component/buySellService';
import { getFeaturePermissionsByKeyName } from '../shared/permissions/permissionService'
import { setWallet } from '../../reducers/buyReducer';

class SelectSellCrypto extends Component {
    myRef = React.createRef();
    constructor(props) {
        super(props);
        this.swapRef = React.createRef();
    }
    state = {
        USDAmnt: "", CryptoAmnt: "",
        sellSaveData: { "id": "00000000-0000-0000-0000-000000000000", "customerId": null, "fromWalletId": null, "fromWalletCode": null, "fromWalletName": null, "fromValue": 0, "toWalletId": null, "toWalletCode": null, "toWalletName": null, "toValue": 0, "description": null, "comission": 0, "exicutedPrice": 0, "totalAmount": 0 },
        isSwap: true,
        errorMessage: null,
        minmaxTab: 'min',
        isConvertionLoading: false,
        isShowCoinsData: false
    }
    componentDidMount() {
        getFeaturePermissionsByKeyName(`trade_sell`)
        this.fetchdefaultMinAmntValues();
        this.props.dispatch(setTab(2));
        this.EventTrack();
    }
    EventTrack = () => {
        apicalls.trackEvent({ "Type": 'User', "Action": 'Sell coin page View', "Feature": 'Sell', "Remarks": "Sell Crypto coin selection view", "FullFeatureName": 'Sell Crypto', "userName": this.props.customer?.userName, id: this.props.customer?.id });
    }
    fetchdefaultMinAmntValues = async () => {
        this.setState({ ...this.state, CryptoAmnt: this.props.sellData.coinDetailData?.sellMinValue || this.props.sellData.coinDetailData?.withDrawMinValue});
    }
    setAmount = async ({ currentTarget }, fn, fnRes) => {
        this.setState({ ...this.state, [fn]: currentTarget.value })
        let res = await getSellamnt(currentTarget.value, !this.state.isSwap, this.props.sellData.coinDetailData?.coin, null);
        if (res.ok) {
            this.setState({ ...this.state, [fnRes]: res.data })
        }
    }
    clickMinamnt(type) {
        let cryptoamnt;
        let obj = Object.assign({}, this.props.sellData.coinDetailData)
        if (type === 'half') {
            cryptoamnt = (obj.coinBalance / 2)
            this.setState({ ...this.state, USDAmnt: "0", CryptoAmnt: cryptoamnt, minmaxTab: type, isSwap: true, });
        } else if (type === 'all') {
            cryptoamnt = obj.coinBalance ? obj.coinBalance : 0;
            this.setState({ ...this.state, USDAmnt: "0", CryptoAmnt: cryptoamnt, minmaxTab: type, isSwap: true, });
        } else {
            this.setState({ CryptoAmnt: this.props.sellData.coinDetailData?.sellMinValue, USDAmnt: "0", isSwap: true, minmaxTab: type });
        }
    }
    previewSellData() {
        this.setState({ ...this.state, errorMessage: '' })
        let obj = Object.assign({}, this.state.sellSaveData);
        let { sellMinValue, gbpInUsd, eurInUsd } = this.props.sellData.coinDetailData;
        const maxUSDT = 100000;
        const purchaseCurrencyMaxAmt = {
            GBP: this.state.USDAmnt * gbpInUsd,
            EUR: this.state.USDAmnt * eurInUsd,
            USD: this.state.USDAmnt
        }
        const maxAmtMesage = "$100,000";
        if ((this.state.CryptoAmnt === "")) {
            this.setState({
                ...this.state, errorMessage: apicalls.convertLocalLang('enter_amount')
            })
            this.myRef.current.scrollIntoView();
        }
        else if ((parseFloat(this.state.USDAmnt) === 0 || parseFloat(this.state.CryptoAmnt) === 0)) {
            this.setState({
                ...this.state, errorMessage: apicalls.convertLocalLang('amount_greater_zero')
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
        else if (this.state.CryptoAmnt > this.props.sellData.coinDetailData.coinBalance) {
            this.setState({ ...this.state, errorMessage: apicalls.convertLocalLang('insufficientFunds') })
            this.myRef.current.scrollIntoView();
            return;
        } else if (parseFloat(this.state.CryptoAmnt) < sellMinValue) {
            this.myRef.current.scrollIntoView();
            this.setState({ ...this.state, errorMessage: apicalls.convertLocalLang('enter_minvalue') + sellMinValue })
            return;
        }
        else if (purchaseCurrencyMaxAmt[obj.toWalletCode] > maxUSDT) {
            this.myRef.current.scrollIntoView();
            this.setState({ ...this.state, errorMessage: apicalls.convertLocalLang('enter_maxvalue') + maxAmtMesage })
            return;
        }
        else {
            this.setState({ ...this.state, errorMessage: '' })
            obj.customerId = this.props.customer?.id;
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
        this.setState({ ...this.state, isShowCoinsData: true, sellSaveData: obj }, () => {
            this.handleConvertion();
        });
        this.props.setWallet(obj);
    }
    onValueChange = (value) => {
        const { isSwap: isSwaped, USDAmnt: localValue, CryptoAmnt: cryptoValue } = this.state;
        let _nativeValue = localValue, _cryptoValue = cryptoValue;
        if (isSwaped) {
            _cryptoValue = value;
        } else { _nativeValue = value; }
        this.setState({ ...this.state, USDAmnt: _nativeValue, CryptoAmnt: _cryptoValue }, () => {
            this.handleConvertion();
        });
    }
    handleConvertion = async () => {
        const { coin } = this.props.sellData.coinDetailData;
        const { isSwap: isSwaped, USDAmnt: localValue, CryptoAmnt: cryptoValue } = this.state;
        this.setState({ ...this.state, isConvertionLoading: true });
        const response = await convertCurrencyDuplicate({
            from: coin,
            to: this.state.sellSaveData.toWalletCode || "USD",
            value: (isSwaped ? cryptoValue : localValue) || 0,
            isCrypto: !isSwaped,
            customer_id: this.props.customer?.id,
            screenName: "sell"
        });
        if (response.ok) {
            const { isSwap: isSwaped, USDAmnt: localValue, CryptoAmnt: cryptoValue } = this.state;
            let _nativeValue = localValue, _cryptoValue = cryptoValue;
            const { data: value, config: { url } } = response;
            const _obj = url.split("CryptoFiatConverter")[1].split("/");
            const _val = isSwaped ? cryptoValue : localValue;
            if (_obj[3] == _val || _obj[3] == 0) {
                if (!isSwaped) {
                    _cryptoValue = value || 0;
                } else { _nativeValue = value || 0; }
                this.setState({ ...this.state, USDAmnt: _nativeValue, CryptoAmnt: _cryptoValue, isConvertionLoading: false });
            }
        } else {
            this.setState({ ...this.state, isConvertionLoading: false });
        }
    }
    selectBuyCurrency = () => {
        this.setState({ ...this.state, isShowCoinsData: true })
    }
    render() {
        const { Text, Paragraph } = Typography;
        const { coinDetailData } = this.props.sellData;
        return (
            <>
                <div ref={this.myRef}>  {this.state?.errorMessage !== null && this.state?.errorMessage !== '' && <Alert onClose={() => this.setState({ ...this.state, errorMessage: null })} showIcon type="error" message={apicalls.convertLocalLang('sellCrypto')} description={this.state?.errorMessage} />}
                    <div className="selectcrypto-container">
                        {coinDetailData && <Card className="crypto-card select " bordered={false}>
                            { <div> <LocalCryptoSwapperCmp
                                cryptoAmt={this.state.CryptoAmnt}
                                localAmt={this.state.USDAmnt}
                                cryptoCurrency={coinDetailData?.coin}
                                localCurrency={this.state.sellSaveData.toWalletCode ? this.state.sellSaveData.toWalletCode : "USD"}
                                onChange={(value) => { this.onValueChange(value) }}
                                onCurrencySwap={() => {
                                    this.setState({ ...this.state, isSwap: !this.state.isSwap });
                                }}
                                isConvertionLoad={this.state.isConvertionLoading}
                                isSwaped={this.state.isSwap}
                            />
                            <div className='display-items' >
                                <Radio.Group defaultValue='min' buttonStyle="solid" className="round-pills sell-radiobtn-style text-left" onChange={({ target: { value } }) => {
                                    this.clickMinamnt(value)
                                }}>
                                    <Translate value="min" content="min" component={Radio.Button} />
                                    
                                    <Translate value="all" content="all" component={Radio.Button} />
                                </Radio.Group>
                                { <div className='crypto-details'><div className='sellcrypto-style'>Balance:
                                </div> <Currency prefix={"$ "} defaultValue={coinDetailData.coinValueinNativeCurrency} suffixText="" className="marginL sellbal-style" /></div>} </div>
                                
                            

                            </div>}

                            <div className="select-currency">
                               
                                <WalletList placeholder="Select Currency" onWalletSelect={(e) => this.handleWalletSelection(e)} />
                            </div>

                            {<div><Translate content="thousandKText" component={Paragraph} className="buy-paragraph" />
                                <Translate content="contact_amount_text" component={Paragraph} className="buy-paragraph" /><div className="sell-btn-style">
                                <SuisseBtn autoDisable={true} title="PreviewSell" className="pop-btn" onClick={() => { this.previewSellData() }} />
                            </div></div>}
                        </Card>


                        }
                    </div>


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
        setWallet: (wallet) => {
            dispatch(setWallet(wallet))
        },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SelectSellCrypto);
