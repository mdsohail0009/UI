import React, { Component } from 'react';
import config from '../../config/config';
import { Link } from 'react-router-dom';
import { List, Skeleton, Typography } from 'antd';
import Translate from 'react-translate-component';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';

const { Text } = Typography;
class SavedCards extends Component {
    state = {}
    render() {
        const { initLoading, loading } = this.state;
        const loadMore =
            !loading ? (
                <div
                    className="d-flex align-center c-pointer"
                    style={{
                        justifyContent: 'space-between',
                    }}
                    onClick={() => this.props.changeStep("step3")}
                >
                    <span>
                        <span className="icon sm add ml-24 valign-initial" />
                        <Translate className="text-darkgreen fs-16 ml-16 fw-500" content="link_newcard" component={Text} />
                    </span>
                    <span className="icon sm r-arrow-o-white" />
                </div>
            ) : null;
        return (
            <List
                itemLayout="horizontal"
                dataSource={config.savedCards}
                loadMore={loadMore}
                className="crypto-list"
                renderItem={item => (
                    <List.Item style={{ borderWidth: '0px' }}>
                        <Link onClick={() => this.props.changeStep('step5')}>
                            <List.Item.Meta
                                avatar={<span className={`coin md ${item.cardType}-black`} />}
                                title={<div className="fw-300 fs-14"><div className="text-white-30">{item.cardNumber}</div><div className="text-defaultylw">{item.confirm}</div></div>}
                            />
                            <span className="icon sm r-arrow-o-white" />
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

export default connect(connectStateToProps, connectDispatchToProps)(SavedCards);