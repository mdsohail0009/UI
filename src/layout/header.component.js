import React, { Component } from 'react';
import { Layout, List, Skeleton, Menu, Modal, Typography, Row, Col, Divider, Dropdown, Avatar, Carousel, Drawer, Radio, Tabs, Card, Button, Switch, Input, Tooltip } from 'antd';
import { RightOutlined, UserOutlined, InfoCircleFilled, CheckOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import logoWhite from '../assets/images/logo-white.png';
import config from '../config/config';
import megamenu from '../assets/images/megamenu.png';
import sacnner from '../assets/images/sacnner.png';
import counterpart from 'counterpart';
import CryptoList from '../components/shared/cryptolist';
import Translate from 'react-translate-component';
import en from '../lang/en';
import ch from '../lang/ch';
import my from '../lang/my';
import WalletList from '../components/shared/walletList';
import BuyCrypto from '../components/buysell.component/buyComponent';
import BuyToggle from '../components/buysell.component/buyToggle';
import Summary from '../components/buysell.component/Summary';
import BillingAddress from '../components/buysell.component/BillingAddress';
import BillType from '../components/buysell.component/BillType';
import BuySell from '../components/buysell.component';

counterpart.registerTranslations('en', en);
counterpart.registerTranslations('ch', ch);
counterpart.registerTranslations('my', my);
counterpart.setLocale('en');

const { menuHeader } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;
const menu = (
    <Menu>
        <Title className="fs-24 text-white mb-16 fw-500">Security</Title>
        <ul className="pl-0 drpdwn-list">
            <li><Link>2FA<span className="icon sm r-arrow-o-white ml-auto" /></Link></li>
            <li><Link>Change Password<span className="icon sm r-arrow-o-white ml-auto" /></Link></li>
            <li><Paragraph className="text-white fs-14">CURRENT SECURITY LEVEL<br /><span className="text-green fw-700">Medium</span></Paragraph>
                <Paragraph className="text-white fs-14">Your account has security features switched off, leaving it potentially vulnerable to specific attacks. Set up these security features to improve the security of your account.</Paragraph></li>
            <li><Link>Protect your account<span className="icon sm r-arrow-o-white ml-auto" /></Link></li>
        </ul>
    </Menu>
);
const options = [
    { label: 'From Crypto', value: 'Buy' },
    { label: 'From Fait', value: 'Sell' },
];
const depostOptions = [
    { label: 'From Crypto', value: 'From Crypto' },
    { label: 'From Fiat', value: 'From Fiat' },
];
class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            megamenu: false,
            lang: 'en',
            buyDrawer: false,
            buyToggle: 'Buy',
            depositToggle: 'From Crypto',
            payDrawer: false,
            payCardsDrawer: false,
            cardsDetails: false,
            billingAddress: false,
            initLoading: true,
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
    closeBuyDrawer = () => {
        this.setState({
            buyDrawer: false,
            payDrawer: false,
            billingAddress: false,
            depositCrypto: false,
            payCardsDrawer: false,
            cardsDetails: false,
            depositScanner: false,
        })
    }
    showPayDrawer = () => {
        this.setState({
            payDrawer: true,
            buyDrawer: false
        })
    }
    showPayCardDrawer = () => {
        this.setState({
            payCardsDrawer: true,

        })
    }
    showCardDrawer = () => {
        this.setState({
            cardsDetails: true,
            payCardsDrawer: false,

        })
    }
    billingAddress = () => {
        this.setState({
            billingAddress: true
        })
    }
    depositCrypto = () => {
        this.setState({
            depositCrypto: true
        })
    }
    depositScanner = () => {
        this.setState({
            depositScanner: true
        })
    }
    handleBuySellToggle = e => {
        this.setState({
            buyToggle: e.target.value,
        });
    };
    handleDepositToggle = e => {
        this.setState({
            depositToggle: e.target.value,
        });
    };
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
                                <Dropdown overlay={menu} trigger={['click']} placement="topRight" arrow overlayClassName="secureDropdown" getPopupContainer={() => document.getElementById('area')}>
                                    <Menu.Item key="5">Security</Menu.Item>
                                </Dropdown>
                                <Menu.Item key="6"><span className="icon md bell" /></Menu.Item>
                                <Menu.Item key="7"><span className="icon md gear" /></Menu.Item>
                            </Menu>
                        </div>
                        <Menu theme="light" mode="horizontal" className="header-right" defaultSelectedKeys={['1']}>
                            <Menu.Item key="1" className="list-item" onClick={this.showBuyDrawer}>Buy / Sell</Menu.Item>
                            <Menu.Item key="2" className="list-item">Swap</Menu.Item>
                            <Menu.Item key="3" className="list-item">Send / Receive</Menu.Item>
                            <Menu.Item key="4" className="list-item">Mass Payments</Menu.Item>
                            <Dropdown overlay={menu} trigger={['click']} placement="topRight" arrow overlayClassName="secureDropdown" getPopupContainer={() => document.getElementById('area')}>
                                <Menu.Item key="5">Security</Menu.Item>
                            </Dropdown>
                            <Menu.Item key="6"><span className="icon md bell ml-4" /></Menu.Item>
                            <Menu.Item key="7"><span className="icon md gear ml-4" /></Menu.Item>
                        </Menu>
                    </menuHeader>
                </Layout >
                <Modal
                    title={[<div className="megamenu-title fs-24 text-white">
                        <img src={logoWhite} alt="logo" className="tlv-logo px-16" />
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

                    {/* <div className="mega-menu">
                    <Row gutter={[16, 16]} className="megamenu-link"   >
                        <Col  xl={4}>
                            <Title className="text-white megamenu-label mb-16 fw-500">Start</Title>
                            <Paragraph className="text-white-30 fs-16 mb-24">We are a platform that connects banks, payment systems, and people.</Paragraph>
                             <div className="mobile-megalinks">
                             <Link>The Dashboard</Link>
                            <Link>Your Portfolio</Link> 
                             </div>
                        </Col>
                        <Col  xl={5}>
                            <Title className="text-white megamenu-label  fw-500 mb-24">Personal</Title>
                            <Link className="pt-24"> Wallets</Link>
                          <Paragraph className="text-white-30 fs-16 mb-0">Full control of your private keys.</Paragraph>
                          <div className="mobile-megalinks">
                            <Link>Cards</Link>
                            <Link>Exchange</Link>
                             </div> 
                        </Col>
                        <Col  xl={5}>
                            <Title className="text-white megamenu-label  fw-500">Crypto</Title>
                            <div className="mobile-megalinks">
                            <Link >Buy and Sell</Link>
                            <Link>Swap Services</Link>
                            <Link>Deposit and Withdraw</Link>
                             </div> 
                        </Col>
                        <Col  xl={5} >
                            <Title className="text-white megamenu-label  fw-500">Business</Title>
                            <Paragraph className="text-white-30 fs-16">User can create a separate account such as a corporate segregated wallet system.</Paragraph>
                            <div className="mobile-megalinks">
                            <Link>Corporate Wallet</Link>
                            <Link>Mass Payments</Link>
                             </div> 
                        </Col>
                        <Col  xl={5} />
                    </Row>
                    <Row gutter={[16, 16]} className="megamenu-link mobile-none ">
                    <Col  xl={4}>
                            <Link>The Dashboard</Link>
                            <Link>Your Portfolio</Link>
                        </Col>
                        <Col  xl={5}>
                            <Link>Cards</Link>
                            <Link>Exchange</Link>
                        </Col>
                        <Col  xl={5}>
                           
                        <Link >Buy and Sell</Link>
                            <Link>Swap Services</Link>
                            <Link>Deposit and Withdraw</Link>
                        </Col>
                    </Row> */}
                    {/* <Row gutter={[16, 16]} className="megamenu-sublink">
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
                        <Col  xl={5} />
                    </Row>
                    </div> */}

                    {/* mega menu login after */}
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
                                {/* <Col  xl={1}></Col> */}
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
                                <Col lg={5} xl={4}  className="mobile-none">

                                </Col>
                                <Col lg={7} xl={6}>
                                    <Title className="fs-36 text-white megamenu-label  mb-16 fw-500">Connect</Title>
                                    <Link>Meet Our Team</Link>
                                    <Link>Report A Bug</Link>
                                    <Link>FAQ</Link>
                                    <Link>Contact Us</Link>
                                    <Link >Sign In</Link>

                                </Col>
                                {/* <Col xl={1} /> */}
                                <Col lg={5} xl={6}>
                                    <Title className="fs-36 text-white mb-16 fw-500 megamenu-label ">Security</Title>
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
                                    <Title className="fs-36 text-yellow mb-16  megamenu-label fw-500 ">Security</Title>
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
                </Modal>
                <BuySell showDrawer={this.state.buyDrawer} onClose={()=>this.closeBuyDrawer()} />

                <Drawer
                    title={[<div className="side-drawer-header"><span onClick={this.closeBuyDrawer} className="icon md lftarw-white c-pointer" />
                        <div className="text-center fs-14">
                            <Paragraph className="mb-0 text-white-30 fw-600 text-upper">LINK A CARD OR DEPOSIT</Paragraph>
                            <Paragraph className="text-white-50 mb-0 fw-300" > Select from below </Paragraph>
                        </div>
                        <span />
                    </div>]}
                    placement="right"
                    closable={true}
                    visible={this.state.payCardsDrawer}
                    closeIcon={null}
                    className="side-drawer"
                >
                    <div className="d-flex align-center mb-24 mt-36 c-pointer" onClick={this.showCardDrawer}>
                        <span className="coin btc" />
                        <div className="ml-24">
                            <Paragraph className="mb-0 fs-14 text-white-30 fw-300">Credit Card</Paragraph>
                            <Paragraph className="mb-0 fs-12 text-white-30 fw-300"> Use a credit or debit card</Paragraph>
                        </div>
                    </div>
                    <div className="d-flex align-center c-pointer" onClick={this.depositCrypto}>
                        <span className="coin btc" />
                        <div className="ml-24">
                            <Paragraph className="mb-0 fs-14 text-white-30 fw-300">Deposit</Paragraph>
                            <Paragraph className="mb-0 fs-12 text-white-30 fw-300" >Deposit from an address or existing wallet</Paragraph>
                        </div>
                    </div>
                </Drawer>
                <Drawer
                    title={[<div className="side-drawer-header"><span onClick={this.closeBuyDrawer} className="icon md lftarw-white c-pointer" />
                        <div className="text-center fs-14">
                            <Paragraph className="mb-0 text-white-30 fw-600 text-upper">Credit Card</Paragraph>
                        </div>
                        <span className="icon md close-white c-pointer" />
                    </div>]}
                    placement="right"
                    closable={true}
                    visible={this.state.cardsDetails}
                    closeIcon={null}
                    className="side-drawer"
                >   <div className="form">
                        <label className="input-label">Name on card</label>
                        <Input className="cust-input" defaultValue="Michael Quiapos" />
                        <label className="input-label">Card number</label>
                        <Input className="cust-input" defaultValue="5443 84000 0902 5339" />
                        <div className="d-flex justify-content align-center">
                            <div className="mr-16 ">
                                <label className="input-label">Expiry</label>
                                <div className="expiry-input">
                                    <Input placeholder="MM" maxLength="2" bordered={false} className="fs-16 text-white-30 text-right" />/
                                    <Input placeholder="YY" maxLength="2" bordered={false} className="fs-16 text-white-30" />
                                </div>
                            </div>
                            <div className="ml-16">
                                <label className="input-label">CVV</label>
                                <Input className="cust-input" defaultValue="544" />
                            </div>
                        </div>
                        <div className="text-center mt-16"><Link className="text-white fs-16"><u>Type your Billing Address</u></Link></div>
                    </div>
                    <Button size="large" block className="pop-btn" style={{ marginTop: '180px' }} onClick={this.billingAddress}>Confirm</Button>
                </Drawer>
                {/* DEPOSIT to crypto */}
                <Drawer
                    title={[<div className="side-drawer-header"><span className="icon md lftarw-white c-pointer" onClick={this.closeBuyDrawer} />
                        <div className="text-center fs-14">
                            <Paragraph className="mb-0 text-white-30 fw-600 text-upper">DEPOSIT</Paragraph>
                            <Paragraph className="text-white-50 mb-0 fw-300" > Select a Currency</Paragraph></div>
                        <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" /></div>]}
                    placement="right"
                    closable={true}
                    visible={this.state.depositCrypto}
                    closeIcon={null}
                    className="side-drawer text-white"
                >
                    <Radio.Group
                        options={depostOptions}
                        onChange={this.handleDepositToggle}
                        value={this.state.depositToggle}
                        optionType="button"
                        buttonStyle="solid"
                        size="large"
                        className="buysell-toggle crypto-toggle mx-12"
                    />
                    <List onClick={this.depositScanner}
                        itemLayout="horizontal"
                        dataSource={config.tlvCoinsList}
                        className="wallet-list"
                        renderItem={item => (
                            <List.Item>
                                <List.Item.Meta
                                    avatar={<span className={`coin ${item.coin} mr-4`} />}
                                    title={<div className="fs-16 fw-600 text-upper text-white-30 mb-0 mt-12">{item.coin}</div>}
                                />
                            </List.Item>
                        )}
                    />
                </Drawer>
                {/* <List
                itemLayout="horizontal"
                dataSource={config.tlvCoinsList}
                renderItem={item => (
                    <List.Item onClick={this.depositScanner}>
                        <Skeleton loading={item.loading} active>
                            <List.Item.Meta
                                avatar={<span className={`coin ${item.coin} mr-4`} />}
                                title={<div className="fs-16 fw-600 text-upper text-white-30 mb-0 mt-12">{item.coin}</div>}
                            />
                            </Skeleton>
                    </List.Item>
                )} />
            </Drawer> */}
                {/* DEPOSIT to Scanner */}
                <Drawer
                    title={[<div className="side-drawer-header"><span className="icon md lftarw-white c-pointer" onClick={this.closeBuyDrawer} />
                        <div className="text-center fs-14">
                            <Paragraph className="mb-0 text-white-30 fw-600 text-upper">DEPOSIT ETH</Paragraph>
                            <Paragraph className="text-white-50 mb-0 fw-300" > Select a Currency</Paragraph></div>
                        <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" /></div>]}
                    placement="right"
                    closable={true}
                    visible={this.state.depositScanner}
                    closeIcon={null}
                    className="side-drawer text-white" >
                    <div className="scanner-img">
                        <img src={sacnner} />
                    </div>
                    <div className="crypto-address">
                        <div className="mb-0 fw-400 text-secondary">Address</div>
                        <div className="mb-0 fs-14 fw-500 text-textDark">TAQgcJD9p29m77EnXweijpHegPUSnxkdQW</div>
                    </div>
                    <Paragraph className="text-center f-12 text-white">Please make sure your delivery address is correct.</Paragraph>
                    <Button size="large" block className="pop-btn" style={{ marginTop: '100px' }}>COPY</Button>
                    <Button type="text" size="large" className="text-center text-white-30 pop-cancel fw-400 text-captz text-center" block>Share</Button>
                </Drawer>
            </>
        );
    }
}

export default Header;