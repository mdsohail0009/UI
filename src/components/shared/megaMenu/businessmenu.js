import React, { Component } from 'react';
import { Typography, Row, Col, Divider } from 'antd';
import { Link } from 'react-router-dom';
import megamenu from '../../../assets/images/megamenu.png';
import Translate from 'react-translate-component';

const LinkValue = (props) => {
    return (
        <Translate className="text-yellow text-underline c-pointer"
            content={props.content}
            component={Link}

        />
    )
}
class BusinessMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }

    render() {
        const { Title, Paragraph, Text } = Typography;
        const link = <LinkValue content="deposit" />;
        return (
            <>
                <div className="mega-menu">
                    <Row gutter={16} className="megamenu-link">
                        <Col xl={5}>
                            <div className="wrapper">
                                <div className="item-wrapper">
                                    <Translate className="text-white megamenu-label mb-16 fw-500 mt-0" content="start" component={Title} />
                                    <Translate className="text-white-30 fs-16 mb-24 fw-300" content="start_text" component={Paragraph} />
                                </div>
                                <div className="item-wrapper">

                                    <Link to="/dashboard" onClick={() => { this.setState({ ...this.state, megamenu: false }) }}>The Dashboard</Link>
                                    <Link to="/dashboard" onClick={() => { this.setState({ ...this.state, megamenu: false }) }}>Your Portfolio</Link>

                                </div>
                            </div>
                        </Col>
                        <Col xl={4}>
                            <div className="wrapper">
                                <div className="item-wrapper">
                                    <Translate className="text-white megamenu-label fw-500 mb-24 mt-0" content="crypto" component={Title} />
                                </div>
                                <div className="item-wrapper">
                                    <Translate className="text-white fw-200 mb-0 fs-18 mt-0" content="wallets" component={Paragraph} />
                                    <Translate className="text-white fs-16 mt-0" content="wallets_text" component={Paragraph} />
                                    <Translate className="fs-18 text-white-30 fw-200 mb-0" content="cards" component={Paragraph} />
                                    <Translate className="fs-18 text-white-30 fw-200 mb-0" content="exchange" component={Paragraph} />
                                </div>
                            </div>
                        </Col>
                        <Col xl={6}>
                            <div className="wrapper">
                                <div className="item-wrapper">

                                    <Translate className="text-white megamenu-label fw-500 mb-24 mt-0" content="personal" component={Title} />
                                </div>
                                <div className="item-wrapper">
                                    <Translate content="menu_buy_sell" with={{ link }} component={Paragraph} className="menu_Link" onClick={() => { this.closeMegaMenu(); this.showBuyDrawer(); }} />
                                    <Translate content="menu_swap" with={{ link }} component={Paragraph} className="menu_Link" onClick={() => { this.closeMegaMenu(); this.showSwapDrawer(); }} />
                                    <Translate content="menu_send_receive" with={{ link }} component={Paragraph} className="menu_Link" onClick={() => { this.closeMegaMenu(); this.showSendDrawer(); }} />
                                </div>
                            </div>
                        </Col>
                        <Col xl={6} >
                            <div className="wrapper">
                                <div className="item-wrapper">
                                    <Translate className="text-white megamenu-label fw-500 mb-24 mt-0" content="business" component={Title} />
                                    <Translate className="text-white-30 fs-16 mb-24 fw-300" content="business_text" component={Paragraph} />
                                </div>
                                <div className="item-wrapper">
                                    <Translate className="text-white-30 fs-18 fw-200 mb-0" content="corporate_wallet" component={Paragraph} />
                                    <Translate content="menu_mass_pay" with={{ link }} component={Paragraph} className="menu_Link" onClick={() => { this.closeMegaMenu(); this.showBuyFiatDrawer(); }} />
                                </div>
                            </div>
                        </Col>
                        <Col xl={3} />
                    </Row>
                    <Divider className="megamenu-divider mobile-none" />
                    <Row gutter={16} className="megamenu-link">
                        <Col lg={5} xl={5}>
                            <Translate className="text-white mb-16 fw-500  megamenu-label mt-0" content="spend" component={Title} />
                            <Translate className="text-white-30 fs-16 mb-8 fw-300" content="spend_text" component={Paragraph} />
                            <Translate className="text-white-30 fs-18 fw-200 mb-0" content="exchange" component={Paragraph} />
                        </Col>
                        <Col lg={5} xl={4} style={{ marginTop: '44px' }}>
                            <img src={megamenu} width="50%" className="pt-16" />
                        </Col>
                        <Col lg={5} xl={6}>
                            <Translate className="text-white mb-16 fw-500  megamenu-label mt-0" content="connect" component={Title} />
                            <Translate className="text-white-30 fs-18 fw-200 mb-0" content="report_a_bug" component={Paragraph} />
                            <Translate className="text-white-30 fs-18 fw-200 mb-0" content="FAQ" component={Paragraph} />
                            <div className="d-flex">
                                <Translate className="text-white-30 fs-18 fw-200 mb-0" content="chat" component={Paragraph} /> <span className="icon lg chat ml-8"></span>
                            </div>

                        </Col>
                        <Col lg={5} xl={6}>
                            <Translate className="text-white mb-16 fw-500  megamenu-label mt-0" content="security" component={Title} />
                            <Translate className="text-white fs-14 fw-300 mb-0" content="current_security_level" component={Paragraph} />
                            <Translate className="text-green fw-700 mr-4" content="sign_in" component={Text} />
                            <Translate className="text-white fs-14 fw-300" content="status" component={Text} />

                            <Translate className="text-white fs-14 fw-300 mt-16" content="security_text" component={Paragraph} />

                        </Col>
                        <Col xl={3} />
                    </Row>
                </div>
            </>
        )
    }
}

export default BusinessMenu;