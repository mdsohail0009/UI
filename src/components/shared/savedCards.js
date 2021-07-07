import React, { Component } from 'react';
import config from '../../config/config';
import { Link } from 'react-router-dom';
import { List, Skeleton, Typography } from 'antd';
import Translate from 'react-translate-component';

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
                        lineHeight: '40px',
                    }}
                >
                    <span>
                        <span className="icon sm add ml-36" />
                        <Text className="text-green fs-16 ml-16 fw-500">Link New Card</Text>
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
                        <Link>
                            <List.Item.Meta
                                avatar={<span className={`coin md ${item.cardType}-white mr-4`} />}
                                title={<div className="fw-300 fs-14"><div className="text-white-30">{item.cardNumber}</div><div className="text-yellow">{item.confirm}</div></div>}
                            />
                            <span className="icon sm r-arrow-o-white" />
                        </Link>
                    </List.Item>
                )}
            />
        );
    }
}

export default SavedCards;