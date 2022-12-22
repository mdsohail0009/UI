import React, { Component } from 'react';
import {List } from 'antd';
import config from '../../config/config';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import DepositFiat from './depositFiat'

class DepositCrypto extends Component {
    state = {
        depositToggle: 'From Crypto',
        depositeFiat: false
    }
    handleBuySellToggle = e => {
        this.setState({
            depositeFiat: e.target.value === 2
        });
    }
    render() {
        const { depositeFiat } = this.state;
        
        return (
            <>
                <div className="text-center">
                  
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
const connectStateToProps = ({ buySell }) => {
    return { buySell }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(DepositCrypto);
