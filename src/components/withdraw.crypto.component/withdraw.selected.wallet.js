import React, { Component } from 'react';
import { Typography, Button, Card, Input, Radio, List, Alert, Row, Col, Form, Modal } from 'antd';
import { setStep } from '../../reducers/sendreceiveReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import Currency from '../shared/number.formate';
import LocalCryptoSwap from '../shared/local.crypto.swap';
import { withDrawCrypto } from '../send.component/api';
import SuccessMsg from './success';
class CryptoWithDrawWallet extends Component {
    eleRef = React.createRef();
    myRef = React.createRef();
    state = {
        CryptoAmnt: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue,
        USDAmnt: "",
        isSwap: true,
        error: null,
        walletAddress: null,
        loading: false,
        showModal: false,
        confirmationStep: "step1",
        isWithdrawSuccess: false
    }
    componentDidMount() {
        this.eleRef.current.handleConvertion({ cryptoValue: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue, localValue: 0 })
    }
    componentWillUnmount() {
        this.setState({ ...this.state, isWithdrawSuccess: false })
        this.props.changeStep("step1");
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
        const { withdrawMaxValue, withdrawMinValue } = this.props.sendReceive?.cryptoWithdraw?.selectedWallet
        this.setState({ ...this.state, error: null });
        if (!amt) {
            this.setState({ ...this.state, error: `Enter amount` });
            this.myRef.current.scrollIntoView();
        }
        else if (amt < withdrawMinValue) {
            this.setState({ ...this.state, error: `Please enter min value of ${withdrawMinValue}` });
            this.myRef.current.scrollIntoView();
        } else if (amt > withdrawMaxValue) {
            this.setState({ ...this.state, error: `Entered amount should be less than available balance ${withdrawMaxValue}` });
            this.myRef.current.scrollIntoView();
        } else if (amt > this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.coinBalance) {
            this.setState({ ...this.state, error: `Entered amount should be less than available balance` });
            this.myRef.current.scrollIntoView();
        }
        else if (!this.state.walletAddress) {
            this.setState({ ...this.state, error: `Entered amount should be less than available balance` });
            this.myRef.current.scrollIntoView();
        }
        else {
            // this.setState({ ...this.state, showModal: true })
            this.withDraw();
        }
    }
    withDraw = async () => {
        const { id, coin } = this.props.sendReceive?.cryptoWithdraw?.selectedWallet
        this.setState({ ...this.state, error: null, loading: true, isWithdrawSuccess: false })
        let obj = {
            "membershipId": this.props.userProfile.id,
            "memberWalletId": id,
            "walletCode": coin,
            "toWalletAddress": this.state.walletAddress,
            "reference": "",
            "description": "",
            "totalValue": this.state.CryptoAmnt,
            "tag": ""
        }
        const response = await withDrawCrypto(obj);
        this.setState({ ...this.state, loading: false, showModal: false })
        if (response.ok) {
            this.setState({ ...this.state, isWithdrawSuccess: true });
        } else {
            this.setState({ ...this.state, error: response.data, confirmationStep: "step1", showModal: false, isWithdrawSuccess: false })
        }
    }
    renderModalContent = () => {
        const { walletAddress, CryptoAmnt, confirmationStep } = this.state;
        const { coin, netWork } = this.props?.sendReceive?.cryptoWithdraw?.selectedWallet
        const _types = {
            step1: <p className="text-center"><b>{netWork}</b> selected as the transfer network. few platforms support the {netWork}.Please confirm that the receving platform supports this network </p>,
            step2: <div>
                <p> <Currency defaultValue={CryptoAmnt} prefixText={<b>Amount: </b>} prefix={""} suffixText={coin} /></p>
                <p><b>Address: </b> {walletAddress}</p>
                <p><b>Network: </b> {netWork}</p>
                <ul>
                    <li>Ensure that the address is correct and on the same network</li>
                    <li>Transaction can't be cancelled</li>
                </ul>
            </div>,
            step3: <div>
                <p> <Currency defaultValue={CryptoAmnt} prefixText={<b>Amount: </b>} prefix={""} suffixText={coin} /></p>
                <p><b>Address: </b> {walletAddress}</p>
                <p><b>Network: </b> {netWork}</p>
                <Form name="verification" initialValues={{ Phone: "" }}>
                    <Form.Item label="Phone" extra="Please enter 6 digit code sent to you're Phone.">
                        <Row gutter={8}>
                            <Col span={12}>
                                <Form.Item
                                    name="Phone"
                                    noStyle
                                    rules={[{ required: true, message: 'Please input the phone' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Button>Get Code</Button>
                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item label="Email" extra="Please enter 6 digit code sent to you're Email.">
                        <Row gutter={8}>
                            <Col span={12}>
                                <Form.Item
                                    name="Email"
                                    noStyle
                                    rules={[{ required: true, message: 'Please input the email' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Button>Get Code</Button>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>
            </div>
        }
        return _types[confirmationStep]
    }
    handleCancel = () => {
        this.setState({ ...this.state, showModal: false, confirmationStep: "step1" })
    }
    handleOk = () => {
        let currentStep = parseInt(this.state.confirmationStep.split("step")[1]);
        if (currentStep == 3) {
            this.withDraw();
        } else {
            this.setState({ ...this.state, confirmationStep: "step" + (currentStep + 1) })
        }

    }
    render() {
        const { Text, Paragraph } = Typography;
        const { cryptoWithdraw: { selectedWallet } } = this.props.sendReceive;
        if (this.state.isWithdrawSuccess) {
            return <SuccessMsg onBackCLick={() => this.props.changeStep("step1")} />
        }
        return (
            <div ref={this.myRef}>
                {this.state.error != null && <Alert closable type="error" message={"Withdraw Crypto"} description={this.state.error} onClose={() => this.setState({ ...this.state, error: null })} showIcon />}
                <Card className="crypto-card select mb-36" bordered={false}>
                    <span className="d-flex align-center">
                        <span className={`coin lg ${selectedWallet.coin}`} />
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
                <Translate
                    className="fs-14 text-aqua fw-500 text-upper"
                    content="address"
                    component={Paragraph}
                />
                <Input className="cust-input" placeholder="Enter address" value={this.state.walletAddress}
                    onChange={({ currentTarget: { value } }) => this.setState({ ...this.state, walletAddress: value })}
                />
                <Translate content="with_draw" loading={this.state.loading} component={Button} size="large" block className="pop-btn" style={{ marginTop: '30px' }} onClick={() => this.handlePreview()} target="#top" />
                <Modal onCancel={() => { this.setState({ ...this.state, showModal: false }) }} title="Withdrawal" footer={[
                    <Button key="back" onClick={this.handleCancel} disabled={this.state.loading}>
                        Return
                    </Button>,
                    <Button key="submit" type="primary" onClick={this.handleOk} loading={this.state.loading}>
                        Confirm
                    </Button>
                ]} visible={this.state.showModal}>
                    {this.renderModalContent()}
                </Modal>
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
