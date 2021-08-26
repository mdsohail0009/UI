import React, { Component } from 'react';
import { Typography, Radio, Card, List, Skeleton } from 'antd';
import config from '../../config/config';
import Translate from 'react-translate-component';
import { setStep } from '../../reducers/sendreceiveReducer';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import CryptoDeposit from '../deposit.component/crypto.deposit';


class DepositeCrypto extends Component {
    state = {
        loading: false,
        initLoading: true,
        buyDrawer: false,
        crypto: config.tlvCoinsList,
        buyToggle: 'Buy',
        sendreceive: false
    }

    handleBuySellToggle = e => {
        // console.log(this.state);
        this.setState({
            sendreceive: e.target.value === 2
        });
    }

    render() {
        console.log('propssssssssssss depositeToggle', this.props)
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
        const { Title, Paragraph, Text } = Typography;
        const { sendreceive } = this.state
        return (
            <>
                <Radio.Group
                    defaultValue={this.props.activeTab || 1}
                    onChange={this.handleBuySellToggle}
                    className="buysell-toggle crypto-toggle text-upper">
                    <Translate value={1} content="deposit" component={Radio.Button} />
                    <Translate value={2} content="withdraw" component={Radio.Button} />
                </Radio.Group>

                {sendreceive ?
                    <>
                        <Translate content="withdraw_a_crypto" component={Title} className="text-white-30 fs-36 fw-200 mb-8" />
                        <Translate content="withdraw_a_crypto_text" component={Paragraph} className="fs-16 text-secondary" />
                        <div className="dep-withdraw auto-scroll">
                            <Card className="crypto-card select mb-16 c-pointer" bordered={false} onClick={() => this.props.changeStep('step2')} >
                                <span className="d-flex align-center">
                                    <span className="coin lg btc-white" />
                                    <Text className="fs-24 text-purewhite ml-8">Bitcoin</Text>
                                </span>
                                <div className="crypto-details">
                                    <div className="crypto-percent">65<sup className="percent">%</sup></div>
                                    <div className="crypto-amount">
                                        <div>1.0147668 <Text className="text-secondary">ETH</Text></div>
                                        <Text className="text-secondary">$</Text> 41.07
                                    </div>
                                </div>
                            </Card>
                            <Card className="crypto-card normal-card mb-16 c-pointer" bordered={false}>
                                <span className="d-flex align-center">
                                    <span className="coin lg eth-white" />
                                    <Text className="fs-24 text-purewhite ml-8">Ethereum</Text>
                                </span>
                                <div className="crypto-details">
                                    <Text className="crypto-percent">25<sup className="percent">%</sup></Text>
                                    <div className="crypto-amount">
                                        <div>1.0147668 <Text className="text-secondary">ETH</Text></div>
                                        <Text className="text-secondary">$</Text> 41.07
                                    </div>
                                </div>
                            </Card>
                        </div>
                    </>
                    :
                    <>
                        <CryptoDeposit />
                    </>
                }

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
export default connect(connectStateToProps, connectDispatchToProps)(DepositeCrypto);

