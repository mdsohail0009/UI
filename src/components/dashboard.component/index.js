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
                            crypto_value='60,000.00 USD'
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
                    </Col>
                </Row>
            </div>
        );


    }
}

export default Home;