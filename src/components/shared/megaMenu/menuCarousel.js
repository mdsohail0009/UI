import React, { Component } from 'react';
import { Typography, Row, Col, Divider, Avatar, Carousel, Switch } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';


class MenuCarousel extends Component {
    constructor(props) {
        super(props);
        this.state = {
        }
    }

    render() {
        const { Title, Paragraph } = Typography;
        return (
            <>

                <Carousel dots={false} className="mb-24 menu-carousel" ref={node => (this.carousel = node)}>
                    <div className="mega-menu">
                        <Row gutter={[16, 16]} className="megamenu-link"   >
                            <Col xl={5}>
                                <div className="wrapper">
                                    <div className="item-wrapper">
                                        <Title className="text-white megamenu-label mb-16 fw-500">Start</Title>
                                        <Paragraph className="text-white-30 fs-16 mb-24 fw-300">We are a platform that connects banks, payment systems, and people.</Paragraph>
                                    </div>
                                    <div className="item-wrapper">
                                        <Link>The Dashboard</Link>
                                        <Link>Your Portfolio</Link>
                                    </div>
                                </div>
                            </Col>
                            <Col xl={4}>
                                <div className="wrapper">
                                    <div className="item-wrapper">
                                        <Title className="text-white megamenu-label  fw-500 mb-24">Personal</Title>
                                        <Link className="pt-24"> Wallets</Link>
                                        <Paragraph className="text-white-30 fs-16 mb-0 fw-300">Full control of your private keys.</Paragraph>
                                    </div>
                                    <div className="item-wrapper">
                                        <Link>Cards</Link>
                                        <Link>Exchange</Link>
                                    </div>
                                </div>
                            </Col>
                            <Col xl={6}>
                                <div className="wrapper">
                                    <div className="item-wrapper">
                                        <Title className="text-white megamenu-label  fw-500">Crypto</Title>
                                    </div>
                                    <div className="item-wrapper">
                                        <Link >Buy and Sell</Link>
                                        <Link>Swap Services</Link>
                                        <Link>Deposit and Withdraw</Link>
                                    </div>
                                </div>
                            </Col>
                            <Col xl={6} >
                                <div className="wrapper">
                                    <div className="item-wrapper">
                                        <Title className="text-white megamenu-label  fw-500">Business</Title>
                                        <Paragraph className="text-white-30 fs-16 fw-300">User can create a separate account such as a corporate segregated wallet system.</Paragraph>
                                    </div>
                                    <div className="item-wrapper">
                                        <Link>Corporate Wallet</Link>
                                        <Link>Mass Payments</Link>
                                    </div>
                                </div>
                            </Col>
                            <Col xl={3} />
                        </Row>
                        <Divider className="megamenu-divider mobile-none" />
                        <Row gutter={[16, 16]} className="megamenu-link">

                            <Col lg={5} xl={5} className="mobile-none">

                            </Col>
                            <Col lg={5} xl={4} className="mobile-none">

                            </Col>
                            <Col lg={7} xl={6}>
                                <Title className=" text-white megamenu-label  mb-16 fw-500">Connect</Title>
                                <Link>Meet Our Team</Link>
                                <Link>Report A Bug</Link>
                                <Link>FAQ</Link>
                                <Link>Contact Us</Link>
                                <Link >Sign In</Link>

                            </Col>

                            <Col lg={5} xl={6}>
                                <Title className=" text-white mb-16 fw-500 megamenu-label ">Security</Title>
                                <Paragraph className="text-white fs-14 fw-400">CURRENT SECURITY LEVEL<br /><span className="text-green fw-700">Medium</span></Paragraph>
                                <Paragraph className="text-white fs-14 fw-400">Your account has security features switched off, leaving it potentially vulnerable to specific attacks. Set up these security features to improve the security of your account.</Paragraph>
                            </Col>
                            <Col xl={3} />
                        </Row>
                    </div>
                    <div className="mega-menu">
                        <Row gutter={16} className="megamenu-link">
                            <Col xl={5}>
                                <div className="wrapper">
                                    <div className="item-wrapper">
                                        <Title className="text-white megamenu-label mb-16 fw-500">Preferences</Title>
                                        <Avatar size={60} style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                                        <Paragraph className="text-white-30 fs-16 mb-0">Michael Quiapos</Paragraph>
                                        <Paragraph className="text-secondary fs-14">Great. i will have a look...</Paragraph>
                                    </div>
                                </div>
                            </Col>
                            <Col xl={4}>
                                <div className="wrapper">
                                    <Title className="text-white megamenu-label  fw-500 mb-24 item-wrapper">Wallet</Title>
                                    <div className="item-wrapper">
                                        <Link>Address Book</Link>
                                        <Link>Invite Friends</Link>
                                        <Link>Buy Crypto</Link>
                                        <Paragraph className="fs-18 mb-0 text-white-30 fw-300">Light Theme <Switch onChange={this.onChange} size="small" className="custom-toggle" /></Paragraph>
                                    </div>
                                </div>
                            </Col>
                            <Col xl={6}>
                                <div className="wrapper">
                                    <div className="item-wrapper">
                                        <Title className="text-white megamenu-label  fw-500">Localization</Title>
                                        <Paragraph className="text-white-30 fs-16 fw-400">User can create a separate account such as a corporate segregated wallet system.</Paragraph>
                                    </div>
                                    <div className="item-wrapper">
                                        <div className="d-flex justify-content">
                                            <p className="text-white-30 fs-18 mb-0">Language</p>
                                            <p className="text-white-30 fs-18 mb-0">lang</p>
                                        </div>
                                        <div className="d-flex justify-content">
                                            <p className="text-white-30 fs-18 mb-0">Currency</p>
                                            <p className="text-white-30 fs-18 mb-0"> USD</p>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col xl={1} className=" mobile-none " />
                            <Col xl={6} >
                                <div className="wrapper">
                                    <div className="item-wrapper">
                                        <Title className="text-white megamenu-label  fw-500">Support</Title>
                                    </div>
                                    <div className="item-wrapper">
                                        <Link>Help Center</Link>
                                        <Link>About</Link>
                                        <Link>Social Networks</Link>
                                    </div>
                                </div>
                            </Col>
                            <Col xl={2} className=" mobile-none " />
                        </Row>
                        <Divider className="megamenu-divider mobile-none" />
                        <Row gutter={[16, 16]} className="megamenu-link "  >
                            <Col xl={5} className=" mobile-none ">

                            </Col>
                            <Col xl={4} className="pt-24 mobile-none">

                            </Col>
                            <Col xl={6}>
                                <Title className=" text-white mb-16  megamenu-label  fw-500">Connect</Title>
                                <Link>Report A Bug</Link>
                                <Link>FAQ</Link>
                                <Link>Chat <span className="icon lg chat"></span></Link>
                            </Col>
                            <Col xl={1} className=" mobile-none " />
                            <Col xl={6} >
                                <Title className=" text-yellow mb-16  megamenu-label fw-500 ">Security</Title>
                                <Paragraph className="text-white fs-16">CURRENT SECURITY LEVEL<br /><span className="text-yellow fw-700">Medium </span>to see your status</Paragraph>
                                <Link>Backup Wallet</Link>
                                <Link>Reset Wallet</Link>
                                <Paragraph className="fs-18 mb-0 text-white-30 fw-300">Always ask pin <Switch onChange={this.onChange} size="small" className="custom-toggle ml-12" /></Paragraph >
                                <Paragraph className="fs-18 mb-0 text-white-30 fw-300">Activate face ID <Switch defaultChecked onChange={this.onChange} size="small" className="custom-toggle  ml-12" /></Paragraph>
                                <Paragraph className="fs-18 mb-0 text-white-30 fw-300">Activate biometry <Switch defaultChecked onChange={this.onChange} size="small" className="custom-toggle  ml-12" /></Paragraph >
                            </Col>
                            <Col xl={2} className=" mobile-none " />
                        </Row>
                    </div>
                </Carousel>

            </>
        )
    }
}

export default MenuCarousel;