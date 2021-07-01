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
                <Translate content="your_portfolio" component={Title} className="fs-24 text-white mb-36 mt-0 fw-600" />
                <List
                    itemLayout="horizontal"
                    dataSource={config.portfilioList}
                    renderItem={item => (
                        <List.Item className="" extra={
                            <div className="ml-16 crypto-btns">
                                <Translate content="buy" component={Button} type="primary" onClick={this.showDrawer} className="custom-btn prime ml-36" />
                                <Translate content="sell" component={Button} className="custom-btn sec outline ml-16" />
                            </div>
                        }>
                            <List.Item.Meta
                                avatar={<span className={`coin ${item.coin}`} />}
                                title={<div className="fs-18 fw-300 text-upper text-white mb-0 mt-8">{item.coin}</div>}
                            />

                            <div style={{ width: 80 }} className={`text-right fs-24 ${item.up ? 'text-green' : 'text-red'}`}>{item.up ? <span className="icon md gain mr-8" /> : <span className="icon md lose mr-8" />}{item.up ? item.gain : item.loss}%</div>
                            {/* <div className="fs-16 text-white-30 fw-300 ml-24  text-upper ">{item.totalcoin} {item.shortcode}</div> */}
                        </List.Item>
                    )}
                />

            </div>
        );
    }
}

export default YourPortfolio;