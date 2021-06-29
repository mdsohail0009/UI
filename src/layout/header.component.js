import React, { Component } from 'react';
import { Layout, Menu, Modal, Typography, Row, Col, Divider, Dropdown, Avatar, Drawer } from 'antd';
import { RightOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import logo from '../assets/images/logo.png';
import logoWhite from '../assets/images/logo-white.png';
import megamenu from '../assets/images/megamenu.png';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import en from '../lang/en';
import ch from '../lang/ch';
import my from '../lang/my';

counterpart.registerTranslations('en', en);
counterpart.registerTranslations('ch', ch);
counterpart.registerTranslations('my', my);
counterpart.setLocale('en');


const { Header } = Layout;
const { Title, Paragraph, Text } = Typography;
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

class tlvHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            megamenu: false,
            lang: 'en',
            buyDrawer: false,
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
    showBuyDrawer = () => {
        this.setState({
            buyDrawer: true
        })
    }
    closeBuyDrawer = () => {
        this.setState({
            buyDrawer: false
        })
    }
    render() {
        return (
            <>
                <Layout className="layout">
                    <Header className="p-0 tlv-header">
                        <div className="login-user d-flex">
                            <ul className="header-logo">
                                <li className="px-16" ><a><img src={logoWhite} alt="logo" className="tlv-logo" /></a></li>
                                <li className="px-16"><a className="icon md hamburger" onClick={this.showMegaMenu} /></li>
                                <li className=""><Translate content="header_title" component="p" className="text-white mb-0 fs-18" />
                                </li>
                            </ul>
                        </div>
                        <Menu theme="light" mode="horizontal" className="header-right mobile-header-right">
                            <Menu.Item key="5">Security</Menu.Item>
                            <Menu.Item key="6"><span className="icon md bell" /></Menu.Item>
                            <Menu.Item key="7"><span className="icon md gear" /></Menu.Item>
                        </Menu>
                        {/* <div className="mid-menu">
                        <a className="ant-dropdown-link header-dropdown" onClick={this.showMegaMenu}>
                            Home<span className="icon md downarrow ml-12" />
                        </a>
                       
                        <Menu theme="light" mode="horizontal" className="main-menu">
                            <Menu.Item key="1" onClick={this.props.onShowBuyDrawer}>Buy / Sell</Menu.Item>
                            <Menu.Item key="2">Swap</Menu.Item>
                            <Menu.Item key="3">Send / Receive</Menu.Item>
                            <Menu.Item key="4">Cards</Menu.Item>
                        </Menu>
                        <BuySell />
                    </div> */}
                        <Menu theme="light" mode="horizontal" className="header-right" defaultSelectedKeys={['1']}>
                            <Menu.Item key="1" className="list-item" onClick={this.showBuyDrawer}>Buy / Sell</Menu.Item>
                            <Menu.Item key="2" className="list-item">Swap</Menu.Item>
                            <Menu.Item key="3" className="list-item">Send / Receive</Menu.Item>
                            <Menu.Item key="4" className="list-item">Mass Payments</Menu.Item>
                            <Dropdown overlay={menu} trigger={['click']} placement="topRight" arrow overlayClassName="secureDropdown">
                                <Menu.Item key="5">Security</Menu.Item>
                            </Dropdown>
                            <Menu.Item key="6"><span className="icon md bell" /></Menu.Item>
                            <Menu.Item key="7"><span className="icon md gear" /></Menu.Item>
                        </Menu>
                        <Drawer
                            title={[<div className="side-drawer-header"><span className="icon md close-white c-pointer" /><div className="text-center fs-14"><Paragraph className="mb-0 text-white-30 fw-600 text-upper">Buy Assets</Paragraph><Paragraph className="text-white-50 mb-0 fw-300">In the past 24 hours</Paragraph></div><span className="icon md search-white c-pointer" /></div>]}
                            placement="right"
                            closable={true}
                            visible={this.state.buyDrawer}
                            closeIcon={null}
                            className="side-drawer"
                        >

                        </Drawer>
                    </Header>
                </Layout >
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
            </>
        );
    }
}

export default tlvHeader;