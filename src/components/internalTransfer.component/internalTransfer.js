import React from "react"
import comingsoon from '../../assets/images/comingsoon.png'
import {Typography,Image } from "antd";

const { Paragraph, Text } = Typography;

const InternalTransfer = () => {

    return <div className="text-center intertrans">
        <div className="">
        <img src={comingsoon} className="confirm-icon" style={{ marginBottom: '10px' }} alt="Confirm" />
        <div><Text className="text-center fw-700 fs-40 textpure-yellow">Coming soon</Text></div>
        </div>

        </div>

}
export default InternalTransfer;