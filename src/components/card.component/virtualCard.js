import React, { Component } from 'react'
import { Card, Row, Col, Typography, Badge } from 'antd';
import VirtualDetailView from './virtualDetailView';
import { Link } from "react-router-dom";
const {Paragraph, Text } = Typography;

class VirtualCard extends Component {
state={
    VirtualCards: true,
    VirtualDetailView:false,

    virtualCardData: [
        
        {
        avilableBal: "272.48",
        avilableCode: "USD",
        spentBal: "177.52",
        spentCode: "USD",
        accountNo:"XXXX  XXXX  XXXX  4578",
        validDate:"02/23",
        UserName:"Jhon Doe"
       },
       {
        avilableBal: "400.5",
        avilableCode: "USD",
        spentBal: "100.82",
        spentCode: "USD",
        accountNo:"XXXX XXXX XXXX 2693",
        validDate:"06/23",
        UserName:"Jhon Doe"
       },
       {
        avilableBal: "100.18",
        avilableCode: "USD",
        spentBal: "30.82",
        spentCode: "EUR",
        accountNo:"XXXX XXXX XXXX 1293",
        validDate:"08/23",
        UserName:"Jhon Doe"
       },
       {
        avilableBal: "1000.30",
        avilableCode: "USD",
        spentBal: "500",
        spentCode: "GBP",
        accountNo:"XXXX XXXX XXXX 1293",
        validDate:"08/23",
        UserName:"Jhon Doe"
       },
       {
        avilableBal: "800",
        avilableCode: "USD",
        spentBal: "200",
        spentCode: "GBP",
        accountNo:"XXXX XXXX XXXX 1241",
        validDate:"01/23",
        UserName:"Jhon Doe"
       },
       {
        avilableBal: "900",
        avilableCode: "USD",
        spentBal: "600",
        spentCode: "GBP",
        accountNo:"XXXX XXXX XXXX 9041",
        validDate:"09/23",
        UserName:"Jhon Doe"
       },
]
}
handelVirtualDetailView=()=>{
    this.setState({VirtualCards:false, VirtualDetailView: true})
}
handelvirtualCardBack=()=>{
    this.setState({VirtualCards:true, VirtualDetailView: false})
}

render() {
    return (<>

       { this.state.VirtualCards && <Row gutter={24} className='my-16' onClick={() => this.handelVirtualDetailView()}>
            {this.state.virtualCardData.map((item, idx) =>
                <Col span={8} key={idx}>
                    <Card  className="card-module crypto-card mb-16 c-pointer" bordered={false} >
                        <Row gutter={24} >
                            <Col span={12}>
                                <div className="align-center">
                                    <Paragraph className="fs-22 fw-600 text-purewhite ml-8 mb-0">{item.avilableBal}{item.avilableCode}</Paragraph>
                                    <Paragraph className="fs-18 fw-500 text-purewhite ml-8 mb-0">Avilable</Paragraph>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="align-center">
                                    <Paragraph className="fs-22 fw-600 text-purewhite ml-8 mb-0">{item.spentBal}{item.spentCode}</Paragraph>
                                    <Paragraph className="fs-18 fw-500 text-purewhite ml-8 mb-0">Spent</Paragraph>
                                </div>
                            </Col>
                            <Col span={24}>
                                <div className="text-white mt-24 mb-16">
                                    <div className="fs-28 fw-400">{item.accountNo}</div>
                                    <div className='text-right valid-time'>Valid Upto {item.validDate}</div>
                                </div>
                                <div className="text-white cardholder-name fw-600">Suisse - {item.UserName}</div>
                            </Col>
                        </Row>
                    </Card>
                </Col>)}
        </Row>}
        {this.state.VirtualDetailView && <>
            <div className="mb-36 text-white-50 fs-24 d-flex justify-start mt-4"><Link className="icon md cardleftarrow mr-16 c-pointer" onClick={() => this.handelvirtualCardBack()}/><div><div className='l-height-normal fs-26'>Suisse -  Jhon Doe</div><Badge className="ant-badge badge radius16 bggreen text-white-30 fs-10 px-16 py-4 l-height-normal fw-300">Active</Badge></div></div>
            <VirtualDetailView />
        </>}
    </>)
}
}

export default VirtualCard;