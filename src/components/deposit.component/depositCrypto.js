import React, { Component } from 'react';
import { Radio, List } from 'antd';
import config from '../../config/config';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import DepositFiat from './depositFiat'
import Translate from 'react-translate-component';

class depositCrypto extends Component {
    state = {
        depositToggle: 'From Crypto',
        depositeFiat: false
    }
    handleBuySellToggle = e => {
        // console.log(this.state);
        this.setState({
            depositeFiat: e.target.value === 2
        });
    }
    render() {
        const { depositeFiat } = this.state;
        return (
            <>
                <div className="text-center">
                    <Radio.Group
                        defaultValue={1}
                        onChange={this.handleBuySellToggle}
                        className="buysell-toggle crypto-toggle">
                        <Translate value="min" content="from_crypto" value={1} component={Radio.Button} />
                        <Translate value="half" content="from_fiat" value={2} component={Radio.Button} />
                    </Radio.Group>
                </div>
                {depositeFiat ?
                    <DepositFiat /> :
                    <div className="sellcrypto-container auto-scroll">
                        <List
                            itemLayout="horizontal"
                            dataSource={config.tlvCoinsList}
                            className="wallet-list"
                            renderItem={item => (
                                <List.Item className="px-4 c-pointer" onClick={() => this.props.changeStep('step8')}>
                                    <List.Item.Meta
                                        avatar={<span className={`coin ${item.coin} mr-4`} />}
                                        title={<div className="wallet-title">{item.coin}</div>}
                                    />
                                </List.Item>
                            )}
                        />
                    </div>
                }

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
