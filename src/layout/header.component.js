import React, { Component } from 'react';
import { Layout, List, Skeleton, Menu, Modal, Typography, Row, Col, Divider, Dropdown, Avatar, Drawer, Radio, Tabs, Card, Button, Switch, Input } from 'antd';
import { RightOutlined, UserOutlined, InfoCircleFilled, CheckOutlined, ArrowLeftOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import logoWhite from '../assets/images/logo-white.png';
import config from '../config/config';
import megamenu from '../assets/images/megamenu.png';
import sacnner from '../assets/images/sacnner.svg';
import counterpart from 'counterpart';
import CryptoList from '../components/shared/cryptolist';
import Translate from 'react-translate-component';
import en from '../lang/en';
import ch from '../lang/ch';
import my from '../lang/my';
import WalletList from '../components/shared/walletList';

counterpart.registerTranslations('en', en);
counterpart.registerTranslations('ch', ch);
counterpart.registerTranslations('my', my);
counterpart.setLocale('en');

const { Header } = Layout;
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
    { label: 'Buy', value: 'Buy' },
    { label: 'Sell', value: 'Sell' },
];
class tlvHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            megamenu: false,
            lang: 'en',
            buyDrawer: false,
            buyToggle: 'Buy',
            payDrawer: false,
            payCardsDrawer: false,
            cardsDetails: false,
            billingAddress: false,
            initLoading: true,
        }
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
    render() {
        const { initLoading, loading } = this.state;
        return (
            <>
                <Layout className="layout">
                    <Header className="tlv-header" id="area">
                        <div className="login-user">
                            <ul className="header-logo">
                                <li className="pr-30 p-relative"><Link><img src={logoWhite} alt="logo" className="tlv-logo" /></Link></li>
                                <li className="px-36"><span className="icon md hamburger c-pointer" onClick={this.showMegaMenu} /></li>
                                <li><Translate content="header_title" component="p" className="text-white-30 mb-0 fs-24" /></li>
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
                            <Dropdown overlay={menu} trigger={['click']} placement="topRight" arrow overlayClassName="secureDropdown" getPopupContainer={() => document.getElementById('area')}>
                                <Menu.Item key="5">Security</Menu.Item>
                            </Dropdown>
                            <Menu.Item key="6"><span className="icon md bell ml-4" /></Menu.Item>
                            <Menu.Item key="7"><span className="icon md gear ml-4" /></Menu.Item>
                        </Menu>
                        <Drawer
                            title={[<div className="side-drawer-header"><span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" /><div className="text-center fs-14"><Translate className="mb-0 text-white-30 fw-600 text-upper" content="buy_assets" component={Paragraph} /><Translate className="text-white-50 mb-0 fw-300" content="past_hours" component={Paragraph} /></div><span className="icon md search-white c-pointer" /></div>]}
                            placement="right"
                            closable={true}
                            visible={this.state.buyDrawer}
                            closeIcon={null}
                            className="side-drawer"
                        >
                            {/* <Radio.Group
                                options={options}
                                onChange={this.handleBuySellToggle}
                                value={this.state.buyToggle}
                                optionType="button"
                                buttonStyle="solid"
                                size="large"
                                className="buysell-toggle"
                            />
                            <Translate content="purchase_a_crypto" component={Title} className="text-white-30 fs-36 fw-200 mb-16" />
                            <Translate content="purchase_a_cryto_txt" component={Paragraph} className="fs-16 text-secondary" />
                            <Tabs className="crypto-list-tabs">
                                <TabPane tab="All" key="1">
                                    <CryptoList />
                                </TabPane>
                                <TabPane tab="Gainers" key="2">
                                    <CryptoList />
                                </TabPane>
                                <TabPane tab="Losers" key="3">
                                    <CryptoList />
                                </TabPane>
                            </Tabs> */}
                            <Card className="crypto-card mb-36" bordered={false}>
                                <span>
                                    <span className="coin md eth-white" />
                                    <Text className="fs-24 text-white crypto-name ml-24">Ethereum</Text>
                                </span>
                                <div className="crypto-details">
                                    <Text className="crypto-percent text-white fw-700">25<sup className="fs-24 text-white fw-700" style={{ verticalAlign: 'Middle', marginLeft: 14 }}>%</sup></Text>
                                    <div className="fs-16 text-white-30 fw-200 text-right">
                                        <div>1.0147668 ETH</div>
                                        <div>$ 41.07</div>
                                    </div>
                                </div>
                            </Card>
                            <div className="d-flex align-center mb-36">
                                <span>
                                    <Input className="fs-36 fw-200 text-white-30 text-center enter-val pb-0"
                                        placeholder="USD $0"
                                        bordered={false}
                                    />
                                    <Text className="fs-14 text-white-30 fw-200 text-center d-block">0.00701 ETH</Text>
                                </span>
                                <span>
                                    <span className="icon sm uparw-o-white d-block c-pointer mb-4" /><span className="icon sm dwnarw-o-white d-block c-pointer" />
                                </span>
                            </div>


                            <Paragraph className="text-upper fw-600 mb-0 text-aqua pt-16">Find with your favoite wallet</Paragraph>
                            <WalletList isArrow={true} />
                            <Paragraph className="fs-14 text-white-30 fw-200 text-center">Please refresh to get a new price</Paragraph>
                            <Button size="large" block className="pop-btn" onClick={this.showPayDrawer} icon={<span className="icon md load" />}>Confirm(18s)</Button>
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

                    {/* before login megamenu */}

                    {/* <div className="mega-menu">
                    <Row gutter={[16, 16]} className="megamenu-link"   >
                        <Col lg={6} xl={4}>
                            <Title className="text-white megamenu-label mb-16 fw-500">Start</Title>
                            <Paragraph className="text-white-30 fs-16 mb-24">We are a platform that connects banks, payment systems, and people.</Paragraph>
                             <div className="mobile-megalinks">
                             <Link>The Dashboard</Link>
                            <Link>Your Portfolio</Link> 
                             </div>
                        </Col>
                        <Col lg={6} xl={5}>
                            <Title className="text-white megamenu-label  fw-500 mb-24">Personal</Title>
                            <Link className="pt-24"> Wallets</Link>
                          <Paragraph className="text-white-30 fs-16 mb-0">Full control of your private keys.</Paragraph>
                          <div className="mobile-megalinks">
                            <Link>Cards</Link>
                            <Link>Exchange</Link>
                             </div> 
                        </Col>
                        <Col lg={6} xl={5}>
                            <Title className="text-white megamenu-label  fw-500">Crypto</Title>
                            <div className="mobile-megalinks">
                            <Link >Buy and Sell</Link>
                            <Link>Swap Services</Link>
                            <Link>Deposit and Withdraw</Link>
                             </div> 
                        </Col>
                        <Col lg={6} xl={5} >
                            <Title className="text-white megamenu-label  fw-500">Business</Title>
                            <Paragraph className="text-white-30 fs-16">User can create a separate account such as a corporate segregated wallet system.</Paragraph>
                            <div className="mobile-megalinks">
                            <Link>Corporate Wallet</Link>
                            <Link>Mass Payments</Link>
                             </div> 
                        </Col>
                        <Col lg={6} xl={5} />
                    </Row>
                    <Row gutter={[16, 16]} className="megamenu-link mobile-none ">
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
                        <Col lg={6} xl={5} />
                    </Row>
                    </div> */}

                    {/* mega menu login after */}

                    <div className="mega-menu">
                        <Row gutter={16} className="megamenu-link">
                            <Col lg={6} xl={5}>
                                <Title className="text-white megamenu-label mb-16 fw-500">Preferences</Title>
                                <Avatar size={60} style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                                <Paragraph className="text-white-30 fs-16 mb-0">Michael Quiapos</Paragraph>
                                <Paragraph className="text-secondary fs-14">Great. i will have a look...</Paragraph>
                            </Col>
                            <Col lg={6} xl={4}>
                                <Title className="text-white megamenu-label  fw-500 mb-24">Wallet</Title>
                                <div className="mobile-megalinks">
                                    <Link>Address Book</Link>
                                    <Link>Invite Friends</Link>
                                    <Link>Buy Crypto</Link>
                                    <Link>Light Theme <Switch onChange={this.onChange} size="small" className="custom-toggle" /></Link>
                                </div>
                            </Col>

                            <Col lg={6} xl={5}>
                                <Title className="text-white megamenu-label  fw-500">Localization</Title>
                                <Paragraph className="text-white-30 fs-16 fw-400">User can create a separate account such as a corporate segregated wallet system.</Paragraph>
                                <div className="mobile-megalinks">
                                    <div className="d-flex justify-content">
                                        <p className="text-white-30 fs-18 mb-0">Language</p>
                                        <p className="text-white-30 fs-18 mb-0">lang</p>
                                    </div>
                                    <div className="d-flex justify-content">
                                        <p className="text-white-30 fs-18 mb-0">Currency</p>
                                        <p className="text-white-30 fs-18 mb-0"> USD</p>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={6} xl={1} className=" mobile-none " />
                            <Col lg={6} xl={5} >
                                <Title className="text-white megamenu-label  fw-500">Support</Title>
                                <div className="mobile-megalinks">
                                    <Link>Help Center</Link>
                                    <Link>About</Link>
                                    <Link>Social Networks</Link>
                                </div>
                            </Col>
                            <Col lg={6} xl={5} className=" mobile-none " />
                        </Row>
                        <Row gutter={[16, 16]} className="megamenu-link mobile-none ">
                            <Col lg={6} xl={5} className=" mobile-none ">
                            </Col>
                            <Col lg={6} xl={4}>
                                <Link>Address Book</Link>
                                <Link>Invite Friends</Link>
                                <Link>Buy Crypto</Link>
                                <Link>Light Theme <Switch onChange={this.onChange} size="small" className="custom-toggle" /></Link>
                            </Col>
                            <Col lg={6} xl={5}>
                                <div className="d-flex justify-content">
                                    <p className="text-white-30 fs-18 mb-0">Language</p>
                                    <p className="text-white-30 fs-18 mb-0">lang</p>
                                </div>
                                <div className="d-flex justify-content">
                                    <p className="text-white-30 fs-18 mb-0">Currency</p>
                                    <p className="text-white-30 fs-18 mb-0"> USD</p>
                                </div> </Col>
                            <Col lg={6} xl={1} />
                            <Col lg={6} xl={5} >
                                <Link>Help Center</Link>
                                <Link>About</Link>
                                <Link>Social Networks</Link>
                            </Col>
                            <Col lg={6} xl={4} className=" mobile-none " />
                        </Row>
                        <Divider className="megamenu-divider mobile-none" />
                        <Row gutter={[16, 16]} className="megamenu-link "  >
                            <Col lg={6} xl={4} className=" mobile-none ">

                            </Col>
                            <Col lg={6} xl={5} className="pt-24 mobile-none">

                            </Col>
                            <Col lg={6} xl={5}>
                                <Title className=" text-white mb-16  megamenu-label  fw-500">Connect</Title>
                                <Link>Report A Bug</Link>
                                <Link>FAQ</Link>
                                <Link>Chat</Link>
                            </Col>

                            <Col lg={6} xl={5} >
                                <Title className="fs-36 text-white mb-16  megamenu-label fw-500 ">Security</Title>
                                <Paragraph className="text-white fs-16">CURRENT SECURITY LEVEL<br /><span className="text-green fw-700">Medium</span></Paragraph>
                                <Link>Backup Wallet</Link>
                                <Link>Reset Wallet</Link>
                                <Link>Always ask pin <Switch onChange={this.onChange} size="small" className="custom-toggle" /></Link>
                                <Link>Activate face ID <Switch defaultChecked onChange={this.onChange} size="small" className="custom-toggle" /></Link>
                                <Link>Activate biometry <Switch defaultChecked onChange={this.onChange} size="small" className="custom-toggle" /></Link>
                            </Col>
                            <Col lg={6} xl={5} />
                        </Row>
                    </div>
                </Modal>
                <Drawer
                    title={[<div className="side-drawer-header"><ArrowLeftOutlined className="text-white c-pointer" onClick={this.closeBuyDrawer} />
                        <div className="text-center fs-14">
                            <Paragraph className="mb-0 text-white-30 fw-600 text-upper">Buy ETH</Paragraph>
                            <Paragraph className="text-white-50 mb-0 fw-300" > Buy ETH to your Wallet</Paragraph></div>
                        <span className="icon md search-white c-pointer" /></div>]}
                    placement="right"
                    closable={true}
                    visible={this.state.payDrawer}
                    closeIcon={null}
                    className="side-drawer"
                >

                    <Input style={{ marginBottom: 0 }} defaultValue="0,0070 ETH" bordered={false} placeholder="ETH" className="custom-input" />
                    <Paragraph className="text-white-50 fw-300 text-center fs-16" ><span className="text-secondary">USD</span> 20,00</Paragraph>
                    <div className="pay-list py-4">
                        <Paragraph className="text-white-50">Exchange Rate</Paragraph>
                        <Paragraph className="text-secondary  fw-300"><span className="text-white-50">1 </span>ETH = USD <span className="text-white-50">2,849.76</span></Paragraph>
                    </div>
                    <div className="pay-list py-4">
                        <Paragraph className="text-white-50 mt-8">Amount</Paragraph>
                        <Paragraph className="text-secondary  fw-300 mt-8">ETH <span className="text-white-50">0,0070125</span></Paragraph>
                    </div>
                    <div className="pay-list py-4">
                        <Paragraph className="text-white-50 mt-8">Suissebase Fee <InfoCircleFilled /></Paragraph>
                        <Paragraph className="text-green  fw-300 mt-8">USD 0,000</Paragraph>
                    </div>
                    <div className="pay-list py-4 mb-8">
                        <Paragraph className="text-white-50 mt-8">Estimated Total</Paragraph>
                        <Paragraph className="text-secondary  fw-300 mt-8"><span className="text-white-50">0.0070125</span> ETH (USD<span className="text-white-50"> 20,00</span>)</Paragraph>
                    </div>
                    <Paragraph className="fs-12 text-secondary text-center mt-16">
                        Your final amount might change due to market activity.
                    </Paragraph>
                    <div className="d-flex px-36 py-36 pt-0" >
                        <CheckOutlined className="fs-20 text-yellow" />
                        <Paragraph className="fs-14 text-secondary mb-16 px-16">
                            I agree to Suissebase’s <Link to="" className="text-yellow">Terms of Service</Link> and its return, refund and cancellation policy.
                        </Paragraph>
                    </div>
                    <Button size="large" block className="pop-btn" onClick={this.showPayCardDrawer} >Pay 0,00701 ETH</Button>
                    <Button type="text" size="large" className="text-center text-white pop-cancel fw-400" >Cancel</Button>
                </Drawer>



                {/* Change billing address */}
                <Drawer
                    title={[<div className="side-drawer-header custom-drawer-header"><ArrowLeftOutlined className="text-white" onClick={this.billingAddress} />
                        <div className="text-center fs-14">
                            <Paragraph className="text-white-50 mb-0 fs-14 fw-500" > CHANGE BILLING ADDRESS</Paragraph></div>
                        <span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" /></div>]}
                    placement="right"
                    closable={true}
                    visible={this.state.billingAddress}
                    closeIcon={null}
                    className="side-drawer text-white"
                >
                    <Title className="text-white fw-400" level={3}>Billing Address</Title>
                    <div className="billing-address">
                        <Paragraph className="text-white mt-8">Your delivary address</Paragraph>
                        <Paragraph className="text-white fw-300 mt-8">UNIT 527 TOWER 4, SMDC Grace Residences, Cayetano Blvd. Brgy. Ususan, Taguig City 1630 PH</Paragraph>
                    </div>
                        <Button size="large" block className="pop-btn" onClick={this.depositCrypto}>CONFIRM BILLING ADDRESS</Button>
                        <Button type="text" size="large" className="text-center text-white pop-cancel fw-400" >Cancel</Button>
                </Drawer>
                <Drawer
                    title={[<div className="side-drawer-header"><span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />
                        <div className="text-center fs-14">
                            <Paragraph className="mb-0 text-white-30 fw-600 text-upper">LINK A CARD OR DEPOSIT</Paragraph>
                            <Paragraph className="text-white-50 mb-0 fw-300" > Select from below </Paragraph>
                        </div>
                        <span className="icon md search-white c-pointer" />
                    </div>]}
                    placement="right"
                    closable={true}
                    visible={this.state.payCardsDrawer}
                    closeIcon={null}
                    className="side-drawer"
                >
                    <div className="d-flex  align-center mb-24 c-pointer" onClick={this.showCardDrawer}>
                        <Avatar size={45} style={{ backgroundColor: "#5d5b6e" }}
                        />
                        <div className="ml-16">
                            <Paragraph className="mb-0 text-white-30 fw-600">Credit Card</Paragraph>
                            <Paragraph className="text-secondary mb-0 fw-300 fs-12" > Use a credit or debit card</Paragraph>
                        </div>
                    </div>
                    <div className="d-flex align-center c-pointer">
                        <Avatar size={45} style={{ backgroundColor: "#5d5b6e" }} />
                        <div className="ml-16">
                            <Paragraph className="mb-0 text-white-30 fw-600">Deposit</Paragraph>
                            <Paragraph className="text-secondary mb-0 fw-300 fs-12" >Deposit from an address or existing wallet</Paragraph>
                        </div>
                    </div>
                </Drawer>
                <Drawer
                    title={[<div className="side-drawer-header"><span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" />
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
                        <label className="text-white-50">Name on card</label>
                        <Input className="cust-input mb-16" defaultValue="Michael Quiapos" />
                        <label className="text-white-50">Card number</label>
                        <Input className="cust-input mb-16" defaultValue="5443 84000 0902 5339" />
                        <div className="d-flex justify-content align-center mb-16">
                            <div className="mr-16">
                                <label className="text-white-50">Expiry</label>
                                <Input className="cust-input mb-16" defaultValue="5/12" />
                            </div>
                            <div className="ml-16">
                                <label className="text-white-50">CVV</label>
                                <Input className="cust-input mb-16" defaultValue="544" />
                            </div>
                        </div>
                        <Paragraph className="text-center"> <Link className="text-white-50 fs-16 ">Type your Billing Address</Link></Paragraph>
                    </div>

                    <Button size="large" block className="pop-btn" onClick={this.billingAddress}>Confirm</Button>

                </Drawer>
                {/* DEPOSIT to crypto */}
                <Drawer
                    title={[<div className="side-drawer-header custom-drawer-header"><ArrowLeftOutlined className="text-white" onClick={this.closeBuyDrawer} />
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
                    <List  onClick={this.depositScanner}
                        itemLayout="horizontal"
                        dataSource={config.tlvCoinsList}
                        renderItem={item => (
                            <List.Item>
                                <Skeleton loading={item.loading} active>
                                    <List.Item.Meta
                                        avatar={<span className={`coin ${item.coin} mr-4`} />}
                                        title={<div className="fs-16 fw-600 text-upper text-white-30 mb-0 mt-12">{item.coin}</div>}
                                    />
                                </Skeleton>
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
                title={[<div className="side-drawer-header custom-drawer-header"><ArrowLeftOutlined className="text-white"  onClick={this.closeBuyDrawer}  />                       
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
                            <img src={sacnner} style={{ width: '164px', height: '164px' }} />
                        </div>
                        <div className="address-bg mt-24">
                            <Paragraph className="mb-0 fw-400">Address</Paragraph>
                            <Paragraph className="mb-0 fs-14 fw-500" >TAQgcJD9p29m77EnXweijpHegPUSnxkdQW</Paragraph>
                        </div>

                        <div className="mt-36 pt-24">
                        <Button size="large" block className="pop-btn">COPY</Button>
                        <Button type="text" size="large" className="text-center text-white pop-cancel fw-400" >Share</Button>
                    </div>
                </Drawer>
            </>
        );
    }
}

export default tlvHeader;