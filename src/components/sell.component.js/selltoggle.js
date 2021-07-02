import React, { Component } from 'react';
import { Drawer, Typography, Button, Card, Input } from 'antd';
import config from '../../config/config';
import WalletList from '../shared/walletList';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';

const options = [
    { label: 'Buy', value: 'Buy' },
    { label: 'Sell', value: 'Sell' },
];
class SellToggle extends Component {
    handleBuySellToggle = e => {
        this.setState({
            buyToggle: e.target.value,
        });
    };
    render() {
        const { Title, Paragraph, Text } = Typography;
        return (
            <>
              <Drawer
              title={[<div className="side-drawer-header"><span className="icon md lftarw-white c-pointer" onClick={this.closeBuyDrawer} />
                  <div className="text-center fs-14">
                      <Paragraph className="mb-0 text-white-30 fw-600 text-upper">WIRI TRANSFER</Paragraph>
                      <Paragraph className="text-white-50 mb-0 fw-300" > Select a method</Paragraph></div>
                  <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" /></div>]}
              placement="right"
              closable={true}
              visible={this.state.wiriTransfer}
              closeIcon={null}
              className="side-drawer text-white"
              >
              <Radio.Group
                                              options={options}
                                              onChange={this.handleBuySellToggle}
                                              value={this.state.buyToggle}
                                              optionType="button"
                                              buttonStyle="solid"
                                              size="large"
                                              className="buysell-toggle sell-toggle"
                                          />

                <Paragraph className="mb-0 text-white-30 fw-300 fs-30">Sell your Crypto for Cash</Paragraph>
                <Paragraph className="text-secondary fw-300" > Easily buy and sell Crypto straight from your Wallet.</Paragraph>
            <Card className="crypto-card mb-36" bordered={false}>
              <span className="d-flex">
                  <span className="coin md eth-white" />
                  <Text className="fs-24 text-white crypto-name ml-24">Bitcoin</Text>
              </span>
              <div className="crypto-details">
                  <Text className="crypto-percent text-white fw-700">65<sup className="fs-24 text-white fw-700" style={{ verticalAlign: 'Middle', marginLeft: 14 }}>%</sup></Text>
                  <div className="fs-16 text-white-30 fw-200 text-right">
                      <div>1.0147668 BTC</div>
                      <div>$ 411.07</div>
                  </div>
              </div>
              </Card>
              <Card className="crypto-card mb-36" bordered={false}>
              <span className="d-flex">
                  <span className="coin md eth-white" />
                  <Text className="fs-24 text-white crypto-name ml-24">Ethereum</Text>
              </span>
              <div className="crypto-details">
                  <Text className="crypto-percent text-white fw-700">25<sup className="fs-24 text-white fw-700" style={{ verticalAlign: 'Middle', marginLeft: 14 }}>%</sup></Text>
                  <div className="fs-16 text-white-30 fw-200 text-right">
                      <div>1.0147668 ETH</div>
                      <div>$ 41.07</div>
                  </div>
              </div>
              </Card>
              </Drawer>
              
              
              </>
        )
    }
}
export default SellToggle;