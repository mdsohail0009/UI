import React, { Component } from 'react';
import { Card, Typography,Row,Col } from 'antd';

const { Text,Title, Paragraph } = Typography;
class SbCard extends Component {

    render() {
        return (<>
                <div className='sb-accounts'>
                   <Row gutter={[16,16]}>
                    <Col xs={24} md={12} className=''>
                    
                    </Col>
                    <Col xs={24} md={12} className=''>
                    
                    </Col>
                   </Row>
                </div>
        </>);
    }

}
export default SbCard;