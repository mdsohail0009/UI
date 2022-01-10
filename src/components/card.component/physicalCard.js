import React, { Component } from 'react'
import { Card, Row, Col, Typography,Tabs,List,Image,Badge } from 'antd';
import logoWhite from '../../assets/images/logo-white.png';
import { Link } from "react-router-dom";
import creditCard  from '../../assets/images/credit-card.png';
import PhysicalDetailView from './physicalDetailView';
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const data = [
    {
      title: 'Ant Design Title 1',
    },
]
class PhysicalCard extends Component {
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
            {this.state.virtualCardData.map((item, idx) =><Col span={8} key={idx}>
            <Card  className="virtual-card crypto-card mb-16 c-pointer" bordered={false} >
                <Row gutter={24}>
                    <Col span={12}>
                        <div className="align-center">
                        <Badge className="ant-badge badge radius16 bggreen text-white-30 fs-10 px-16 py-4 l-height-normal fw-300">Active</Badge>
                        {/* <Badge className="ant-badge badge radius16 bgred text-white-30 fs-10 px-16 py-4 l-height-normal fw-300">Active</Badge> */}
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="text-right">
                            <img src={logoWhite} alt="logo" className="tlv-logo dark" alt={"image"} />
                        </div>
                    </Col>
                </Row>
                    <div className="text-white">
                        <img src={creditCard} width={35} height={30} alt="logo" className="mb-8" alt={"image"} />
                        {/* <span className="coin lg ETH"></span> */}
                        <div className="fs-28 fw-400">{item.accountNo}</div>
                    </div>
            </Card>
            </Col>)}
            </Row>}
            {this.state.VirtualDetailView && <>
                <div className="mb-36 text-white-50 fs-24 d-flex justify-start mt-4"><Link className="icon md cardleftarrow mr-16 c-pointer" onClick={() => this.handelvirtualCardBack()}/><div><div className='l-height-normal fs-26'>Suisse -  Jhon Doe</div><Badge className="ant-badge badge radius16 bggreen text-white-30 fs-10 px-16 py-4 l-height-normal fw-300">Active</Badge></div></div>
                <PhysicalDetailView />
            </>}
    </>)
}
}

export default PhysicalCard;