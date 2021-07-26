import React, { Component } from 'react';
import { Typography, Button, Input, List } from 'antd';
import Translate from 'react-translate-component';
import { setStep ,updateCoinDetails , getMemberCoins } from '../../reducers/swapReducer';
import { connect } from 'react-redux';

class SelectCrypto extends Component {
    state = {
        addLinks: null,
        MemberCoins: []
    }
    componentDidMount(){
        this.state.MemberCoins = this.props.swapStore.MemberCoins;
        this.props.fetchMemberCoins();
    }
    
    onSearch(e) {
        var searchValue = e.target.value;
        let matches = this.props.swapStore.MemberCoins.filter(v => v.coin.toLowerCase().includes(searchValue.toLowerCase()));
        this.setState({ ...this.state, MemberCoins: matches});
    }

    selectToggle = id => {
        this.setState({ addLinks: id });
      };
    render() {
        const { Search } = Input;
        const { addLinks } = this.state;
        const { Paragraph, Text } = Typography;

        return (<>
        
            <Search placeholder="Search for a Currency" onChange={value=>this.onSearch(value)} className="crypto-search fs-14" />
            <Paragraph className="text-upper fs-14 text-center text-white-30 mt-36 mb-0 fw-500">Swap From<span className="icon sm rightarrow ml-12 mb-4" /></Paragraph>
            <div className="sellcrypto-container auto-scroll">
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.MemberCoins}
                    className="wallet-list c-pointer"
                   
                    renderItem={item => (
                        <List.Item className={ (item.id === addLinks ? " select" : "")}  key={item.id}
                         onClick={() => {this.selectToggle(item.id);this.props.dispatch(updateCoinDetails(item))}} >
                            <List.Item.Meta
                                avatar={<span className={`coin ${item.coin} mr-4`} />}
                                title={<div className="wallet-title">{item.coin}</div>}
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
const connectStateToProps = ({ swapStore }) => {
    return { swapStore }
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
export default connect(connectStateToProps, connectDispatchToProps)(SelectCrypto);
