import React, { Component } from 'react';
import config from '../../config/config';
import { Link } from 'react-router-dom';
import { List } from 'antd';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';

class FiatList extends Component {
    state = {}
    render() {
        return (
            <List
                itemLayout="horizontal"
                dataSource={config.fiatList}
                className="wallet-list"
                renderItem={item => (
                    <List.Item className="px-8">
                        <Link onClick={() => this.props.changeStep('step2')}>
                            <List.Item.Meta
                                avatar={<span className={`coin ${item.coin} mr-4`} />}
                                title={<div className="fs-16 fw-600 text-upper text-white-30 mb-0 mt-12">{item.title}</div>}
                            />
                            <div className="fs-16 text-right">
                                <div className="text-white-30 fw-600">{item.currency}{item.balance}</div>
                                <div className="text-white-30 fw-100">{item.currency}{item.profit}</div>
                            </div>
                        </Link>
                    </List.Item>
                )}
            />
        );
    }
}

const connectStateToProps = ({ buyFiat, oidc }) => {
    return { buyFiat }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}

export default connect(connectStateToProps, connectDispatchToProps)(FiatList);