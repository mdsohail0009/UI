import React, { Component } from 'react';
import { List } from 'antd';
import config from '../../config/config';
import { Link } from 'react-router-dom';

class WalletList extends Component {
    state = {
        isArrow: true,
    }
    render() {
        return (
            <List
                itemLayout="horizontal"
                className="wallet-list mb-36"
                dataSource={config.walletList}
                style={{ borderBottom: '1px solid var(--borderLight)' }}
                renderItem={item => (
                    <List.Item className="px-4">
                        <Link>
                            <List.Item.Meta
                                avatar={<span className={`coin ${item.coin}`} />}
                                title={<><div className="fs-16 fw-400 text-white">{item.title}</div>
                                    <div className="fs-16 fw-400 text-upper text-white">{item.coin}</div></>}
                            />
                            <span className="icon sm r-arrow-o-white" />
                        </Link>
                    </List.Item>

                )}
            />
        );
    }
}

export default WalletList;