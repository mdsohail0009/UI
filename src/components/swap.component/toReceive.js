import React, { Component } from 'react';
import { Typography, Button, Input, List } from 'antd';
import config from '../../config/config';
import Translate from 'react-translate-component';
import { setStep , updateReceiveCoinDetails } from '../../reducers/swapReducer';
import { connect } from 'react-redux';
import { getMemberCoins } from '../buysell.component/crypto.reducer'

class ToReceive extends Component {
    state = {
        addLinks: null,
    }
    componentDidMount(){
        this.state.MemberCoins = this.props.sellData.MemberCoins;
        this.props.fetchMemberCoins()
    }
    onSearch(searchValue) {
        let matches = this.props.sellData.MemberCoins.filter(v => v.coin.toLowerCase().includes(searchValue.toLowerCase()));
        this.setState({ ...this.state, MemberCoins: matches});
    }
    selectToggle = id => {
        this.setState({ addLinks: id });
      };
    render() {
        const { Search } = Input;
        const { Paragraph, Text } = Typography;
        const {addLinks }= this.state;

        return (<>
            <Search placeholder="Search for a Currency" onSearch={value=>this.onSearch(value)} className="crypto-search fs-14" />
            <Paragraph className="text-upper fs-14 text-center text-white-30 c-pointer mt-36 fw-500 mb-0"><span className="icon sm leftarrow mr-12 mb-4" />To Receive</Paragraph>
            <div className="sellcrypto-container auto-scroll">
            <List
                    itemLayout="horizontal"
                    dataSource={this.state.MemberCoins}
                    className="wallet-list c-pointer"
                   
                    renderItem={item => (
                        <List.Item className={  (item.id === addLinks ? " select" : "")}  key={item.id}
                         onClick={() => {this.selectToggle(item.id);this.props.dispatch(updateReceiveCoinDetails(item))}} >
                            <List.Item.Meta
                                avatar={<span className={`coin ${item.coin} mr-4`} />}
                                title={<div className="fs-16 fw-600 text-upper text-white-30 mb-0 mt-12">{item.coin}</div>}
                            />
                        </List.Item>
                    )}
                />
            </div>
            <Translate size="large" className="custon-btngroup cancel-btngroup" content="cancel" component={Button} onClick={() => this.props.changeStep('step1')} />
            <Translate size="large" className="custon-btngroup pick-btn" content="pick" component={Button} onClick={() => this.props.changeStep('step1')} />
        </>)
    }
}
const connectStateToProps = ({ swapStore, sellData }) => {
    return { swapStore,sellData }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        },
        fetchMemberCoins:()=>{
            dispatch(getMemberCoins())
        },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(ToReceive);
