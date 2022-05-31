import React, { Component } from 'react';
import { Typography, Button, Card, Input, Radio, Alert, Row, Col, Form, Modal, Tooltip,Image } from 'antd';
import { handleSendFetch, setStep, setSubTitle, setWithdrawcrypto, setAddress } from '../../reducers/sendreceiveReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import Currency from '../shared/number.formate';
import LocalCryptoSwap from '../shared/local.crypto.swap';
import SuccessMsg from './success';
import apicalls from '../../api/apiCalls';
import { validateContent } from '../../utils/custom.validator';

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
        isWithdrawSuccess: false,
        amountPercentageType: "min"
    }
    componentDidMount() {
        if (this.props.sendReceive.withdrawCryptoObj) {
            this.eleRef.current.handleConvertion({ cryptoValue: this.props.sendReceive?.withdrawCryptoObj?.totalValue, localValue: 0 })
            this.setState({ ...this.state, walletAddress: this.props.sendReceive.withdrawCryptoObj.toWalletAddress, amountPercentageType: this.props.sendReceive.withdrawCryptoObj.amounttype });
        } else {
            this.eleRef.current.handleConvertion({ cryptoValue: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue, localValue: 0 })
        }
        this.props.dispatch(handleSendFetch({ key: "cryptoWithdraw", activeKey: 2 }))
        this.props.dispatch(setSubTitle(apicalls.convertLocalLang('wallet_address')));
        this.trackevent();
    }
    trackevent = () => {
        apicalls.trackEvent({
            "Type": 'User', "Action": 'Withdraw Crypto Selected page view', "Username": this.props.userProfile.userName, "MemeberId": this.props.userProfile.id, "Feature": 'Withdraw Crypto', "Remarks": "Withdraw Crypto Selected page view", "Duration": 1, "Url": window.location.href, "FullFeatureName": 'Withdraw Crypto'
        });
    }
    componentWillUnmount() {
        this.setState({ ...this.state, isWithdrawSuccess: false });
    }

    selectCrypto = () => {
        const { id, coin } = this.props.sendReceive?.cryptoWithdraw?.selectedWallet
        this.props.dispatch(setSubTitle(apicalls.convertLocalLang('select_address')));
        let obj = {
            "membershipId": this.props.userProfile.id,
            "memberWalletId": id,
            "walletCode": coin,
            "toWalletAddress": this.state.walletAddress,
            "reference": "",
            "description": "",
            "totalValue": this.state.CryptoAmnt,
            "tag": "",
            'amounttype': this.state.amountPercentageType
        }
        this.props.dispatch(setWithdrawcrypto(obj))
        this.setState({ ...this.state, loading: true })
        this.props.changeStep('step8');

    }

    clickMinamnt(type) {
        let usdamnt; let cryptoamnt;
        let obj = Object.assign({}, this.props.sendReceive?.cryptoWithdraw?.selectedWallet)
        if (type === 'half') {
            usdamnt = (obj.coinValueinNativeCurrency / 2).toString();;
            cryptoamnt = (obj.coinBalance / 2)
            this.setState({ ...this.state, USDAmnt: usdamnt, CryptoAmnt: cryptoamnt, amountPercentageType: 'half' });
            this.eleRef.current.changeInfo({ localValue: usdamnt, cryptoValue: cryptoamnt });
        } else if (type === 'all') {
            usdamnt = obj.coinValueinNativeCurrency ? obj.coinValueinNativeCurrency : 0;
            cryptoamnt = obj.coinBalance ? obj.coinBalance : 0;
            this.setState({ ...this.state, USDAmnt: usdamnt, CryptoAmnt: cryptoamnt, amountPercentageType: 'all' });
            this.eleRef.current.changeInfo({ localValue: usdamnt, cryptoValue: cryptoamnt });
        } else {
            this.setState({ ...this.state, CryptoAmnt: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue, amountPercentageType: 'min' });
            this.eleRef.current.changeInfo({ cryptoValue: this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.withdrawMinValue, localValue: 0 });
        }
    }
    handlePreview = () => {

        const amt = parseFloat(this.state.CryptoAmnt);
        const { withdrawMaxValue, withdrawMinValue } = this.props.sendReceive?.cryptoWithdraw?.selectedWallet
        this.setState({ ...this.state, error: null });
        if (this.state.CryptoAmnt === "") {
            this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('enter_amount') });
            this.myRef.current.scrollIntoView();
        }
      else if (this.state.CryptoAmnt === "0" || amt === 0) {
            this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('amount_greater_zero') });
            this.myRef.current.scrollIntoView();
        }
        else if (amt < withdrawMinValue) {
            this.setState({ ...this.state, error: apicalls.convertLocalLang('amount_min') + " " + withdrawMinValue });
            this.myRef.current.scrollIntoView();
        } else if (amt > withdrawMaxValue) {
            this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('amount_max') + " " + withdrawMaxValue });
            this.myRef.current.scrollIntoView();
        } else if (amt > this.props.sendReceive?.cryptoWithdraw?.selectedWallet?.coinBalance) {
            this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('amount_less') });
            this.myRef.current.scrollIntoView();
        } else if (!validateContent(this.state.walletAddress)) {
            this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('please_enter_valid_content') });
            this.myRef.current.scrollIntoView();
        }
        else if (this.state.walletAddress == null || this.state.walletAddress.trim() === "") {
            this.setState({ ...this.state, error: " " + apicalls.convertLocalLang('enter_wallet_address') });
            this.myRef.current.scrollIntoView();
        }
        else {
            this.withDraw();
        }
    }
    withDraw = async () => {
        const { id, coin } = this.props.sendReceive?.cryptoWithdraw?.selectedWallet
        this.setState({ ...this.state, error: null, loading: true, isWithdrawSuccess: false });
        let obj = {
            "membershipId": this.props.userProfile.id,
            "memberWalletId": id,
            "walletCode": coin,
            "toWalletAddress": this.state.walletAddress,
            "reference": "",
            "description": "",
            "totalValue": this.state.CryptoAmnt,
            "tag": "",
            "amounttype": this.state.amountPercentageType
        }
        //this.props.dispatch(setSubTitle(apicalls.convertLocalLang('withdrawSummary')));
        this.props.dispatch(setWithdrawcrypto(obj))
        this.props.changeStep('withdraw_crpto_summary');
    }
    renderModalContent = () => {
        if (!this.props?.sendReceive?.cryptoWithdraw?.selectedWallet) { return null }
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
                                <Button>Click here to get code</Button>
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
                                <Button>Click here to get code</Button>
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
        if (currentStep === 3) {
            this.withDraw();
        } else {
            this.setState({ ...this.state, confirmationStep: "step" + (currentStep + 1) })
        }

    }
    render() {
        const { Text } = Typography;
        const { cryptoWithdraw: { selectedWallet } } = this.props.sendReceive;
        if (this.state.isWithdrawSuccess) {
            return <SuccessMsg onBackCLick={() => this.props.changeStep("step1")} />
        }
        return (
            <div ref={this.myRef}>
                <div> {this.state.error != null && <Alert type="error"
                    description={this.state.error} onClose={() => this.setState({ ...this.state, error: null })} showIcon />}

                    <Card className="crypto-card select mb-36" bordered={false}>
                        <span className="d-flex align-center">
                            <Image preview={false} src={selectedWallet.impageWhitePath}/>
                            <Text className="fs-24 text-purewhite ml-8">{selectedWallet?.coinFullName}</Text>
                        </span>
                        <div className="crypto-details">
                            <Text className="crypto-percent fw-700">{selectedWallet?.percentage}<sup className="percent fw-700">%</sup></Text>
                            <div className="crypto-amount">
                                <Currency defaultValue={selectedWallet?.coinBalance} prefix={""} type={"text"} suffixText={selectedWallet?.coin} />
                                <Currency defaultValue={selectedWallet?.coinValueinNativeCurrency} prefix={"$"} type={"text"} />
                            </div>
                        </div>
                    </Card>
                    <LocalCryptoSwap ref={this.eleRef} showConvertion={false}
                        isSwap={this.state.isSwap}
                        cryptoAmt={this.state.CryptoAmnt}
                        localAmt={this.state.USDAmnt}
                        cryptoCurrency={selectedWallet?.coin}
                        localCurrency={"USD"}
                        selectedCoin={selectedWallet?.coin}
                        onChange={({ localValue, cryptoValue, isSwaped, isInputChange }) => { this.setState({ ...this.state, CryptoAmnt: cryptoValue, USDAmnt: localValue, isSwap: isSwaped, amountPercentageType: isInputChange ? this.state.amountPercentageType : "" }) }} memberId={this.props.userProfile.id} screenName='withdrawcrypto' />
                    <Radio.Group defaultValue='min' buttonStyle="solid" className="round-pills" onChange={({ target: { value } }) => {
                        this.clickMinamnt(value)
                    }}>
                        <Translate value="min" content="min" component={Radio.Button} />
                        <Translate value="half" content="half" component={Radio.Button} />
                        <Translate value="all" content="all" component={Radio.Button} />
                    </Radio.Group>

                    <Form>
                        <Form.Item
                            name="toWalletAddress"
                            className="custom-forminput custom-label  mb-16"
                            required
                            label={apicalls.convertLocalLang('sendTo')}
                        >
                            <div className="p-relative d-flex align-center">
                                {/* <Input className="cust-input custom-add-select mb-0" placeholder="Enter address" value={this.state.walletAddress} */}
                                <Input className="cust-input custom-add-select mb-0" placeholder={apicalls.convertLocalLang('enter_address')} value={this.state.walletAddress}

                                   disabled={true} onChange={({ currentTarget: { value } }) => { this.setState({ ...this.state, walletAddress: value }); this.props.clearAddress(null) }}
                                    maxLength="250" />
                                <Tooltip placement="top" title={<span>{apicalls.convertLocalLang('SelectAddress')}</span>} style={{ flexGrow: 1 }}>
                                    <div className="new-add c-pointer" onClick={() => this.selectCrypto()}>
                                        <span className="icon md diag-arrow d-block c-pointer"></span>
                                    </div>
                                </Tooltip>
                            </div>
                        </Form.Item>
                    </Form>
                    <Translate content="Confirm_crypto" loading={this.state.loading} component={Button} size="large" block className="pop-btn" style={{ marginTop: '30px' }} onClick={() => this.handlePreview()} target="#top" />
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
        },
        clearAddress: (stepcode) => {
            dispatch(setAddress(stepcode))
        },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(CryptoWithDrawWallet);
