import React, { Component } from "react";
import { Typography } from "antd";
import Translate from 'react-translate-component';

class WireTransfer extends Component {
    state = {}
    render() {
        const { Text } = Typography;
        return (<>
            <div className="mb-24">
                <div className="wire-trans">
                    <Translate className="fs-16 text-white-30 fw-200" content="fidor_bank" component={Text} />
                    <Text className="fs-16 text-white-30 fw-200">$1.00 min</Text>
                </div>
                <div className="wire-trans">
                    <Translate className="fs-16 text-white-30 fw-200 text-upper" content="sepa" component={Text} />
                    <Translate className="fs-16 text-white-30 fw-200" content="no_fee" component={Text} />
                </div>
                <div className="text-right">
                    <Translate className="recomnd-tag fs-14 text-upper text-white fw-500 text-upper" content="recommended" component={Text} />
                </div>
            </div>
            <div className="wire-trans">
                <Translate className="fs-16 text-white-30 fw-200" content="bank_frick" component={Text} />
                <Text className="fs-16 text-white-30 fw-200">$1.00 min</Text>
            </div>
            <div className="wire-trans mb-24">
                <Translate className="fs-16 text-white-30 fw-200 text-upper" content="sepa" component={Text} />
                <Translate className="fs-16 text-white-30 fw-200" content="no_fee" component={Text} />
            </div>
            <div className="wire-trans">
                <Translate className="fs-16 text-white-30 fw-200" content="fidor_bank" component={Text} />
                <Text className="fs-16 text-white-30 fw-200">$10.00 min</Text>
            </div>
            <div className="wire-trans mb-24">
                <Translate className="fs-16 text-white-30 fw-200 text-upper" content="sepa" component={Text} />
                <Text className="fs-16 text-white-30 fw-200">No fee</Text>
            </div>
            <div className="wire-trans">
                <Translate className="fs-16 text-white-30 fw-200 text-upper" content="bank_frick" component={Text} />
                <Text className="fs-16 text-white-30 fw-200">$4.00 min</Text>
            </div>
            <div className="wire-trans mb-24">
                <Translate className="fs-16 text-white-30 fw-200 text-upper" content="swift" component={Text} />
                <Text className="fs-16 text-white-30 fw-200">$3.00 fee</Text>
            </div>

        </>
        )
    }
}

export default WireTransfer;
