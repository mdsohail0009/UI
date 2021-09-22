import React, { Component } from 'react';
import { Layout, Menu, Modal, Typography, Dropdown, Tabs, Row, Col, Divider, Avatar, Carousel, Switch, Drawer, notification, Button } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import { Link, withRouter } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import logoWhite from '../assets/images/logo-white.png';
import logoColor from '../assets/images/logo-color.png';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import en from '../lang/en';
import ch from '../lang/ch';
import my from '../lang/my';
import BuySell from '../components/buy.component';
import SendReceive from '../components/send.component'
import SwapCrypto from '../components/swap.component'
import MassPayment from '../components/buyfiat.component'
import { userManager } from '../authentication';
import Changepassword from '../components/changepassword';
import TransactionsHistory from '../components/transactions.history.component';
import AuditLogs from '../components/auditlogs.component';
import { updateCoinDetails, updateReceiveCoinDetails, updateSwapdata, clearSwapData } from '../reducers/swapReducer';
import { connect } from 'react-redux';
import DefaultUser from '../assets/images/defaultuser.jpg';

counterpart.registerTranslations('en', en);
counterpart.registerTranslations('ch', ch);
counterpart.registerTranslations('my', my);
counterpart.setLocale('en');

const LinkValue = (props) => {
    return (
        <Translate className="text-yellow fw-700 fs-16 d-inlineblock"
            content={props.content}
            component={Link}
        // to="./#"
        />
    )
}
const { menuHeader } = Layout;
const { Title, Paragraph, Text } = Typography;
const { TabPane } = Tabs;


class Header extends Component {
    securityMenu = (

        <Menu>
            <Translate className="fs-24 text-white my-16 fw-500 mx-30" content="security" component={Title} />
            <ul className="pl-0 drpdwn-list">
                <li className="no-hover dropdown-flex text-white fs-14 pb-16">2FA<Switch size="small" checked={this.props.userConfig?.twofactorVerified} onChange={(status) => {
                    if (status == true) {
                        window.open(process.env.REACT_APP_AUTHORITY + "/account/login?returnUrl=/manage/EnableAuthenticator", "_self");
                    } else {
                        window.open(process.env.REACT_APP_AUTHORITY + "/account/login?returnUrl=/manage/Disable2faWarning", "_self");
                    }
                }} /> </li>
                <li className="">
                    {/* <Translate content="change_password" component={Link} to="/changepassword" /> */}
                    <Link className="dropdown-flex" to="/changepassword" >Change Password <span className="icon md rarrow-white" /></Link>

                </li>
                <li className="no-hover">
                    <div className="">
                        <Translate className="text-white fs-14 pt-16 mb-0" content="current_security_level" component={Paragraph} />
                        <Translate className="text-green fw-900" content="medium" component={Paragraph} />
                    </div>
                    <Translate className="text-white fs-14" style={{ paddingRight: '78px' }} content="current_security_text" component={Paragraph} />
                </li>
                <li>
                    <div className="dropdown-flex-top">
                        <Translate content="protect_your_account" component={Link} />
                        <span className="icon md rarrow-white" />
                    </div>
                </li>
            </ul>
        </Menu>
    );
    settingMenu = (
        <Menu>
            <Translate className="fs-24 text-white my-16 fw-500 mx-30" content="settings" component={Title} />
            <ul className="pl-0 drpdwn-list">
                <li className>
                    <div className="dropdown-flex">
                        <Translate content="general" component={Link} />
                        <span className="icon md rarrow-white" />
                    </div>
                </li>
                <li>
                    <div className="dropdown-flex">
                        <Translate content="privacy_policy" component={Link} />
                        <span className="icon md rarrow-white" />
                    </div>
                </li>
                <li>
                    <div className="dropdown-flex">
                        <Translate content="terms_service" component={Link} />
                        <span className="icon md rarrow-white" />
                    </div>
                </li>
                <li>
                    <div className="dropdown-flex">
                        <Translate content="about" component={Link} />
                        <span className="icon md rarrow-white" />
                    </div>
                </li>
                <li>
                    <div className="dropdown-flex">
                        <Translate content="wallet_version" component={Link} />
                        <span className="icon md rarrow-white" />
                    </div>
                </li>
                <li>
                    <div className="dropdown-flex">
                        <Translate content="preferences" component={Link} />
                        <span className="icon md rarrow-white" />
                    </div>
                </li>
                <li>
                    <div className="dropdown-flex">
                        <Translate content="language" component={Link} />
                        <span className="icon md rarrow-white" />
                    </div>
                </li>
                <li>
                    <div className="dropdown-flex">
                        <Translate content="local_currency" component={Link} />
                        <span className="icon md rarrow-white" />
                    </div>
                </li>
                <li>
                    <div className="dropdown-flex">
                        <Translate content="notifications" component={Link} />
                        <span className="icon md rarrow-white" />
                    </div>
                </li>
                <li>
                    <div className="dropdown-flex">
                        <Translate content="themes" component={Link} />
                        <span className="icon md rarrow-white" />
                    </div>
                </li>
                {/* <li onClick={() => this.setState({ ...this.state, showChangePassword: true })}>
                    <div className="dropdown-flex">
                        <Translate content="change_password" component={Link} />
                        <span className="icon md rarrow-white" />
                    </div>
                </li> */}
                <li className="d-flex justify-content align-center c-pointer" onClick={() => userManager.signoutRedirect()}>
                    <Translate content="logout" component={Link} />
                    <span className="icon md rarrow-white" />
                </li>
            </ul>
        </Menu>
    );
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
            showChangePassword: false,
            transactionDrawer: false,
            auditlogsDrawer: false
        }
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.carousel = React.createRef();
        this.userProfile = this.userProfile.bind(this);
    }
    userProfile() {
        debugger;
        this.props.history.push("/userprofile");
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
        // this.setState({
        //     buyDrawer: true
        // })
        if (this.props.userConfig.isKYC) {
            this.setState({
                buyDrawer: true
            })
        } else {
            this.props.history.push("/notkyc");
            //notification.error({ message: "", description: 'Please complete Your '+ (this.props.userConfig.isbusines?'KYB.':'KYC.') });
        }
    }
    showSendDrawer = () => {
        // this.setState({
        //     sendDrawer: true
        // })
        if (this.props.userConfig.isKYC) {
            this.setState({
                sendDrawer: true
            })
        } else {
            this.props.history.push("/notkyc");
            //notification.error({ message: "", description: 'Please complete Your '+ (this.props.userConfig.isbusines?'KYB.':'KYC.') });
        }
    }
    showTransactionHistoryDrawer = () => {
        this.setState({
            transactionDrawer: true
        })
    }
    showAuditLogsDrawer = () => {
        debugger
        this.setState({
            auditlogsDrawer: true
        })
    }



    showSwapDrawer = () => {
        // this.setState({
        //     swapDrawer: true
        // })
        if (this.props.userConfig.isKYC) {
            this.setState({
                swapDrawer: true
            })
        } else {
            this.props.history.push("/notkyc");
        }
    }
    showBuyFiatDrawer = () => {
        // this.setState({
        //     buyFiatDrawer: true,
        // })
        if (this.props.userConfig.isKYC) {
            this.setState({
                buyFiatDrawer: true
            })
        } else {
            this.props.history.push("/notkyc");
            // notification.error({ message: "", description: 'Please complete Your '+ (this.props.userConfig.isbusines?'KYB.':'KYC.') });
        }
    }
    closeDrawer = () => {
        if (this.child) this.child.clearValues();
        let obj = {};
        this.props.fromObjSwap(obj);
        this.props.receiveObjSwap(obj);
        this.props.updateSwapdataobj({
            fromCoin: null,
            receiveCoin: null,
            price: null,
            fromValue: null,
            receiveValue: null,
            errorMessage: null
        })
        this.props.clearSwapfullData()
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
            transactionDrawer: false,
            auditlogsDrawer: false
        })
    }
    enableDisable2fa = (status) => {
        var url = '';
        if (status) {
            url = process.env.REACT_APP_AUTHORITY + "/account/login?returnUrl=/manage/EnableAuthenticator";
        } else {
            url = process.env.REACT_APP_AUTHORITY + "/account/login?returnUrl=/manage/Disable2faWarning"
        }
        var win = window.open(url);

    }

    render() {
        const { initLoading, loading } = this.state;
        const link = <LinkValue content="medium" />;
        const depostWithdrawMenu = (
            <Menu>
                <ul className="pl-0 drpdwn-list">
                    <li onClick={this.showSendDrawer}>
                        <Link>Crypto <span className="icon md rarrow-white" /></Link>
                    </li>
                    <li onClick={this.showBuyFiatDrawer}>
                        <Link>Fiat <span className="icon md rarrow-white" /></Link>
                    </li>
                </ul>
            </Menu>
        )
        const userProfileMenu = (
            <Menu>
                <div className="profile-dropdown">
                    {this.props.userConfig?.imageURL != null && <img src={this.props.userConfig?.imageURL ? this.props.userConfig?.imageURL : DefaultUser} className="user-profile" />}
                    {this.props.userConfig?.imageURL == null && <img src={this.props.userConfig?.imageURL ? this.props.userConfig?.imageURL : DefaultUser} className="user-profile" />}
                    <p className="mb-15 ml-8 profile-value" style={{ flexGrow: 12 }}>{this.props.userConfig.firstName} {this.props.userConfig.lastName}</p>
                    {/* <Translate className="fs-16 text-white my-16 fw-500 mx-30" content="userName" component={this.props.userConfig.userName} /> */}
                    <Translate content="manage_account" component={Button} size="medium" block className="profile-btn" onClick={() => this.userProfile()} />
                    {/* <Link className="profile-btn" to="/userprofile" >Manage Your Account</Link> */}
                    <ul className="pl-0 drpdwn-list">
                        <Menu.Item className="px-0" onClick={() => this.showAuditLogsDrawer()}>
                            <li className="c-pointer px-0">
                                <Link>Audit Logs</Link>
                            </li>
                        </Menu.Item>
                        <li className="c-pointer px-0" onClick={() => userManager.signoutRedirect()}>
                            <Translate content="logout" component={Link} />
                        </li>
                    </ul>
                </div>
            </Menu>
        );
        return (
            <>
                <Layout className="layout">
                    <menuHeader className="tlv-header" id="area">
                        <div className="login-user">
                            <ul className="header-logo pl-0">
                                <li className="pr-30 p-relative">{this.props.userConfig.isKYC ? <Link to="/dashboard"><img src={logoColor} alt="logo" className="tlv-logo" /></Link> : <Link ><img src={logoColor} alt="logo" className="tlv-logo" /></Link>}</li>
                                <li className="px-36"><span className="icon md hamburger c-pointer" /></li>
                                {/* Mega menu ==> onClick={this.showMegaMenu} */}
                                <li className="mb-d-none"><Translate content="header_title" with={{ lable: this.props.userConfig?.isBusiness ? " Business" : " Personal" }} component="p" className="text-white-30 mb-0 fs-24" /></li>
                            </ul>
                            <Menu theme="light" mode="horizontal" className="header-right mobile-header-right">

                                <Menu.Item key="6"><span className="icon md bell" /></Menu.Item>
                                <Dropdown overlay={userProfileMenu} trigger={['click']} placement="topRight" arrow overlayClassName="secureDropdown" getPopupContainer={() => document.getElementById('area')}>
                                    <Menu.Item key="7">{this.props.userConfig?.imageURL != null && <img src={this.props.userConfig?.imageURL ? this.props.userConfig?.imageURL : DefaultUser} className="user-profile" />}
                                        {this.props.userConfig?.imageURL == null && <img src={this.props.userConfig?.imageURL ? this.props.userConfig?.imageURL : DefaultUser} className="user-profile" />}</Menu.Item>
                                </Dropdown>
                            </Menu>
                        </div>
                        <Menu theme="light" mode="horizontal" className="header-right" >
                            {/* <Menu.Item key="1" className="list-item" onClick={this.showBuyDrawer}>Buy / Sell</Menu.Item> */}
                            <Translate content="menu_buy_sell" component={Menu.Item} key="1" onClick={this.showBuyDrawer} className="list-item" />
                            <Translate content="menu_swap" component={Menu.Item} key="2" onClick={this.showSwapDrawer} className="list-item" />
                            <Dropdown overlay={depostWithdrawMenu} trigger={['click']} placement="bottomCenter" arrow overlayClassName="secureDropdown depwith-drpdown" getPopupContainer={() => document.getElementById('area')}>
                                <Translate content="menu_send_receive" component={Menu.Item} key="3" className="mr-16" />
                            </Dropdown>
                            {/* <Translate content="menu_mass_pay" component={Menu.Item} key="4" onClick={this.showBuyFiatDrawer} className="list-item" /> */}
                            {/* <Dropdown overlay={this.securityMenu} placement="topRight" arrow overlayClassName="secureDropdown" getPopupContainer={() => document.getElementById('area')}>
                                <Translate key="5" content="security" component={Menu.Item} />
                            </Dropdown> */}
                            <Translate content="menu_transactions_history" component={Menu.Item} key="4" onClick={this.showTransactionHistoryDrawer} className="list-item" />
                            <Menu.Item key="6"><span className="icon md bell ml-4" /></Menu.Item>
                            <Dropdown overlay={userProfileMenu} trigger={['click']} placement="topRight" arrow overlayClassName="secureDropdown" getPopupContainer={() => document.getElementById('area')}>
                                <Menu.Item key="7" className="ml-16" >{this.props.userConfig?.imageURL != null && <img src={this.props.userConfig?.imageURL ? this.props.userConfig?.imageURL : DefaultUser} className="user-profile" />}
                                    {this.props.userConfig?.imageURL == null && <img src={this.props.userConfig?.imageURL ? this.props.userConfig?.imageURL : DefaultUser} className="user-profile" />}</Menu.Item>
                            </Dropdown>
                        </Menu>
                    </menuHeader>
                </Layout >
                <Modal
                    title={[<div className="megamenu-title fs-24 text-white">
                        <img src={logoWhite} alt="logo" className="tlv-logo" />
                        <div><span className="icon sm r-arrow-o-white mr-16 c-pointer" style={{ transform: 'rotate(180deg)' }} onClick={this.previous} ></span>
                            <span className="icon sm r-arrow-o-white c-pointer ml-24" onClick={this.next}></span>
                            <Translate content="sign_in" className="text-white-30 fs-18 fw-300 c-pointer menu-items menu_Link ml-16" /></div>
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
                                <Col md={16} lg={16} xl={5}>
                                    <div className="wrapper">
                                        <div className="item-wrapper">
                                            <Translate className="text-white megamenu-label mb-16 fw-500 mt-0" content="start" component={Title} />
                                            <Translate className="text-white-30 fs-16 mb-24 fw-300" content="start_text" component={Paragraph} />
                                        </div>
                                        <div className="item-wrapper">
                                            <Translate content="the_dashboard" to="/dashboard" onClick={() => { this.setState({ ...this.state, megamenu: false }) }} className="text-white-30 fs-18 fw-300 c-pointer menu-items menu_Link" />
                                            <Translate content="your_portfolio" to="/dashboard" onClick={() => { this.setState({ ...this.state, megamenu: false }) }} className="text-white-30 fs-18 fw-300 c-pointer menu-items menu_Link" />
                                        </div>
                                    </div>
                                </Col>
                                <Col md={16} lg={16} xl={4}>
                                    <div className="wrapper">
                                        <div className="item-wrapper">
                                            <Translate className="text-white megamenu-label fw-500 mb-24 mt-0" content="personal" component={Title} />
                                            {/* <Link className="pt-24"> Wallets</Link> */}
                                            <Translate className="fs-18 text-white-30 fw-200 mb-0" content="wallets" component={Paragraph} />
                                            <Translate className="text-white-30 fs-16 mb-0 fw-300" content="wallets_text" component={Paragraph} />
                                        </div>
                                        <div className="item-wrapper">
                                            <Translate className="fs-18 text-white-30 fw-200 mb-0" content="cards" component={Paragraph} />
                                            <Translate className="fs-18 text-white-30 fw-200 mb-0" content="exchange" component={Paragraph} />
                                        </div>
                                    </div>
                                </Col>
                                <Col md={16} lg={16} xl={6}>
                                    <div className="wrapper">
                                        <div className="item-wrapper">
                                            <Translate className="text-white megamenu-label fw-500 mt-0" content="crypto" component={Title} />
                                        </div>
                                        <div className="item-wrapper">
                                            <Translate content="buy_and_sell" onClick={() => { this.closeMegaMenu(); this.showBuyDrawer(); }} className="text-white-30 fs-18 fw-300 c-pointer menu-items menu_Link" />
                                            <Translate content="swap_services" onClick={() => { this.closeMegaMenu(); this.showSwapDrawer(); }} className="text-white-30 fs-18 fw-300 c-pointer menu-items menu_Link" />
                                            <Translate content="deposit_and_withdraw" onClick={() => { this.closeMegaMenu(); this.showSendDrawer(); }} className="text-white-30 fs-18 fw-300 c-pointer menu-items menu_Link" />
                                        </div>
                                    </div>
                                </Col>
                                <Col md={16} lg={16} xl={6} >
                                    <div className="wrapper">
                                        <div className="item-wrapper">
                                            <Translate className="text-white megamenu-label fw-500 mt-0" content="business" component={Title} />
                                            <Translate className="text-white-30 fs-16 fw-300" content="business_text" component={Paragraph} />
                                        </div>
                                        <div className="item-wrapper">
                                            <Translate className="text-white-30 fs-18 fw-200 mb-0" content="corporate_wallet" component={Paragraph} />
                                            <Translate content="menu_mass_pay" onClick={() => { this.closeMegaMenu(); this.showBuyFiatDrawer(); }} className="text-white-30 fs-18 fw-300 c-pointer menu-items menu_Link" />
                                        </div>
                                    </div>
                                </Col>
                                <Col xl={3} />
                            </Row>
                            <Divider className="megamenu-divider mobile-none" />
                            <Row gutter={[16, 16]} className="megamenu-link">

                                <Col lg={5} xl={5} className="mobile-none p-0">

                                </Col>
                                <Col lg={5} xl={4} className="mobile-none p-0">

                                </Col>
                                <Col md={16} lg={16} lg={7} xl={6}>
                                    <Translate className="text-white megamenu-label  mb-16 fw-500 mt-0" content="connect" component={Title} />
                                    <Translate className="text-white-30 fs-18 fw-300 mb-0" content="meet_our_team" component={Paragraph} />
                                    <Translate className="text-white-30 fs-18 fw-300 mb-0" content="report_a_bug" component={Paragraph} />
                                    <Translate className="text-white-30 fs-18 fw-300 mb-0" content="FAQ" component={Paragraph} />
                                    <Translate className="text-white-30 fs-18 fw-300 mb-0" content="contact_us" component={Paragraph} />
                                    <Translate className="text-white-30 fs-18 fw-300 mb-0" content="sign_in" component={Paragraph} />

                                </Col>

                                <Col md={16} lg={5} xl={6}>
                                    <Translate className="text-white mb-16 fw-500 megamenu-label mt-0" content="security" component={Title} />
                                    <Translate className="text-white fs-14 fw-400 mb-0" content="current_security_level" component={Paragraph} />
                                    <Translate className="text-green fw-700 " content="medium" component={Paragraph} />
                                    <Translate className="text-white fs-14 fw-400" content="security_text" component={Paragraph} />
                                </Col>
                                <Col xl={3} />
                            </Row>
                        </div>
                        <div className="mega-menu">
                            <Row gutter={16} className="megamenu-link">
                                <Col md={16} lg={16} xl={5}>
                                    <div className="wrapper">
                                        <div className="item-wrapper">
                                            <Translate className="text-white megamenu-label mb-16 fw-500 mt-0" content="preferences" component={Title} />
                                            <Avatar size={60} style={{ backgroundColor: '#87d068' }} icon={<UserOutlined />} />
                                            <Translate className="text-white-30 fs-16 mb-0" content="michael_quiapos" component={Paragraph} />
                                            <Translate className="text-secondary fs-14" content="great" component={Paragraph} />
                                        </div>
                                    </div>
                                </Col>
                                <Col md={16} lg={16} xl={4}>
                                    <div className="wrapper">
                                        <Translate className="text-white megamenu-label fw-500 mb-24 item-wrapper mt-0 " content="wallets" component={Title} />
                                        <div className="item-wrapper">
                                            <Translate className="fs-18 text-white-30 fw-200 mb-0" content="address_book" component={Paragraph} />
                                            <Translate className="fs-18 text-white-30 fw-200 mb-0" content="invite_friends" component={Paragraph} />
                                            <Translate content="buy_crypto" onClick={() => { this.setState({ ...this.state, megamenu: false }); this.showBuyDrawer() }} className="text-white-30 fs-18 fw-300 c-pointer menu-items menu_Link" />
                                            <div className="d-flex align-center">
                                                <Translate className="fs-18 text-white-30 fw-200 mb-0" content="light_theme" component={Paragraph} />
                                                <Switch onChange={this.onChange} size="small" className="custom-toggle ml-12" />
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={16} xl={6}>
                                    <div className="wrapper">
                                        <div className="item-wrapper">
                                            <Translate className="text-white megamenu-label fw-500" content="localization" component={Title} />
                                            <Translate className="text-white-30 fs-16 fw-400" content="localization_text" component={Paragraph} />
                                        </div>
                                        <div className="item-wrapper">
                                            <div className="d-flex justify-content">
                                                <Translate className="text-white-30 fs-18 mb-0 fw-200" content="language" component={Paragraph} />
                                                <Translate className="text-white-30 fs-18 mb-0 fw-200" content="lang" component={Paragraph} />
                                            </div>
                                            <div className="d-flex justify-content">
                                                <Translate className="text-white-30 fs-18 mb-0 fw-200" content="currency" component={Paragraph} />
                                                <p className="text-white-30 fs-18 mb-0  fw-200"> USD</p>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col xl={1} className=" mobile-none p-0" />
                                <Col md={16} lg={16} xl={6} >
                                    <div className="wrapper">
                                        <div className="item-wrapper">
                                            <Translate className="text-white megamenu-label fw-500" content="support" component={Title} />
                                        </div>
                                        <div className="item-wrapper">
                                            {/* <Link>Help Center</Link>
                                            <Link>About</Link>
                                            <Link>Social Networks</Link> */}
                                            <Translate className="fs-18 text-white-30 fw-200 mb-0" content="help_center" component={Paragraph} />
                                            <Translate className="fs-18 text-white-30 fw-200 mb-0" content="about" component={Paragraph} />
                                            <Translate className="fs-18 text-white-30 fw-200 mb-0" content="social_networks" component={Paragraph} />
                                        </div>
                                    </div>
                                </Col>
                                <Col xl={2} className=" mobile-none p-0" />
                            </Row>
                            <Divider className="megamenu-divider mobile-none" />
                            <Row gutter={[16, 16]} className="megamenu-link "  >
                                <Col xl={5} className=" mobile-none p-0">

                                </Col>
                                <Col xl={4} className="pt-24 mobile-none">

                                </Col>
                                <Col md={16} lg={16} xl={6}>
                                    <Translate className=" text-white mb-16  megamenu-label fw-500" content="connect" component={Title} />
                                    <Translate className="fs-18 text-white-30 fw-200 mb-0" content="report_a_bug" component={Paragraph} />
                                    <Translate className="fs-18 text-white-30 fw-200 mb-0" content="FAQ" component={Paragraph} />
                                    <div className="d-flex align-center">
                                        <Translate className="fs-18 text-white-30 fw-200 mb-0" content="chat" component={Paragraph} />
                                        <span className="icon lg chat"></span></div>
                                    {/* <Link>Report A Bug</Link>
                                    <Link>FAQ</Link>
                                    <Link>Chat <span className="icon lg chat"></span></Link> */}
                                </Col>
                                <Col lg={16} xl={1} className=" mobile-none p-0" />
                                <Col md={16} lg={16} xl={6} >
                                    <Translate className=" text-yellow mb-16 megamenu-label fw-500" content="security" component={Title} />
                                    <Translate content="medium_text" with={{ link }} component={Paragraph} className="text-white fs-16" />
                                    <Translate className="fs-18 text-white-30 fw-200 mb-0" content="backup_wallet" component={Paragraph} />
                                    <Translate className="fs-18 text-white-30 fw-200 mb-0" content="reset_wallet" component={Paragraph} />
                                    {/* <Link>Backup Wallet</Link>
                                    <Link>Reset Wallet</Link> */}
                                    <div className="d-flex align-center">
                                        <Translate className="fs-18 mb-0 text-white-30 fw-300" content="always_ask_pin" component={Paragraph} />
                                        <Switch onChange={this.onChange} size="small" className="custom-toggle ml-12" />
                                    </div>
                                    <div className="d-flex align-center">
                                        <Translate className="fs-18 mb-0 text-white-30 fw-300" content="activate_face" component={Paragraph} />
                                        <Switch defaultChecked onChange={this.onChange} size="small" className="custom-toggle ml-12" />
                                    </div>
                                    <div className="d-flex align-center">
                                        <Translate className="fs-18 mb-0 text-white-30 fw-300" content="activate_biometry" component={Paragraph} />
                                        <Switch defaultChecked onChange={this.onChange} size="small" className="custom-toggle ml-12" />
                                    </div>
                                </Col>
                                <Col xl={2} className=" mobile-none p-0" />
                            </Row>
                        </div>
                    </Carousel>
                </Modal>
                <BuySell showDrawer={this.state.buyDrawer} onClose={() => this.closeDrawer()} />
                <SendReceive showDrawer={this.state.sendDrawer} onClose={() => this.closeDrawer()} />
                <SwapCrypto swapRef={(cd) => this.child = cd} showDrawer={this.state.swapDrawer} onClose={() => this.closeDrawer()} />
                <MassPayment showDrawer={this.state.buyFiatDrawer} onClose={() => this.closeDrawer()} />
                {this.state.transactionDrawer&&<TransactionsHistory showDrawer={this.state.transactionDrawer} onClose={() => { this.closeDrawer(); if (this.child1) { this.child1.setKy() } }} thref={(cd) => this.child1 = cd} />}
                <AuditLogs showDrawer={this.state.auditlogsDrawer} onClose={() => this.closeDrawer()} />
                <Drawer
                    title={[<div className="side-drawer-header">
                        <span onClick={() => this.setState({ ...this.state, showChangePassword: false })} className="icon md close-white c-pointer" />
                        <div className="text-center fs-14">
                            <Translate className="mb-0 text-white-30 fw-600 text-upper" content="change_password" component={Paragraph} />
                        </div>

                    </div>]}
                    placement="right"
                    closable={true}
                    visible={this.state.showChangePassword}
                    closeIcon={null}
                    onClose={() => this.setState({ ...this.state, showChangePassword: false })}
                    className="side-drawer"
                >
                    <Changepassword onSubmit={() => { this.setState({ ...this.state, showChangePassword: false }) }} />
                </Drawer>
            </>

        );
    }
}

const connectStateToProps = ({ swapStore, userConfig, oidc }) => {
    return { swapStore, userConfig: userConfig.userProfileInfo }
}
const connectDispatchToProps = dispatch => {
    return {
        fromObjSwap: (obj) => {
            dispatch(updateCoinDetails(obj))
        },
        receiveObjSwap: (obj) => {
            dispatch(updateReceiveCoinDetails(obj))
        },
        updateSwapdataobj: (obj) => {
            dispatch(updateSwapdata(obj))
        },
        clearSwapfullData: (member_id) => {
            dispatch(clearSwapData(member_id))
        },
        dispatch
    }
}

// export default Header;
export default connect(connectStateToProps, connectDispatchToProps)(withRouter(Header));
