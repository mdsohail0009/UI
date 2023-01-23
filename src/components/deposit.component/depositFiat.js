import React, { Component } from 'react';
import { Typography } from 'antd';
import WalletList from '../shared/walletList';
import Translate from 'react-translate-component';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';

class DepositFiat extends Component {
    state = {
        buyToggle: 'From Fiat'
    }
   

    render() {
        const { Paragraph, Text } = Typography;
        return (
            <>
                <div className="sellcrypto-container auto-scroll">
                    <WalletList />
                    <Translate className="mb-0 mt-36 fs-14 text-white fw-500 text-upper" content="wire_transfer_mthd" component={Paragraph} />
                    <div className="d-flex align-center mt-16 c-pointer" onClick={() => this.props.changeStep('step12')}>
                        <span className="coin deposit-white" />
                        <div className="ml-16">
                            <Translate className="mb-0 fs-14 text-white-30 fw-300" content="fidor_bank" component={Paragraph} />
                            <Paragraph className="mb-0 fs-12 text-white-30 fw-300">EUR</Paragraph>
                        </div>
                        <Translate className="recomnd-tag fs-12 text-white-30 fw-300 ml-auto text-upper" content="recommended" component={Text} />
                    </div>
                </div>
            </>
        )
    }
}

const connectStateToProps = ({ buySell }) => {
    return { buySell }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(DepositFiat);
