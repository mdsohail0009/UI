import React, { Component } from 'react';
import { Card, Typography,Row,Col,Avatar, List } from 'antd';
const data = [
    {
      title: 'Ant Design Title 1',
    },
    {
      title: 'Ant Design Title 2',
    },
  ];
const { Text,Title, Paragraph } = Typography;
class SbCard extends Component {

    render() {
        return (<>
                <div className='sb-accounts'>
                   <Row gutter={[16,16]}>
                    <Col xs={24} md={12} className=''>
                        <List
                            itemLayout="horizontal"
                            dataSource={data}
                            renderItem={(item) => (
                                <List.Item>
                                    <List.Item.Meta
                                        avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                                        title={<a href="https://ant.design">{item.title}</a>}
                                        description="Ant Design, a design language for background applications, is refined by Ant UED Team"
                                    />
                                </List.Item>
                            )}
                        />
                    </Col>
                    <Col xs={24} md={12} className=''>

                    </Col>
                   </Row>
                </div>
        </>);
    }

}
export default SbCard;