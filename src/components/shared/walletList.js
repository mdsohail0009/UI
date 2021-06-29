import React, { Component } from 'react';
import { List } from 'antd';
import config from '../../config/config';
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
                renderItem={item => (
                    <List.Item>
                        <List.Item.Meta
                            avatar={<span className={`coin ${item.coin}`} />}
                            title={<><div className="fs-16 fw-400 text-white">{item.title}</div>
                                <div className="fs-16 fw-400 text-upper text-white">{item.coin}</div></>}
                        />
                        <span className="icon sm r-arrow-o-white" />
                    </List.Item>
                )}
            />
        );
    }
}

export default WalletList;