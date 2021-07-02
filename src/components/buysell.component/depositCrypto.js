import React, { Component } from 'react';

class depositCrypto extends Component {
    state = {}
    render() {
        return (
            <>
                <Radio.Group
                    options={depostOptions}
                    onChange={this.handleDepositToggle}
                    value={this.state.depositToggle}
                    optionType="button"
                    buttonStyle="solid"
                    size="large"
                    className="buysell-toggle crypto-toggle mx-12"
                />
                <List onClick={this.depositScanner}
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

export default depositCrypto;