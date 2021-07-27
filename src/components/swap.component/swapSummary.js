import React, { Component } from 'react';
import { Typography, Button, notification } from 'antd';
import Translate from 'react-translate-component';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/swapReducer';
import { connect } from 'react-redux';
import { fetchCurrConvertionValue , saveSwapData } from '../../components/swap.component/api'

const LinkValue = (props) => {
    return (
        <Translate className="text-yellow text-underline c-pointer"
            content={props.content}
            component={Link}
            // to="./#"
        />
    )
}

class SwapSummary extends Component {
    state = {
        loader: true,
        price:null,
        receiveValue:null,
        disableConfirm:false,
        errorMessage:null,
        agreeValue:false,
        swapSaveData: { "id": "00000000-0000-0000-0000-000000000000", "membershipId": "3fa85f64-5717-4562-b3fc-2c963f66afa6", "fromWalletId": null, "fromWalletCode": null, "fromWalletName": null, "fromValue": 0, "toWalletId": null, "toWalletCode": null, "toWalletName": null, "toValue": 0, "description": null, "comission": 0, "exicutedPrice": 0, "totalAmount": 0 }
    }
    componentDidMount(){
         this.setOneCoinValue();
         this.setReceiveAmount();
        this.updateTimer = setInterval(() => {
            this.setOneCoinValue();
            this.setReceiveAmount();
            this.setState({ ...this.state, disableConfirm: true});
        },10000);
    }
    componentWillUnmount(){
        clearInterval(this.updateTimer);
    }
    agreePolicyChecked(e){
        this.setState({ agreeValue: e.target.checked }, () => this.callBackFunction());
    }
    callBackFunction(){
        if(this.state.agreeValue){
            this.setState({...this.state,errorMessage: ''})
        }
    }

    async setOneCoinValue(){
        if(this.props.swapStore.coinDetailData.coin && this.props.swapStore.coinReceiveDetailData.coin){
            let res = await fetchCurrConvertionValue(this.props.swapStore.coinDetailData.coin, this.props.swapStore.coinReceiveDetailData.coin,1);
            if (res.ok) {
                this.setState({...this.state,price: res.data })
            }
        }
    }
    async setReceiveAmount(e){
        let res = await fetchCurrConvertionValue(this.props.swapStore.coinDetailData.coin, this.props.swapStore.coinReceiveDetailData.coin,this.props.swapStore.fromCoinInputValue);
        if (res.ok) {
            this.setState({...this.state,receiveValue: res.data })
        }
    }
    async confirmSwap(){
        if(!this.state.agreeValue){
            notification.error({ message: "", description: 'Please agree to terms&conditions' });
            // this.setState({...this.state,errorMessage: 'Check Agree Policy Checkbox'})
        }
        else if(!this.props.swapStore.coinDetailData.coinBalance){
            notification.error({ message: "", description: 'Insufficiant funds to swap' });
            // this.setState({...this.state,errorMessage: 'Insufficiant funds to swap'})
        }
        else{
            let obj = Object.assign({}, this.state.swapSaveData);
            obj.membershipId = this.props.userProfile.id;
            obj.fromWalletId = this.props.swapStore.coinDetailData.id
            obj.fromWalletCode = this.props.swapStore.coinDetailData.coin
            obj.fromWalletName = this.props.swapStore.coinDetailData.coinFullName
            obj.fromValue = this.props.swapStore.fromCoinInputValue 
            obj.exicutedPrice = this.state.price 

            obj.toWalletId = this.props.swapStore.coinReceiveDetailData.id
            obj.toWalletCode = this.props.swapStore.coinReceiveDetailData.coin
            obj.toWalletName = this.props.swapStore.coinReceiveDetailData.coinFullName
            obj.toValue = this.state.receiveValue
            obj.totalAmount = this.state.receiveValue

            let res = await saveSwapData(obj);
            if (res.ok) {
                this.props.changeStep('confirm');
                this.setState({ ...this.state,loader:false })
            }else{
                this.setState({ ...this.state,loader:false })
        }
      }
    }
    
    render() {
        const { Paragraph, Text } = Typography;
        const link = <LinkValue content="terms_service" />;
        return (
            <>
               {this.state.errorMessage!=null&& <Text className="fs-15 text-red crypto-name ml-8 mb-8">{this.state.errorMessage}</Text>}
                <div className="enter-val-container">
                    <div className="text-center">
                        <Text className="fs-36 fw-200 text-white-30">{this.state.receiveValue} {this.props.swapStore.coinReceiveDetailData?.coin}</Text>
                    </div>
                </div>
                <div className="pay-list fs-16">
                    <Translate className="fw-400 text-white" content="exchange_rate" component={Text} />
                    <Text className="fw-300 text-white-30">1 {this.props.swapStore?.coinDetailData?.coin} = {this.state.price} {this.props.swapStore?.coinReceiveDetailData?.coin}</Text>
                </div>
                <div className="pay-list fs-16 mb-16">
                    <Translate className="fw-400 text-white" content="convert" component={Text} />
                    <Text className="fw-300 text-white-30">{this.props.swapStore.fromCoinInputValue} {this.props.swapStore?.coinDetailData?.coin} </Text>
                </div>
                <Translate className="fs-14 text-white-30 text-center mb-36 fw-200" content="summary_hint_text" component={Paragraph} />
                <div className="text-center text-underline"><Link className="text-white" onClick={() => {this.setOneCoinValue();this.setReceiveAmount();this.setState({ ...this.state, disableConfirm: false});}}> Click to see the new rate.</Link></div>
                <div className="d-flex p-16 mb-36 agree-check">
                    <label>
                        <input type="checkbox" id="agree-check" onChange={(e) => this.agreePolicyChecked(e)} />
                        <span for="agree-check" />
                    </label><Translate content="agree_to_suissebase" with={{ link }} component={Paragraph} className="fs-14 text-white-30 ml-16" style={{ flex: 1 }} />
                </div>
                <Translate size="large" block className="pop-btn" disabled={this.state.disableConfirm} onClick={()=>this.confirmSwap()} style={{ marginTop: '100px' }} content="confirm_swap" component={Button} />
            </>
        )
    }
}
const connectStateToProps = ({ swapStore, oidc,userConfig }) => {
    return { swapStore,userProfile:userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SwapSummary);

