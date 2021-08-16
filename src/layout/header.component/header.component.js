import React, { Component } from 'react';
import { Layout, Menu,  Typography, Dropdown, Tabs, Switch, Drawer } from 'antd';
import { Link } from 'react-router-dom';
import logoColor from '../../assets/images/logo-color.png';
import counterpart from 'counterpart';
import Translate from 'react-translate-component';
import en from '../../lang/en';
import ch from '../../lang/ch';
import my from '../../lang/my';
import BuySell from '../../components/buy.component';
import SendReceive from '../../components/send.component'
import SwapCrypto from '../../components/swap.component'
import MassPayment from '../../components/buyfiat.component'
import Changepassword from '../../components/changepassword';
import { updateCoinDetails, updateReceiveCoinDetails, updateSwapdata,clearSwapData } from '../../reducers/swapReducer';
import { connect } from 'react-redux';
import MegaMenu from './megaMenu.component'
import SettingsMenu from './settingsMenu.component'
import SecurityMenu from './securityMenu.component'

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
           <SecurityMenu/>
        </Menu>
    );
    settingMenu = (
        <Menu><SettingsMenu/></Menu>
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
        }
      
    }
   
    onChange(checked) {
        console.log(`switch to ${checked}`);
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
        this.child.clearValues();
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
        return (
            <>
                <Layout className="layout">
                    <menuHeader className="tlv-header" id="area">
                        <div className="login-user">
                            <ul className="header-logo pl-0">
                                <li className="pr-30 p-relative"><Link><img src={logoColor} alt="logo" className="tlv-logo" /></Link></li>
                               <MegaMenu></MegaMenu>
                                <li className="mb-d-none"><Translate content="header_title" component="p" className="text-white-30 mb-0 fs-24" /></li>
                            </ul>
                            <Menu theme="light" mode="horizontal" className="header-right mobile-header-right">
                                <Dropdown overlay={this.securityMenu}  placement="topRight" arrow overlayClassName="secureDropdown" getPopupContainer={() => document.getElementById('area')}>
                                    <Menu.Item key="5">Security</Menu.Item>
                                </Dropdown>
                                <Menu.Item key="6"><span className="icon md bell" /></Menu.Item>
                                <Dropdown overlay={this.settingMenu} trigger={['click']} placement="topRight" arrow overlayClassName="secureDropdown" getPopupContainer={() => document.getElementById('area')}>
                                    <Menu.Item key="7"><span className="icon md gear" /></Menu.Item>
                                </Dropdown>
                            </Menu>
                        </div>
                        <Menu theme="light" mode="horizontal" className="header-right" defaultSelectedKeys={['1']}>
                            {/* <Menu.Item key="1" className="list-item" onClick={this.showBuyDrawer}>Buy / Sell</Menu.Item> */}
                            <Translate content="menu_buy_sell" component={Menu.Item} key="1" onClick={this.showBuyDrawer} className="list-item" />
                            <Translate content="menu_swap" component={Menu.Item} key="2" onClick={this.showSwapDrawer} className="list-item" />
                            <Dropdown overlay={depostWithdrawMenu} trigger={['click']} placement="bottomCenter" arrow overlayClassName="secureDropdown depwith-drpdown" getPopupContainer={() => document.getElementById('area')}>
                                <Translate content="menu_send_receive" component={Menu.Item} key="3" className="mr-16" />
                            </Dropdown>
                            {/* <Translate content="menu_mass_pay" component={Menu.Item} key="4" onClick={this.showBuyFiatDrawer} className="list-item" /> */}
                            <Dropdown overlay={this.securityMenu} placement="topRight" arrow overlayClassName="secureDropdown" getPopupContainer={() => document.getElementById('area')}>
                                <Translate key="5" content="security" component={Menu.Item} />
                            </Dropdown>
                            <Menu.Item key="6"><span className="icon md bell ml-4" /></Menu.Item>
                            <Dropdown overlay={this.settingMenu} trigger={['click']} placement="topRight" arrow overlayClassName="secureDropdown" getPopupContainer={() => document.getElementById('area')}>
                                <Menu.Item key="7"><span className="icon md gear ml-4" /></Menu.Item>
                            </Dropdown>
                        </Menu>
                    </menuHeader>
                </Layout >
                
                <BuySell showDrawer={this.state.buyDrawer} onClose={() => this.closeDrawer()} />
                <SendReceive showDrawer={this.state.sendDrawer} onClose={() => this.closeDrawer()} />
                <SwapCrypto swapRef={(cd) => this.child = cd}  showDrawer={this.state.swapDrawer} onClose={() => this.closeDrawer()} />
                <MassPayment showDrawer={this.state.buyFiatDrawer} onClose={() => this.closeDrawer()} />
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

const connectStateToProps = ({ swapStore, userConfig,oidc }) => {
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
        clearSwapfullData: (member_id) => {
            dispatch(clearSwapData(member_id))
        },
        dispatch
    }
}

// export default Header;
export default connect(connectStateToProps, connectDispatchToProps)(Header);
