import React, { Component } from 'react';
import { Typography, Card, Input, Alert, message } from 'antd';
import WalletList from '../shared/walletList';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { convertCurrency, validatePreview } from './buySellService';
import { fetchMemberFiat, fetchPreview, setWallet } from '../../reducers/buy.reducer';
import Loader from '../../Shared/loader';
import SuisseBtn from '../shared/butons';
import NumberFormat from 'react-number-format';
import LocalCryptoSwapper from '../shared/local.crypto.swap';
import CryptoList from '../shared/cryptolist';

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
    componentDidMount() {
        this.props.getCoinsList(this.props.userProfileInfo?.id)
    }
    fetchConvertionValue = async () => {
        const { coin } = this.props.sellData?.selectedCoin?.data;
        const { isSwaped, cryptoValue, localValue } = this.state.swapValues;
        const value = await convertCurrency({ from: coin, to: "USD", value: isSwaped ? cryptoValue : localValue, isCrypto: !isSwaped })
        this.setState({ ...this.state, disableConfirm: false, swapValues: { ...this.state.swapValues, [isSwaped ? "localValue" : "cryptoValue"]: value } })
    }
    onValueChange = ({ cryptoValue, localValue, isSwaped }) => {
        this.setState({ ...this.state, swapValues: { localValue, cryptoValue, isSwaped } });
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
            this.setState({ ...this.state, error: { ..._vaidator } });
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
        const { loading: coinLoading, data: coinsList } = this.props.sellData?.memberFiat;
        return (
            <div id="divScroll">
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
                                <div>{coinBalance} {coin}</div>
                                <NumberFormat value={coinValueinNativeCurrency} displayType={'text'} thousandSeparator={true} prefix={'$'} renderText={(value, props) => <div {...props}>{value}</div>} />
                            </div>
                        </div>
                    </Card>
                    <LocalCryptoSwapper selectedCoin={coin} localAmt={localValue} cryptoAmt={cryptoValue} localCurrency={"USD"} cryptoCurrency={coin} onChange={(obj) => this.onValueChange(obj)} />
                    <Translate content="find_with_wallet" component={Paragraph} className="text-upper fw-600 mb-4 text-aqua pt-16" />
                    <CryptoList
                        coinType=""
                        showSearch={true}
                        coinList={coinsList} isLoading={coinLoading}
                        onCoinSelected={(selectedCoin) => this.handleWalletSelection(selectedCoin)}
                    />
                    <div className="fs-12 text-white-30 text-center mt-24">Your amount might be changed with in <span className="text-yellow" >10</span> seconds.</div>
                    {/* <div className="text-center">
                        <Translate content="refresh_newprice" component={Link} onClick={() => this.fetchConvertionValue()} className="mb-36 fs-14 text-yellow fw-200 mb-16 text-underline" />
                    </div> */}
                    <div className="mt-24">
                        <SuisseBtn title="confirm_btn_text" onRefresh={() => this.fetchConvertionValue()} className="pop-btn" onClick={() => this.handlePreview()} icon={<span className="icon md load" />} />
                    </div>
                </div>

            </div>
        )
    }
}
const connectStateToProps = ({ buySell, oidc, sellData, userConfig }) => {
    return { buySell, sellData, userProfileInfo: userConfig?.userProfileInfo  }
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
        },
        getCoinsList: (id) => {
            dispatch(fetchMemberFiat(id));
        }

    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SelectCrypto);