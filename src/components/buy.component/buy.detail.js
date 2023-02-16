import React, { Component } from 'react';
import { Typography, Card, Alert, message } from 'antd';
import WalletList from '../shared/walletList';
import { changeStep, setTab } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { convertCurrency, convertCurrencyDuplicate, validatePreview } from './buySellService';
import { fetchPreview, setWallet, fetchMemberFiat } from '../../reducers/buyReducer';
import Loader from '../../Shared/loader';
import SuisseBtn from '../shared/butons';
import LocalCryptoSwapperCmp from '../shared/local.crypto.swap/swap';
import Currency from '../shared/number.formate';
import apicalls from '../../api/apiCalls';
import {  getPreview } from './api'
import { getFeaturePermissionsByKeyName } from '../shared/permissions/permissionService'
import apicalls from '../../api/apiCalls';
class SelectCrypto extends Component {
    myRef = React.createRef();
    swapRef = React.createRef();
    constructor(props) {
        super(props);
        this.state = {
            buyDrawer: false,
            isShowCoinsData: false,
            swapValues: {
                localValue: '',
                cryptoValue: '',
                isSwaped: false,
                isConvertionLoading: false
            },
            selectedWallet: null,
            disableConfirm: false,
            error: {
                valid: true,
                description: message
            },
            errorMsg:null,
            btnLoading:false
        }
    }
    componentDidMount() {
        getFeaturePermissionsByKeyName(`trade_buy`)
        this.props.setTabKey();
        this.EventTrack()
    }
    EventTrack = () => {
        apicalls.trackEvent({ "Type": 'User', "Action": 'Buy coin page view', "Username": this.props.userProfileInfo.userName, "customerId": this.props.userProfileInfo.id, "Feature": 'Buy', "Remarks": 'Buy Crypto coin selection view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Buy Crypto' });
    }
    fetchConvertionValue = async () => {
        const { coin } = this.props.buyInfo?.selectedCoin?.data;
        const { isSwaped, cryptoValue, localValue } = this.state.swapValues;
        const value = await convertCurrency({ from: coin, to: "USD", value: isSwaped ? cryptoValue : localValue, isCrypto: !isSwaped, customer_id: this.props.userProfileInfo.id, screenName: "buy" })

        this.setState({ ...this.state, disableConfirm: false, swapValues: { ...this.state.swapValues, [isSwaped ? "localValue" : "cryptoValue"]: value } })
    }
    onValueChange = (value) => {
        const { isSwaped, localValue, cryptoValue } = this.state.swapValues;
        let _nativeValue = localValue, _cryptoValue = cryptoValue;
        if (isSwaped) {
            _cryptoValue = value;
        } else { _nativeValue = value; }
        this.setState({ ...this.state, swapValues: { localValue: _nativeValue, cryptoValue: _cryptoValue, isSwaped } }, () => {
            this.handleConvertion();
        });
    }
    handleConvertion = async () => {
        
        const { coin } = this.props.buyInfo?.selectedCoin?.data;
        const { isSwaped, localValue, cryptoValue } = this.state.swapValues;
        this.setState({ ...this.state, swapValues: { ...this.state.swapValues, isConvertionLoading: true } });
        const response = await convertCurrencyDuplicate({
            from: coin,
            to: this.state.selectedWallet?.currencyCode || "USD",
            value: (isSwaped ? cryptoValue : localValue) || 0,
            isCrypto: !isSwaped,
            customer_id: this.props.userProfileInfo?.id,
            screenName: "buy"
        });
        if (response.ok) {
            this.setState({...this.state,isConvertionLoading:false})
            let _nativeValue = localValue, _cryptoValue = cryptoValue;
            const { data: value, config: { url } } = response;
            const _obj = url.split("CryptoFiatConverter")[1].split("/");
            const _val = isSwaped ? cryptoValue : localValue;
            if (_obj[3] == _val || _obj[3] == 0) {
                if (!isSwaped) {
                    _cryptoValue = value || 0;
                } else { _nativeValue = value || 0; }
                this.setState({ ...this.state, swapValues: { localValue: _nativeValue, cryptoValue: _cryptoValue, isSwaped, isConvertionLoading: false } });
            }
        } else {
            this.setState({ ...this.state, swapValues: { ...this.state.swapValues, isConvertionLoading: false } });
        }
    }
    handleWalletSelection = (walletId) => {
        const selectedWallet = this.props.buyInfo?.memberFiat?.data?.filter(item => item.id === walletId)[0];
        this.setState({ ...this.state, isShowCoinsData: true, swapValues: { isSwaped: true}, selectedWallet }, () => {
            this.handleConvertion();
        });
        this.props.setWallet(selectedWallet);
    }

    handlePreview = async() => {

        const { localValue, cryptoValue, isSwaped } = this.state.swapValues;
        const { buyMin, buyMax, coin, gbpInUsd, eurInUsd } = this.props.buyInfo?.selectedCoin?.data;
        const _vaidator = validatePreview({ localValue, cryptValue: cryptoValue, wallet: this.state.selectedWallet, maxPurchase: buyMax, minPurchase: buyMin, gbpInUsd, eurInUsd })
        if (!_vaidator.valid) {
            this.setState({ ...this.state, error: { ..._vaidator } });
            this.myRef.current.scrollIntoView(0,0);
            return;
        }
        if((localValue == 0 && cryptoValue == 0)){
            this.setState({ ...this.state, error: "We can not process this request, Since commission is more than or equal to requested amount" });

        }
        this.setState({...this.state,btnLoading:true})
        const response = await getPreview({ coin, currency: this.state.selectedWallet.currencyCode, amount:(isSwaped ? cryptoValue : localValue), isCrypto:!isSwaped });
        if (response.ok) {
            this.props.preview(this.state.selectedWallet, coin, (isSwaped ? cryptoValue : localValue), !isSwaped, this.props?.userProfileInfo.id);
            this.props.setStep('step3');
            this.setState({...this.state,btnLoading:false})
        } else {
            this.setState({ ...this.state,errorMsg:apicalls.isErrorDispaly(response),btnLoading:false})
            this.divScroll?.current?.scrollIntoView()
        }
        
    }
   
    selectBuyCurrency = () => {
       this.setState({ ...this.state, isShowCoinsData: true})
    }
    render() {
        if (this.props.buyInfo?.selectedCoin?.loading || !this.props.buyInfo?.selectedCoin?.data) {
            return <Loader />
        }
        const { Paragraph } = Typography;
        const { localValue, cryptoValue, isSwaped, isConvertionLoading } = this.state.swapValues;
        const { coin, coinBalance } = this.props.buyInfo?.selectedCoin?.data;
        return (
            <div id="divScroll" ref={this.myRef}>
                {this.state.errorMsg && (
                        <Alert
                            className="mb-12"
                            showIcon
                            description={this.state.errorMsg}
                            closable={false}
                            type="error"
                        />
                    )}
                    {!this.state?.error?.valid && <Alert onClose={() => this.setState({ ...this.state, error: { valid: true, description: null } })} showIcon type="error" message={apicalls.convertLocalLang('buy_crypto')} description={this.state.error?.message} />}

                <div className="selectcrypto-container">
                    <Card className="crypto-card select " bordered={false}>
                        {<div>
                   <LocalCryptoSwapperCmp
                        localAmt={localValue}
                        cryptoAmt={cryptoValue}
                        localCurrency={this.state.selectedWallet?.currencyCode || "USD"}
                        cryptoCurrency={coin}
                        onChange={(obj) => this.onValueChange(obj)} customerId={this.props.userProfileInfo?.id}
                        screenName='buy'
                        isSwaped={isSwaped}
                        onCurrencySwap={() => {
                            this.setState({ ...this.state, swapValues: { ...this.state.swapValues, isSwaped: !this.state.swapValues.isSwaped } })
                        }}
                        isConvertionLoad={isConvertionLoading} /></div>}
                            <div className="crypto-amount">
                               <div className="crypto-details"><span className='buy-balance'>Balance: </span><Currency prefix={'' } defaultValue={coinBalance} suffixText={""} className='buycoin-style marginL' /><span className='buycoin-style marginL'>{coin }</span> </div>

                            </div>

                        {this.state.isShowCoinsData && <div>
                    
                    </div>}
                    <div className="select-currency">
                        <WalletList placeholder="Select Currency" onWalletSelect={(e) => this.handleWalletSelection(e)} />
                    </div>
                    {<div><Translate content="thousandKText" component={Paragraph} className="buy-paragraph " />
                    <Translate content="contact_amount_text" component={Paragraph} className="buy-paragraph" />
                     <div className="buy-usdt-btn">
                     <SuisseBtn title="PreviewBuy" loading={this.state.btnLoading} onRefresh={() => this.refresh()} className="pop-btn" onClick={() => this.handlePreview()} icon={<span className="icon md load" />} />
                    </div> </div>}

                    </Card>
          
                   
      
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
        preview: (wallet, coin, amount, isCrypto, customer_id) => {
            dispatch(fetchPreview({ coin, wallet, amount, isCrypto, customer_id }))
        },
        setWallet: (wallet) => {
            dispatch(setWallet(wallet))
        },
        getCoinsList: () => {
            dispatch(fetchMemberFiat());
        },
        setTabKey: () => dispatch(setTab(1))

    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SelectCrypto);