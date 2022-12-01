import React, { Component } from 'react';
import { Radio, List,Col,Input } from 'antd';
import config from '../../config/config';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import DepositFiat from './depositFiat'
import Translate from 'react-translate-component';

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
        const { Search } = Input;
        return (
            <>
                <div className="text-center">
                    {/* <Radio.Group
                        defaultValue={1}
                        onChange={this.handleBuySellToggle}
                        className="buysell-toggle crypto-toggle">
                        <Translate value="min" content="from_crypto" value={1} component={Radio.Button} />
                        <Translate value="half" content="from_fiat" value={2} component={Radio.Button} />
                    </Radio.Group> */}
                </div>
              
                {/* <Col xs={24} md={24} lg={24} xl={24} xxl={24}>
                    <Search placeholder="Search Currency" value={this.state.searchVal} addonAfter={<span className="icon md search-white" />} onChange={this.handleSearch} size="middle" bordered={false} className="text-center mt-12" />
                </Col> */}
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
