import React, { Component } from 'react';
import { Typography, Card, Alert, message } from 'antd';
import WalletList from '../shared/walletList';
import { changeStep, setTab } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { convertCurrency, validatePreview } from './buySellService';
import { fetchPreview, setWallet, fetchMemberFiat } from '../../reducers/buyReducer';
import Loader from '../../Shared/loader';
import SuisseBtn from '../shared/butons';
import NumberFormat from 'react-number-format';
import LocalCryptoSwapper from '../shared/local.crypto.swap';
import Currency from '../shared/number.formate';
import { appInsights } from "../../Shared/appinsights";
class SelectCrypto extends Component {
    myRef = React.createRef();
    swapRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            buyDrawer: false,
            swapValues: {
                localValue: '',
                cryptoValue: '',
                isSwaped: false,
            },
            selectedWallet: null,
            disableConfirm: false,
            error: {
                valid: true,
                description: message
            }
        }
    }
    componentDidMount() {
        this.props.getCoinsList(this.props.userProfileInfo?.id);
        this.props.setTabKey();
        this.trackEvent()
    }
    trackEvent = () =>{
        appInsights.trackEvent({
            name: 'Buy', properties: {"Type": 'User',"Action": 'Page view',"Username": this.props.userProfileInfo.userName,"MemeberId": this.props.userProfileInfo.id,"Feature": 'Buy',"Remarks": 'Buy coins',"Duration": 1,"Url": window.location.href,"FullFeatureName": 'Buy crypto'}
        });
    }
    fetchConvertionValue = async () => {
        const { coin } = this.props.buyInfo?.selectedCoin?.data;
        const { isSwaped, cryptoValue, localValue } = this.state.swapValues;
        const value = await convertCurrency({ from: coin, to: "USD", value: isSwaped ? cryptoValue : localValue, isCrypto: !isSwaped,memId:this.props.userProfileInfo.id,screenName:null})
        this.setState({ ...this.state, disableConfirm: false, swapValues: { ...this.state.swapValues, [isSwaped ? "localValue" : "cryptoValue"]: value } })
    }
    onValueChange = ({ cryptoValue, localValue, isSwaped }) => {
        this.setState({ ...this.state, swapValues: { localValue, cryptoValue, isSwaped } });
    }
    handleWalletSelection = (walletId) => {
        const selectedWallet = this.props.buyInfo?.memberFiat?.data?.filter(item => item.id === walletId)[0];
        this.setState({ ...this.state, selectedWallet },()=>{
            this.swapRef.current.handleConvertion({cryptoValue:this.state.swapValues.cryptoValue,localValue:this.state.swapValues.localValue,locCurrency:selectedWallet.currencyCode})
        });
        this.props.setWallet(selectedWallet);
    }
    handlePreview = () => {
        const { localValue, cryptoValue, isSwaped } = this.state.swapValues;
        const { buyMin, buyMax, coin } = this.props.buyInfo?.selectedCoin?.data;
        const _vaidator = validatePreview({ localValue, cryptValue: cryptoValue, wallet: this.state.selectedWallet, maxPurchase: buyMax, minPurchase: buyMin })
        if (!_vaidator.valid) {
            this.setState({ ...this.state, error: { ..._vaidator } });
            this.myRef.current.scrollIntoView();
            return;
        }
        this.props.preview(this.state.selectedWallet, coin, (isSwaped ? cryptoValue : localValue), !isSwaped);
        this.props.setStep('step3');
    }
    refresh=()=>{
        const { localValue, cryptoValue, isSwaped } = this.state.swapValues;
        const { buyMin, buyMax, coin } = this.props.buyInfo?.selectedCoin?.data;
        const _vaidator = validatePreview({ localValue, cryptValue: cryptoValue, wallet: this.state.selectedWallet, maxPurchase: buyMax, minPurchase: buyMin })
        if (!_vaidator.valid) {
            this.setState({ ...this.state, error: { ..._vaidator } });
            this.myRef.current.scrollIntoView();
            return;
        }else{
           this.fetchConvertionValue() 
        }  
    }
    render() {
        if (this.props.buyInfo?.selectedCoin?.loading || !this.props.buyInfo?.selectedCoin?.data) {
            return <Loader />
        }
        const { Paragraph, Text } = Typography;
        const { localValue, cryptoValue } = this.state.swapValues;
        const { coin, coinValueinNativeCurrency, coinBalance, percentage} = this.props.buyInfo?.selectedCoin?.data;
        return (
            <div id="divScroll" ref={this.myRef}>
                {!this.state?.error?.valid && <Alert onClose={() => this.setState({ ...this.state, error: { valid: true, description: null } })} showIcon type="info" message="Buy crypto" description={this.state.error?.message} closable />}
                <div className="selectcrypto-container">
                    <Card className="crypto-card select mb-36" bordered={false}>
                        <span className="d-flex align-center">
                            <span className={`coin lg ${coin}`} />
                            <Text className="fs-24 text-purewhite crypto-name ml-8">{coin}</Text>
                        </span>
                        <div className="crypto-details">
                            <Text className="crypto-percent text-purewhite fw-700">{percentage}<sup className="percent text-purewhite fw-700">%</sup></Text>
                            <div className="fs-16 text-purewhite fw-200 crypto-amount">
                                <Currency prefix={""} defaultValue={coinBalance} suffixText={coin} />
                                <NumberFormat value={coinValueinNativeCurrency} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={(value, props) => <div {...props}>{value}</div>} />
                            </div>
                        </div>
                    </Card>
                    <LocalCryptoSwapper ref={this.swapRef} selectedCoin={coin} localAmt={localValue} cryptoAmt={cryptoValue} localCurrency={this.state.selectedWallet?.currencyCode||"USD"} cryptoCurrency={coin} onChange={(obj) => this.onValueChange(obj)} memberId={this.props.userProfileInfo?.id} screenName='buy'/>
                    <Translate content="find_with_wallet" component={Paragraph} className="text-upper fw-600 mb-4 text-aqua pt-16" />
                    <WalletList onWalletSelect={(e) => this.handleWalletSelection(e)} />
                    <div className="fs-12 text-white-30 text-center mt-24"><Translate content="change_10Sec_amount" component={Paragraph} className="fs-12 text-white-30 text-center mt-24" /></div>
                    <div className="mt-24">
                        <SuisseBtn title="confirm_btn_text" onRefresh={() => this.refresh()} className="pop-btn" onClick={() => this.handlePreview()} icon={<span className="icon md load" />} />
                    </div>
                </div>

            </div>
        )
    }
}
const connectStateToProps = ({ buySell, buyInfo, userConfig }) => {
    return { buySell, buyInfo, userProfileInfo: userConfig?.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        setStep: (stepcode) => {
            dispatch(changeStep(stepcode))
        },
        preview: (wallet, coin, amount, isCrypto) => {
            dispatch(fetchPreview({ coin, wallet, amount, isCrypto }))
        },
        setWallet: (wallet) => {
            dispatch(setWallet(wallet))
        },
        getCoinsList: (id) => {
            dispatch(fetchMemberFiat(id));
        },
        setTabKey: () => dispatch(setTab(1))

    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SelectCrypto);