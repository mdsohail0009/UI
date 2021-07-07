import React, { Component } from 'react';
import config from '../../config/config';
import { Link } from 'react-router-dom';
import { List, Skeleton } from 'antd';
import Translate from 'react-translate-component';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';

class CryptoList extends Component {
    state = {
        loading: false,
        initLoading: true,
    }
    render() {
        const { initLoading, loading } = this.state;
        const loadMore =
            !loading ? (
                <div
                    style={{
                        textAlign: 'center',
                        marginTop: 16,
                        height: 40,
                        lineHeight: '40px',
                        borderColor: 'var(--borderGrey)'
                    }}
                >
                    <Translate content="load_more" component={Link} className="fs-16 text-white-30" />
                </div>
            ) : null;
        return (
            <List
                itemLayout="horizontal"
                dataSource={config.tlvCoinsList}
                loadMore={loadMore}
                className="crypto-list"
                renderItem={item => (
                    <List.Item>
                        <Link onClick={() => this.props.changeStep('step2')}>
                            <List.Item.Meta
                                avatar={<span className={`coin ${item.coin} mr-4`} />}
                                title={<div className="fs-16 fw-600 text-upper text-white-30 mb-0 mt-12">{item.coin}</div>}
                            />
                            <div className="fs-16 text-right">
                                <div className="text-white-30 fw-600">${item.price}</div>
                                <div className={item.up ? 'text-green' : 'text-red'}>-{item.loss} % </div>
                            </div>
                            {item.up ? <span className="icon sm uparrow ml-12" /> : <span className="icon sm downarrow ml-12" />}
                        </Link>
                    </List.Item>
                )}
            />
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

export default connect(connectStateToProps, connectDispatchToProps)(CryptoList);