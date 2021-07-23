import React, { Component } from 'react';
import { Drawer, Typography, Button, Card, Input, Select } from 'antd';
import config from '../../config/config';
import WalletList from '../shared/walletList';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { convertCurrency } from './buySellService';
import { fetchPreview } from './crypto.reducer';
class SelectCrypto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buyDrawer: false,
            crypto: config.tlvCoinsList,
            wallets: config.walletList,
            swapValues: {
                nativeValue: 0,
                selectedCoinValue: 0,
                isSwaped: false,
            },
            selectedWallet: null
        }
    }
    showPayDrawer = () => {

        console.log(this.state);
    }
    fetchConvertionValue = async () => {
        const value = await convertCurrency({ from: (!this.state.swapValues.isSwaped ? this.props.sellData?.selectedCoin?.data?.coin : "USD"), to: (!this.state.swapValues.isSwaped ? this.props.sellData?.selectedCoin?.data?.coin : "USD"), value: this.state.swapValues.nativeValue, isCrypto: !this.state.swapValues.isSwaped })
        this.setState({ ...this.state, swapValues: { ...this.state.swapValues, selectedCoinValue: value } })
    }
    handleWalletSelection = (walletId) => {
        const selectedWallet = this.props.sellData?.memberFiat?.data?.filter(item => item.id == walletId)[0];
        this.setState({ ...this.state, selectedWallet });
    }
    handlePreview = () => {
        this.props.preview(this.state.selectedWallet,this.props.sellData?.selectedCoin?.data?.coin,this.state.swapValues.nativeValue);
        this.props.changeStep('step3');
    }
    render() {
        const { Title, Paragraph, Text } = Typography;
        const { Option } = Select;
        return (
            <>
                <Card className="crypto-card select mb-36" bordered={false}>
                    <span className="d-flex align-center">
                        <span className="coin lg eth-white" />
                        <Text className="fs-24 text-purewhite crypto-name ml-8">{this.props.sellData.selectedCoin?.data?.coin}</Text>
                    </span>
                    <div className="crypto-details">
                        <Text className="crypto-percent text-purewhite fw-700">{this.props.sellData.selectedCoin?.data?.percentage}<sup className="percent text-purewhite fw-700">%</sup></Text>
                        <div className="fs-16 text-purewhite fw-200 crypto-amount">
                            <div>{this.props.sellData.selectedCoin?.data?.coinBalance} {this.props.sellData.selectedCoin?.data?.coin}</div>
                            <div>${this.props.sellData.selectedCoin?.data?.coinValueinNativeCurrency}</div>
                        </div>
                    </div>
                </Card>
                <div className="enter-val-container">
                    <div className="text-center">
                        <Input className="fs-36 fw-100 text-white-30 text-center enter-val p-0"
                            placeholder="0.00"
                            bordered={false}
                            prefix={!this.state.swapValues.isSwaped ? "USD" : this.props.sellData?.selectedCoin?.data?.coin}
                            style={{ maxWidth: 160 }}
                            value={this.state.swapValues.isSwaped ? this.state.swapValues.selectedCoinValue : this.state.swapValues.nativeValue}
                            onChange={(e) => {
                                this.setState({ ...this.state, swapValues: { ...this.state.swapValues, [this.state.swapValues.isSwaped ? "selectedCoinValue" : "nativeValue"]: e.currentTarget.value } }, () => this.fetchConvertionValue());

                            }}
                        />
                        <Text className="fs-14 text-white-30 fw-200 text-center d-block mb-36">{this.state.swapValues.isSwaped ? this.state.swapValues.nativeValue : this.state.swapValues.selectedCoinValue} {this.state.swapValues.isSwaped ? "USD" : this.props.sellData?.selectedCoin?.data?.coin}</Text>
                    </div>
                    <span className="mt-24 val-updown">
                        <span onClick={() => !this.state.swapValues.isSwaped ? this.setState({ ...this.state, swapValues: { ...this.state.swapValues, isSwaped: true } }) : ""} className="icon sm uparw-o-white d-block c-pointer mb-4" /><span onClick={() => this.state.swapValues.isSwaped ? this.setState({ ...this.state, swapValues: { ...this.state.swapValues, isSwaped: false } }) : ""} className="icon sm dwnarw-o-white d-block c-pointer" />
                    </span>
                </div>

                <Translate content="find_with_wallet" component={Paragraph} className="text-upper fw-600 mb-4 text-aqua pt-16" />
                <WalletList isArrow={true} className="mb-4" onWalletSelect={(e) => this.handleWalletSelection(e)} />
                <Translate content="refresh_newprice" component={Paragraph} className="mb-36 fs-14 text-white-30 fw-200 text-center mb-16" />
                <Translate content="confirm_btn_text" component={Button} size="large" block className="pop-btn" onClick={() => this.handlePreview()} icon={<span className="icon md load" />} />
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
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SelectCrypto);