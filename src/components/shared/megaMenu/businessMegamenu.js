import React, { Component } from 'react';
import { Typography, Button, Tooltip,Row, Col ,Divider} from 'antd';
import { Link } from 'react-router-dom';
import megamenu from '../../../assets/images/megamenu.png';

class BusinessMenu extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    depositCrypto = () => {
        console.log(this.state);
    }
    showCardDrawer = () => {
        console.log(this.state);
    }


    render() {
        const { Title, Paragraph, Text } = Typography;
        return (
            <>
                <div className="mega-menu">
                        <Row gutter={16} className="megamenu-link">
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
                                        <Paragraph className="text-white-30 fs-14 mb-0 fw-300">Full control of your private keys.</Paragraph>
                                    </div>
                                    <div className="item-wrapper">
                                        {/* <p>Cards</p> */}
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
                                        <Paragraph className="text-white-30 fs-16  fw-300">User can create a separate account such as a corporate segregated wallet system.</Paragraph>
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
                        <Row gutter={16} className="megamenu-link">

                            <Col lg={5} xl={5}>
                                <Title className=" text-white mb-16 fw-500  megamenu-label">Spend</Title>
                                <Paragraph className="text-white fs-14 fw-300">Your account has security features switched off, leaving it potentially vulnerable to specific attacks. Set up these security features to improve the security of your account.</Paragraph>
                                <Link className="text-secondary">Exchange</Link>
                            </Col>
                            <Col lg={5} xl={4} style={{marginTop:'44px'}}> 
                               <img src={megamenu} width="50%" className="pt-16"/>
                                
                            </Col>
                            <Col lg={5} xl={6}>
                                <Title className=" text-white mb-16 fw-500  megamenu-label">Connect</Title>
                                <Link>Report A Bug</Link>
                                <Link>FAQ</Link>
                                <Link>Chat <span className="icon lg chat"></span></Link>
                            </Col>
                            <Col lg={5} xl={6}>
                                <Title className=" text-white mb-16 fw-500 megamenu-label ">Security</Title>
                                <Paragraph className="text-white fs-14 fw-300">CURRENT SECURITY LEVEL<br /><span className="text-green fw-700">Sign in</span> to see your status</Paragraph>
                                <Paragraph className="text-white fs-14 fw-300">Your account has security features switched off, leaving it potentially vulnerable to specific attacks. Set up these security features to improve the security of your account.</Paragraph>
                            </Col>
                            <Col xl={3} />
                        </Row>
                    </div>
            </>
        )
    }
}

export default BusinessMenu;