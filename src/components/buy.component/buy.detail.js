import React, { Component } from 'react';
import { Typography, Card, Alert, message,Image } from 'antd';
import WalletList from '../shared/walletList';
import { changeStep, setTab } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { convertCurrency, convertCurrencyDuplicate, validatePreview } from './buySellService';
import { fetchPreview, setWallet, fetchMemberFiat } from '../../reducers/buyReducer';
import Loader from '../../Shared/loader';
import SuisseBtn from '../shared/butons';
import NumberFormat from 'react-number-format';
import LocalCryptoSwapperCmp from '../shared/local.crypto.swap/swap';
import Currency from '../shared/number.formate';
import apicalls from '../../api/apiCalls';
import {  getPreview } from './api'
import { getFeaturePermissionsByKeyName } from '../shared/permissions/permissionService'

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
        this.props.getCoinsList(this.props.userProfileInfo?.id);
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
            const { isSwaped, localValue, cryptoValue } = this.state.swapValues;
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
            this.myRef.current.scrollIntoView();
            return;
        }
        if((localValue === 0 && cryptoValue === 0)){
            this.setState({ ...this.state, error: "We can not process this request, Since commission is more than or equal to requested amount" });

        }
        this.setState({...this.state,btnLoading:true})
        const response = await getPreview({ coin, currency: this.state.selectedWallet.currencyCode, amount:(isSwaped ? cryptoValue : localValue), isCrypto:!isSwaped });
        if (response.ok) {
            this.props.preview(this.state.selectedWallet, coin, (isSwaped ? cryptoValue : localValue), !isSwaped, this.props?.userProfileInfo.id);
            this.props.setStep('step3');
            this.setState({...this.state,btnLoading:false})
        } else {
            this.setState({ ...this.state,errorMsg:this.isErrorDispaly(response),btnLoading:false})
            this.divScroll?.current?.scrollIntoView()
        }
        
    }
    isErrorDispaly = (objValue) => {
		if (objValue.data && typeof objValue.data === "string") {
			return objValue.data;
		} else if (objValue.originalError && typeof objValue.originalError.message === "string"
		) {
			return objValue.originalError.message;
		} else {
			return "Something went wrong please try again!";
		}
	};
    selectBuyCurrency = () => {
       this.setState({ ...this.state, isShowCoinsData: true})
    }
    render() {
        if (this.props.buyInfo?.selectedCoin?.loading || !this.props.buyInfo?.selectedCoin?.data) {
            return <Loader />
        }
        const { Paragraph, Text } = Typography;
        const { localValue, cryptoValue, isSwaped, isConvertionLoading } = this.state.swapValues;
        const { coin, coinFullName, coinBalance, percentage,impageWhitePath } = this.props.buyInfo?.selectedCoin?.data;
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
                    <Card className="crypto-card select mb-36" bordered={false}>
                    <div className='d-flex justify-content'>
                        <div>
                        <span className="d-flex align-center mb-4">
                            <Image preview={false} src={impageWhitePath}/>
                            <Text className="crypto-percent text-purewhite">{percentage}<sup className="percent text-purewhite">%</sup></Text>
                        </span>
                        <Text className="fs-24 text-purewhite crypto-name ml-4">{coinFullName}</Text>
                        </div>
                        <div className="crypto-details">
                            
                            <div className="fs-16 text-purewhite fw-200 crypto-amount">
                                <Currency prefix={""} defaultValue={coinBalance} suffixText={coin} />
                                <NumberFormat value={coinFullName} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={(value, props) => <div {...props}>{value}</div>} />
                            </div>
                        </div></div>
                    </Card>
          
                    <div className="my-36">
                        <Translate content="buy_select_currency" component={Paragraph} className="fw-500 mb-4 text-white-50 pt-16 code-lbl" />
                        <WalletList placeholder="Select Currency" onWalletSelect={(e) => this.handleWalletSelection(e)} />
                    </div>
            {this.state.isShowCoinsData && <div>
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
                        isConvertionLoad={isConvertionLoading} />

                    <Translate content="thousandKText" component={Paragraph} className="text-center f-16 text-yellow fw-400 mb-0" />
                    <Translate content="contact_amount_text" component={Paragraph} className="text-center f-16 text-yellow fw-400 mb-4" />
                    {/* <Translate content="find_with_wallet" component={Paragraph} className="text-upper fw-600 mb-4 text-white-50 pt-16" />
                    <WalletList onWalletSelect={(e) => this.handleWalletSelection(e)} /> */}
                    {/* <div className="fs-12 text-white-30 text-center mt-24"><Translate content="change_10Sec_amount" component={Paragraph} className="fs-12 text-white-30 text-center mt-24" /></div> */}
                    <div className="mt-16 buy-usdt-btn">
                        <SuisseBtn title="PreviewBuy" loading={this.state.btnLoading} onRefresh={() => this.refresh()} className="pop-btn" onClick={() => this.handlePreview()} icon={<span className="icon md load" />} />
                    </div>
                    </div>}
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
        getCoinsList: (id) => {
            dispatch(fetchMemberFiat(id));
        },
        setTabKey: () => dispatch(setTab(1))

    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SelectCrypto);