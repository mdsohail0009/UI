import React, { Component } from 'react';
import { Drawer, Typography, Button, Card, Input } from 'antd';
import config from '../../config/config';
import WalletList from '../shared/walletList';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';

class SelectCrypto extends Component {
    constructor(props) {
        super(props);
        this.state = {
            buyDrawer: false,
            crypto: config.tlvCoinsList
        }
    }
    showPayDrawer = () => {
        console.log(this.state);
    }

    render() {
        const { Title, Paragraph, Text } = Typography;
        return (
            <>
                <Card className="crypto-card mb-36" bordered={false}>
                    <span className="d-flex align-center">
                        <span className="coin lg eth-white" />
                        <Text className="fs-24 text-white crypto-name ml-8">Ethereum</Text>
                    </span>
                    <div className="crypto-details">
                        <Text className="crypto-percent text-white fw-700">25<sup className="fs-24 text-white fw-700" style={{ verticalAlign: 'Middle', marginLeft: 14 }}>%</sup></Text>
                        <div className="fs-16 text-white-30 fw-200 crypto-amount">
                            <div>1.0147668 ETH</div>
                            <div>$ 41.07</div>
                        </div>
                    </div>
                </Card>
                <div className="enter-val-container">
                    <div className="text-center">
                        <Input className="fs-36 fw-100 text-white-30 text-center enter-val p-0"
                            placeholder="0.00"
                            bordered={false}
                            prefix="USD"
                            style={{ maxWidth: 160 }}
                        />
                        <Text className="fs-14 text-white-30 fw-200 text-center d-block mb-36">0.00701 ETH</Text>
                    </div>
                    <span className="mt-24 val-updown">
                        <span className="icon sm uparw-o-white d-block c-pointer mb-4" /><span className="icon sm dwnarw-o-white d-block c-pointer" />
                    </span>
                </div>
                <Translate content="find_with_wallet" component={Paragraph} className="text-upper fw-600 mb-0 text-aqua pt-16" />
                <WalletList isArrow={true} />
                <Translate content="refresh_newprice" component={Paragraph} className="fs-14 text-white-30 fw-200 text-center mb-16" />
                <Translate content="confirm_btn_text" component={Button} size="large" block className="pop-btn" onClick={() => this.props.changeStep('step3')} icon={<span className="icon md load" />} />
            </>
        )
    }
}
const connectStateToProps = ({ buySell, oidc }) => {
    return { buySell }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(SelectCrypto);