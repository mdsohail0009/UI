import React, { Component } from 'react';
import { Row, Col, Typography, List, Button, Skeleton, Input, Carousel, Drawer, Dropdown } from 'antd';
import { CaretDownOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import chart from '../../assets/images/chart.png'
import graph from '../../assets/images/graph.png'
import { Link } from 'react-router-dom';
import { AudioOutlined } from '@ant-design/icons';
import config from '../../config/config';
import SuissebaseWallet from '../shared/suissebasewallet';
import Translate from 'react-translate-component';
import CryptoList from '../shared/cryptolist';
import Portfolio from '../shared/portfolio';
import Coins from '../shared/coins';
import YourPortfolio from '../shared/yourportfolio';

const { Search } = Input;
const { Title, Paragraph, Text } = Typography;

class Home extends Component {
    state = {
        loading: false,
        initLoading: true,
        visible: false,
        childrenDrawer: false,
    };
    showDrawer = () => {
        this.setState({
            visible: true,
        });
    };

    onClose = () => {
        this.setState({
            visible: false,
        });
    };

    showChildrenDrawer = () => {
        this.setState({
            childrenDrawer: true,
        });
    };

    onChildrenDrawerClose = () => {
        this.setState({
            childrenDrawer: false,
        });
    };
    render() {
        return (
            <div className="main-container">
                <Row justify="center">
                    <Col xs={24} md={12} xl={10}>
                        <div className="markets-panel mb-36">
                            <SuissebaseWallet />
                        </div>
                        <div className="box markets-panel">
                            <Translate content="markets_title" component={Title} className="fs-24 fw-700 mb-0 text-white-30" />
                            <Translate content="markets_subtitle" component={Paragraph} className="text-white-30 fs-16" />
                            <Search placeholder="Search Currency" size="middle" bordered={false} enterButton className="mt-24" />
                            <CryptoList />
                        </div>
                    </Col>
                    <Col xs={24} md={12} xl={14}>
                        <Portfolio
                            crypto="Bitcoin"
                            crypto_value='$60,000.00'
                            crypto_usd="1.0147658 USD"
                            crypto_stock="7.41 %" />

                        <Carousel autoplay className="mb-16">
                            <div className="p-28 carousel-card">
                                <Title className="fs-24 text-black mb-4">Get $10 in free crypto</Title>
                                <Paragraph className="fs-16 text-black mb-24">Setup a recurring buy of $50 or more and get $10 after your both 4th and 8th buys</Paragraph>
                                <Button className="custom-btn fs-14 prime mb-24">Set up recurring buy</Button>
                            </div>
                            <div className="p-28 carousel-card">
                                <Title className="fs-24 text-black mb-4">Get $10 in free crypto</Title>
                                <Paragraph className="fs-16 text-black mb-24">Setup a recurring buy of $50 or more and get $10 after your both 4th and 8th buys</Paragraph>
                                <Button className="custom-btn fs-14 prime mb-24">Set up recurring buy</Button>
                            </div>
                            <div className="p-28 carousel-card">
                                <Title className="fs-24 text-black mb-4">Get $10 in free crypto</Title>
                                <Paragraph className="fs-16 text-black mb-24">Setup a recurring buy of $50 or more and get $10 after your both 4th and 8th buys</Paragraph>
                                <Button className="custom-btn fs-14 prime mb-24">Set up recurring buy</Button>
                            </div>
                        </Carousel>
                        <Coins />
                        <YourPortfolio/>
                        {/* <img src={graph} width="100%" className="mb-16" /> */}
                        {/* <div className="box portfolio-list">
                            <Title className="fs-24 text-white mb-0">Your Portfolio</Title>
                            <List
                                itemLayout="horizontal"
                                dataSource={config.tlvCoinsList}
                                renderItem={item => (
                                    <List.Item className="" extra={
                                        <div>
                                            <Button className="custom-btn fs-14 btn-primary  ml-16" onClick={this.showDrawer}>Buy</Button>
                                            <Drawer className="custom-drawer text-white"
                                                title={<div className="d-flex">
                                                    <ArrowLeftOutlined className="text-white" />
                                                    <div className="">
                                                     <div>Buy ETH</div>
                                                     <div>1ETH - $2,495.31</div>
                                                 </div>
                                                 <div>
                                                     
                                                 </div>
                                                </div>}
                                                width={500} closable={false} onClose={this.onClose} visible={this.state.visible}>fdhf</Drawer>
                                            <Button className="outline-btn fs-14 btn-primary ml-12">Sell</Button></div>
                                    }>
                                        <List.Item.Meta
                                            avatar={<span className={`coin ${item.coin}`} />}
                                            title={<div className="fs-18 fw-600 text-captz text-white mb-0 mt-8">{item.title}</div>}
                                        />
                                        <Text className="fs-16 text-secondary fw-600 text-right ml-12">-2%</Text>
                                        <Text className="fs-16 text-secondary  fw-600 text-right  ml-12">1.10 XML</Text>
                                    </List.Item>
                                )}
                            />

                        </div> */}
                    </Col>
                </Row>
            </div>
        );


    }
}

export default Home;