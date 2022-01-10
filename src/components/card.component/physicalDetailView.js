import React,{Component} from 'react';
import { Card, Row, Col, Typography, Image, Progress,Drawer,Button,Input,Form  } from 'antd';
import logoWhite from '../../assets/images/logo-white.png';
import NumberFormat from "react-number-format";
const {Paragraph, Text, Title } = Typography;


class PhysicalDetailView extends Component {
  
    state = { 
        visible:'false',
        placement: 'right'
     };

  showDrawer = () => {
      debugger
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

render() {
    return (<>
            <Row gutter={24} className='mt-16 card-progress'>
                <Col lg={8} xl={8} xxl={8}>
                    <Card  className="virtual-card crypto-card mb-16 c-pointer" bordered={false} >
                        <Row gutter={24}>
                            <Col span={12}>
                                <div className="align-center">
                                    <Paragraph className="fs-18 fw-500 text-purewhite ml-8 mb-0">Avilable</Paragraph>
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
                            <div className="fs-28 fw-400">XXXX  XXXX  XXXX  4578</div>
                        </div>
                    </Card>
                </Col>
                <Col lg={16} xl={16} xxl={16} className='pl-30'>
                <Row gutter={24} className='mb-16'>
                        <Col span={8}>
                                <div className="d-flex align-start">
                                    <div style={{width:'12px',height:'12px',borderRadius:'50%',backgroundColor:'#B0F07D',marginTop:'5px'}}></div>
                                   <div className='l-height-normal'>
                                    <Paragraph className="fs-20 fw-500 text-purewhite ml-8 mb-0">272.48 USD</Paragraph>
                                    <Paragraph className="fs-12 fw-300 text-purewhite ml-8 mb-0">Avilable</Paragraph>
                                    </div>
                                </div>
                        </Col>
                        <Col span={16}>
                                <div className="d-flex align-start">
                                <div style={{width:'12px',height:'12px',borderRadius:'50%',backgroundColor:'#F81506',marginTop:'5px'}}></div>
                                   <div className='l-height-normal'>
                                    <Paragraph className="fs-20 fw-500 text-purewhite ml-8 mb-0">177.52 USD</Paragraph>
                                    <Paragraph className="fs-12 fw-300 text-purewhite ml-8 mb-0">Spent</Paragraph>
                                </div>
                                </div>
                        </Col>
                    </Row>
                    <Progress percent={100} success={{ percent: 50 }} showInfo={false} width={100}/>
                    <div className="mb-0 mt-24 text-white-50 l-height-normal fs-26">Jhon Doe</div>
                    <Paragraph className="text-white-50 fw-300 fs-12 mb-24">Holder Name</Paragraph>
                    <Row gutter={24} justify="start" className='my-16'>
                        <Col span={12}>
                            <div className="m-0 d-flex justify-content">
                                <div className="">
                                    <Paragraph className="fs-20 fw-500 text-purewhite ml-8 mb-0">PTPL</Paragraph>
                                    <Paragraph className="fs-12 fw-300 text-purewhite ml-8 mb-0">Budget</Paragraph>
                                </div>
                                <div className="">
                                    <Paragraph className="fs-20 fw-500 text-purewhite ml-8 mb-0">09/23</Paragraph>
                                    <Paragraph className="fs-12 fw-300 text-purewhite ml-8 mb-0">Valid Upto</Paragraph>
                                </div>
                                <div className="">
                                    <Paragraph className="fs-20 fw-500 text-purewhite ml-8 mb-0">457 USD</Paragraph>
                                    <Paragraph className="fs-12 fw-300 text-purewhite ml-8 mb-0">Card Balance</Paragraph>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Col>
            </Row>
            <Row gutter={24}>
                <Col flex={2}>
                <div className='d-flex justify-center'>
                    <div className='virtival-icons'>
                        <span className="icon lg card-view" />
                        <div className="fw-300 fs-12">View</div>
                    </div>
                    <div className='virtival-icons'>
                        <span className="icon lg card-block" />
                        <div className="fw-300 fs-12">Block</div>
                    </div>
                    <div className='virtival-icons' onClick={() => this.showDrawer()} >
                        <span className="icon lg card-settings" />
                        <div className="fw-300 fs-12" >Settings</div>
                    </div>
                </div>
                </Col>
                <Col flex={3}></Col>
            </Row>
            <Row gutter={24} className='my-16'>
            <Col span={24}>
                    <div className="virtual-box mt-16 py-24 coin-details right">
                        <Title component={Title} className="fs-24 fw-600 mb-4 text-white-30">Know Your Card Transactions</Title>
                        <Paragraph className="text-white-50 fw-300 fs-12 mb-24">Check spends and avilable limit</Paragraph>  
                            <div className="card-info">
                                <Paragraph className='mb-0 text-left'>02 Dec 2021</Paragraph>
                                <Paragraph className='mb-0 text-left'>Ref # 187168819874</Paragraph>
                                <Paragraph className='mb-0 text-left'>Paragon Shopping</Paragraph>
                                <Paragraph className='mb-0 text-left'>$48.42</Paragraph>
                            </div>
                            <div className="card-info">
                                <Paragraph className='mb-0 text-left'>09 Dec 2021</Paragraph>
                                <Paragraph className='mb-0 text-left'>Ref # 187168887545</Paragraph>
                                <Paragraph className='mb-0 text-left'>Knightsbridge Mall</Paragraph>
                                <Paragraph className='mb-0 text-left'>$78.12</Paragraph>
                            </div>
                            <div className="card-info">
                                <Paragraph className='mb-0 text-left'>09 Dec 2021</Paragraph>
                                <Paragraph className='mb-0 text-left'>Ref # 187168887545</Paragraph>
                                <Paragraph className='mb-0 text-left'>Knightsbridge Mall</Paragraph>
                                <Paragraph className='mb-0 text-left'>$78.12</Paragraph>
                            </div>
                            <div className="card-info">
                                <Paragraph className='mb-0 text-left'>09 Dec 2021</Paragraph>
                                <Paragraph className='mb-0 text-left'>Ref # 187168887545</Paragraph>
                                <Paragraph className='mb-0 text-left'>Knightsbridge Mall</Paragraph>
                                <Paragraph className='mb-0 text-left'>$78.12</Paragraph>
                            </div>
                    </div>
                </Col>
            </Row>
            <div>
            <Drawer
          title={[<div className="side-drawer-header text-white d-flex justify-content align-center">
              <span className="icon md lftarw-white c-pointer"></span>
              <Title className="fs-18 fw-600 text-white-30">Settings</Title>
              <span className="icon md close-white c-pointer" />
              </div>]}
          className="side-drawer"
          onClose={this.onClose}
          visible={this.state.visible}
          destoryOnClose={true}
        >
          <Paragraph className='fs-16 text-white'>You can change Basic info, like your Limit and Recurring funds, Card Details</Paragraph>
            <Form>
                <Form.Item
                    name="toWalletAddress"
                    className="custom-forminput custom-label mb-16"
                    required
                    label="Card Blance">
                        <div className="p-relative ">
                            <Input suffix="SGD" className="text-left cust-input mb-0" placeholder="450" value={450} maxLength="250" />
                            <Paragraph className='text-white-50 fs-12 mt-4 ml-4'>This is the balance of the card till the time it expires. Blanace never resets</Paragraph>
                        </div>
                    </Form.Item>
                </Form>
          <Paragraph className='text-white-50 fs-18 fe-500'>Recurring Funds</Paragraph>
        </Drawer>
            </div>
    </>)
}

}
export default PhysicalDetailView;