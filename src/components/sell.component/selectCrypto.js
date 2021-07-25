import React, { Component } from 'react';
import { Drawer, Typography, Button, Card, Input, Radio,notification } from 'antd';
import WalletList from '../shared/walletList';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
import { Dropdown } from '../../Shared/Dropdown';
import {getSellamnt} from '../../components/buysell.component/api'
import { updatesellsaveObject } from '../buysell.component/crypto.reducer';

class SelectSellCrypto extends Component {
    state = {
        USDAmnt: null, CryptoAmnt: null, sellSaveData: { "id": "00000000-0000-0000-0000-000000000000", "membershipId": null, "fromWalletId": null, "fromWalletCode": null, "fromWalletName": null, "fromValue": 0, "toWalletId": null, "toWalletCode": null, "toWalletName": null, "toValue": 0, "description": null, "comission": 0, "exicutedPrice": 0, "totalAmount": 0 }, isSwap: false
        
    }
    componentDidMount(){
       this.fetchdefaultMinAmntValues()
    }
    async fetchdefaultMinAmntValues(){
        this.setState({...this.state,CryptoAmnt:this.props.sellData.coinDetailData?.sellMinValue})
        let res =await getSellamnt(this.props.sellData.coinDetailData?.sellMinValue,true);
        if (res.ok) {
            this.setState({ CryptoAmnt: this.props.sellData.coinDetailData?.sellMinValue, USDAmnt: res.data,isSwap:true })
        }
    }
    async setAmount(e,fn){
        this.state[fn]=e.target.value
        let res =await getSellamnt(e.target.value, this.state.isSwap);
        if (res.ok) {
            this.setState({...this.state,CryptoAmnt: res.data })
        }
    }
    clickMinamnt(type) {
        let usdamnt;let cryptoamnt;
        let obj=Object.assign({},this.props.sellData.coinDetailData)
        if (type == 'half') {
            usdamnt=(obj.coinValueinNativeCurrency/2).toString();
            cryptoamnt=(obj.coinBalance/2)
            this.setState({USDAmnt:usdamnt,CryptoAmnt:cryptoamnt})
        }else if(type == 'all'){
            usdamnt=obj.coinValueinNativeCurrency;
            cryptoamnt=obj.coinBalance
            this.setState({USDAmnt:usdamnt,CryptoAmnt:cryptoamnt})
        }else{
            this.fetchdefaultMinAmntValues()
        }
    }
    previewSellData(){
        let obj = Object.assign({}, this.state.sellSaveData);
        let {sellMinValue}=this.props.sellData.coinDetailData;
        if (!this.state.USDAmnt) {
            notification.error({ message: "", description: 'Enter amount' });
            return;
        }
        else if (!obj.toWalletId) {
            notification.error({ message: '', description: 'Select wallet' });
            return;
        } else if (!this.state.isSwap && this.state.USDAmnt > this.props.sellData.coinDetailData.coinValueinNativeCurrency) {
            notification.error({ message: '', description: 'Entered amount should be less than available amount' });
            return;
        }
        else if (this.state.isSwap && this.state.CryptoAmnt > this.props.sellData.coinDetailData.coinBalance) {
            notification.error({ message: '', description: 'Entered amount should be less than balance' });
            return;
        } else if (this.state.isSwap && parseFloat(this.state.CryptoAmnt) <sellMinValue ) {
            notification.error({ message: '', description: 'Please enter min value' });
            return;
        }
        else if (!this.state.isSwap &&parseFloat(this.state.USDAmnt) < sellMinValue) {
            notification.error({ message: '', description: 'Please enter min value' });
            return;
        }
         else {
            obj.membershipId = this.props.member?.id;
            obj.fromWalletId = this.props.sellData.coinDetailData.id
            obj.fromWalletCode = this.props.sellData.coinDetailData.coin
            obj.fromWalletName = this.props.sellData.coinDetailData.coinFullName
            obj.fromValue = this.state.CryptoAmnt
            obj.toValue = this.state.USDAmnt
            obj.exicutedPrice = this.props.sellData.coinDetailData.oneCoinValue
            this.props.changeStep('step11');
            this.props.dispatch(updatesellsaveObject(obj))
        }
    }
    handleChange(e) {
        let obj = Object.assign({}, this.state.sellSaveData);
        for (var k in this.props.sellData.MemberFiat) {
            if (this.props.sellData.MemberFiat[k].currencyCode == e) {
                obj.toWalletId=this.props.sellData.MemberFiat[k].id;
                obj.toWalletCode=this.props.sellData.MemberFiat[k].currencyCode;
            }
        }
        this.setState({ ...this.state,sellSaveData:obj })
    }
    async swapChange(value){
        let obj=Object.assign({},this.state);
        this.setState({isSwap:value,USDAmnt:obj.CryptoAmnt,CryptoAmnt:obj.USDAmnt})
        let res =await getSellamnt(obj.CryptoAmnt,value);
        if (res.ok) {
            this.setState({ USDAmnt: obj.CryptoAmnt, CryptoAmnt: parseFloat(res.data).toFixed(8) })
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
                            <div className="text-yellow"><Text className="text-secondary"></Text> {coinDetailData.coinValueinNativeCurrency}</div>
                        </div>
                    </div>
                </Card>}
                <div className="enter-val-container">
                    <div className="text-center">
                        <Input className="fs-36 fw-100 text-white-30 text-center enter-val p-0"
                            placeholder=""
                            bordered={false}
                            prefix={this.state.isSwap?coinDetailData.coin:"USD"}
                            style={{ maxWidth: 206 }}
                            onChange={value=>this.setAmount(value,'USDAmnt')} value={this.state.USDAmnt}/>
                        <Text className="fs-14 text-white-30 fw-200 text-center d-block mb-36">{this.state.CryptoAmnt} {this.state.isSwap?"USD":coinDetailData.coin}</Text>
                    </div>
                    <span className="mt-8 val-updown">
                        <span className="icon sm uparw-o-white d-block c-pointer mb-4" onClick={()=>this.state.isSwap?this.swapChange(false):''}/>
                        <span className="icon sm dwnarw-o-white d-block c-pointer" onClick={()=>!this.state.isSwap?this.swapChange(true):''}/>
                    </span>
                </div>
                <Radio.Group defaultValue="min" buttonStyle="solid" className="round-pills">
                    <Translate value="min" content="min" component={Radio.Button} onClick={()=>this.clickMinamnt('min')}/>
                    <Translate value="half" content="half" component={Radio.Button}  onClick={()=>this.clickMinamnt('half')}/>
                    <Translate value="max" content="all" component={Radio.Button}  onClick={()=>this.clickMinamnt('all')}/>
                </Radio.Group>
                {/* <WalletList /> */}
                <Dropdown label="Wallets" name="currencyCode" type="Wallets" dropdownData={this.props.sellData.MemberFiat} value={this.state.sellSaveData.walletName} onValueChange={(Value)=>this.handleChange(Value)} field='WalletName'></Dropdown>
                <Translate content="preview" component={Button} size="large" block className="pop-btn" onClick={() => {this.previewSellData()}} />
            </>

        )
    }
}
const connectStateToProps = ({ buySell, sellData,userConfig }) => {
    return { buySell, sellData  , member: userConfig.userProfileInfo}
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
