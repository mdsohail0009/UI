import React from "react"
import comingsoon from '../../assets/images/comingsoon.png'
import {Typography} from "antd";

const { Text } = Typography;

const InternalTransfer = () => {

    return <div className="text-center intertrans">
        <div className="">
        <img src={comingsoon} className="" style={{ marginBottom: '10px' }} alt="Confirm" />
        <div><Text className="db-titles internal-titles">Coming soon</Text></div>
        </div>

        </div>

}
export default InternalTransfer;