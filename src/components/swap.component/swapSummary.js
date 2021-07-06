import React, { Component } from 'react';
import { Typography, Button, Tooltip, Input } from 'antd';
import Translate from 'react-translate-component';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';

class SwapSummary extends Component {
    render() {
        const { Paragraph, Text } = Typography;
        return (
            <>
                <div className="enter-val-container">
                    <div className="text-center">
                        <Input className="enter-val p-0 fs-36 text-white-30 fw-200 text-center" style={{ lineHeight: '28px' }}
                            bordered={false}
                            prefix="0.101833"
                            placeholder="ETH"
                            style={{ maxWidth: 253, lineHeight:'0.1' }}
                        />
                        <Text className="fs-14 text-white-30 fw-200 text-center d-block mb-36">USD 200.00</Text>
                    </div>
                    <span className="mt-24" style={{ marginLeft: 50 }}>
                        <span className="icon sm uparw-o-white d-block c-pointer mb-4" /><span className="icon sm dwnarw-o-white d-block c-pointer" />
                    </span>
                </div>

                <div className="pay-list fs-14">
                    {/* <Text className="fw-400 text-white">Exchange Rate</Text> */}
                    <Translate className="fw-400 text-white" content="exchange_rate" component={Text}/>
                    <Text className="fw-300 text-white-30">1 BTC = 41.363.47 USD</Text>
                </div>
                <div className="pay-list fs-14">
                    <Translate className="fw-400 text-white" content="amount" component={Text} />
                    <Text className="fw-300 text-white-30">USD 106.79</Text>
                </div>
                <div className="pay-list fs-14">
                    <Text className="fw-400 text-white">Suissebase Fee<Tooltip title="Suissebase Fee"><span className="icon md info c-pointer ml-4" /></Tooltip></Text>
                    <Text className="text-darkgreen fw-400">USD $2.71</Text>
                </div>
                <div className="pay-list fs-14">
                    <Text className="fw-400 text-white">Total</Text>
                    <Text className="fw-300 text-white-30">0.00279935 BTC (USD 104.08)</Text>
                </div>
                <Paragraph className="fs-12 text-white-30 text-center mt-16 mb-36">
                    Your final amount might change due to market activity.
                </Paragraph>
                <Button size="large" block className="pop-btn" onClick={() => this.props.changeStep('success')}>Confirm Swap</Button>
            </>
        )
    }
}

export default SwapSummary;

