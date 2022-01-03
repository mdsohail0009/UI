import React, { Component } from 'react'
import { Card, Row, Col, Typography, Tooltip,Tabs,List,Avatar   } from 'antd';
import apiCalls from "../../api/apiCalls";
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { AppleOutlined, AndroidOutlined } from '@ant-design/icons';
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const data = [
    {
      title: 'Ant Design Title 1',
    },
]
class CardsModule extends Component {
state={

}
render() {
    return (<>
    <div className="main-container db-container text-center">
    <Title className="fs-42 text-center text-white megamenu-label mb-8 fw-500">Welcome To Your Cards</Title>
    <Paragraph className='fs-14 text-center text-white'>Select card to check spends and avilable limit</Paragraph>

    <div>
    <Tabs defaultActiveKey="1" centered className='text-white card-list'>
        <TabPane tab={<span className='tab-block'> <span className="coin lg ETH mb-16 mx-auto"></span> Overview</span>} key="1" > 
            <div className='wallet-total p-24 mt-36'>
                <List 
                itemLayout="horizontal"
                dataSource={data}
                renderItem={item => (
                <List.Item className='p-0'>
                    <List.Item.Meta 
                    avatar={<span className="coin lg ETH mb-16 mx-auto"></span>}
                    title={<div className="fs-26 fw-400 text-white-30">Total Blance</div>}
                    description={<div className="fs-32 fw-600 text-white">1,200 USD</div>}
                    />
                </List.Item>
                )}
            />
            </div>
        </TabPane>
        <TabPane tab={<span className='tab-block'> <span className="coin lg ETH mb-16 mx-auto"></span> Physical Cards</span>}key="2"> Tab 2</TabPane>
        <TabPane tab={<span className='tab-block'> <span className="coin lg ETH mb-16 mx-auto"></span> Virtual Cards</span>} key="3" > Tab 1 </TabPane>
        <TabPane tab={<span className='tab-block'> <span className="coin lg ETH mb-16 mx-auto"></span> Settings</span>}key="4"> Tab 2</TabPane>
    </Tabs>
    </div>
    </div>
    </>)
}
}

export default CardsModule;