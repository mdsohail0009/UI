import React, { Component } from 'react';
import { Drawer, Typography, Button, Card, Input, Radio } from 'antd';
import WalletList from '../shared/walletList';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { Dropdown } from '../../Shared/Dropdown';
import {getSellamnt} from '../../components/buysell.component/api'
import { updatesellsaveObject } from '../buysell.component/crypto.reducer';

class SelectSellCrypto extends Component {
    state={
        amnt: null, minamntValue: null, sellSaveData: {
            "id": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "membershipId": "2E8E3877-BC8E-466D-B62D-F3F8CCBBD019",
            "walletId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
            "walletName":null,
            "walletCode": "",
            "walletAddress": "",
            "description": "",
            "filledvalue": 0,
            "excuatedPrice": 0,
            "totalAmount": 0,
            "type": "",
            "orderNo": "",
            "date": new Date(),
            "comission": 0,
            "amountInUsd": 0,
            "isFiat": false,
            "walletNameFrom": "",
            "txId": "3fa85f64-5717-4562-b3fc-2c963f66afa6"
        },isSwap:false
    }
    async setAmount(e,fn){
        this.state[fn]=e.target.value
        let res =await getSellamnt(e.target.value, this.state.isSwap);
        if (res.ok) {
            this.setState({...this.state,minamntValue: res.data })
        }
    }
    clickMinamnt(type) {
        let usdamnt;let cryptoamnt;
        let obj=Object.assign({},this.props.sellData.coinDetailData)
        if (type == 'half') {
            usdamnt=(obj.coinValueinNativeCurrency/2).toString();
            cryptoamnt=(obj.coinBalance/2)
        }else if(type == 'all'){
            usdamnt=obj.coinValueinNativeCurrency;
            cryptoamnt=obj.coinBalance
        }else{
            usdamnt=this.state.amnt
        }
        this.setState({amnt:usdamnt,minamntValue:cryptoamnt})
    }
    previewSellData(){
        let obj={"id":"3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "membershipId":"2E8E3877-BC8E-466D-B62D-F3F8CCBBD019",
        "walletId":"3fa85f64-5717-4562-b3fc-2c963f66afa6",
        "walletName":"",
        "walletCode":"",
        "walletAddress":"",
        "description":"",
        "filledvalue":0,
        "excuatedPrice":0,
        "totalAmount":0,
        "type":"",
        "orderNo":"",
        "date":new Date(),
        "comission":0,
        "amountInUsd":0,
        "isFiat":false,
        "walletNameFrom":"",
        "txId":"3fa85f64-5717-4562-b3fc-2c963f66afa6"}
        this.props.changeStep('step11');
        this.props.dispatch(updatesellsaveObject(obj))
    }
    handleChange(e) {
        // let obj=Object.assign({},this.state);
        // this.setState({...this.state})
    }
    async swapChange(value){
        let obj=Object.assign({},this.state);
        this.setState({isSwap:value,amnt:parseInt(obj.minamntValue),minamntValue:obj.amnt})
        let res =await getSellamnt(obj.minamntValue,value);
        if (res.ok) {
            this.setState({ amnt: obj.minamntValue, minamntValue: res.data })
        }
    }
    render() {
        const { Text } = Typography;
        const {coinDetailData}=this.props.sellData;
        return (
            <>
                {coinDetailData&&<Card className="crypto-card mb-36" bordered={false}>
                    <span className="d-flex align-center">
                        <span className="coin lg btc-white" />
                        <Text className="fs-24 text-white crypto-name ml-8">{coinDetailData.coinFullName}</Text>
                    </span>
                    <div className="crypto-details">
                        <Text className="crypto-percent text-white fw-700">{coinDetailData.percentage}<sup className="percent text-white fw-700">%</sup></Text>
                        <div className="fs-16 text-white-30 fw-200 crypto-amount">
                            <div className="text-yellow">{coinDetailData.coinBalance}<Text className="text-secondary"> {coinDetailData.coin}</Text></div>
                            <div className="text-yellow"><Text className="text-secondary">$</Text> {coinDetailData.coinValueinNativeCurrency}</div>
                        </div>
                    </div>
                </Card>}
                <div className="enter-val-container">
                    <div className="text-center">
                        <Input className="fs-36 fw-100 text-white-30 text-center enter-val p-0"
                            placeholder="0.0"
                            bordered={false}
                            prefix={this.state.isSwap?coinDetailData.coin:"USD"}
                            style={{ maxWidth: 206 }}
                            onChange={value=>this.setAmount(value,'amnt')} value={this.state.amnt}/>
                        <Text className="fs-14 text-white-30 fw-200 text-center d-block mb-36">{this.state.minamntValue} {this.state.isSwap?"USD":coinDetailData.coin}</Text>
                    </div>
                    <span className="mt-8 val-updown">
                        <span className="icon sm uparw-o-white d-block c-pointer mb-4" onClick={()=>this.state.isSwap?this.swapChange(false):''}/>
                        <span className="icon sm dwnarw-o-white d-block c-pointer" onClick={()=>!this.state.isSwap?this.swapChange(true):''}/>
                    </span>
                </div>
                <Radio.Group defaultValue="min" buttonStyle="solid" className="round-pills">
                    <Translate value="min" content="min" component={Radio.Button} onClick={()=>this.clickMinamnt('min')}/>
                    <Translate value="half" content="half" component={Radio.Button}  onClick={()=>this.clickMinamnt('half')}/>
                    <Translate value="all" content="all" component={Radio.Button}  onClick={()=>this.clickMinamnt('all')}/>
                </Radio.Group>
                {/* <WalletList /> */}
                <Dropdown label="Wallets" name="currencyCode" type="Wallets" dropdownData={this.props.sellData.MemberFiat} value={this.state.sellSaveData.walletName} onValueChange={()=>this.handleChange()} field='WalletName'></Dropdown>
                <Translate content="preview" component={Button} size="large" block className="pop-btn" onClick={() => {this.previewSellData()}} />
            </>

        )
    }
}
const connectStateToProps = ({ buySell, sellData }) => {
    return { buySell, sellData }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SelectSellCrypto);
