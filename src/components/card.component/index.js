import React, { Component } from 'react'
import { Card, Row, Col, Typography,Tabs,List,Image,Carousel,Badge  } from 'antd';
import VirtualCard from './virtualCard';
import logoWhite from '../../assets/images/logo-white.png';
import creditCard  from '../../assets/images/credit-card.png';
import PhysicalCard from './physicalCard';
import Transactions from './transactions';
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const data = [
    {
      title: 'Ant Design Title 1',
    },
]
function onChange(a, b, c) {
    console.log(a, b, c);
  }
  
  const contentStyle = {
    height: '160px',
    color: '#fff',
    lineHeight: '160px',
    textAlign: 'center',
    background: '#364d79',
  };
class CardsModule extends Component {
state={
}
render() {
    return (<>
    <div className="main-container db-container text-center">
    <Title className="fs-42 text-center text-white megamenu-label mb-8 fw-500">Welcome To Your Cards</Title>
    <Paragraph className='fs-14 text-center text-white'>Select card to check spends and avilable limit</Paragraph>

    <div>
    <Tabs defaultActiveKey="1" centered className='text-white card-list mt-24'>
        <TabPane tab={<span className='tab-block fs-16'> <span className="icon xl overview mb-16 mx-auto"></span> <span>Overview</span></span>} key="1" > 
            <div className='wallet-total mx-auto p-24 my-30'>
                <List 
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (
                <List.Item className='p-0'>
                    <List.Item.Meta 
                    avatar={<span className="icon xxl wallet-icon"></span>}
                    title={<div className="fs-26 fw-400 text-white-30">Total Blance</div>}
                    description={<div className="fs-32 fw-600 text-white">1,200 USD</div>}
                    />
                </List.Item>
                )}
            />
            </div>
            <div className='text-left'>
                <div className='pt-16 mt-36 mb-28'>
                    <Title className='fs-22 fw-600 mb-8 text-white-30'>Know Your Card</Title>
                    {/* <Paragraph className='text-white-50 fs-16 mb-0 l-height-normal'>Select card to check spends and avilable limit</Paragraph> */}
                </div>
                
                <div className="site-card-wrapper">
                    <Row gutter={24}>
                    {/* <Carousel autoplay> */}
                    <Col span={8}>
                        <Card  className="card-module crypto-card mb-16 c-pointer" bordered={false} >
                            <Row gutter={24}>
                                <Col span={12}>
                                    <div className="align-center">
                                        <Paragraph className="fs-22 fw-600 text-purewhite ml-8 mb-0">177.52 USD</Paragraph>
                                        <Paragraph className="fs-18 fw-500 text-purewhite ml-8 mb-0">Spent</Paragraph>
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
                            <div className="fs-28 fw-400">XXXX  XXXX  XXXX  4578</div>
                            <div className='text-right valid-time'>Valid Upto 02/23</div>
                        </div>
                    </Card>
                    </Col>
                    <Col span={8}>
                        <Card  className="card-module crypto-card mb-16 c-pointer" bordered={false} >
                            <Row gutter={24}>
                                <Col span={12}>
                                    <div className="align-center">
                                        <Paragraph className="fs-22 fw-600 text-purewhite ml-8 mb-0">100.82 USD</Paragraph>
                                        <Paragraph className="fs-18 fw-500 text-purewhite ml-8 mb-0">Spent</Paragraph>
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
                            <div className="fs-28 fw-400">XXXX  XXXX  XXXX  2693</div>
                            <div className='text-right valid-time'>Valid Upto 06/23</div>
                        </div>
                    </Card>
                    </Col>
                    <Col span={8}>
                        <Card  className="virtual-card crypto-card mb-16 c-pointer" bordered={false} >
                            <Row gutter={24}>
                                <Col span={12}>
                                    <div className="align-center">
                                        {/* <Paragraph className="fs-18 fw-500 text-purewhite ml-8 mb-0">Avilable</Paragraph> */}
                                        <Badge className="ant-badge badge radius16 bggreen text-white-30 fs-10 px-16 py-4 l-height-normal fw-300">Active</Badge>
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
                            <div className="fs-28 fw-400">XXXX  XXXX  XXXX  2693</div>
                            <div className='text-right valid-time'>Valid Upto 06/23</div>
                        </div>
                        </Card>
                    </Col>
                     {/* </Carousel> */}
                    </Row>
                </div>
            </div>
        </TabPane>
        <TabPane tab={<span className='tab-block fs-16'> <span className="icon xl physical-card mb-16 mx-auto"></span> <span>Physical Cards</span></span>}key="2"> 
            <div className="site-card-wrapper text-left my-30">
                <PhysicalCard />
                {/* <Row gutter={24} className='my-16'>
                    <Col span={8}>
                        <Card  className="virtual-card crypto-card mb-16 c-pointer" bordered={false} >
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <div className="align-center">
                                        <Badge className="ant-badge badge radius16 bggreen text-white-30 fs-10 px-16 py-4 l-height-normal fw-300">Active</Badge>
                                        </div>
                                        </Col>
                                    <Col span={12}>
                                        <div className="text-right">
                                        <img src={logoWhite} alt="logo" className="tlv-logo dark" alt={"image"} />
                                        </div>
                                    </Col>
                                </Row>
                                <div className="text-white">
                                <span className="coin lg ETH"></span>
                                <div className="fs-28 fw-400">XXXX  XXXX  XXXX  2693</div>
                            </div>
                        </Card>
                    </Col>
                    <Col span={8}>
                        <Card  className="virtual-card crypto-card mb-16 c-pointer" bordered={false} >
                                <Row gutter={24}>
                                    <Col span={12}>
                                        <div className="align-center">
                                        <Badge className="ant-badge badge radius16 bgred text-white-30 fs-10 px-16 py-4 l-height-normal fw-300">Inactive</Badge>
                                        </div>
                                        </Col>
                                    <Col span={12}>
                                        <div className="text-right">
                                        <img src={logoWhite} alt="logo" className="tlv-logo dark" alt={"image"} />
                                        </div>
                                    </Col>
                                </Row>
                                <div className="text-white">
                                <span className="coin lg ETH"></span>
                                <div className="fs-28 fw-400">XXXX  XXXX  XXXX  2693</div>
                            </div>
                        </Card>
                    </Col>
                </Row> */}
            </div>
        </TabPane>
        <TabPane tab={<span className='tab-block fs-16'> <span className="icon xl virtual-card mb-16 mx-auto"></span> <span>Virtual Cards</span></span>} key="3" > 
            <div className="site-card-wrapper text-left my-30">
               <VirtualCard/>
            </div>
        </TabPane>
        <TabPane tab={<span className='tab-block fs-16'> <span className="icon xl settings mb-16 mx-auto"></span> <span>Transactions</span></span>}key="4"> 
             <Transactions />
                    
        </TabPane>
    </Tabs>
    </div>
    </div>
    </>)
}
}

export default CardsModule;