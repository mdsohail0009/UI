import React, { Component } from 'react';
import { Typography, Button, Tooltip, Input } from 'antd';
import Translate from 'react-translate-component';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/swapReducer';
import { connect } from 'react-redux';

class SwapSummary extends Component {
    render() {
        const { Paragraph, Text } = Typography;
        return (
            <>
                <div className="enter-val-container">
                    <div className="text-center">
                        <Input className="enter-val p-0 fs-36 text-white-30 fw-200" style={{ lineHeight: '28px' }}
                            bordered={false}
                            suffix="ETH"
                            placeholder="0.101833"
                            style={{ maxWidth: 253, lineHeight: '0.1' }}
                        />
                        <Text className="fs-14 text-white-30 fw-200 text-center d-block">USD 200.00</Text>
                    </div>
                    <span className="mt-8 val-updown">
                        <span className="icon sm uparw-o-white d-block c-pointer mb-4" /><span className="icon sm dwnarw-o-white d-block c-pointer" />
                    </span>
                </div>

                <div className="pay-list fs-16">
                    <Translate className="fw-400 text-white" content="exchange_rate" component={Text} />
                    <Text className="fw-300 text-white-30">1 BTC = 41,363.47 USD</Text>
                </div>
                <div className="pay-list fs-16">
                    <Translate className="fw-400 text-white" content="amount" component={Text} />
                    <Text className="fw-300 text-white-30">USD 106.79</Text>
                </div>
                <div className="pay-list fs-16">
                    {/* <Translate className="fw-400 text-white" content="suissebase_fee" component={Text} ><Tooltip title="Suissebase Fee"><span className="icon md info c-pointer ml-4" /></Tooltip></Translate> */}
                    <Text className="fw-400 text-white">Suissebase Fee<Tooltip title="Suissebase Fee"><span className="icon md info c-pointer ml-12" /></Tooltip></Text>
                    <Text className="text-darkgreen fw-400">USD $2.71</Text>
                </div>
                <div className="pay-list fs-16 mb-16">
                    <Translate className="fw-400 text-white" content="total" component={Text} />
                    <Text className="fw-300 text-white-30">0.00279935 BTC (USD 104.08)</Text>
                </div>
                <Translate className="fs-14 text-white-30 text-center mb-36 fw-200" content="summary_hint_text" component={Paragraph} />
                <Translate size="large" block className="pop-btn" onClick={() => this.props.changeStep('confirm')} style={{ marginTop: '100px' }} content="confirm_swap" component={Button} />
            </>
        )
    }
}
const connectStateToProps = ({ swapStore, oidc }) => {
    return { swapStore }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SwapSummary);

