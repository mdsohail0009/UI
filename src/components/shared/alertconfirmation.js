import React, { Component } from 'react';
import { Typography,Card,List, Avatar,Alert } from 'antd';
import { CloseOutlined } from '@ant-design/icons';
import success from '../../assets/images/success.png';
import { Link } from 'react-router-dom';

const { Title, Paragraph} = Typography;
const data = [
    {
      title: 'Transaction Submitted ',
      description: 'Swapped 0.00549635 BTC for 0.10183318 ETH'
    },
]
class AlertConfirmation extends Component {
    render() {
        return (
            <>
            {/* <Alert className="alert-popup"
      message="Transaction Submitted"
      description="Swapped 0.00549635 BTC for 0.10183318 ETH"
      type="success"
      showIcon={<img src={success} className="alert-success" />}
      closable
      actions={[<CloseOutlined className="fs-24 mb-24 alert-close" />]}
    /> */}
                <Card className="alert-popup">
                    <div>
                    <List 
    itemLayout="horizontal"
    dataSource={data}
    renderItem={item => (
      <List.Item actions={[<CloseOutlined className="fs-24 mb-24 alert-close" />]}>
        <List.Item.Meta
          avatar={<img src={success} className="alert-success " />}
          title={<Title className="fs-24 fw-600 mb-0">{item.title}</Title>}
          description={<div className="fw-400 fs-12 text-textDark">{item.description}</div>}
        />
      </List.Item>
    )}
  />
                    
                    </div>
                </Card> 
            </>
        )
    }
}
export default AlertConfirmation;