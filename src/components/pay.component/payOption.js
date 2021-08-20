import React, { Component } from 'react';
import { Typography } from 'antd';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';
class BillType extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    depositCrypto = () => {
        console.log(this.state);
    }
    showCardDrawer = () => {
        console.log(this.state);
    }
    render() {
        const { Paragraph } = Typography;
        return (
            <>
                <div className="d-flex align-center mb-24 mt-36 c-pointer" onClick={() => this.props.changeStep('step5')}>
                    <span className="coin credit-white" />
                    <div className="ml-24">
                        <Translate className="mb-0 fs-14 text-white-30 fw-300" content="credit_card" component={Paragraph} />
                        <Translate className="mb-0 fs-12 text-white-30 fw-300" content="credit_card_text" component={Paragraph} />
                    </div>
                </div>
                <div className="d-flex align-center c-pointer" onClick={() => this.props.changeStep('step6')}>
                    <span className="coin deposit-white" />
                    <div className="ml-24">
                        <Translate className="mb-0 fs-14 text-white-30 fw-300" content="deposit" component={Paragraph} />
                        <Translate className="mb-0 fs-12 text-white-30 fw-300" content="desosit_text" component={Paragraph} />
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
export default connect(connectStateToProps, connectDispatchToProps)(BillType);
