import React, { Component } from 'react';
import { Radio, Typography, Card } from 'antd';
import { Link } from 'react-router-dom';
import FiatList from '../shared/fiatList';
import Translate from 'react-translate-component';
import { setStep } from '../../reducers/buyFiatReducer';
import { connect } from 'react-redux';

class BuyFiat extends Component {
    state = {
        buyFiat: false,
    }

    handleBuyFiatToggle = (e) => {
        this.setState({
            buyFiat: e.target.value === 2
        });
    }
    render() {
        const { Paragraph, Title, Text } = Typography;
        const { buyFiat } = this.state
        return (
            <>
                <Radio.Group
                    defaultValue={1}
                    onChange={this.handleBuyFiatToggle}
                    className="buysell-toggle crypto-toggle">
                    <Radio.Button value={1}>Add Fund</Radio.Button>
                    <Radio.Button value={2}>Withdraw</Radio.Button>
                </Radio.Group>
                {!buyFiat ? <>
                    <Translate className="mb-0 text-white-30 fw-200 fs-36 mb-16" content="purchase_fiat" component={Title} />
                        <Paragraph className="text-secondary fw-300 fs-16">Your wallet is empty, you don’t have any assets to make transactions. Follow this link and <Link to="" className="text-yellow text-underline">Deposit</Link> some cash.</Paragraph>
                        <div className="markets-panel mt-36">
                            <FiatList />
                        </div>
                </>
                    : <>
                         <Paragraph className="mb-0 text-white-30 fw-200 fs-36">Sell your Fiat for Cash</Paragraph>
                        <Paragraph className="text-secondary fw-300 fs-16 mb-36">Need to replenish your wallet? Follow this link and  <Link to="" className="text-yellow">Deposit</Link> some cash.</Paragraph>

                <Card className="crypto-card fiatcard mb-36" bordered={false} onClick={() => this.props.changeStep('step3')}>
                    <span className="d-flex align-center">
                        <span className="coin-circle coin md usdtbg-white" />
                        <Text className="fs-24 text-white crypto-name ml-8">USD</Text>
                    </span>
                    <div className="crypto-details">

                        <div className=" fw-200">
                            <div className="text-white-50 fs-14">Current Balance</div>
                            <div className="fs-24 text-white fw-500">$5,200.00</div>
                        </div>
                    </div>
                </Card>
                <Card className="crypto-card select mb-36" bordered={false}>
                    <div className="d-flex justify-content align-center">
                        <span className="d-flex align-center">
                            <span className="coin-circle coin md eurotbg-white" />
                            <Text className="fs-24 text-white crypto-name ml-8">EUR</Text>
                        </span>
                        <span className="icon md c-pointer signal-white" />
                    </div>
                    <div className="crypto-details d-flex justify-content align-center">

                        <div className=" fw-200">
                            <div className="text-white-50 fs-14">Current Balance</div>
                            <div className="fs-24 text-white fw-500">$5,200.00</div>
                        </div>
                        <div>
                            <span className="coin-circle coin md visa-white" />
                            <span className="coin-circle coin md mastercard-white" />
                        </div>
                    </div>
                </Card>
                    </>}
            </>
        );
    }
}
const connectStateToProps = ({buyFiat, oidc }) => {
    return {buyFiat }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(BuyFiat);
