import React, { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import {
    Layout,
    Menu,
    Typography,
    Dropdown,
    Drawer,
    Button, Popover
} from "antd";
import { setHeaderTab, setStep, setSellHeaderHide, setSelectedSellCoin } from "../../../reducers/buysellReducer";
import Translate from "react-translate-component";
import en from "../../../lang/en";
import ch from "../../../lang/ch";
import my from "../../../lang/my";
import DefaultUser from "../../../assets/images/defaultuser.jpg";
import counterpart from "counterpart";
import { connect } from "react-redux";
import BuySell from "../../buy.component";
import SendReceive from "../../send.component";
import SwapCrypto from "../../swap.component";
import Transfor from "../../transfor.component";
import MassPayment from "../../buyfiat.component";
import Changepassword from "../../changepassword";
import AuditLogs from "../../auditlogs.component";
import Notifications from "../../../notifications";
import Wallets from "../../wallets.component.js";
import TheamSwitch from "./theamSwitch"
import {
    setStepcode as transforSetStep
} from "../../../reducers/tranfor.Reducer";
import {
    updateCoinDetails,
    updateReceiveCoinDetails,
    updateSwapdata,
    clearSwapData,
} from "../../../reducers/swapReducer";
import { setStep as byFiatSetStep, setReceiveFiatHead, setSendFiatHead } from "../../../reducers/buyFiatReducer";
import {
    setStep as sendSetStep,
    setWithdrawfiat,
    setWithdrawfiatenaable,
    setSendCrypto,
    hideSendCrypto
} from "../../../reducers/sendreceiveReducer";
import { getmemeberInfo } from "../../../reducers/configReduser";
import { clearPermissions, fetchFeatures, getScreenName, setSelectedFeatureMenu } from "../../../reducers/feturesReducer";
import { readNotification as readNotifications } from "../../../notifications/api";
import apicalls from "../../../api/apiCalls";
import { setNotificationCount } from "../../../reducers/dashboardReducer";
import { userManager } from "../../../authentication";
import { setCurrentAction } from "../../../reducers/actionsReducer";
import { KEY_URL_MAP } from "./config";
import { getFeaturePermissionsByKey } from "./permissionService";
import { headerSubscriber } from "../../../utils/pubsub";
import { checkCustomerState } from "../../../utils/service";

counterpart.registerTranslations("en", en);
counterpart.registerTranslations("ch", ch);
counterpart.registerTranslations("my", my);
const { Paragraph, Text } = Typography;
const { Sider } = Layout;
class MobileHeaderMenu extends Component {
    render() {
        const { onMenuItemClick, features: { features: { data },getScreen },dispatch } = this.props;

        return <> <Menu
            theme="light"
            mode="vertical"
            className="header-right"
            selectedKeys={[this.props.buySell?.headerTab]}
            onSelect={(key) => {
                this.props.dispatch(setHeaderTab(key.key));
            }}
        >
            <Translate
                content="header_title"
                onClick={this.props.routeToCockpit}
                component={Menu.Item}
                className={getScreen?.getScreen === "dashboard" ? "active" : "custom-inactive"}
            />
            {data?.map((item, indx) => item.menuitemType === "dropdown" ?
                <><Translate
                    content={item.content}
                    component={Menu.Item}
                    key={indx}
                    className="mr-16"
                /><Menu>
                        <ul className="drpdwn-list">
                            {item?.subMenu?.map((subItem) => <li
                                className={getScreen?.getScreen === item.content ? "" : "custom-inactive"}

                                onClick={() => {
                                    onMenuItemClick(subItem.key, subItem);
                                    dispatch(getScreenName(item.content))

                                }}>
                                <Link>
                                    <Translate content={subItem.content} conmponent={Text} />{" "}
                                    <span className="icon md rarrow-white" />
                                </Link>
                            </li>)}

                        </ul>
                    </Menu></>
                : item.key === "trade" && <Translate
                    content={item.content}
                    component={Menu.Item}
                    key={indx}
                    onClick={() => onMenuItemClick(item.key, item)}
                    className="list-item"
                />)}
        </Menu>
        </>
    }
}
class HeaderPermissionMenu extends Component {

    state = {
        visbleProfileMenu: false,
        drawerMenu: {
            balances: false,
            transactions: false,
            depositWithdraw: false,
            transfer: false,
            sendreceive: false,
            sendreceivefiat: false,
            wallets: false,
            payments: false,
            auditLogs: false,
            notifications: false,
            swap: false,
            changePassword: false,
            selectedTab: false,
            sell: false,
            sendCryptoTab: false,
            trade_buy: false,
            trade_sell: false,
            send_fiat: false,
            send_crypto: false,
            receive_fiat: false,
            receive_crypto: false,
            sendFiatTab: false,
            theamFalge: 'darkTheam',
            tabColour: false

        },
        previousDrawerKey: ""
    }
    componentDidMount() {
        this.props.dispatch(getScreenName({ getScreen: "dashboard" }))
        this.props.dispatch(fetchFeatures(this.props.userConfig.appId || "178A3680-3B6F-44AD-9EF2-69EA040C16CC"));
        this.menuClickSub = headerSubscriber.subscribe(({ menuitem, menuKey }) => this.onMenuItemClick(menuitem, menuKey));
    }
    componentWillUnmount() {
        this.menuClickSub.unsubscribe();
    }
    userProfile() {
        if (this.state.previousDrawerKey && this.state.drawerMenu[this.state.previousDrawerKey]) {
            this.closeDrawer(this.state.previousDrawerKey);
        }
        this.props.history.push("/userprofile");

        if (this.props.oidc.user.profile?.sub) {
            this.props.getmemeberInfoa(this.props.oidc.user.profile.sub);
        }
    }
    showDocRequestError() {
        if (!checkCustomerState(this.props.userConfig)) {
            this.props.history.push("/sumsub");
        }
        else if (!this.props.twoFA?.isEnabled) {
            this.props.history.push("/enabletwofactor");
        }
        else if (this.props?.userConfig?.isDocsRequested) {
            this.props.history.push("/docnotices");
        }
    }

    navigate = (menuKey, menuItem) => {
        if (menuItem.path === "/modal") {
            switch (menuKey) {
                case "trade_buy":
                    this.setState({ ...this.state, drawerMenu: { ...this.state.drawerMenu, trade: true, selectedTab: false } });
                    this.props.dispatch(setSellHeaderHide(false));
                    this.props.dispatch(setSelectedSellCoin(false));
                    this.props.dispatch(menuItem.dispatchStep ? setStep(menuItem.dispatchStep) : setStep("step1"));
                    break;
                case "trade_sell":
                    this.setState({ ...this.state, drawerMenu: { ...this.state.drawerMenu, trade: true, selectedTab: true } });
                    this.props.dispatch(setSellHeaderHide(false));
                    this.props.dispatch(setSelectedSellCoin(false));
                    this.props.dispatch(setStep("step1"));
                    break;
                case "transfer":
                    this.props.dispatch(transforSetStep(menuItem.dispatchStep));
                    break;
                case "sendReceive":
                    this.props.dispatch(sendSetStep("step1"));
                    break;
                case "send_fiat":
                    this.setState({ ...this.state, drawerMenu: { ...this.state.drawerMenu, send_fiat: true, sendCryptoTab: false, sendFiatTab: true } });
                    this.props.dispatch(setWithdrawfiat(""));
                    this.props.dispatch(byFiatSetStep("step1"));
                    this.props.dispatch(setWithdrawfiatenaable(true));
                    this.props.dispatch(setSendCrypto(true));
                    this.props.dispatch(setReceiveFiatHead(false));
                    this.props.dispatch(setSendFiatHead(false));
                    break;
                case "send_crypto":
                    this.setState({ ...this.state, drawerMenu: { ...this.state.drawerMenu, send_crypto: true, sendCryptoTab: true, sendFiatTab: false } });
                    this.props.dispatch(setWithdrawfiat(""));
                    this.props.dispatch(byFiatSetStep("step1"));
                    this.props.dispatch(setWithdrawfiatenaable(false));
                    this.props.dispatch(setSendCrypto(true));
                    this.props.dispatch(hideSendCrypto(false));
                    break;
                case "receive_fiat":
                    this.setState({ ...this.state, drawerMenu: { ...this.state.drawerMenu, receive_fiat: true, sendCryptoTab: false, sendFiatTab: false } });
                    this.props.dispatch(setWithdrawfiat(""));
                    this.props.dispatch(setReceiveFiatHead(true));
                    this.props.dispatch(byFiatSetStep("step1"));
                    this.props.dispatch(setWithdrawfiatenaable(false));
                    this.props.dispatch(setSendCrypto(false));
                    break;
                case "receive_crypto":
                    this.setState({ ...this.state, drawerMenu: { ...this.state.drawerMenu, receive_crypto: true, sendCryptoTab: false, sendFiatTab: false } });
                    this.props.dispatch(setWithdrawfiat(""));
                    this.props.dispatch(byFiatSetStep("step1"));
                    this.props.dispatch(setWithdrawfiatenaable(false));
                    this.props.dispatch(setSendCrypto(false));
                    break;
                case "personal_bank_account":
                    window.open(process.env.REACT_APP_BANK_UI_URL + 'dashboard/receive', '_self')
                    break;
                default:
                    break;
            }
            this.closeDrawer(this.state.previousDrawerKey, () => {
                this.setState({ ...this.state, drawerMenu: { ...this.state.drawerMenu, [menuKey]: true, selectedTab: menuKey === "trade_sell" ? true : false, sendCryptoTab: menuKey === "send_crypto" ? true : false, sendFiatTab: menuKey === "send_fiat" ? true : false }, previousDrawerKey: menuKey });
            });
        } else if (menuItem.path) {
            if (this.state.previousDrawerKey) {
                this.closeDrawer(this.state.previousDrawerKey)
            }
            this.props.history.push(menuItem.path);
        }
    }
    chekPermissions = (menuKey, menuItem, data) => {
        const viewPer = data?.actions.find(item => item.permissionName.toLowerCase() === "view");
        if (!viewPer?.values) {
            this.props.history.push("/accessdenied");
        } else {
            this.props.dispatch(setSelectedFeatureMenu(menuItem.id))
            this.navigate(menuKey, menuItem);
        }
    }
    onMenuItemClick = async (menuKey, menuItem) => {
        const perIgnoreLst = ["notifications", "auditLogs", "cases", "transactions"];
        if (perIgnoreLst.includes(menuKey)) { this.navigate(menuKey, menuItem) }
        else {
            const ignoreKycLst = ["transactions"];
            if ((this.props.userConfig.isKYC && !this.props.userConfig.isDocsRequested && this.props.twoFA?.isEnabled && checkCustomerState(this.props.userConfig)) || ignoreKycLst.includes(menuItem.key)) {
                if (!this.props.menuItems.featurePermissions[menuItem.key]) {
                    getFeaturePermissionsByKey(menuItem.key, (data) => {
                        if (data.ok) {
                            this.chekPermissions(menuKey, menuItem, data?.data)
                        }
                    });
                } else {
                    this.chekPermissions(menuKey, menuItem, this.props.menuItems.featurePermissions[menuItem.key]);
                }

            } else {
                const isKyc = !this.props.userConfig.isKYC;
                if (isKyc) {
                    this.props.history.push("/notkyc");
                } else {
                    this.showDocRequestError();
                }
            }
        }
    }
    closeDrawer = (key, callback = () => { }) => {
        if (this.props.menuItems?.featurePermissions?.[KEY_URL_MAP[window.location.pathname]]?.featureId) {
            this.props.dispatch(setSelectedFeatureMenu(this.props.menuItems?.featurePermissions?.[KEY_URL_MAP[window.location.pathname]]?.featureId));
        }
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
        });
        this.props.clearSwapfullData();
        if (key === "send") {
            this.setState({ ...this.state, drawerMenu: { ...this.state.drawerMenu, send_crypto: false, send_fiat: false, receive_fiat: false, receive_crypto: false } }, callback);
        }
        else if (key === "trade") {
            this.setState({ ...this.state, drawerMenu: { ...this.state.drawerMenu, "trade_buy": false, "trade_sell": false } }, callback);
        }
        else {
            this.setState({ ...this.state, drawerMenu: { ...this.state.drawerMenu, [key]: false } }, callback);
        }
        if(["/","/cockpit"].includes(window.location.pathname)){
            this.props.dispatch(getScreenName({getScreen:"dashboard"}));
        }
    }
    readNotification() {
        apicalls.encryptValue("true", this.props.userConfig?.sk);
        readNotifications().then(() => {
            this.props.dispatch(setNotificationCount(0));
        });
    }
    showCards = () => {
        window.open(
            process.env.REACT_APP_CARDS_URL,
            "_blank"
        )
    }
    clearEvents = () => {
        this.props.dispatch(clearPermissions());
        window.$zoho?.salesiq?.chat.complete();
        window.$zoho?.salesiq?.reset();
        userManager.signoutRedirect();
        apicalls.trackEvent({
            Type: "User",
            Action: "User Logged out",
            Username: null,
            customerId: null,
            Feature: "Logout",
            Remarks: "User Logged out",
            Duration: 1,
            Url: window.location.href,
            FullFeatureName: "Logout"
        });
    }
    uploadDoc=()=>{
        window.open(process.env.REACT_APP_UPLOAD_DOC , '_blank')
    }
    themeSwitch = () => {
        if (this.props.userConfig?.theme == "Light Theme") {
            this.setState({ ...this.state, theamFalge: "darkTheam" })
        } else if (this.props.userConfig?.theme == "Dark Theme") {
            this.setState({ ...this.state, theamFalge: "lightTheam" })
        }
    }
    handleHover = () => {
        this.setState({ ...this.state, tabColour: "blue" })
        this.props.dispatch(getScreenName({ getScreen: "dashboard" }))
    }
    handleSelecte = (items) => {
        this.props.dispatch(getScreenName({ getScreen: null }))
        if (items) {
            this.props.dispatch(getScreenName({ getScreen: items.content }))
        }
    }
    render() {
        const userProfileMenu = (
            <Menu>
                <div className="profile-dropdown">

                    <Translate
                        content={`${this.props.userConfig?.isBusiness === true ? "business_account" : "manage_account"}`}
                        component={Button}
                        size="medium"
                        block
                        className="profile-btn"
                        onClick={() => this.userProfile()}
                    />
                    <ul className="drpdwn-list">
                    <li
                           onClick={() => window.open(process.env.REACT_APP_ACCOUNT_USER_ONBOARD, '_blank')}
                        >
                            <Link>
                           
                            <div>Upgrade Your Account  </div>
                                <span className="icon md rarrow-white" />
                            </Link>
                        </li>
                        <li
                            onClick={() => this.onMenuItemClick("transactions", { key: "transactions", path: "/transactions" })}
                        >
                            <Link>
                                <Translate
                                    content="transactions_history"
                                    component={Text}
                                    className="text-white"
                                />
                                <span className="icon md rarrow-white" />
                            </Link>
                        </li>
                        <li
                        >
                            <Popover placement="left" content={<><div className="personal-popup" onClick={() => window.open("https://pyrros.instance.kyc-chain.com/#/auth/signup/6120197cdc204d9ddb882e4d")}>
                                <Link>
                                    <Translate
                                        content="personal_account"
                                        component={Text}
                                        className="text-white" key="1"
                                    />
                                </Link><span className="icon c-pointer md rarrow-white ml-12" /></div>
                                <div className="personal-popup" onClick={() => window.open("https://pyrros.instance.kyc-chain.com/#/auth/signup/611b3ed20414885a6fc64fa7")}>
                                    <Link>
                                        <Translate
                                            content="business_account"
                                            component={Text}
                                            className="text-white" key="1"
                                        />
                                    </Link><span className="icon c-pointer md rarrow-white ml-12" /></div></>} >
                            </Popover>
                        </li>
                        <li
                            onClick={() => this.props.history.push("/auditlogs")}

                        >
                            <Link>
                                <Translate
                                    content="AuditLogs"
                                    component={Text}
                                    className="text-white"
                                />
                                <span className="icon md rarrow-white" />
                            </Link>
                        </li>
                        <li
                            onClick={() => this.onMenuItemClick("addressbook", { key: "addressbook", path: "/addressbook" })}
                        >
                            <Link>
                                <Translate
                                    content="address_book"
                                    component={Text}
                                    className="text-white"
                                />
                                <span className="icon md rarrow-white" />
                            </Link>
                        </li>
                        <li
                            onClick={() => this.onMenuItemClick("cases", { key: "cases", path: "/cases" })}
                        >
                            <Link>
                                <Translate
                                    content="case"
                                    component={Text}
                                    className="text-white"
                                />
                                <span className="icon md rarrow-white" />
                            </Link>
                        </li>
                        <li
                            onClick={() => this.uploadDoc()}
                        >
                            <Link>
                                <span className="text-left">
                                    <Translate
                                        content="upload_documents"
                                        component={Text}
                                        className="d-block text-white"
                                    />
                                    <Translate
                                        content='compliance'
                                        component={Text}
                                        className="text-white"
                                    />
                                </span>
                                <span className="icon md rarrow-white" />
                            </Link>
                        </li>
                        <li
                            onClick={() => this.props.history.push("/videoTutorials")}
                        >
                            <Link className="text-left">
                                <span>
                                    Video Tutorials
                                </span>
                                <span className="icon md rarrow-white" />

                            </Link>

                        </li>
                        <li onClick={() => this.clearEvents()}>
                            <Link className="text-left">
                                <span>
                                    <Translate
                                        content="logout"
                                        className="text-white"
                                        component={Text}
                                    />
                                </span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </Menu>
        );
        const { features: { data } } = this.props.menuItems;
        const { collapsed, isShowSider } = this.props;
        const { send_crypto, send_fiat, receive_crypto, receive_fiat } = this.state.drawerMenu
        return <>
            <Menu
                theme="light"
                mode="horizontal"
                className="header-right mobile-headerview"
                selectedKeys={[this.props.buySell?.headerTab]}
                onSelect={(key) => {
                    this.props.dispatch(setHeaderTab(key.key));
                }}
            >
                <Menu.Item
                    className={this.props.menuItems.getScreen?.getScreen == "dashboard" ? "active" : "custom-inactive"}
                >
                    <Translate
                        content="header_title"
                        onClick={this.props.routeToCockpit}
                        onMouseOver={() => { this.handleHover() }}
                        // component={Text}
                        className={this.props.menuItems.getScreen?.getScreen == "dashboard" ? "" : "custom-inactive"}
                    />
                </Menu.Item>
                {data?.map((item, indx) => <React.Fragment>
                    {item.isTab ? <Menu.Item key={item.id} onClick={() => this.handleSelecte(item)}>
                        <Dropdown
                            onClick={() =>
                                this.setState({ ...this.state, visbleProfileMenu: false })
                            }
                            overlay={<Menu >
                                <ul className="drpdwn-list ">
                                    {item.subMenu.map(subitem => <li onClick={() => this.onMenuItemClick(subitem.key, subitem)}>
                                        <Link value={2} className="c-pointer">
                                            <Translate content={subitem.content} />
                                        </Link>
                                    </li>)}

                                </ul>
                            </Menu>}
                            trigger={["click"]}
                            placement="bottomCenter"
                            arrow
                            overlayClassName="secureDropdown depwith-drpdown"
                            getPopupContainer={() => document.getElementById("area")}
                        >
                            <Translate
                                content={item.content}
                                component={Menu.Item}
                                key="4"
                                className={item.content == this.props.menuItems.getScreen?.getScreen ? "" : "custom-header"}

                            />
                        </Dropdown>
                    </Menu.Item> :
                        <Menu.Item onClick={() => this.onMenuItemClick(item.key, item)}>

                            <Translate content={item.content}
                                component={Menu.Item}
                                className="fs-20 custom-header" />
                        </Menu.Item>}
                </React.Fragment>)}
            </Menu>
            <Menu
                theme="light"
                mode="horizontal"
                className="header-right mobile-headerview"
                selectedKeys={[this.props.buySell?.headerTab]}
                onSelect={(key) => {
                    this.props.dispatch(setHeaderTab(key.key));
                }}>

                <Menu.Item key="15">

                    <TheamSwitch theamFlag={this.state.theamFalge} />

                </Menu.Item>
                <Menu.Item
                    key="9"
                    className="notification-conunt"
                    onClick={() => this.onMenuItemClick("notifications", { path: "/modal", key: "notifications" })}
                >
                    <span
                        className="icon md bell ml-4 p-relative"
                        onClick={() => this.readNotification()}
                    >
                        {this.props.dashboard?.notificationCount != null &&
                            this.props.dashboard?.notificationCount !== 0 && (
                                <span>{this.props.dashboard?.notificationCount}</span>
                            )}
                    </span>
                </Menu.Item>
                <Dropdown
                    onVisibleChange={() =>
                        this.setState({
                            ...this.state,
                            visbleProfileMenu: !this.state.visbleProfileMenu
                        })
                    }
                    visible={this.state.visbleProfileMenu}
                    onClick={() =>
                        this.setState({ ...this.state, visbleProfileMenu: true })
                    }
                    overlay={userProfileMenu}
                    placement="topRight"
                    arrow
                    overlayClassName="secureDropdown"
                    getPopupContainer={() => document.getElementById("area")}
                >
                    <Menu.Item key="10" className="user-left">
                        {this.props.userConfig?.imageURL != null && (
                            <img
                                src={
                                    this.props.userConfig?.imageURL
                                        ? this.props.userConfig?.imageURL
                                        : DefaultUser
                                }
                                className="user-profile"
                                alt={"image"}
                            />
                        )}
                        {this.props.userConfig?.imageURL === null && (
                            <img
                                src={
                                    this.props.userConfig?.imageURL
                                        ? this.props.userConfig?.imageURL
                                        : DefaultUser
                                }
                                className="user-profile"
                                alt={"image"}
                            />
                        )}
                    </Menu.Item>
                </Dropdown>
            </Menu>
            {isShowSider && <Sider trigger={null}
                collapsible
                collapsed={collapsed}
                collapsedWidth={0}
                className={` ${collapsed ? '' : "sideropen"}`}>
                <MobileHeaderMenu onMenuItemClick={this.onMenuItemClick} routeToCockpit={this.props.routeToCockpit} features={this.props.menuItems} dispatch={this.props.dispatch} />
            </Sider>}
            {this.state.drawerMenu.notifications && (
                <Notifications
                    showDrawer={this.state.drawerMenu.notifications}
                    onClose={() => this.closeDrawer("notifications")}
                />
            )}
            {this.state.drawerMenu.auditLogs && (
                <AuditLogs
                    showDrawer={this.state.drawerMenu.auditLogs}
                    onClose={() => this.closeDrawer("auditLogs")}
                />
            )}

            <Wallets
                showDrawer={this.state.drawerMenu.wallets}
                onClose={() => this.closeDrawer("wallets")}
            />
            <BuySell
                showDrawer={this.state.drawerMenu.trade_buy || this.state.drawerMenu.trade_sell}
                isTabKey={this.state.drawerMenu.selectedTab}
                onClose={() => this.closeDrawer("trade")}
            />
            <SendReceive
                showDrawer={send_crypto || receive_crypto}
                isSendTab={this.state.drawerMenu.sendCryptoTab}
                onClose={() => this.closeDrawer("send")}
            />
            <SwapCrypto
                swapRef={(cd) => (this.child = cd)}
                showDrawer={this.state.drawerMenu.swap}
                onClose={() => this.closeDrawer("swap")}
            />
            <Transfor
                swapRef={(cd) => (this.child = cd)}
                showDrawer={this.state.drawerMenu.transfer}
                onClose={() => this.closeDrawer("transfer")}
            />
            <MassPayment
                showDrawer={send_fiat || receive_fiat}
                isShowSendFiat={this.state.drawerMenu.sendFiatTab}
                onClose={() => this.closeDrawer("send")}
            />
           
            <Drawer
                title={[
                    <div className="side-drawer-header">
                        <span
                            onClick={() =>
                                this.closeDrawer("changePassword")
                            }
                            className="icon md close-white c-pointer"
                        />
                        <div className="text-center">
                            <Translate
                                className="drawer-maintitle"
                                content="change_pass_word"
                                component={Paragraph}
                            />
                        </div>
                    </div>
                ]}
                placement="right"
                closable={true}
                visible={this.state.drawerMenu.changePassword}
                closeIcon={null}
                onClose={() =>
                    this.closeDrawer("changePassword")
                }
                className="side-drawer"
            >
                <Changepassword
                    onSubmit={() => {
                        this.closeDrawer("changePassword")
                    }}
                />
            </Drawer>
        </>
    }
}
const connectStateToProps = ({ swapStore,
    userConfig,
    oidc,
    dashboard,
    buySell,
    menuItems
}) => {
    return {
        swapStore,
        userConfig: userConfig.userProfileInfo,
        twoFA: userConfig.twoFA,
        dashboard,
        buySell,
        oidc,
        menuItems
    };
}
const connectDispatchToProps = dispatch => {
    return {
        fromObjSwap: (obj) => {
            dispatch(updateCoinDetails(obj));
        },
        receiveObjSwap: (obj) => {
            dispatch(updateReceiveCoinDetails(obj));
        },
        updateSwapdataobj: (obj) => {
            dispatch(updateSwapdata(obj));
        },
        clearSwapfullData: (customerid) => {
            dispatch(clearSwapData(customerid));
        },
        getmemeberInfoa: (useremail) => {
            dispatch(getmemeberInfo(useremail));
        },
        setAction: (val) => {
            dispatch(setCurrentAction(val))
        },
        dispatch
    }
}

export default withRouter(connect(connectStateToProps, connectDispatchToProps)(HeaderPermissionMenu));
