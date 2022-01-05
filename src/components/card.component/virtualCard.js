import React, { Component } from 'react'
import { Card, Row, Col, Typography,Tabs,List,Image } from 'antd';
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const data = [
    {
      title: 'Ant Design Title 1',
    },
]
class VirtualCard extends Component {
state={

}
render() {
    return (<>
                <Card  className="card-module crypto-card mb-16 c-pointer" bordered={false} >
                        <Row gutter={24}>
                            <Col span={12}>
                                <div className="align-center">
                                    <Paragraph className="fs-22 fw-600 text-purewhite ml-8 mb-0">272.48 USD</Paragraph>
                                    <Paragraph className="fs-18 fw-500 text-purewhite ml-8 mb-0">Avilable</Paragraph>
                                </div>
                            </Col>
                            <Col span={12}>
                                <div className="align-center">
                                    <Paragraph className="fs-22 fw-600 text-purewhite ml-8 mb-0">177.52 USD</Paragraph>
                                    <Paragraph className="fs-18 fw-500 text-purewhite ml-8 mb-0">Spent</Paragraph>
                                </div>
                            </Col>
                        </Row>
                        <div className="text-white">
                            <div className="fs-28 fw-400">XXXX  XXXX  XXXX  4578</div>
                            <div className='text-right valid-time'>Valid Upto 02/23</div>
                        </div>
                        <div className="text-white cardholder-name fw-600">
                            Suisse - Jhon Doe
                        </div>
                </Card>
    </>)
}
}

export default VirtualCard;