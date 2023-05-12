import React, { Component } from 'react';
import {  Modal,Carousel,Row, Col,Typography,Divider, Avatar,  Switch,notification} from 'antd';
import logoWhite from '../../assets/images/logo-white.png';
import Translate from 'react-translate-component';
import { UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import BuySell from '../../components/buy.component';
import SendReceive from '../../components/send.component'
import SwapCrypto from '../../components/swap.component'
import MassPayment from '../../components/buyfiat.component'
import { updateCoinDetails, updateReceiveCoinDetails, updateSwapdata,clearSwapData } from '../../reducers/swapReducer';
import { connect } from 'react-redux';

const { Title, Paragraph} = Typography;

const LinkValue = (props) => {
    return (
        <Translate className="text-yellow fw-700 fs-16 d-inlineblock"
            content={props.content}
            component={Link}
        />
    )
}
class MegaMenu extends Component {

    constructor(props) {
        super(props);
        this.state = {
            megamenu: false,
            buyDrawer: false,
            sendDrawer: false,
            swapDrawer: false,
            buyFiatDrawer: false,
        }
        this.next = this.next.bind(this);
        this.previous = this.previous.bind(this);
        this.carousel = React.createRef();
    }
    closeDrawer = () => {
        if(this.child)this.child.clearValues();
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
            sendDrawer: false,
            swapDrawer: false,
            buyFiatDrawer: false,
        })
    }
    next() {
        this.carousel.next();
    }
    previous() {
        this.carousel.prev();
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
        if (this.props.userConfig?.isKYC) {
            this.setState({
                buyDrawer: true
            })
        } else {
            notification.error({ message: "", description: 'Please complete Your '+ (this.props?.userConfig?.isBusiness?'KYB.':'KYC.') });
        }
    }
    showSendDrawer = () => {
        if (this.props.userConfig?.isKYC) {
            this.setState({
                sendDrawer: true
            })
        } else {
            notification.error({ message: "", description: 'Please complete Your '+ (this.props?.userConfig?.isBusiness?'KYB.':'KYC.') });
        }
    }
    showSwapDrawer = () => {
        if (this.props.userConfig?.isKYC) {
            this.setState({
                swapDrawer: true
            })
        } else {
            notification.error({ message: "", description: 'Please complete Your '+ (this.props?.userConfig?.isBusiness?'KYB.':'KYC.') });
        }
    }
    showBuyFiatDrawer = () => {
        if (this.props.userConfig?.isKYC) {
            this.setState({
                buyFiatDrawer: true
            })
        } else {
            notification.error({ message: "", description: 'Please complete Your '+ (this.props?.userConfig?.isBusiness?'KYB.':'KYC.') });
        }
    }
    render() {
        const link = <LinkValue content="medium" />;
        return(
            <>
            <li className="px-36"><span className="icon md hamburger c-pointer" onClick={this.showMegaMenu} /></li>
                <BuySell showDrawer={this.state.buyDrawer} onClose={() => this.closeDrawer()} />
                <SendReceive showDrawer={this.state.sendDrawer} onClose={() => this.closeDrawer()} />
                <SwapCrypto swapRef={(cd) => this.child = cd} showDrawer={this.state.swapDrawer} onClose={() => this.closeDrawer()} />
                <MassPayment showDrawer={this.state.buyFiatDrawer} onClose={() => this.closeDrawer()} />
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
                        <Col md={16} lg={16}  xl={6}>
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
                        </Col>
                        <Col lg={16} xl={1} className=" mobile-none p-0" />
                        <Col md={16} lg={16} xl={6} >
                            <Translate className=" text-yellow mb-16 megamenu-label fw-500" content="security" component={Title} />
                            <Translate content="medium_text" with={{ link }} component={Paragraph} className="text-white fs-16" />
                            <Translate className="fs-18 text-white-30 fw-200 mb-0" content="backup_wallet" component={Paragraph} />
                            <Translate className="fs-18 text-white-30 fw-200 mb-0" content="reset_wallet" component={Paragraph} />
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
        </>
        )
    }
}
const connectStateToProps = ({ swapStore, userConfig }) => {
    return { swapStore,userConfig: userConfig.userProfileInfo }
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
        clearSwapfullData: (customer_id) => {
            dispatch(clearSwapData(customer_id))
        },
        dispatch
    }
}
export default connect(connectStateToProps, connectDispatchToProps)(MegaMenu);