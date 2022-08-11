import React from "react"
import oops from '../../assets/images/oops.png'
import {Typography,Image } from "antd";

const { Paragraph, Text } = Typography;

const InternalTransfer = () => {

    return <div className="text-center intertrans">
        <div className="">
        <img src={oops} className="confirm-icon" style={{ marginBottom: '10px' }} alt="Confirm" />
        <div><Text className="text-center fw-700 fs-40 textpure-yellow">Coming soon</Text></div>
        </div>

        </div>

}
export default InternalTransfer;