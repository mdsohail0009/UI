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
                                <li className="pr-16" ><a><img src={logoWhite} alt="logo" className="tlv-logo" /></a></li>
                                <li className="px-16"><a className="icon md hamburger" onClick={this.showMegaMenu} /></li>
                                <li className=""><Translate content="header_title" component="p" className="text-white mb-0 fs-18" />
                                </li>
                            </ul>
                            <Menu theme="light" mode="horizontal" className="header-right mobile-header-right">
                            <Menu.Item key="5">Security</Menu.Item>
                            <Menu.Item key="6"><span className="icon md bell" /></Menu.Item>
                            <Menu.Item key="7"><span className="icon md gear" /></Menu.Item>
                        </Menu>
                        </div>
                       
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
                    title={[<div className="megamenu-title fs-24 text-white">
                        <img src={logoWhite} alt="logo" className="tlv-logo px-16" />
                        <Link className="text-white">Sign in</Link></div>]}
                    visible={this.state.megamenu}
                    onCancel={this.closeMegaMenu}
                    footer={null}
                    wrapClassName="megamenu-backdrop"
                    className="megamenu"
                    closeIcon={<span className="icon xl closewhite" />}
                >
                    <div style={{paddingRight:'30px', paddingLeft:'30px'}}>
                    <Row gutter={[16, 16]} className="megamenu-link " style={{ paddingRight: '15px', paddingLeft: '15px', marginLeft: 'auto', marginRight: "auto" }}  >
                        <Col lg={6} xl={4}>
                            <Title className="text-white megamenu-label mb-16 fw-500">Start</Title>
                            <Paragraph className="text-white-30 fs-16 mb-24">We are a platform that connects banks, payment systems, and people.</Paragraph>
                        </Col>
                        <Col lg={6} xl={5}>
                            <Title className="text-white megamenu-label  fw-500 mb-24">Personal</Title>
                            <Link className="pt-24"> Wallets</Link>
                          <Paragraph className="text-white-30 fs-16 mb-0">Full control of your private keys.</Paragraph>
                            
                        </Col>
                        <Col lg={6} xl={5}>
                            <Title className="text-white megamenu-label  fw-500">Crypto</Title>
                        </Col>

                        <Col lg={6} xl={5} >
                            <Title className="text-white megamenu-label  fw-500">Business</Title>
                            <Paragraph className="text-white-30 fs-16">User can create a separate account such as a corporate segregated wallet system.</Paragraph>
                        </Col>
                        <Col lg={6} xl={5} />
                    </Row>
                    <Row gutter={[16, 16]} className="megamenu-link " style={{ paddingRight: '15px', paddingLeft: '15px', marginLeft: 'auto', marginRight: "auto" }}  >
                    <Col lg={6} xl={4}>
                            <Link>The Dashboard</Link>
                            <Link>Your Portfolio</Link>
                        </Col>
                        <Col lg={6} xl={5}>
                            <Link>Cards</Link>
                            <Link>Exchange</Link>
                        </Col>
                        <Col lg={6} xl={5}>
                           
                        <Link >Buy and Sell</Link>
                            <Link>Swap Services</Link>
                            <Link>Deposit and Withdraw</Link>
                        </Col>
                        <Col lg={6} xl={5} >
                            <Link>Corporate Wallet</Link>
                            <Link>Mass Payments</Link>
                        </Col>
                        <Col lg={6} xl={5} />
                    </Row>
                    <Divider className="megamenu-divider" />
                    <Row gutter={[16, 16]} className="megamenu-link " style={{ paddingRight: '15px', paddingLeft: '15px', marginLeft: 'auto', marginRight: "auto" }}  >
                        <Col lg={6} xl={4}>
                            <Title className="text-white megamenu-label mb-16 fw-500">Spend</Title>
                            <Paragraph className="text-white-30 fs-16 mb-24">Use our Visa and Mastercards to convert, spend your crypto and traditional currency in real life.</Paragraph>
                        </Col>
                        <Col lg={6} xl={5} className="pt-24">
                        <img src={megamenu} alt="logo" />
                        </Col>
                        <Col lg={6} xl={5}>
                        <Title className=" text-white mb-16  megamenu-label  fw-500">Connect</Title>
                            <Link>Report A Bug</Link>
                            <Link>FAQ</Link>
                            <Link>Chat</Link>
                        </Col>

                        <Col lg={6} xl={5} >
                        <Title className="fs-36 text-white mb-16 fw-500 text-green">Security</Title>
                            <Paragraph className="text-white fs-16">CURRENT SECURITY LEVEL<br /><span className="text-green fw-700">Medium</span></Paragraph>
                            <Paragraph className="text-white fs-16">Your account has security features switched off, leaving it potentially vulnerable to specific attacks. Set up these security features to improve the security of your account.</Paragraph>
                        </Col>
                        <Col lg={6} xl={5} />
                    </Row>
                    </div>
                   
                </Modal>
            </>
        );
    }
}

export default tlvHeader;