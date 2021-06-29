import React, { Component } from 'react';
import config from '../../config/config';
import { Link } from 'react-router-dom';
import { CaretDownOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { List, Button, Input, Carousel, Drawer, Dropdown, Typography } from 'antd';
import Translate from 'react-translate-component';


class YourPortfolio extends Component {
    state = {
        loading: false,
        initLoading: true,
        visible: false,
    }
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
        const { Title, Paragraph, Text } = Typography;
        return (
            <div className="box portfolio-list">
                <Translate content="your_portfolio" component={Title} className="fs-24 text-white py-20 pt-0" />
                <List
                    itemLayout="horizontal"
                    dataSource={config.tlvCoinsList}
                    renderItem={item => (
                        <List.Item className="" extra={
                            <div className="ml-16">
                                 <Translate content="buy" component={Button} type="primary" onClick={this.showDrawer} className="custom-btn prime fs-14 btn-primary  ml-24" />
                                <Translate content="sell" component={Button} className="custom-btn outline-btn fs-14 ml-12" />
                                {/* <Button className="custom-btn prime fs-14 btn-primary  ml-24" onClick={this.showDrawer}>Buy</Button> */}
                                <Drawer className="custom-drawer text-white"
                                    title={<div className="d-flex">
                                        <ArrowLeftOutlined className="text-white" />
                                        {/* <div className="">
                                     <div>Buy ETH</div>
                                     <div>1ETH - $2,495.31</div>
                                 </div>
                                 <div>
                                     
                                 </div> */}
                                    </div>}
                                    width={500} closable={false} onClose={this.onClose} visible={this.state.visible}>fdhf</Drawer>
                                {/* <Button className="custom-btn outline-btn fs-14 ml-12">Sell</Button> */}
                            </div>
                        }>
                            <List.Item.Meta
                                avatar={<span className={`coin ${item.coin}`} />}
                                title={<div className="fs-18 fw-300   text-upper text-white mb-0 mt-8">{item.coin}</div>}
                            />
                             {item.up ? <span className="icon sm uparrow " /> : <span className="icon sm downarrow ml-12" />}
                             <div className={item.up ? 'text-green ml-12' : 'text-red ml-12'}>-{item.loss}</div>
                                <div className="fs-16  text-white-30 fw-300 ml-24  text-upper ">{item.totalcoin} {item.shortcode}</div>
                           
                            {/* <Text className="fs-16 text-secondary fw-600 text-right ml-12">-2%</Text>
                            <Text className="fs-16 text-secondary  fw-600 text-right  ml-12">1.10 XML</Text> */}
                        </List.Item>
                    )}
                />

            </div>
        );
    }
}

export default YourPortfolio;