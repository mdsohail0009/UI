import React, { Component } from 'react';
import { Typography, Button, Input, List } from 'antd';
import Translate from 'react-translate-component';
import { setStep, updateCoinDetails, getMemberCoins } from '../../reducers/swapReducer';
import { connect } from 'react-redux';

class SelectCrypto extends Component {
    state = {
        addLinks: null,
        MemberCoins: []
    }
    componentDidMount() {
        this.props.fetchMemberCoins(this.props.userProfile?.id);
    }

    onSearch(e) {
        var searchValue = e.target.value;
        let matches = this.props.swapStore.MemberCoins.filter(v => v.coin.toLowerCase().includes(searchValue.toLowerCase()));
        this.setState({ ...this.state, MemberCoins: matches });
    }

    selectToggle = id => {
        this.setState({ addLinks: id });
    };
    render() {
        const { Search } = Input;
        const { addLinks } = this.state;
        const { Paragraph, Text } = Typography;

        return (<>

            <Search placeholder="Search for a Currency" onChange={value => this.onSearch(value)} className="crypto-search fs-14" />
            <Paragraph className="to-receive">Swap From<span className="icon sm rightarrow ml-12 mb-4" /></Paragraph>
            {this.props.swapStore.MemberCoins && <div className="sellcrypto-container auto-scroll">
                <List
                    itemLayout="horizontal"
                    dataSource={this.props.swapStore.MemberCoins}
                    className="wallet-list c-pointer"

                    renderItem={item => (
                        <List.Item className={(item.id === addLinks ? " select" : "")} key={item.id}
                            onClick={() => { this.selectToggle(item.id); this.props.dispatch(updateCoinDetails(item)) }} >
                            <List.Item.Meta
                                avatar={<span className={`coin ${item.coin} mr-4`} />}
                                title={<div className="wallet-title">{item.coin}</div>}
                            />
                        </List.Item>
                    )}
                />
            </div>}
            <Translate size="large" className="custon-btngroup cancel-btngroup" content="cancel" component={Button} onClick={() => this.props.changeStep('step1')} />
            <Translate size="large" className="custon-btngroup pick-btn" content="pick" component={Button} onClick={() => this.props.changeStep('step1')} />
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
