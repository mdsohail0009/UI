import React, { Component } from 'react';
import { Typography, Button, Card, Input, Radio, List, Alert } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import Currency from '../shared/number.formate';
import LocalCryptoSwap from '../shared/local.crypto.swap';
const assetsList = [
    {
        address: "1CTEjSuGFv1DwpkGWxfC5qck1iHACw…",
        network: "BTC Binance Address",
    }
]
class CryptoWithDrawWallet extends Component {
    eleRef = React.createRef();
    myRef=React.createRef();
    state = {
        CryptoAmnt: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue,
        USDAmnt: "",
        isSwap: true,
        error: null
    }
    componentDidMount() {
        this.eleRef.current.handleConvertion({ cryptoValue: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue, localValue: 0 })
    }
    clickMinamnt(type) {
        let usdamnt; let cryptoamnt;
        let obj = Object.assign({}, this.props.sendReceive?.cryptoWithdraw?.selectedWallet)
        if (type == 'half') {
            usdamnt = (obj.coinValueinNativeCurrency / 2).toString();
            cryptoamnt = (obj.coinBalance / 2)
            this.setState({ USDAmnt: usdamnt, CryptoAmnt: cryptoamnt });
            this.eleRef.current.changeInfo({ localValue: usdamnt, cryptoValue: cryptoamnt });
        } else if (type == 'all') {
            usdamnt = obj.coinValueinNativeCurrency ? obj.coinValueinNativeCurrency : 0;
            cryptoamnt = obj.coinBalance ? obj.coinBalance : 0;
            this.setState({ USDAmnt: usdamnt, CryptoAmnt: cryptoamnt });
            this.eleRef.current.changeInfo({ localValue: usdamnt, cryptoValue: cryptoamnt });
        } else {
            this.eleRef.current.handleConvertion({ cryptoValue: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue, localValue: 0 });
        }
    }
    handlePreview = () => {
        const amt = parseFloat(this.state.CryptoAmnt);
        const {withdrawMaxValue,withdrawMinValue} =this.props.sendReceive?.cryptoWithdraw?.selectedWallet
        this.setState({ ...this.state, error: null });
        if (amt < withdrawMinValue) {
            this.setState({ ...this.state, error: `Please enter minimum purchase value of ${withdrawMinValue}` });
            this.myRef.current.scrollIntoView();
        } else if (amt >withdrawMaxValue) {
            this.setState({ ...this.state, error: `You can purchase maximum value of ${withdrawMaxValue}` });
            this.myRef.current.scrollIntoView();
        }
        else {
            this.props.changeStep('step5')
        }
    }
    render() {
        const { Text } = Typography;
        const { cryptoWithdraw: { selectedWallet } } = this.props.sendReceive;
        return (
            <div ref={this.myRef}>
                {this.state.error!=null&&<Alert closable type="error" message={"Error"} description={this.state.error} onClose={()=> this.setState({ ...this.state, error: null })} showIcon /> }
                <Card className="crypto-card select mb-36" bordered={false}>
                    <span className="d-flex align-center">
                        <span className={`coin lg ${selectedWallet.coin.toLowerCase()}-white`} />
                        <Text className="fs-24 text-purewhite ml-8">{selectedWallet.coinFullName}</Text>
                    </span>
                    <div className="crypto-details">
                        <Text className="crypto-percent fw-700">{selectedWallet.percentage}<sup className="percent fw-700">%</sup></Text>
                        <div className="crypto-amount">
                            <Currency defaultValue={selectedWallet.coinBalance} prefix={""} type={"text"} suffixText={selectedWallet.coin} />
                            <Currency defaultValue={selectedWallet.coinValueinNativeCurrency} prefix={"$"} type={"text"} />
                        </div>
                    </div>
                </Card>
                <LocalCryptoSwap ref={this.eleRef}
                    isSwap={this.state.isSwap}
                    cryptoAmt={this.state.CryptoAmnt}
                    localAmt={this.state.USDAmnt}
                    cryptoCurrency={selectedWallet?.coin}
                    localCurrency={"USD"}
                    selectedCoin={selectedWallet?.coin}
                    onChange={({ localValue, cryptoValue, isSwaped }) => { this.setState({ ...this.state, CryptoAmnt: cryptoValue, USDAmnt: localValue, isSwap: isSwaped }) }} />
                <Radio.Group defaultValue="min" buttonStyle="solid" className="round-pills">
                    <Translate value="min" content="min" component={Radio.Button} onClick={() => this.clickMinamnt("min")} />
                    <Translate value="half" content="half" component={Radio.Button} onClick={() => this.clickMinamnt("half")} />
                    <Translate value="all" content="all" component={Radio.Button} onClick={() => this.clickMinamnt("all")} />
                </Radio.Group>
                <Radio.Group defaultValue="min" buttonStyle="outline" className="default-radio">
                    <Translate value="min" content="assets" className="fs-16 fw-400" component={Radio.Button} />
                    <Translate value="half" content="address" className="fs-16 fw-400" component={Radio.Button} onClick={() => this.props.changeStep('step4')} />
                </Radio.Group>
                <List
                    itemLayout="horizontal"
                    className="wallet-list my-36"
                    dataSource={assetsList}
                    style={{ borderBottom: '1px solid var(--borderLight)' }}
                    renderItem={item => (
                        <List.Item className="px-8">
                            <Link>
                                <List.Item.Meta
                                    title={<><div className="fs-16 fw-200 text-white">{item.address}</div>
                                        <div className="fs-16 fw-200 text-white">{item.network}</div></>}
                                />
                                <span className="icon sm r-arrow-o-white" />
                            </Link>
                        </List.Item>

                    )}
                />
                <Translate content="preview" component={Button} size="large" block className="pop-btn" style={{ marginTop: '30px' }} onClick={() => this.handlePreview()} target="#top" />
            </div>


        )
    }
}
const connectStateToProps = ({ sendReceive, userConfig }) => {
    return { sendReceive, userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(CryptoWithDrawWallet);
