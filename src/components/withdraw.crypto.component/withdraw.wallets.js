import React, { Component } from 'react';
import { Drawer, Typography, Button, Card, Input, Radio, List } from 'antd';
import WalletList from '../shared/walletList';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';

const assetsList = [
    {
        address: "1CTEjSuGFv1DwpkGWxfC5qck1iHACw…",
        network: "BTC Binance Address",
    }
]
class CryptoWithDrawWallets extends Component {
    render() {
        const { Text } = Typography;
        return (
            <>
                <Card className="crypto-card select mb-36" bordered={false}>
                    <span className="d-flex align-center">
                        <span className="coin lg btc-white" />
                        <Text className="fs-24 text-purewhite ml-8">Bitcoin</Text>
                    </span>
                    <div className="crypto-details">
                        <Text className="crypto-percent fw-700">65<sup className="percent fw-700">%</sup></Text>
                        <div className="crypto-amount">
                            <div>1.0147668 <Text className="text-secondary">ETH</Text></div>
                            <Text className="text-secondary">$</Text> 41.07
                        </div>
                    </div>
                </Card>
                <div className="enter-val-container mr-0">
                    <div className="text-center">
                        <Input className="fs-36 fw-100 text-white-30 text-center enter-val p-0"
                            placeholder="106.79"
                            bordered={false}
                            prefix="$"
                            style={{ maxWidth: 186 }}
                        />
                        <Text className="fs-14 text-white-30 fw-200 text-center d-block mb-36">0.00287116 BTC</Text>
                    </div>
                    <span className="mt-8 val-updown  c-pointe">
                        <span className="icon sm uparw-o-white d-block c-pointer mb-4" /><span className="icon sm dwnarw-o-white d-block c-pointer" />
                    </span>
                </div>
                <Radio.Group defaultValue="min" buttonStyle="solid" className="round-pills">
                    <Translate value="min" content="min" component={Radio.Button} />
                    <Translate value="half" content="half" component={Radio.Button} />
                    <Translate value="all" content="all" component={Radio.Button} />
                </Radio.Group>
                <Radio.Group defaultValue="min" buttonStyle="outline" className="default-radio">
                    <Translate value="min" content="assets" className="fs-16 fw-400" component={Radio.Button} />
                    <Translate value="half" content="address" className="fs-16 fw-400" component={Radio.Button} onClick={() => this.props.changeStep('step4')} />
                </Radio.Group>
                <List
                    itemLayout="horizontal"
                    className="wallet-list my-36"
                    dataSource={assetsList}
                    style={{ borderBottom: '1px solid var(--borderLight)' }}
                    renderItem={item => (
                        <List.Item className="px-8">
                            <Link>
                                <List.Item.Meta
                                    title={<><div className="fs-16 fw-200 text-white">{item.address}</div>
                                        <div className="fs-16 fw-200 text-white">{item.network}</div></>}
                                />
                                <span className="icon sm r-arrow-o-white" />
                            </Link>
                        </List.Item>

                    )}
                />
                <Translate content="preview" component={Button} size="large" block className="pop-btn" style={{ marginTop: '30px' }} onClick={() => this.props.changeStep('step5')} />
            </>


        )
    }
}
const connectStateToProps = ({ sendReceive, oidc }) => {
    return { sendReceive }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(CryptoWithDrawWallets);
