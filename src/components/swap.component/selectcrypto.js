import React, { Component } from 'react';
import { Typography, Button, Input, List, Empty, Alert } from 'antd';
import Translate from 'react-translate-component';
import { setStep, updateCoinDetails, getMemberCoins } from '../../reducers/swapReducer';
import { connect } from 'react-redux';

class SelectCrypto extends Component {
    state = {
        addLinks: null,
        MemberCoins: null,
        coinDetails:null,
        errorMessage:null
    }
    componentDidMount() {
        this.props.fetchMemberCoins(this.props.userProfile?.id);
    }

    onSearch=(e)=> {
        var searchValue = e.target.value;
        let matches = this.props.swapStore.MemberCoins.filter(v => v.coin.toLowerCase().includes(searchValue.toLowerCase()));
        this.setState({ ...this.state, MemberCoins: matches });
    }

    selectToggle = item => {
        this.setState({ addLinks: item.id,coinDetails:item });
    };
    render() {
        const { Search } = Input;
        const { addLinks } = this.state;
        const { Paragraph, Text } = Typography;

        return (<>
{this.state.errorMessage!=null&&<Alert
                    //message="this.state.errorMessage"
                     description={this.state.errorMessage}
                    type="error"
                    showIcon
                    closable={false}
                />}
            <Search placeholder="Search for a Currency" onChange={(value) => this.onSearch(value)} className="crypto-search fs-14" />
            <Paragraph className="to-receive">Swap From<span className="icon sm swaprightarrow ml-12 mb-4" /></Paragraph>
            {this.props.swapStore.MemberCoins && <div className="crypto-container auto-scroll">
                <List
                    itemLayout="horizontal"
                    dataSource={this.state.MemberCoins||this.props.swapStore.MemberCoins}
                    className="wallet-list c-pointer"
                    loading={(this.state.MemberCoins||this.props.swapStore.MemberCoins)?false:true}
                    locale={{ emptyText:<Empty image={Empty.PRESENTED_IMAGE_DEFAULT} description={<span>No records found</span>} />}}
                    renderItem={item => (
                        <List.Item className={(item.id === addLinks ? " select" : "")} key={item.id}
                            onClick={() => { this.selectToggle(item);  }} >
                            <List.Item.Meta
                                avatar={<span className={`coin ${item.coin} mr-4`} />}
                                title={<div className="wallet-title">{item.coin}</div>}
                            />
                        </List.Item>
                    )}
                />
            </div>}
            {(this.state.MemberCoins?this.state.MemberCoins.length>0:true)&&<><Translate size="large" className="custon-btngroup cancel-btngroup" content="cancel" component={Button} onClick={() => this.props.changeStep('step1')} />
            <Translate size="large" className="custon-btngroup pick-btn" content="pick" component={Button} onClick={() => {if(this.state.coinDetails!=null){this.props.dispatch(updateCoinDetails(this.state.coinDetails));this.props.changeStep('step1')}else{this.setState({ ...this.state, errorMessage: 'Please select coin to swap' })}}} /></>}
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
