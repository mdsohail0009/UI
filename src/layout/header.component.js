import React, { Component } from 'react';
import { Layout, Menu, Modal, Typography, Row, Col, Divider, Dropdown, Avatar } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import logo from '../assets/images/tlv/logo.png';
import logoWhite from '../assets/images/tlv/logo-white.png';
import megamenu from '../assets/images/tlv/megamenu.png';
import BuySell from '../components/buysell.component';

const { Header:AntHeader } = Layout;
const { Title, Paragraph } = Typography;
const menu = (
    <Menu>
        <Row>
            <Col span={18}>
                <Title className="fs-36 text-white mb-16 fw-500">Security</Title>
                <Paragraph className="text-white fs-14">CURRENT SECURITY LEVEL<br /><span className="text-green fw-700">Medium</span></Paragraph>
            </Col>
            <Col span={6}><Avatar size={62}></Avatar></Col>
        </Row>
        <Paragraph className="text-white fs-14">Your account has security features switched off, leaving it potentially vulnerable to specific attacks. Set up these security features to improve the security of your account.</Paragraph>
        <Avatar size={30} className="mr-8"></Avatar><span className="text-white">Protect your account<RightOutlined className="ml-12" /></span>
    </Menu>
);

class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            megamenu: false,
        }
    }

    showMegaMenu = () => {
        this.setState({
            megamenu: true
        })
    }
    closeMegaMenu = () => {
        this.setState({
            megamenu: false
        })
    }

    render() {
        return (
            <Layout className="layout">
                <AntHeader className="p-0 tlv-header">
                    <img src={logo} alt="logo" className="tlv-logo" />
                    <Menu theme="light" mode="horizontal" className="header-right mobile-header-right">
                        <Menu.Item key="1">Security</Menu.Item>
                        <Menu.Item key="2"><span className="icon md bell" /></Menu.Item>
                        <Menu.Item key="3"><span className="icon md gear" /></Menu.Item>
                    </Menu>
                    <div className="mid-menu">
                        <a className="ant-dropdown-link header-dropdown" onClick={this.showMegaMenu}>
                            Home<span className="icon md downarrow ml-12" />
                        </a>
                        <Modal
                            title={[<div className="megamenu-title fs-24 text-white"><img src={logoWhite} alt="logo" className="tlv-logo" /><Link className="text-white">Sign in</Link></div>]}
                            visible={this.state.megamenu}
                            onCancel={this.closeMegaMenu}
                            footer={null}
                            wrapClassName="megamenu-backdrop"
                            className="megamenu"
                            closeIcon={<span className="icon xl closewhite" />}
                        >
                            <Row gutter={[16, 16]} className="megamenu-link">
                                <Col lg={1} xl={1} />
                                <Col lg={6} xl={4}>
                                    <Title className="text-white megamenu-label mb-16 fw-500">Start</Title>
                                    <Paragraph className="text-white fs-14 mb-24">We are a platform that connects banks, payment systems, and people.</Paragraph>
                                    <Link>The Dashboard</Link>
                                    <Link>Your Portfolio</Link>
                                </Col>
                                <Col lg={6} xl={5}>
                                    <Title className="text-white megamenu-label mb-16 fw-500">Buy and Sell</Title>
                                    <Paragraph className="text-white fs-14 mb-24">Use our Visa and Mastercards to convert, spend your crypto and traditional currency in real life.</Paragraph>
                                    <Link>Send and Receive</Link>
                                    <Link>Swap</Link>
                                </Col>
                                <Col lg={6} xl={4}>
                                    <Title className="text-white megamenu-label mb-16 fw-500">Spend</Title>
                                    <Paragraph className="text-white fs-14 mb-24">Use our Visa and Mastercards to convert, spend your crypto and traditional currency in real life.</Paragraph>
                                    <Link>Cards</Link>
                                    <Link>Exchange</Link>
                                </Col>
                                <Col xl={1} />
                                <Col lg={3} xl={3} className="pt-24">
                                    <img src={megamenu} alt="logo" />
                                </Col>
                            </Row>
                            <Row>
                                <Col lg={1} xl={1} />
                                <Col lg={23} xl={16}>
                                    <Divider className="megamenu-divider" />
                                </Col>
                            </Row>
                            <Row gutter={[16, 16]} className="megamenu-sublink">
                                <Col lg={1} xl={1} />
                                <Col lg={5} xl={4}>
                                    <Title className="fs-36 text-white mb-16 fw-500">Learn</Title>
                                    <Link>What is Cryptocurrency?</Link>
                                    <Link>What is Staking?</Link>
                                    <Link>Who is Satoshi?</Link>
                                    <Link>View All</Link>
                                </Col>
                                <Col lg={5} xl={4}>
                                    <Title className="fs-36 text-white mb-16 fw-500">Explore</Title>
                                    <Link>Everything</Link>
                                    <Link>Education</Link>
                                    <Link>News</Link>
                                    <Link>Get more crypto</Link>
                                </Col>
                                <Col lg={7} xl={4}>
                                    <Title className="fs-36 text-white mb-16 fw-500">Security</Title>
                                    <Paragraph className="text-white fs-14">CURRENT SECURITY LEVEL<br /><span className="text-green fw-700">Medium</span></Paragraph>
                                    <Paragraph className="text-white fs-14">Your account has security features switched off, leaving it potentially vulnerable to specific attacks. Set up these security features to improve the security of your account.</Paragraph>
                                </Col>
                                <Col xl={2} />
                                <Col lg={5} xl={3}>
                                    <Title className="fs-36 text-white mb-16 fw-500">Connect</Title>
                                    <Link>Meet Our Team</Link>
                                    <Link>Report A Bug</Link>
                                    <Link>FAQ</Link>
                                    <Link>Contact Us</Link>
                                    <Link >Sign In</Link>
                                </Col>
                            </Row>
                        </Modal>
                        <Menu theme="light" mode="horizontal" className="main-menu">
                            <Menu.Item key="1" onClick={this.props.onShowBuyDrawer}>Buy / Sell</Menu.Item>
                            <Menu.Item key="2">Swap</Menu.Item>
                            <Menu.Item key="3">Send / Receive</Menu.Item>
                            <Menu.Item key="4">Cards</Menu.Item>
                        </Menu>
                        <BuySell />
                    </div>
                    <Menu theme="light" mode="horizontal" className="header-right">
                        <Dropdown overlay={menu} trigger={['click']} placement="topRight" arrow overlayClassName="secureDropdown">
                            <Menu.Item key="1">Security</Menu.Item>
                        </Dropdown>
                        <Menu.Item key="2"><span className="icon md bell" /></Menu.Item>
                        <Menu.Item key="3"><span className="icon md gear" /></Menu.Item>
                    </Menu>
                </AntHeader>
            </Layout >
        );
    }
}

export default Header;