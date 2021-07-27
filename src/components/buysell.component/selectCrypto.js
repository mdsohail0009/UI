import React, { Component } from 'react';
import { Typography, Card, Input, Alert, message } from 'antd';
import WalletList from '../shared/walletList';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { convertCurrency, validatePreview } from './buySellService';
import { fetchPreview, setWallet } from './crypto.reducer';
import Loader from '../../Shared/loader';
import SuisseBtn from '../shared/butons';
import NumberFormat from 'react-number-format';

class SelectCrypto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buyDrawer: false,
            swapValues: {
                localValue: '0.00',
                cryptoValue: '0.00',
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
    showPayDrawer = () => {

        console.log(this.state);
    }
    startTimer = () => {
        setTimeout(() => this.setState({ ...this.state, disableConfirm: true }), 12000)
    }
    fetchConvertionValue = async () => {
        const { coin } = this.props.sellData?.selectedCoin?.data;
        const { isSwaped, cryptoValue, localValue } = this.state.swapValues;
        const value = await convertCurrency({ from: coin, to: "USD", value: isSwaped ? cryptoValue : localValue, isCrypto: !isSwaped })
        this.setState({ ...this.state, disableConfirm: false, swapValues: { ...this.state.swapValues, [isSwaped ? "localValue" : "cryptoValue"]: value } }, () => {
            this.startTimer();
        })
    }
    handleWalletSelection = (walletId) => {
        const selectedWallet = this.props.sellData?.memberFiat?.data?.filter(item => item.id == walletId)[0];
        this.setState({ ...this.state, selectedWallet });
        this.props.setWallet(selectedWallet);
    }
    handlePreview = () => {
        const { localValue, cryptoValue, isSwaped } = this.state.swapValues;
        const { buyMin, buyMax, coin } = this.props.sellData?.selectedCoin?.data;
        const _vaidator = validatePreview({ localValue, cryptValue: cryptoValue, wallet: this.state.selectedWallet, maxPurchase: buyMax, minPurchase: buyMin })
        if (!_vaidator.valid) {
            // notification.error({ message: "Buy crypto", description: _vaidator.message });
            this.setState({ ...this.state, error: { ..._vaidator } })
            return;
        }
        this.props.preview(this.state.selectedWallet, coin, cryptoValue);
        this.props.changeStep('step3');
    }
    render() {
        if (this.props.sellData?.selectedCoin.loading || !this.props.sellData?.selectedCoin?.data) {
            return <Loader />
        }
        const { Paragraph, Text } = Typography;
        const { localValue, cryptoValue, isSwaped } = this.state.swapValues;
        const { coin, coinValueinNativeCurrency, coinBalance, percentage } = this.props.sellData?.selectedCoin?.data;
        return (
            <>
                {!this.state?.error?.valid && <Alert showIcon type="info" message="Buy crypto" description={this.state.error?.message} closable />}
                <div className="selectcrypto-container auto-scroll">
                    <Card className="crypto-card select mb-36" bordered={false}>
                        <span className="d-flex align-center">
                            <span className={`coin lg ${coin}`} />
                            <Text className="fs-24 text-purewhite crypto-name ml-8">{coin}</Text>
                        </span>
                        <div className="crypto-details">
                            <Text className="crypto-percent text-purewhite fw-700">{percentage}<sup className="percent text-purewhite fw-700">%</sup></Text>
                            <div className="fs-16 text-purewhite fw-200 crypto-amount">
                                <div>{coinBalance} {coin}</div>
                                <NumberFormat value={coinValueinNativeCurrency} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={(value, props) =>  <div {...props}>{value}</div>} />
                            </div>
                        </div>
                    </Card>
                    <div className="p-relative">
                        <div className="enter-val-container  p-relative">
                            <Text className="fs-36 fw-100 text-white-30 mr-4">{!isSwaped ? "USD" : coin}</Text>
                            <Input className="fw-100 text-white-30 enter-val p-0"
                                placeholder="0.00"
                                bordered={false}
                                style={{ width: 90, lineHeight: '55px', fontSize: 36, paddingRight: 30 }}
                                //prefix={!isSwaped ? "USD" : coin}
                                onBlur={(e) => e.currentTarget.value.length == 0 ? e.currentTarget.style.width = "100px" : ''}
                                onKeyPress={(e) => {
                                    e.currentTarget.style.width = ((e.currentTarget.value.length + 6) * 15) + 'px'
                                    e.currentTarget.value.length >= 8 ? e.currentTarget.style.fontSize = "30px" : e.currentTarget.style.fontSize = "36px"
                                }}
                                value={isSwaped ? cryptoValue : localValue}
                                onChange={(e) => {
                                    this.setState({ ...this.state, swapValues: { ...this.state.swapValues, [isSwaped ? "cryptoValue" : "localValue"]: e.currentTarget.value } }, () => this.fetchConvertionValue());

                                }}
                                autoFocus
                            />

                        </div>
                        <Text className="fs-14 text-white-30 fw-200 text-center d-block mb-36">{isSwaped ? localValue : cryptoValue} {isSwaped ? "USD" : coin}</Text>
                        <span className="mt-16 val-updown c-pointer">
                            <span onClick={() => !isSwaped ? this.setState({ ...this.state, swapValues: { ...this.state.swapValues, isSwaped: true } }) : ""} className="icon sm uparw-o-white d-block c-pointer mb-4" /><span onClick={() => isSwaped ? this.setState({ ...this.state, swapValues: { ...this.state.swapValues, isSwaped: false } }) : ""} className="icon sm dwnarw-o-white d-block c-pointer" />
                        </span>
                    </div>
                    <Translate content="find_with_wallet" component={Paragraph} className="text-upper fw-600 mb-4 text-aqua pt-16" />
                    <WalletList isArrow={true} className="mb-4" onWalletSelect={(e) => this.handleWalletSelection(e)} />
                    <div className="fs-12 text-white-30 text-center mt-24">Your amount might be changed with in10 seconds.</div>
                    {/* <div className="text-center">
                        <Translate content="refresh_newprice" component={Link} onClick={() => this.fetchConvertionValue()} className="mb-36 fs-14 text-yellow fw-200 mb-16 text-underline" />
                    </div> */}
                    <SuisseBtn title="confirm_btn_text" onRefresh={() => this.fetchConvertionValue()} className="pop-btn mt-16" onClick={() => this.handlePreview()} icon={<span className="icon md load" />} />
                </div>

            </>
        )
    }
}
const connectStateToProps = ({ buySell, oidc, sellData }) => {
    return { buySell, sellData }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        preview: (wallet, coin, amount) => {
            dispatch(fetchPreview({ coin, wallet, amount }))
        },
        setWallet: (wallet) => {
            dispatch(setWallet(wallet))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SelectCrypto);