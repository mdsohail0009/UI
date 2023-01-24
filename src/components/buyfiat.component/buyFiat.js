import React, { Component } from 'react';
import { Radio, Typography, Card } from 'antd';
import { Link } from 'react-router-dom';
import FiatList from '../shared/fiatList';
import Translate from 'react-translate-component';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';



const LinkValue = (props) => {
    return (
        <Translate className="text-yellow text-underline c-pointer"
            content={props.content} onClick={() => this.props.changeStep('step2')}
            component={Link}
            to="./#"
        />
    )
}
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
        const link = <LinkValue content="deposit" />;
        const { buyFiat } = this.state;
        return (
            <>
                <Radio.Group
                    defaultValue={1}
                    onChange={this.handleBuyFiatToggle}
                    className="buysell-toggle crypto-toggle">
                    <Translate content="add_fund" component={Radio.Button} value={1} />
                    <Translate content="withdraw" component={Radio.Button} value={2} />
                </Radio.Group>
                {buyFiat ? <>
                    <Translate className="mb-0 text-white-30 fw-200 fs-36" content="sell_your_fiat_for_cash" component={Paragraph} />
                    <Translate className="text-secondary fw-300 fs-16 mb-36 mr-16" with={{ link }} content="need_to_replenish" component={Paragraph} />

                    <div className="sellcrypto-container auto-scroll">
                        <Card className="crypto-card fiatcard mb-36 c-pointer" bordered={false} onClick={() => this.props.changeStep('step4')}>
                            <div className="crypto-card-top">
                                <span className="d-flex align-center">
                                    <span className="coin-circle coin md usd" />
                                    <Text className="fs-24 text-purewhite ml-8">USD</Text>
                                </span>
                                <span className="icon md signal-white" />
                            </div>
                            <div className="crypto-card-bottom">
                                <div>
                                    <Translate className="text-purewhite fs-14 fw-200 mb-0" content="current_balance" component={Paragraph} />
                                    <div className="fs-24 text-purewhite fw-500">$5,200.00</div>
                                </div>
                                <div className="card-icons">
                                    <span className="coin-circle coin md visa-white" />
                                    <span className="coin-circle coin md mastercard-white ml-12" />
                                </div>
                            </div>
                        </Card>
                        <Card className="crypto-card select c-pointer" bordered={false}>
                            <div className="crypto-card-top">
                                <span className="d-flex align-center">
                                    <span className="coin-circle coin md eur-white" />
                                    <Text className="fs-24 text-purewhite ml-8">EUR</Text>
                                </span>
                                <span className="icon md signal-white" />
                            </div>
                            <div className="crypto-card-bottom">
                                <div>
                                    <Translate className="text-purewhite fs-14 fw-200 mb-0" content="current_balance" component={Paragraph} />
                                    <div className="fs-24 text-purewhite fw-500">$2,500.00</div>
                                </div>
                                <div className="card-icons">
                                    <span className="coin-circle coin md visa-white" />
                                    <span className="coin-circle coin md mastercard-white ml-12" />
                                </div>
                            </div>
                        </Card>
                    </div>
                </>
                    : <>
                        <Translate className="mb-0 text-white-30 fw-200 fs-36 mb-16" content="purchase_fiat" component={Title} />  
                       <Translate className="text-secondary fw-300 fs-16" content="Beneficiary_BankDetails" with={{ link }} component={Title} /> 
                        <div className="markets-panel mr-0">
                            <FiatList />
                           
                        </div>
                    </>}
            </>
        );
    }
}

const connectStateToProps = ({ buyFiat }) => {
    return { buyFiat }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}

export default connect(connectStateToProps, connectDispatchToProps)(BuyFiat);