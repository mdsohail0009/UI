import React, { Component } from 'react';
import { Typography, Button, message } from 'antd';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';
import Translate from 'react-translate-component';

class AddressScanner extends Component {
    state = {}
    success = () => {
        message.success('Address was copied!');
    };
    render() {
        const { Paragraph, Text } = Typography;
        return (
            <div>
                <div className="scanner-img">
                    {/* <img src={sacnner} /> */}
                </div>
                <div className="crypto-address">
                    <Translate className="mb-0 fw-400 text-secondary" content="address" component={Text} />
                    <div className="mb-0 fs-14 fw-500 text-textDark">TAQgcJD9p29m77EnXweijpHegPUSnxkdQW</div>
                </div>
                <Translate className="text-center f-12 text-white" content="address_hint_text" component={Paragraph} />
                <Translate size="large" block className="pop-btn" style={{ marginTop: '100px' }} onClick={this.success} content="copy" component={Button} />
                <Translate type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block content="share" onClick={() => this.props.changeStep('step1')} component={Button} />
            </div>
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
export default connect(connectStateToProps, connectDispatchToProps)(AddressScanner);