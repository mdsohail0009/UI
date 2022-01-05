import React, { Component } from 'react'
import { Card, Row, Col, Typography,Tabs,List,Image } from 'antd';
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const data = [
    {
      title: 'Ant Design Title 1',
    },
]
class PhysicalCard extends Component {
state={

}
render() {
    return (<>
            <Card  className="virtual-card crypto-card mb-16 c-pointer" bordered={false} >
                <Row gutter={24}>
                    <Col span={12}>
                        <div className="align-center">
                            <Paragraph className="fs-18 fw-500 text-purewhite ml-8 mb-0">Avilable</Paragraph>
                        </div>
                    </Col>
                    <Col span={12}>
                        <div className="text-right">
                            <Image width={75} src="https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg" />
                        </div>
                    </Col>
                </Row>
                    <div className="text-white">
                        <span className="coin lg ETH"></span>
                        <div className="fs-28 fw-400">XXXX  XXXX  XXXX  2693</div>
                    </div>
            </Card>
    </>)
}
}

export default PhysicalCard;