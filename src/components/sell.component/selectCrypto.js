import React, { Component } from 'react';
import { Drawer, Typography, Button, Card, Input, Radio } from 'antd';
import WalletList from '../shared/walletList';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';

class SelectSellCrypto extends Component {
    state={
        amnt:null,minamntValue:null
    }
    setAmount(e){
        this.setState({amnt:e.target.value,minamntValue:e.target.value})
    }
    clickMinamnt(type) {
        let amnt;
        if (type == 'half') {
            amnt=(this.state.amnt/2)
        }else if(type == 'all'){
            amnt=this.state.amnt
        }else{
            amnt=this.state.amnt
        }
        this.setState({minamntValue:amnt})
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
    }
    render() {
        const { Text } = Typography;
        const {coinDetailData}=this.props.sellData;
        return (
            <>
                {coinDetailData&&<Card className="crypto-card mb-36" bordered={false}>
                    <span className="d-flex align-center">
                        <span className="coin lg btc-white" />
                        <Text className="fs-24 text-white crypto-name ml-8">{coinDetailData.coin}</Text>
                    </span>
                    <div className="crypto-details">
                        <Text className="crypto-percent text-white fw-700">{coinDetailData.change}<sup className="percent text-white fw-700">%</sup></Text>
                        <div className="fs-16 text-white-30 fw-200 crypto-amount">
                            <div className="text-yellow">{coinDetailData.balance}<Text className="text-secondary"> {coinDetailData.coin}</Text></div>
                            <div className="text-yellow"><Text className="text-secondary">$</Text> {coinDetailData.price}</div>
                        </div>
                    </div>
                </Card>}
                <div className="enter-val-container">
                    <div className="text-center">
                        <Input className="fs-36 fw-100 text-white-30 text-center enter-val p-0"
                            placeholder="0.0"
                            bordered={false}
                            prefix="USD"
                            style={{ maxWidth: 206 }}
                            onChange={(e)=>this.setAmount(e)} value={this.state.amnt}/>
                        <Text className="fs-14 text-white-30 fw-200 text-center d-block mb-36">{this.state.minamntValue} BTC</Text>
                    </div>
                    <span className="mt-8 val-updown">
                        <span className="icon sm uparw-o-white d-block c-pointer mb-4" /><span className="icon sm dwnarw-o-white d-block c-pointer" />
                    </span>
                </div>
                <Radio.Group defaultValue="min" buttonStyle="solid" className="round-pills">
                    <Translate value="min" content="min" component={Radio.Button} onClick={()=>this.clickMinamnt('min')}/>
                    <Translate value="half" content="half" component={Radio.Button}  onClick={()=>this.clickMinamnt('half')}/>
                    <Translate value="all" content="all" component={Radio.Button}  onClick={()=>this.clickMinamnt('all')}/>
                </Radio.Group>
                <WalletList />
                <Translate content="preview" component={Button} size="large" block className="pop-btn" onClick={() => {this.props.changeStep('step11');this.previewSellData()}} />
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
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SelectSellCrypto);
