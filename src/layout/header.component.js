import React, { Component } from 'react';
import { Layout, Menu, Modal, Typography, Dropdown, Tabs, Row, Col, Divider, Avatar, Carousel, Switch } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import logoWhite from '../assets/images/logo-white.png';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import en from '../lang/en';
import ch from '../lang/ch';
import my from '../lang/my';
import BuySell from '../components/buysell.component';
import BusinessMenu from '../components/shared/megaMenu/businessMegamenu';
import menuCarousel from '../components/shared/megaMenu/menuCarousel';
import SendReceive from '../components/send.component'
import SwapCrypto from '../components/swap.component'
import MassPayment from '../components/buyfiat.component'
import { userManager } from '../authentication';

counterpart.registerTranslations('en', en);
counterpart.registerTranslations('ch', ch);
counterpart.registerTranslations('my', my);
counterpart.setLocale('en');

const { menuHeader } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const securityMenu = (
    <Menu>
        <Translate className="fs-24 text-white my-16 fw-500 mx-30" content="security" component={Title} />
        <ul className="pl-0 drpdwn-list">
            <li><Link>2FA<span className="icon md rarrow-white" /></Link></li>
            <li className="d-flex justify-content align-center">
            <Translate content="change_password" component={Link} />
            <span className="icon md rarrow-white" />
                </li>
            <li className="no-hover">
                 <div className="">
                    <Translate className="text-white fs-14 pt-16 mb-0" content="current_security_level" component={Paragraph} />
                    <Translate className="text-green fw-900" content="medium" component={Paragraph} />
                 </div>
                <Translate className="text-white fs-14" style={{ paddingRight: '78px' }} content="current_security_text" component={Paragraph} />
            </li>
            <li className="d-flex justify-content align-center">
                <Translate content="protect_your_account" component={Link} />
                <span className="icon md rarrow-white" />
            </li>
        </ul>
    </Menu>
);
const settingMenu = (
    <Menu>
        <Translate className="fs-24 text-white my-16 fw-500 mx-30" content="settings" component={Title} />
        <ul className="pl-0 drpdwn-list">
            <li className="d-flex justify-content align-center">
                <Translate content="general" component={Link} />
                <span className="icon md rarrow-white" />
            </li>
            <li className="d-flex justify-content align-center">
                <Translate content="privacy_policy" component={Link} />
                <span className="icon md rarrow-white" />
            </li>
            <li className="d-flex justify-content align-center">
                <Translate content="terms_service" component={Link} />
                <span className="icon md rarrow-white" />
            </li>
            <li className="d-flex justify-content align-center">
                <Translate content="about" component={Link} />
                <span className="icon md rarrow-white" />
            </li>
            <li className="d-flex justify-content align-center">
                <Translate content="wallet_version" component={Link} />
                <span className="icon md rarrow-white" />
            </li>
            <li className="d-flex justify-content align-center">
                <Translate content="preferences" component={Link} />
                <span className="icon md rarrow-white" />
            </li>
            <li className="d-flex justify-content align-center">
                <Translate content="language" component={Link} />
                <span className="icon md rarrow-white" />
            </li>
            <li className="d-flex justify-content align-center">
                <Translate content="local_currency" component={Link} />
                <span className="icon md rarrow-white" />
            </li>
            <li className="d-flex justify-content align-center">
                <Translate content="notifications" component={Link} />
                <span className="icon md rarrow-white" />
            </li>
            <li className="d-flex justify-content align-center">
                <Translate content="themes" component={Link} />
                <span className="icon md rarrow-white" />
            </li>
            <li className="d-flex justify-content align-center" onClick={()=>userManager.signoutRedirect()}>
                <Translate content="logout" component={Link} />
                <span className="icon md rarrow-white" />
            </li>
        </ul>
    </Menu>
);
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            megamenu: false,
            lang: 'en',
            buyDrawer: false,
            sendDrawer: false,
            swapDrawer: false,
            buyToggle: 'Buy',
            depositToggle: 'From Crypto',
            payDrawer: false,
            payCardsDrawer: false,
            cardsDetails: false,
            billingAddress: false,
            initLoading: true,
            buyFiatDrawer: false,
        }
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.carousel = React.createRef();
    }
    next() {
        this.carousel.next();
    }
    previous() {
        this.carousel.prev();
    }
    onChange(checked) {
        console.log(`switch to ${checked}`);
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
    showSendDrawer = () => {
        this.setState({
            sendDrawer: true
        })
    }
    showSwapDrawer = () => {
        this.setState({
            swapDrawer: true
        })
    }
    showBuyFiatDrawer = () => {
        this.setState({
            buyFiatDrawer: true,
        })
    }
    closeDrawer = () => {
        this.setState({
            buyDrawer: false,
            payDrawer: false,
            billingAddress: false,
            depositCrypto: false,
            payCardsDrawer: false,
            cardsDetails: false,
            depositScanner: false,
            sendDrawer: false,
            swapDrawer: false,
            buyFiatDrawer: false,
        })
    }
    render() {
        const { initLoading, loading } = this.state;
        return (
            <>
                <Layout className="layout">
                    <menuHeader className="tlv-header" id="area">
                        <div className="login-user">
                            <ul className="header-logo">
                                <li className="pr-30 p-relative"><Link><img src={logoWhite} alt="logo" className="tlv-logo" /></Link></li>
                                <li className="px-36"><span className="icon md hamburger c-pointer" onClick={this.showMegaMenu} /></li>
                                <li className="mb-d-none"><Translate content="header_title" component="p" className="text-white-30 mb-0 fs-24" /></li>
                            </ul>
                            <Menu theme="light" mode="horizontal" className="header-right mobile-header-right">
                                <Dropdown overlay={securityMenu} trigger={['click']} placement="topRight" arrow overlayClassName="secureDropdown" getPopupContainer={() => document.getElementById('area')}>
                                    <Menu.Item key="5">Security</Menu.Item>
                                </Dropdown>
                                <Menu.Item key="6"><span className="icon md bell" /></Menu.Item>
                                <Dropdown overlay={settingMenu} trigger={['click']} placement="topRight" arrow overlayClassName="secureDropdown" getPopupContainer={() => document.getElementById('area')}>
                                    <Menu.Item key="7"><span className="icon md gear" /></Menu.Item>
                                </Dropdown>
                            </Menu>
                        </div>
                        <Menu theme="light" mode="horizontal" className="header-right" defaultSelectedKeys={['1']}>
                            {/* <Menu.Item key="1" className="list-item" onClick={this.showBuyDrawer}>Buy / Sell</Menu.Item> */}
                            <Translate content="menu_buy_sell" component={Menu.Item} key="1" onClick={this.showBuyDrawer} className="list-item" />
                            <Translate content="menu_swap" component={Menu.Item} key="2" onClick={this.showSwapDrawer} className="list-item" />
                            <Translate content="menu_send_receive" component={Menu.Item} key="3" onClick={this.showSendDrawer} className="list-item" />
                            <Translate content="menu_mass_pay" component={Menu.Item} key="4" onClick={this.showBuyFiatDrawer} className="list-item" />
                            <Dropdown overlay={securityMenu} trigger={['click']} placement="topRight" arrow overlayClassName="secureDropdown" getPopupContainer={() => document.getElementById('area')}>
                                <Translate key="5" content="security" component={Menu.Item} />
                            </Dropdown>
                            <Menu.Item key="6"><span className="icon md bell ml-4" /></Menu.Item>
                            <Dropdown overlay={settingMenu} trigger={['click']} placement="topRight" arrow overlayClassName="secureDropdown" getPopupContainer={() => document.getElementById('area')}>
                                <Menu.Item key="7"><span className="icon md gear ml-4" /></Menu.Item>
                            </Dropdown>
                        </Menu>
                    </menuHeader>
                </Layout >
                <Modal
                    title={[<div className="megamenu-title fs-24 text-white">
                        <img src={logoWhite} alt="logo" className="tlv-logo" />
                        <div><span className="icon sm r-arrow-o-white mr-16 c-pointer" style={{ transform: 'rotate(180deg)' }} onClick={this.previous} ></span>
                            <span className="icon sm r-arrow-o-white c-pointer ml-24" onClick={this.next}></span>
                            <Link className="text-white ml-16">Sign in</Link></div>
                    </div>]}
                    visible={this.state.megamenu}
                    onCancel={this.closeMegaMenu}
                    footer={null}
                    wrapClassName="megamenu-backdrop"
                    className="megamenu"
                    closeIcon={<span className="icon xl closewhite" />}
                >

                    {/* before login megamenu */}

                    {/* <BusinessMenu/> */}

                    {/* mega menu login after */}
                    <Carousel dots={false} className="mb-24 menu-carousel" ref={node => (this.carousel = node)}>
                        <div className="mega-menu">
                            <Row gutter={16} className="megamenu-link"   >
                                <Col xl={5}>
                                    <div className="wrapper">
                                        <div className="item-wrapper">
                                            <Title className="text-white megamenu-label mb-16 fw-500 mt-0">Start</Title>
                                            <Paragraph className="text-white-30 fs-16 mb-24 fw-300">We are a platform that connects banks, payment systems, and people.</Paragraph>
                                        </div>
                                        <div className="item-wrapper">
                                        <Link to="/dashboard" onClick={()=>{this.setState({...this.state,megamenu:false})}}>The Dashboard</Link>
                                            <Link to="/dashboard" onClick={()=>{this.setState({...this.state,megamenu:false})}}>Your Portfolio</Link>
                                            {/* <Link>The Dashboard</Link>
                                            <Link>Your Portfolio</Link> */}
                                        </div>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="wrapper">
                                        <div className="item-wrapper">
                                            <Title className="text-white megamenu-label  fw-500 mb-24 mt-0">Personal</Title>
                                            {/* <Link className="pt-24"> Wallets</Link> */}
                                            <p className="fs-18 text-white-30 fw-200 mb-0">Wallets</p>
                                            <Paragraph className="text-white-30 fs-16 mb-0 fw-300">Full control of your private keys.</Paragraph>
                                        </div>
                                        <div className="item-wrapper">
                                            <p className="fs-18 text-white-30 fw-200 mb-0">Cards</p>
                                            <p className="fs-18 text-white-30 fw-200 mb-0">Exchange</p>
                                            {/* <Link>Cards</Link>
                                            <Link>Exchange</Link> */}
                                        </div>
                                    </div>
                                </Col>
                                <Col xl={6}>
                                    <div className="wrapper">
                                        <div className="item-wrapper">
                                            <Title className="text-white megamenu-label  fw-500 mt-0">Crypto</Title>
                                        </div>
                                        <div className="item-wrapper">
                                            <Link onClick={() => { this.closeMegaMenu(); this.showBuyDrawer();}}>Buy and Sell</Link>
                                            {/* <Translate content="buy_sell" onClick={() => { this.closeMegaMenu(); this.showBuyDrawer();}} className="text-white-30 fs-16 fw-300 c-pointer menu-items" /> */}
                                            <Link onClick={() => { this.closeMegaMenu(); this.showSwapDrawer();}}>Swap Services</Link>
                                            {/* <Translate content="swap_services" onClick={() => { this.closeMegaMenu(); this.showSwapDrawer();}} className="text-white-30 fs-16 fw-300 c-pointer menu-items" /> */}
                                            <Link onClick={() => { this.closeMegaMenu(); this.showSendDrawer();}}>Deposit and Withdraw</Link>
                                            {/* <Translate content="deposit_and_withdraw"  onClick={() => { this.closeMegaMenu(); this.showSendDrawer();}} className="text-white-30 fs-16 fw-300 c-pointer menu-items" /> */}
                                        </div>
                                    </div>
                                </Col>
                                <Col xl={6} >
                                    <div className="wrapper">
                                        <div className="item-wrapper">
                                            <Title className="text-white megamenu-label  fw-500 mt-0">Business</Title>
                                            <Paragraph className="text-white-30 fs-16 fw-300">User can create a separate account such as a corporate segregated wallet system.</Paragraph>
                                        </div>
                                        <div className="item-wrapper">
                                            <p className="text-white-30 fs-18 fw-200 mb-0">Corporate Wallet</p>
                                            <Link onClick={() => { this.closeMegaMenu(); this.showBuyFiatDrawer();}}>Mass Payments</Link>
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
                                    <Title className=" text-white megamenu-label  mb-16 fw-500 mt-0">Connect</Title>
                                    <div className="text-white-30 fs-16 fw-300">Meet Our Team</div>
                                    <div className="text-white-30 fs-16 fw-300">Report A Bug</div>
                                    <div className="text-white-30 fs-16 fw-300">FAQ</div>
                                    <div className="text-white-30 fs-16 fw-300">Contact Us</div>
                                    <div className="text-white-30 fs-16 fw-300" >Sign In</div>

                                </Col>

                                <Col lg={5} xl={6}>
                                    <Title className=" text-white mb-16 fw-500 megamenu-label mt-0">Security</Title>
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
                                            <Title className="text-white megamenu-label mb-16 fw-500 mt-0">Preferences</Title>
                                            <Avatar size={60} style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                                            <Paragraph className="text-white-30 fs-16 mb-0">Michael Quiapos</Paragraph>
                                            <Paragraph className="text-secondary fs-14">Great. i will have a look...</Paragraph>
                                        </div>
                                    </div>
                                </Col>
                                <Col xl={4}>
                                    <div className="wrapper">
                                        <Title className="text-white megamenu-label  fw-500 mb-24 item-wrapper mt-0 ">Wallet</Title>
                                        <div className="item-wrapper">
                                        <p className="fs-18 text-white-30 fw-200 mb-0">Address Book</p>
                                        <p className="fs-18 text-white-30 fw-200 mb-0">Invite Friends</p>
                                        <Link onClick={()=>{this.setState({...this.state,megamenu:false});this.showBuyDrawer()}}>Buy Crypto</Link>
                                            {/* <Link>Address Book</Link>
                                            <Link>Invite Friends</Link>
                                            <Link>Buy Crypto</Link> */}
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
                                                <p className="text-white-30 fs-18 mb-0 fw-200">Language</p>
                                                <p className="text-white-30 fs-18 mb-0  fw-200">lang</p>
                                            </div>
                                            <div className="d-flex justify-content">
                                                <p className="text-white-30 fs-18 mb-0  fw-200">Currency</p>
                                                <p className="text-white-30 fs-18 mb-0  fw-200"> USD</p>
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
                                            {/* <Link>Help Center</Link>
                                            <Link>About</Link>
                                            <Link>Social Networks</Link> */}
                                        <p className="fs-18 text-white-30 fw-200 mb-0">Help Center</p>
                                        <p className="fs-18 text-white-30 fw-200 mb-0">About</p>
                                        <p className="fs-18 text-white-30 fw-200 mb-0">Social Networks</p>
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
                                    <p className="fs-18 text-white-30 fw-200 mb-0">Report A Bug</p>
                                    <p className="fs-18 text-white-30 fw-200 mb-0">FAQ</p>
                                    <p className="fs-18 text-white-30 fw-200 mb-0">Chat <span className="icon lg chat"></span></p>
                                    {/* <Link>Report A Bug</Link>
                                    <Link>FAQ</Link>
                                    <Link>Chat <span className="icon lg chat"></span></Link> */}
                                </Col>
                                <Col xl={1} className=" mobile-none " />
                                <Col xl={6} >
                                    <Title className=" text-yellow mb-16  megamenu-label fw-500 ">Security</Title>
                                    <Paragraph className="text-white fs-16">CURRENT SECURITY LEVEL<br /><span className="text-yellow fw-700">Medium </span>to see your status</Paragraph>
                                    <p className="fs-18 text-white-30 fw-200 mb-0">Backup Wallet</p>
                                    <p className="fs-18 text-white-30 fw-200 mb-0">Reset Wallet</p>
                                    {/* <Link>Backup Wallet</Link>
                                    <Link>Reset Wallet</Link> */}
                                    <Paragraph className="fs-18 mb-0 text-white-30 fw-300">Always ask pin <Switch onChange={this.onChange} size="small" className="custom-toggle ml-12" /></Paragraph >
                                    <Paragraph className="fs-18 mb-0 text-white-30 fw-300">Activate face ID <Switch defaultChecked onChange={this.onChange} size="small" className="custom-toggle  ml-12" /></Paragraph>
                                    <Paragraph className="fs-18 mb-0 text-white-30 fw-300">Activate biometry <Switch defaultChecked onChange={this.onChange} size="small" className="custom-toggle  ml-12" /></Paragraph >
                                </Col>
                                <Col xl={2} className=" mobile-none " />
                            </Row>
                        </div>
                    </Carousel>
                </Modal>
                <BuySell showDrawer={this.state.buyDrawer} onClose={() => this.closeDrawer()} />
                <SendReceive showDrawer={this.state.sendDrawer} onClose={() => this.closeDrawer()} />
                <SwapCrypto showDrawer={this.state.swapDrawer} onClose={() => this.closeDrawer()} />
                <MassPayment showDrawer={this.state.buyFiatDrawer} onClose={() => this.closeDrawer()} />
            </>
        );
    }
}

export default Header;