import React, { Component } from 'react';
import { Typography, Button, Input, List } from 'antd';
import config from '../../config/config';
import Translate from 'react-translate-component';
import { setStep } from '../../reducers/swapReducer';
import { connect } from 'react-redux';

class SelectCrypto extends Component {
    state = {
        swapfrom: "",
        swapto: ""
    }
    onSearch = value => console.log(value);
    render() {
        const { swapto, swapfrom } = this.state;
        const { Search } = Input;
        const { Paragraph, Text } = Typography;
        return (<>
            <Search placeholder="Search for a Currency" onSearch={this.onSearch} className="crypto-search fs-14" />
            {!swapfrom && <Paragraph className="text-upper fs-14 text-center text-white-30 c-pointer mt-36 mb-0 fw-500">Swap From<span className="icon sm rightarrow ml-12 mb-4" /></Paragraph>}
            {swapto && <Paragraph className="text-upper fs-14 text-center text-white-30 c-pointer mt-36 fw-500 mb-0"><span className="icon sm leftarrow mr-12 mb-4" />To Receive</Paragraph>}
            <div className="sellcrypto-container auto-scroll">
                <List
                    itemLayout="horizontal"
                    dataSource={config.tlvCoinsList}
                    className="wallet-list c-pointer"
                    renderItem={item => (
                        <List.Item className="px-4">
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
const connectStateToProps = ({ swapStore, oidc }) => {
    return { swapStore }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SelectCrypto);
