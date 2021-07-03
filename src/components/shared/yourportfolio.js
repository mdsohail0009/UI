import React, { Component } from 'react';
import config from '../../config/config';
import { Link } from 'react-router-dom';
import { CaretDownOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { List, Button, Input, Carousel, Drawer, Dropdown, Typography } from 'antd';
import Translate from 'react-translate-component';
import { setStep } from '../../reducers/buysellReducer';
import { connect } from 'react-redux';

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
                            <div className="crypto_btns">
                                <Translate content="buy" component={Button} type="primary" onClick={() => this.props.changeStep('step10')} className="custom-btn prime" />
                                <Translate content="sell" component={Button} className="custom-btn sec outline ml-16" />
                            </div>
                        }>
                            <List.Item.Meta
                                avatar={<span className={`coin ${item.coin}`} />}
                                title={<div className="fs-18 fw-300 text-upper text-white mb-0 mt-12">{item.coin}</div>}
                            />

                            <div className={`text-right fs-20 ${item.up ? 'text-green' : 'text-red'}`}>{item.up ? <span className="icon md gain mr-8" /> : <span className="icon md lose mr-8" />}{item.up ? item.gain : item.loss}%</div>
                            {/* <div className="fs-16 text-white-30 fw-300 ml-24  text-upper ">{item.totalcoin} {item.shortcode}</div> */}
                        </List.Item>
                    )}
                />

            </div>
        );
    }
}
const connectStateToProps = ({ buySell, oidc }) => {
    return { buySell }
}
const connectDispatchToProps = dispatch => {
    return {
        changeStep: (stepcode) => {
            dispatch(setStep(stepcode))
        }
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(YourPortfolio);
