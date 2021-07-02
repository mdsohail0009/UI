import React, { Component } from "react";
import { Typography, Button, Tooltip } from "antd";
import { Link } from "react-router-dom";

class WiriTransfer extends Component {
  render() {
    const { Title, Paragraph, Text } = Typography;
    return (<>
            <div className="pb-12 mb-16">
                <div className="d-flex justify-content">
                    <Paragraph className="mb-0 text-white-30 text-upper">Fidor Bank AG</Paragraph>
                    <Paragraph className="text-white-50 mb-0 fw-300" > $1.00 min</Paragraph>
                </div>
                <div className="d-flex justify-content">
                    <Paragraph className="mb-0 text-white-30 text-upper">SEPA</Paragraph>
                    <Paragraph className="text-white-50 mb-0 fw-300" > No fee</Paragraph>
                </div>
                    <Paragraph className="recomoned-bg">RECOMMENDED</Paragraph>
            </div>
            <div className="pb-12">
                <div className="d-flex justify-content">
                    <Paragraph className="mb-0 text-white-30 text-upper">Bank Frick</Paragraph>
                    <Paragraph className="text-white-50 mb-0 fw-300" > $1.00 min</Paragraph>
                </div>
                <div className="d-flex justify-content">
                    <Paragraph className="mb-0 text-white-30 text-upper">SEPA</Paragraph>
                    <Paragraph className="text-white-50 mb-0 fw-300" > No fee</Paragraph>
                </div>
            </div>
    </>
    )
  }
}

export default WiriTransfer;
