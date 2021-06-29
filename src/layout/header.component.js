import React, { Component } from 'react';
import { Layout, Menu, Modal, Typography, Row, Col, Divider, Dropdown, Avatar, Drawer, Radio, Tabs,Switch } from 'antd';
import { RightOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import logoWhite from '../assets/images/logo-white.png';
import megamenu from '../assets/images/megamenu.png';
import counterpart from 'counterpart';
import CryptoList from '../components/shared/cryptolist';
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
const { TabPane } = Tabs;
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
            buyDrawer: false
        })
    }
    handleBuySellToggle = e => {
        this.setState({
            buyToggle: e.target.value,
        });
    };
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
                            title={[<div className="side-drawer-header"><span onClick={this.closeBuyDrawer} className="icon md close-white c-pointer" /><div className="text-center fs-14"><Paragraph className="mb-0 text-white-30 fw-600 text-upper">Buy Assets</Paragraph><Paragraph className="text-white-50 mb-0 fw-300">In the past 24 hours</Paragraph></div><span className="icon md search-white c-pointer" /></div>]}
                            placement="right"
                            closable={true}
                            visible={this.state.buyDrawer}
                            closeIcon={null}
                            className="side-drawer"
                        >
                            <Radio.Group
                                options={options}
                                onChange={this.handleBuySellToggle}
                                value={this.state.buyToggle}
                                optionType="button"
                                buttonStyle="solid"
                                size="large"
                                className="buysell-toggle"
                            />
                            <Title className="text-white-30 fs-36 fw-200 mb-16">Purchase a Crypto</Title>
                            <Paragraph className="fs-16 text-secondary">Your wallet is empty, you don’t have any assets to make transactions. Follow this link and <Link className="text-yellow"><u>Deposit</u></Link> some cash.</Paragraph>
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
                            </Tabs>
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
                        <Col lg={6} xl={5} >
                            <Link>Corporate Wallet</Link>
                            <Link>Mass Payments</Link>
                        </Col>
                        <Col lg={6} xl={5} />
                    </Row>
                    <Divider className="megamenu-divider" />
                    <Row gutter={[16, 16]} className="megamenu-link "  >
                        <Col lg={6} xl={4}>
                            <Title className="text-white megamenu-label mb-16 fw-500">Spend</Title>
                            <Paragraph className="text-white-30 fs-16 mb-24">Use our Visa and Mastercards to convert, spend your crypto and traditional currency in real life.</Paragraph>
                        </Col>
                        <Col lg={6} xl={5} className="pt-24 mobile-none">
                        <img src={megamenu} alt="logo" />
                        </Col>
                        <Col lg={6} xl={5}>
                        <Title className=" text-white mb-16  megamenu-label  fw-500">Connect</Title>
                            <Link>Report A Bug</Link>
                            <Link>FAQ</Link>
                            <Link>Chat</Link>
                        </Col>

                        <Col lg={6} xl={5} >
                        <Title className="fs-36 text-white mb-16 fw-500">Security</Title>
                            <Paragraph className="text-white fs-16">CURRENT SECURITY LEVEL<br /><span className="text-green fw-700">Medium</span></Paragraph>
                            <Paragraph className="text-white fs-16">Your account has security features switched off, leaving it potentially vulnerable to specific attacks. Set up these security features to improve the security of your account.</Paragraph>
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
                                <Link>Light Theme <Switch  onChange={this.onChange}size="small" className="custom-toggle" /></Link>
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
                            <Col lg={6} xl={1} className=" mobile-none "/>
                            <Col lg={6} xl={5} >
                                <Title className="text-white megamenu-label  fw-500">Support</Title>
                                <div className="mobile-megalinks">
                                <Link>Help Center</Link>
                                <Link>About</Link>
                                <Link>Social Networks</Link>
                                </div>
                            </Col>
                            <Col lg={6} xl={5}  className=" mobile-none " />
                        </Row>
                        <Row gutter={[16, 16]} className="megamenu-link mobile-none ">
                            <Col lg={6} xl={5} className=" mobile-none ">
                            </Col>
                            <Col lg={6} xl={4}>
                                <Link>Address Book</Link>
                                <Link>Invite Friends</Link>
                                <Link>Buy Crypto</Link>
                                <Link>Light Theme <Switch  onChange={this.onChange}size="small" className="custom-toggle" /></Link>
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
                            <Col lg={6} xl={1}  />
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
                                <Link>Always ask pin <Switch onChange={this.onChange} size="small"className="custom-toggle"/></Link>
                                <Link>Activate face ID <Switch defaultChecked onChange={this.onChange} size="small"className="custom-toggle"/></Link>
                                <Link>Activate biometry <Switch defaultChecked  onChange={this.onChange} size="small" className="custom-toggle"/></Link>
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