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
                        <Paragraph className="mb-0 text-white-30 fs-14 fw-100">Swap From</Paragraph>
                        <Input className="card-input"  defaultValue="0.00549635" bordered={false} placeholder="0.0" />
                        <Paragraph className="mb-0 text-white-30 fs-12 fw-100">Balance - 2.547813980005 BTC</Paragraph>
                    </div>
                    <div className="d-flex justify-content align-center c-pointer" onClick={() => this.props.changeStep('step3')} >
                        <div>
                        <span className="coin md btc-white"></span>
                        <Paragraph className="mb-0 text-white-30 fs-12 fw-100 text-center">Bitcoin</Paragraph>
                        </div>
                        <span className="icon md arrow-right ml-16"></span>
                        <span className="icon swapfrom-arrow"></span>
                    </div>
                </div>
              
                <div className="swap swapreceive-card p-relative">
                    <div>
                        <Paragraph className="mb-0 text-white-30 fs-14 fw-100">To Receive</Paragraph>
                        <Input className="card-input"  defaultValue="0.10183318" bordered={false} placeholder="0.0" />
                        <Paragraph className="mb-0 text-white-30 fs-12 fw-100">Balance - 2.547813980005 ETH</Paragraph>
                    </div>
                    <div className="d-flex justify-content align-center c-pointer" onClick={() => this.props.changeStep('step1')} >
                        <div>
                        <span className="icon swapto-arrow"></span>
                        <span className="coin md eth-white"></span>
                        <Paragraph className="mb-0 text-white-30 fs-12 fw-100 text-center">Ethereum</Paragraph>
                        </div>
                        <span className="icon md arrow-right ml-16"></span>
                    </div>
                </div>
                <div className="p-16 mt-16 mb-0 text-center">
                <Paragraph className="fs-16 text-white-30 text-center mb-0">
               Available 0.00549635 BTC
                </Paragraph>
                <Paragraph className="fs-16 text-white-30 text-center mb-0">
              Price 1BTC = 16.41933713 ETH
                </Paragraph>
                </div>
                <Translate size="large" block className="pop-btn" style={{ marginTop: '100px' }} content="preview" component={Button} onClick={() => this.props.changeStep('step2')} />
            </div>
        )
    }
}

const connectStateToProps = ({swapStore, oidc }) => {
    return {swapStore }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SwapCoins);
