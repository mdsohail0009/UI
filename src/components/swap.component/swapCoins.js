import React, { Component } from 'react';
import { Typography, Button, Input, Alert, Spin,Image } from 'antd';
import { setStep, updateFromCoinInputValue, updateCoinDetails, updateReceiveCoinDetails, updateSwapdata } from '../../reducers/swapReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { fetchCurrConvertionValue } from '../../components/swap.component/api'
import * as _ from 'lodash';
import NumberFormat from 'react-number-format';
import Currency from '../shared/number.formate';
import apicalls from '../../api/apiCalls';

class SwapCoins extends Component {
    constructor(props) {
        super(props)
        this.state = {
            fromCoin: null,
            receiveCoin: null,
            price: null,
            fromValue: null,
            receiveValue: null,
            errorMessage: null,
            loadingToValue: false,
            loadingFromValue: false
        }
    }
    async componentDidMount() {
        this.swapCoinsTrack();
        this.props.swapCoinsRef(this)
        this.loadamount();
        await this.setOneCoinValue();
    }
    swapCoinsTrack = () => {
        apicalls.trackEvent({
            "Type": 'User', "Action": 'Swap page view', "Username": this.props.userProfile?.userName, "customerId": this.props.userProfile?.id, "Feature": 'Swap', "Remarks": 'Swap page view', "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Swap'
        });
    }
    clearSwapCoinValues = () => {
        this.setState({}, () => this.componentWillUnmount());
    }
    componentWillUnmount() {
        this.setState({ ...this.state, fromCoin: null, receiveCoin: null, price: null, fromValue: '', receiveValue: '', errorMessage: null })
    }
    loadamount() {
        if (this.state.fromValue || this.props.swapStore.fromCoinInputValue) {
            this.setState({ ...this.state, fromValue: (this.state.fromValue || this.props.swapStore.fromCoinInputValue) })
            this.setReceiveAmount(this.state.fromValue || this.props.swapStore.fromCoinInputValue);
        }
    }
    async setOneCoinValue() {
        this.setState({ ...this.props.swapStore.swapdata, fromValue: (this.state.fromValue || this.props.swapStore.fromCoinInputValue) })
        if (this.props.swapStore.coinDetailData.coin && this.props.swapStore.coinReceiveDetailData.coin) {
            let res = await fetchCurrConvertionValue(this.props.swapStore.coinDetailData.coin, this.props.swapStore.coinReceiveDetailData.coin, 1);
            if (res.ok) {
                this.setState({ ...this.state, price: res.data })
            }
        }

    }
    async setSwapOneCoinValue(fromCoin, toCoin) {
        if (fromCoin && toCoin) {
            let res = await fetchCurrConvertionValue(fromCoin, toCoin, 1);
            if (res.ok) {
                this.setState({ ...this.state, price: res.data })
            }
        }
    }
    async setReceiveAmount(e) {
        this.setState({ ...this.state, fromValue: e }, async () => {
            this.props.insertFromCoinInputValue(e);
            if (this.state.fromValue) {
                this.setState({ ...this.state, errorMessage: null })
            }
            if (this.props.swapStore.coinDetailData.coin && this.props.swapStore.coinReceiveDetailData.coin) {
                if (e) {
                    this.setState({ ...this.state, loadingToValue: true })
                    let res = await fetchCurrConvertionValue(this.props.swapStore.coinDetailData.coin, this.props.swapStore.coinReceiveDetailData.coin, e, 'swap');
                    if (res.ok) {
                        let { config: { url } } = res;
                        const _val = url.split("/");
                        if (_val[5] === this.state.fromValue) { // this need to changed when parametrs change happen
                            this.setState({ ...this.state, receiveValue: res.data, errorMessage: null, loadingToValue: false })
                            this.props.updateSwapdataobj({ ...this.state, receiveValue: res.data })
                        }
                    } else {
                        this.setState({ ...this.state, receiveValue: "", loadingToValue: false })
                    }
                } else {
                    this.setState({ ...this.state, receiveValue: "", loadingToValue: false })
                }
            }
        })

    }
    previewClick() {
        if (!this.props.swapStore.coinDetailData.coin) {
            this.setState({ ...this.state, errorMessage: apicalls.convertLocalLang('coin_swap') })
        }
        else if (!this.props.swapStore.coinReceiveDetailData.coin) {
            this.setState({ ...this.state, errorMessage: apicalls.convertLocalLang('receive_coin') })
        }
        else if (!this.state.fromValue || parseFloat(this.state.fromValue === 0)) {
            this.setState({ ...this.state, errorMessage: apicalls.convertLocalLang('enter_coinvalue') })
        }
        else if(this.state.fromValue<=0){
            this.setState({   ...this.state, errorMessage:<Translate content="value_should_greater" /> });
          }
        else if (!this.props.swapStore.coinDetailData.coinBalance) {
            this.setState({ ...this.state, errorMessage: apicalls.convertLocalLang('insufficient_balance') })
        }
        else if (this.props.swapStore.coinReceiveDetailData.coin === this.props.swapStore.coinDetailData.coin) {
            this.setState({ ...this.state, errorMessage: 'Selected coins are both same' })
        } else if (parseFloat(typeof this.state.fromValue === 'string' ? this.state.fromValue.replace(/,/g, '') : this.state.fromValue) > parseFloat(this.props.swapStore.coinDetailData.coinBalance)) {
            this.setState({ ...this.state, errorMessage: apicalls.convertLocalLang('insufficient_balance') })
        } else {

            this.props.updateSwapdataobj({ ...this.state })
            this.setState({
                fromCoin: null,
                receiveCoin: null,
                price: null,
                fromValue: null,
                receiveValue: null,
                errorMessage: null,
                loadingToValue: false,
                loadingFromValue: false
            })
            this.props.changeStep('swapsummary');
        }
    }
    swapingCurr() {
        if (this.props) {
            let objFrom = Object.assign({}, this.props.swapStore.coinDetailData)
            let objReceive = Object.assign({}, this.props.swapStore.coinReceiveDetailData)
            let v1 = _.cloneDeep(this.state.fromValue);
            let v2 = _.cloneDeep(this.state.receiveValue);


            objReceive.coinBalance = this.props.swapStore.coinDetailData.coinBalance
            objReceive.coin = this.props.swapStore.coinDetailData.coin
            objReceive.coinFullName = this.props.swapStore.coinDetailData.coinFullName
            objReceive.id = this.props.swapStore.coinDetailData.id

            objFrom.coinBalance = this.props.swapStore.coinReceiveDetailData.coinBalance
            objFrom.id = this.props.swapStore.coinReceiveDetailData.id
            objFrom.coin = this.props.swapStore.coinReceiveDetailData.coin
            objFrom.coinFullName = this.props.swapStore.coinReceiveDetailData.coinFullName

            this.props.fromObjSwap(objFrom);
            this.props.receiveObjSwap(objReceive);
            this.setSwapOneCoinValue(objFrom.coin, objReceive.coin);
            this.setState({ ...this.state, fromValue: v2, receiveValue: v1 })
            this.props.insertFromCoinInputValue(v2);
        }
    }
    async setFromAmount(e) {
        this.state.receiveValue = e;
        if (this.props.swapStore.coinDetailData.coin && this.props.swapStore.coinReceiveDetailData.coin) {
            this.setState({ ...this.state, loadingFromValue: true })
            let res = await fetchCurrConvertionValue(this.props.swapStore.coinReceiveDetailData.coin, this.props.swapStore.coinDetailData.coin, e, 'swap');
            if (res.ok) {
                this.setState({ ...this.state, fromValue: res.data, errorMessage: null, loadingFromValue: false })
                this.props.updateSwapdataobj({ ...this.state, fromValue: res.data })
                this.props.insertFromCoinInputValue(res.data);
            } else {
                this.setState({ ...this.state, loadingFromValue: false })
            }
        } else {
            this.setState({ ...this.state, errorMessage: 'Please select from and receive coins to swap' })
        }
    }
    swapMax = () => {
        this.setState({ fromValue: this.props.swapStore?.coinDetailData?.coinBalance })
    }
    render() {
        const { Paragraph, Text } = Typography;
        const { coinDetailData } = this.props.swapStore;
        const { coinReceiveDetailData } = this.props.swapStore;
        if ((!coinReceiveDetailData.coin) && this.state.receiveValue) {
            this.setState({ ...this.state, receiveValue: 0 })
        }
        return (
            <div>
                {this.state.errorMessage && <Alert
                    description={this.state.errorMessage}
                    type="info"
                    showIcon
                    closable={false}
                />}
                {coinDetailData && <div className="swap swapfrom-card p-relative">
                    <div>

                        <div className="d-flex">
                            <Translate className="text-purewhite fs-14 fw-100" content="swap_from" component={Text} />
                            <Translate
                                type="text"
                                size="small"
                                className="min-btn"
                                content="all"
                                component={Button}
                                onClick={() => this.swapMax()}
                            />
                        </div>
                        {this.state.loadingFromValue ? <Spin className={'inputSpinner'} /> : <NumberFormat className="card-input d-block " customInput={Input} thousandSeparator={true} prefix={""}
                            placeholder="0.00"
                            decimalScale={8}
                            allowNegative={false}
                            bordered={false}
                            maxlength={24}
                            onKeyPress={(e) => {
                                e.currentTarget.style.fontSize = e.currentTarget.value.length >= 6 ? "20px" : "24px";
                            }}
                            onValueChange={({ value }) => {
                                this.setReceiveAmount(value)
                            }}
                            value={this.state.fromValue}
                        />}
                        {(coinDetailData.coinBalance === 0 || coinDetailData.coinBalance) && <><Translate content="balance" component={Text} className="custom-font fw-300 fs-14 text-purewhite" /> <Currency prefix={""} className="currencyContains text-purewhite" decimalPlaces={8} defaultValue={coinDetailData.coinBalance} suffixText={coinDetailData.coin} /></>}
                    </div>
                    <div className="mr-20 text-center d-flex justify-content align-center c-pointer" onClick={() => this.props.changeStep('selectcrypto')} >
                        <div className="crypto-coin">

                            {coinDetailData.coin ? <>
                            <Image preview={false} src={coinDetailData.impageWhitePath} width={40}/>
                                <Paragraph className="mb-0 text-purewhite fs-14 fw-100 mt-4" style={{ lineHeight: 'normal' }}>{coinDetailData.coinFullName}</Paragraph></>
                                :
                                <div className="text-center mt-4"><span className="default-circle swap-from"><span className="icon lg usd-default"></span></span>

                                    <Paragraph className="mb-0 text-purewhite fs-14 fw-100 mt-8">  <Translate content="Select" component={Paragraph} className="custom-font fw-300 fs-14 text-purewhite mb-0" /></Paragraph>
                                </div>}
                        </div>
                        <span className="icon sm rightarrow swap-arrow"></span>
                    </div>
                </div>
                }

                {coinReceiveDetailData && <div className="swap swapreceive-card p-relative">
                    <div>
                        <Translate className="text-purewhite fs-14 fw-100" content="swap_to" component={Text} />

                        {this.state.loadingToValue ? <Spin className={'inputSpinner'} /> : <NumberFormat className="card-input d-block colr-comn" customInput={Input} thousandSeparator={true} prefix={""}
                            placeholder="0.00"
                            decimalScale={8}
                            allowNegative={false}
                            maxlength={24}
                            disabled={true}
                            bordered={false}
                            onKeyPress={(e) => {
                                e.currentTarget.style.fontSize = e.currentTarget.value.length >= 6 ? '20px' : "24px";
                                if (!(coinDetailData.coin && coinReceiveDetailData.coin)) {
                                    e.preventDefault()
                                }
                            }}
                            onKeyUp={(e) => {
                                this.setFromAmount(e.target.value)
                            }}
                            value={this.state.receiveValue}

                        />}
                        {(coinReceiveDetailData.coinBalance || coinReceiveDetailData.coinBalance === 0) && <Text className="text-purewhite mt-4 fs-12 fw-100"><Translate content="balance" component={Text} className="custom-font fw-300 fs-14 text-purewhite" /> <Currency prefix={""} className="currencyContains text-purewhite" decimalPlaces={8} defaultValue={coinReceiveDetailData.coinBalance} suffixText={coinReceiveDetailData.coin} /></Text>}
                    </div>
                    <div className="mr-20 text-center d-flex justify-content align-center c-pointer" onClick={() => { if (coinDetailData.coinFullName) { this.props.changeStep('toreceive'); this.setState({ ...this.state, errorMessage: '' }) } else { this.setState({ ...this.state, errorMessage: apicalls.convertLocalLang('select_coin') }) } }} >
                        <div className="crypto-coin">
                            {coinReceiveDetailData.coin ? <> 
                            <Image preview={false} src={coinReceiveDetailData.impageWhitePath} width={40}/>
                                <Paragraph className="mb-0 text-purewhite fs-14 fw-100 mt-4" style={{ lineHeight: 'normal' }}>{coinReceiveDetailData.coinFullName}</Paragraph></>
                                :
                                <div className="text-center mt-4"><span className="default-circle swap-to"><span className="icon lg usd-default"></span></span>

                                    <Paragraph className="mb-0 text-purewhite fs-14 fw-100 mt-8">  <Translate content="Select" component={Paragraph} className="custom-font fw-300 fs-14 text-purewhite mb-0" /></Paragraph>
                                </div>}
                        </div>
                        <span className="icon sm rightarrow swap-arrow"></span>
                    </div>
                </div>}
                <div className="p-16 mt-24 text-center fw-200">
                    {(coinDetailData.coinBalance || coinReceiveDetailData.coinBalance === 0) && <Paragraph className="fs-16 text-white-30 mb-0 l-height-normal">
                        <Translate content="Available" component={Text} className="custom-font fw-300 fs-14 text-white" /> <Currency className={'currencyContains'} prefix={""} decimalPlaces={8} defaultValue={coinDetailData.coinBalance} suffixText={coinDetailData.coin} />
                    </Paragraph>}
                    {(this.state.price && coinReceiveDetailData.coin) && <Paragraph className="fs-16 text-white-30 l-height-normal">
                        <Translate content="ExchangeRate" component={Text} className="custom-font fw-300 fs-14 text-white" /><Currency className={'currencyContains fw-300 text-white-30'} defaultValue={this.state.price} decimalPlaces={"8"} prefix={""} suffixText={coinReceiveDetailData.coin} prefixText={`1 ${coinDetailData.coin} =  `} />
                    </Paragraph>}
                </div>
                <Translate size="large" block className="pop-btn mt-36" content="Confirm" component={Button} onClick={() => { this.previewClick() }} />
            </div>
        )
    }
}

const connectStateToProps = ({ swapStore, userConfig }) => {
    return { swapStore, userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        insertFromCoinInputValue: (value) => {
            dispatch(updateFromCoinInputValue(value))
        },
        fromObjSwap: (obj) => {
            dispatch(updateCoinDetails(obj))
        },
        receiveObjSwap: (obj) => {
            dispatch(updateReceiveCoinDetails(obj))
        },
        updateSwapdataobj: (obj) => {
            dispatch(updateSwapdata(obj))
        },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SwapCoins);
