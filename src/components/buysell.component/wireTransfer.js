import React, { Component } from "react";
import { Typography, Button, Tooltip } from "antd";

class WireTransfer extends Component {
    state = {}
    render() {
        const { Title, Paragraph, Text } = Typography;
        return (<>
            <div className="mb-24">
                <div className="wire-trans">
                    <Text className="fs-16 text-white-30 fw-200">Fidor Bank AG</Text>
                    <Text className="fs-16 text-white-30 fw-200">$1.00 min</Text>
                </div>
                <div className="wire-trans">
                    <Text className="fs-16 text-white-30 fw-200">SEPA</Text>
                    <Text className="fs-16 text-white-30 fw-200">No fee</Text>
                </div>
                <div className="text-right">
                    <Text className="recomnd-tag fs-14 text-upper text-white fw-500">RECOMMENDED</Text>
                </div>
            </div>
            <div className="wire-trans">
                <Text className="fs-16 text-white-30 fw-200">Bank Frick</Text>
                <Text className="fs-16 text-white-30 fw-200">$1.00 min</Text>
            </div>
            <div className="wire-trans mb-24">
                <Text className="fs-16 text-white-30 fw-200">SEPA</Text>
                <Text className="fs-16 text-white-30 fw-200">No fee</Text>
            </div>
            <div className="wire-trans">
                <Text className="fs-16 text-white-30 fw-200">Fidor Bank AG</Text>
                <Text className="fs-16 text-white-30 fw-200">$10.00 min</Text>
            </div>
            <div className="wire-trans mb-24">
                <Text className="fs-16 text-white-30 fw-200">SEPA</Text>
                <Text className="fs-16 text-white-30 fw-200">No fee</Text>
            </div>
            <div className="wire-trans">
                <Text className="fs-16 text-white-30 fw-200">Bank Frick</Text>
                <Text className="fs-16 text-white-30 fw-200">$4.00 min</Text>
            </div>
            <div className="wire-trans mb-24">
                <Text className="fs-16 text-white-30 fw-200">Swift</Text>
                <Text className="fs-16 text-white-30 fw-200">$3.00 fee</Text>
            </div>

        </>
        )
    }
}

export default WireTransfer;
