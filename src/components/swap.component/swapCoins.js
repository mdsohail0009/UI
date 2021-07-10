import React, { Component } from 'react';
import { Typography, Button, Input } from 'antd';
import { Link } from 'react-router-dom';
import { setStep } from '../../reducers/swapReducer';
import { connect } from 'react-redux';
import sacnner from '../../assets/images/sacnner.png';
import Translate from 'react-translate-component';

class SwapCoins extends Component {
    state = {}
    render() {
        const { Paragraph, Text } = Typography;
        return (
            <div>
                <div className="swap swapfrom-card p-relative">
                    <div>
                        <Translate className="text-white-30 fs-14 fw-100" content="swap_from" component={Text} />
                        <Input className="card-input" defaultValue="0.00549635" bordered={false} placeholder="0.0" />
                        <Text className="text-white-30 mt-4 fs-12 fw-100">Balance - 2.547813980005 BTC</Text>
                    </div>
                    <div className="d-flex justify-content align-center c-pointer" onClick={() => this.props.changeStep('step3')} >
                        <div className="text-center crypto-coin">
                            <span className="coin md btc-white"></span>
                            <Paragraph className="mb-0 text-white-30 fs-14 fw-100 mt-4" style={{ lineHeight: 'normal' }}>Bitcoin</Paragraph>
                        </div>
                        <span className="icon sm rightarrow swap-arrow"></span>
                        <span className="icon swapfrom-arrow"></span>
                    </div>
                </div>
                <div className="swap swapreceive-card p-relative">
                    <div>
                        <Translate className="text-white-30 fs-14 fw-100" content="swap_to" component={Text} />
                        <Input className="card-input" defaultValue="0.10183318" bordered={false} placeholder="0.0" />
                        <Text className="text-white-30 mt-4 fs-12 fw-100">Balance - 2.547813980005 ETH</Text>
                    </div>
                    <div className="d-flex justify-content align-center c-pointer" onClick={() => this.props.changeStep('step4')} >
                        <div className="text-center crypto-coin">
                            <span className="icon swapto-arrow"></span>
                            <span className="coin md eth-white"></span>
                            <Paragraph className="mb-0 text-white-30 fs-14 fw-100 mt-4" style={{ lineHeight: 'normal' }}>Ethereum</Paragraph>
                        </div>
                        <span className="icon sm rightarrow swap-arrow"></span>
                    </div>
                </div>
                <div className="p-16 mt-24 text-center fw-200">
                    <Paragraph className="fs-16 text-white-30 mb-0 l-height-normal">
                        Available 0.00549635 BTC
                    </Paragraph>
                    <Paragraph className="fs-16 text-white-30 l-height-normal">
                        Price 1BTC = 16.41933713 ETH
                    </Paragraph>
                </div>
                <Translate size="large" block className="pop-btn" style={{ marginTop: '100px' }} content="preview_swap" component={Button} onClick={() => this.props.changeStep('step2')} />
            </div>
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
export default connect(connectStateToProps, connectDispatchToProps)(SwapCoins);
