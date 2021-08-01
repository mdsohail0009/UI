import React, { Component } from 'react';
import { Typography, Button, Input, notification, Alert } from 'antd';
import { setStep, updateFromCoinInputValue, updateCoinDetails, updateReceiveCoinDetails, updateSwapdata } from '../../reducers/swapReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { fetchCurrConvertionValue } from '../../components/swap.component/api'
import * as _ from 'lodash';
import NumberFormat from 'react-number-format';

class SwapCoins extends Component {
    state = {
        fromCoin: null,
        receiveCoin: null,
        price: null,
        fromValue: null,
        receiveValue: null,
        errorMessage: null
    }
    async componentDidMount() {
        this.props.swapCoinsRef(this)
        await this.setOneCoinValue();
        this.loadamount()
    }
    clearSwapCoinValues = () =>{
        this.setState({  }, () => this.componentWillUnmount());
    }
    componentWillUnmount() {
        // this.setState({
        //     fromCoin: null,
        //     receiveCoin: null,
        //     price: null,
        //     fromValue: null,
        //     receiveValue: null,
        //     errorMessage: null
        // })
         this.setState({ ...this.state, fromCoin: null,eceiveCoin: null,price: null, fromValue: 0, receiveValue: 0,errorMessage: null})
        //  this.setReceiveAmount(0);
     }
    loadamount() {
        if (this.state.fromValue || this.props.swapStore.swapdata.fromValue) {
            this.setReceiveAmount(this.state.fromValue || this.props.swapStore.swapdata.fromValue);
        }
    }
    async setOneCoinValue() {
        this.setState({ ...this.props.swapStore.swapdata })
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
        this.state.fromValue = e;
        this.props.insertFromCoinInputValue(e);
        if (this.state.fromValue) {
            this.setState({ ...this.state, errorMessage: null })
        }
        if (this.props.swapStore.coinDetailData.coin && this.props.swapStore.coinReceiveDetailData.coin) {
            let res = await fetchCurrConvertionValue(this.props.swapStore.coinDetailData.coin, this.props.swapStore.coinReceiveDetailData.coin, e);
            if (res.ok) {
                this.setState({ ...this.state, receiveValue: res.data,errorMessage: null})
                this.props.updateSwapdataobj({ ...this.state, receiveValue: res.data })
            } else {
                this.setState({ ...this.state, receiveValue: 0 })
            }
        } else {
            //notification.error({ message: "", description: 'Select from and recevie swap coin' });
            this.setState({ ...this.state, errorMessage: 'Please select from coin to swap' })
        }
        
    }
    previewClick() {
        if (!this.props.swapStore.coinDetailData.coin) {
            //notification.error({ message: "", description: 'Select From Swap Coin' });
             this.setState({ ...this.state, errorMessage: 'Please select from coin to swap' })
        }
        else if (!this.props.swapStore.coinReceiveDetailData.coin) {
            //notification.error({ message: "", description: 'Select Receive Swap Coin' });
             this.setState({ ...this.state, errorMessage: 'Please select receive coin to swap' })
        }
        else if (!this.state.fromValue) {
            //notification.error({ message: "", description: 'Enter Swap From Value' });
             this.setState({ ...this.state, errorMessage: 'Please enter from coin Value' })
        }
        else if (this.props.swapStore.coinReceiveDetailData.coin == this.props.swapStore.coinDetailData.coin) {
            //notification.error({ message: "", description: 'selected coins are both same' })
            this.setState({ ...this.state, errorMessage: 'Selected coins are both same' })
        } else if (this.state.fromValue > this.props.swapStore.coinDetailData.coinBalance) {
            //notification.error({ message: "", description: 'Entered Swap From balance is not available' })
            this.setState({ ...this.state, errorMessage: 'Insufficient balance' })
        } else {

            this.props.updateSwapdataobj({ ...this.state })
            this.setState({
                fromCoin: null,
                receiveCoin: null,
                price: null,
                fromValue: null,
                receiveValue: null,
                errorMessage: null
            })
            this.props.changeStep('step2');
        }
    }
    swapingCurr() {
        // alert('cal')
        if (this.props) {
            let objFrom = Object.assign({}, this.props.swapStore.coinDetailData)
            let objReceive = Object.assign({}, this.props.swapStore.coinReceiveDetailData)
            let v1 = _.cloneDeep(this.state.fromValue);
            let v2 = _.cloneDeep(this.state.receiveValue);

            this.setState({ ...this.state, fromValue: v2, receiveValue: v1 })

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
            this.props.insertFromCoinInputValue(v2);
        }
    }
    async setFromAmount(e) {
        this.state.receiveValue = e;
        if (this.props.swapStore.coinDetailData.coin && this.props.swapStore.coinReceiveDetailData.coin) {
            let res = await fetchCurrConvertionValue(this.props.swapStore.coinReceiveDetailData.coin, this.props.swapStore.coinDetailData.coin, e);
            if (res.ok) {
                this.setState({ ...this.state, fromValue: res.data,errorMessage:null })
                this.props.updateSwapdataobj({ ...this.state, fromValue: res.data })
                this.props.insertFromCoinInputValue(res.data);
            }
        } else {
            //notification.error({ message: "", description: 'Select from and recevie swap coin' });
            this.setState({ ...this.state, errorMessage: 'Select from and recevie swap coin' })
        }
    }
    render() {
        const { Paragraph, Text } = Typography;
        const { coinDetailData } = this.props.swapStore;
        const { coinReceiveDetailData } = this.props.swapStore;

        return (
            <div>
                {this.state.errorMessage!=null&&<Alert
                    //message="this.state.errorMessage"
                     description={this.state.errorMessage}
                    type="error"
                    showIcon
                    closable={false}
                />}
                {/* {this.state.errorMessage!=null&& <Text className="fs-15 text-red crypto-name ml-8 mb-8">{this.state.errorMessage}</Text>} */}
                {coinDetailData && <div className="swap swapfrom-card p-relative">
                    <div>
                        <Translate className="text-purewhite fs-14 fw-100" content="swap_from" component={Text} />
                        {/* <Input className="card-input" defaultValue="0" value={this.state.fromValue} onChange={value => this.setReceiveAmount(value.target.value)} bordered={false} placeholder="0.0" /> */}
                        <NumberFormat className="card-input d-block " customInput={Input} thousandSeparator={true} prefix={""}
                            placeholder="0.00"
                            bordered={false}
                            // style={{ lineHeight: '48px', fontSize: 30,width:'200px'  }}
                            //onBlur={(e) => e.currentTarget.value.length == 0 ? e.currentTarget.style.width = "100px" : ''}
                            onKeyPress={(e) => {
                                //e.currentTarget.style.width = ((e.currentTarget.value.length + 6) * 15) + 'px'
                                e.currentTarget.value.length >= 6 ? e.currentTarget.style.fontSize = "20px" : e.currentTarget.style.fontSize = "24px";

                            }}
                            onKeyUp={(e) => {
                                this.setReceiveAmount(e.target.value)
                            }}
                            //value={isSwaped ? cryptoValue : localValue}
                            value={this.state.fromValue}
                            // onValueChange={({ value }) => {
                            //     this.setReceiveAmount(value)
                            // }}
                            autoFocus
                        />
                        {coinDetailData.coinBalance && <Text className="text-purewhite mt-4 fs-12 fw-100">Balance - {coinDetailData.coinBalance} {coinDetailData.coin}</Text>}
                    </div>
                    <div className="mr-20 text-center d-flex justify-content align-center c-pointer" onClick={() => this.props.changeStep('step3')} >
                        <div className="crypto-coin">
                            {/* <span className="coin md btc-white"></span> */}

                            {coinDetailData.coin ? <><span className={`coin md  ${coinDetailData.coin}`}></span>
                                <Paragraph className="mb-0 text-purewhite fs-14 fw-100 mt-4" style={{ lineHeight: 'normal' }}>{coinDetailData.coinFullName}</Paragraph></>
                                :
                                <div className="text-center mt-4"><span className="default-circle swap-from"><span className="icon lg usd-default"></span></span>
                                    <Paragraph className="mb-0 text-purewhite fs-14 fw-100 mt-8">Select</Paragraph></div>}
                        </div>
                        <span className="icon sm rightarrow swap-arrow"></span>
                    </div>
                    {/* <span className="icon swapfrom-arrow c-pointer" onClick={()=>this.swapingCurr()}></span> */}

                    <span className="mt-16 swap-updown c-pointer" onClick={() => this.swapingCurr()}>
                        <span className="icon md swaparrow" />
                    </span>
                </div>
                }

                {coinReceiveDetailData && <div className="swap swapreceive-card p-relative">
                    <div>
                        <Translate className="text-purewhite fs-14 fw-100" content="swap_to" component={Text} />
                        {/*<Input className="card-input" defaultValue="0" value={this.state.receiveValue} onChange={value => this.setFromAmount(value.target.value)} bordered={false} placeholder="0.0" />*/}
                        <NumberFormat className="card-input d-block" customInput={Input} thousandSeparator={true} prefix={""}
                            placeholder="0.00"
                            bordered={false}
                            // style={{ lineHeight: '48px', fontSize: 30,width:'200px'  }}
                            //onBlur={(e) => e.currentTarget.value.length == 0 ? e.currentTarget.style.width = "100px" : ''}
                            onKeyPress={(e) => {
                                //e.currentTarget.style.width = ((e.currentTarget.value.length + 6) * 15) + 'px'
                                e.currentTarget.value.length >= 6 ? e.currentTarget.style.fontSize = "20px" : e.currentTarget.style.fontSize = "24px";
                            }}
                            onKeyUp={(e) => {
                                this.setFromAmount(e.target.value)
                            }}
                            //value={isSwaped ? cryptoValue : localValue}
                            value={this.state.receiveValue}
                            // onValueChange={({ value }) => {
                            //     this.setFromAmount(value)
                            // }}
                            autoFocus
                        />
                        {coinReceiveDetailData.coinBalance && <Text className="text-purewhite mt-4 fs-12 fw-100">Balance - {coinReceiveDetailData.coinBalance} {coinReceiveDetailData.coin}</Text>}
                    </div>
                    <div className="mr-20 text-center d-flex justify-content align-center c-pointer" onClick={() => this.props.changeStep('step4')} >
                        <div className="crypto-coin">
                            {coinReceiveDetailData.coin ? <> <span className={`coin md ${coinReceiveDetailData.coin}`}></span>
                                <Paragraph className="mb-0 text-purewhite fs-14 fw-100 mt-4" style={{ lineHeight: 'normal' }}>{coinReceiveDetailData.coinFullName}</Paragraph></>
                                :
                                <div className="text-center mt-4"><span className="default-circle swap-to"><span className="icon lg usd-default"></span></span>
                                    <Paragraph className="mb-0 text-purewhite fs-14 fw-100 mt-8">Select</Paragraph></div>}

                        </div>
                        <span className="icon sm rightarrow swap-arrow"></span>
                    </div>
                    {/* <span className="icon swapto-arrow c-pointer" onClick={()=>this.swapingCurr()}></span> */}
                </div>}
                <div className="p-16 mt-24 text-center fw-200">
                    {coinDetailData.coinBalance && <Paragraph className="fs-16 text-white-30 mb-0 l-height-normal">
                        Available {coinDetailData.coinBalance} {coinDetailData.coin}
                    </Paragraph>}
                    {this.state.price && <Paragraph className="fs-16 text-white-30 l-height-normal">
                        Exchange Rate 1{coinDetailData.coin} = {this.state.price} {coinReceiveDetailData.coin}
                    </Paragraph>}
                </div>
                <Translate size="large" block className="pop-btn mt-36" content="preview_swap" component={Button} onClick={() => { this.previewClick() }} />
            </div>
        )
    }
}

const connectStateToProps = ({ swapStore, oidc }) => {
    return { swapStore }
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
