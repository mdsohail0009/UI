import React, { Component } from 'react';
import { Typography, Button, Input, List, Empty, Alert } from 'antd';
import Translate from 'react-translate-component';
import { setStep, updateCoinDetails, getMemberCoins,updateReceiveCoinDetails } from '../../reducers/swapReducer';
import { connect } from 'react-redux';
import cryptolist from '../shared/cryptolist';
import CryptoList from '../shared/cryptolist';
import { appInsights } from "../../Shared/appinsights";
import { getfromCoinList, gettoCoinList } from './api'

class SelectCrypto extends Component {
    state = {
        addLinks: null,
        MemberCoins: null,
        coinDetails: null,
        errorMessage: null,
        fromCoinsList:[],
        toCoinsList:[],
        isLoading:true,
    }
    useDivRef = React.createRef();
    componentDidMount() {
        //this.props.fetchMemberCoins(this.props.userProfile?.id);
        //this.trackEvent()
        if(this.props.swapfrom){
            this.fromCoinList()
        }else{
            this.toCoinList()
        }
    }
    fromCoinList = async() =>{
       let  fromlist =  await getfromCoinList(this.props.userProfile?.id)
        if(fromlist.ok){
            this.setState({...this.state,fromCoinsList:fromlist.data,isLoading:false})
        }else{
            this.setState({...this.state,fromCoinsList:[],isLoading:false})
        }
    }
    toCoinList = async() =>{
        let tolist = await gettoCoinList(this.props.userProfile?.id, this.props.swapStore.coinDetailData.coin)
        if(tolist.ok){
            this.setState({...this.state,toCoinsList:tolist.data,isLoading:false})
        }else{
            this.setState({...this.state,toCoinsList:[],isLoading:false})
        }
    }
    
    trackEvent = () =>{
        appInsights.trackEvent({
            name: 'Swap', properties: {"Type": 'User',"Action": 'Page view',"Username": this.props.userProfile.userName,"MemeberId": this.props.userProfile.userId,"Feature": 'Swap',"Remarks": 'Swap coins',"Duration": 1,"Url": window.location.href,"FullFeatureName": 'Swap crypto'}
        });
    }
    onSearch = (e) => {
        var searchValue = e.target.value;
        let matches = this.props.swapStore.MemberCoins.filter(v => v.coin.toLowerCase().includes(searchValue.toLowerCase()));
        this.setState({ ...this.state, MemberCoins: matches });
    }

    selectToggle = item => {
        this.setState({ addLinks: item.id, coinDetails: item });
    };
    pickCoin = ()=>{
        if (this.state.coinDetails != null && this.state.coinDetails.id) {
            if (this.props.swapfrom) {
                this.props.dispatch(updateCoinDetails(this.state.coinDetails));
                this.props.dispatch(updateReceiveCoinDetails({}));
            } else {
                this.props.dispatch(updateReceiveCoinDetails(this.state.coinDetails));
            }
            this.props.changeStep('step1') 
        } else { 
            this.useDivRef.current.scrollIntoView()
            this.setState({ ...this.state, errorMessage: 'Please select coin to swap' })
        }
    }
    render() {
        const { Search } = Input;
        const { addLinks } = this.state;
        const { Paragraph, Text } = Typography;

        return (<><div ref={this.useDivRef}></div>
            {this.state.errorMessage != null && <Alert
                //message="this.state.errorMessage"
                description={this.state.errorMessage}
                type="error"
                showIcon
                closable={false}
            />}
            {/*<Search placeholder="Search for a Currency" onChange={(value) => this.onSearch(value)} className="crypto-search fs-14" />*/}
            <Paragraph className="to-receive">Swap {this.props.swapfrom?'from':'to'}<span className="icon sm rightarrow ml-12 mb-4" /></Paragraph>
            
            <CryptoList coinType="swap" showSearch={true} showValues={true} titleField={'coin'} iconField={'coin'} selectedCoin={this.props.swapfrom?this.props.swapStore.coinDetailData:this.props.swapStore.coinReceiveDetailData} coinList={this.props.swapfrom?this.state.fromCoinsList:this.state.toCoinsList} isLoading={this.state.isLoading} onCoinSelected={(selectedCoin) => this.selectToggle(selectedCoin)} />

            {(this.state.MemberCoins ? this.state.MemberCoins.length > 0 : true) && <><Translate size="large" className="custon-btngroup cancel-btngroup" content="cancel" component={Button} onClick={() => this.props.changeStep('step1')} />
                <Translate size="large" className="custon-btngroup pick-btn" content="pick" component={Button} onClick={() => this.pickCoin()} /></>}
        </>)
    }
}
const connectStateToProps = ({ swapStore, userConfig }) => {
    return { swapStore, userProfile: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        fetchMemberCoins: (member_id) => {
            dispatch(getMemberCoins(member_id))
        },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SelectCrypto);
