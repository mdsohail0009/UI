import React, { Component } from 'react';
import { Drawer, Typography, Button, Radio, Tabs, List } from 'antd';
import config from '../../config/config';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
const depostOptions = [
    { label: 'From Crypto', value: 'From Crypto' },
    { label: 'From Fiat', value: 'From Fiat' },
];
class depositCrypto extends Component {
    state = {
        depositToggle: 'From Crypto'
    }
    handleDepositToggle = e => {
        console.log(this.state);
    }
    render() {
        return (
            <>
                <Radio.Group
                    defaultValue={1}
                    onChange={this.handleBuySellToggle}
                    className="buysell-toggle crypto-toggle">
                    <Radio.Button value={1}>From Crypto</Radio.Button>
                    <Radio.Button value={2}>From Fiat</Radio.Button>
                </Radio.Group>
                <List onClick={() => this.props.changeStep('step8')}
                    itemLayout="horizontal"
                    dataSource={config.tlvCoinsList}
                    className="wallet-list"
                    renderItem={item => (
                        <List.Item>
                            <List.Item.Meta
                                avatar={<span className={`coin ${item.coin} mr-4`} />}
                                title={<div className="fs-16 fw-600 text-upper text-white-30 mb-0 mt-12">{item.coin}</div>}
                            />
                        </List.Item>
                    )}
                />
            </>
        );
    }
}
const connectStateToProps = ({ buySell, oidc }) => {
    return { buySell }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(depositCrypto);
