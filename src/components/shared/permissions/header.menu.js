import { Component } from "react";
import { withRouter, Link } from "react-router-dom";
import {
    Collapse,
    Layout,
    Menu,
    Modal,
    Typography,
    Dropdown,
    Row,
    Col,
    Divider,
    Avatar,
    Carousel,
    Switch,
    Drawer,
    Button, Popover
} from "antd";
import { setHeaderTab, setStep } from "../../../reducers/buysellReducer";
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
import TransactionsHistory from "../../transactions.history.component";
import AuditLogs from "../../auditlogs.component";
import Notifications from "../../../notifications";
import Wallets from "../../wallets.component.js";
// Action Steps
import {
    setStepcode as transforSetStep
} from "../../../reducers/tranfor.Reducer";
import {
    updateCoinDetails,
    updateReceiveCoinDetails,
    updateSwapdata,
    clearSwapData,
    setStep as swapSetStep
} from "../../../reducers/swapReducer";
import { setStep as byFiatSetStep } from "../../../reducers/buyFiatReducer";
import {
    setStep as sendSetStep,
    setWithdrawfiatenaable
} from "../../../reducers/sendreceiveReducer";
import { getmemeberInfo } from "../../../reducers/configReduser";
import { clearPermissions, fetchFeaturePermissions, fetchFeatures, setSelectedFeatureMenu, updatePermissions } from "../../../reducers/feturesReducer";
import { readNotification as readNotifications } from "../../../notifications/api";
import apicalls from "../../../api/apiCalls";
import { setNotificationCount } from "../../../reducers/dashboardReducer";
import { userManager } from "../../../authentication";
import { setCurrentAction } from "../../../reducers/actionsReducer";
import { KEY_URL_MAP } from "./config";
import { getFeaturePermissionsByKey } from "./permissionService";
counterpart.registerTranslations("en", en);
counterpart.registerTranslations("ch", ch);
counterpart.registerTranslations("my", my);
const { Paragraph, Text } = Typography;
const { Sider } = Layout;
class MobileHeaderMenu extends Component {
    render() {
        const { onMenuItemClick, features: { features: { data, error, loading } } } = this.props;
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
                onClick={() => this.props.history.push("/cockpit")}
                component={Menu.Item}
                className="list-item"
            />
            {data?.map((item, indx) => item.menuitemType === "dropdown" ?
                <><Translate
                    content={item.content}
                    component={Menu.Item}
                    key={indx}
                    className="mr-16"
                /><Menu>
                        <ul className="pl-0 drpdwn-list">
                            {item?.subMenu?.map((subItem) => <li onClick={() => onMenuItemClick(subItem.key, subItem)}>
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
            trade: false,
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
            changePassword: false

        },
    }
    componentDidMount() {
        this.props.dispatch(fetchFeatures(this.props.userConfig.appId || "178A3680-3B6F-44AD-9EF2-69EA040C16CC", this.props.userConfig.id));
    }
    userProfile() {
        this.props.history.push("/userprofile");

        if (this.props.oidc.user.profile?.sub) {
            this.props.getmemeberInfoa(this.props.oidc.user.profile.sub);
        }
    }
    showDocRequestError() {
        if (!this.props.twoFA?.isEnabled) {
            this.props.history.push("/enabletwofactor");
        }
        else if (this.props?.userConfig?.isDocsRequested) {
            this.props.history.push("/docnotices");
        }
    }
    navigate = (menuKey, menuItem) => {
        if (menuItem.path === "/modal") {
            if (menuItem.dispatchStep) {
                switch (menuKey) {
                    case "trade":
                        this.props.dispatch(setStep(menuItem.dispatchStep));
                        break;
                    case "transfer":
                        this.props.dispatch(transforSetStep(menuItem.dispatchStep));
                        break;
                    case "sendReceive":
                        this.props.dispatch(sendSetStep("step1"));
                        break;
                    case "sendreceivefiat":
                        this.props.dispatch(byFiatSetStep("step1"));
                        this.props.dispatch(setWithdrawfiatenaable(false));
                        break;
                    case "sendreceivecrypto":
                        this.props.dispatch(sendSetStep("step1"));
                        break;
                    default:
                        break;
                }
            }
            this.setState({ ...this.state, drawerMenu: { ...this.state.drawerMenu, [menuKey]: true } });
        } else if (menuItem.path) {
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
        const perIgnoreLst = ["notifications", "auditLogs"];
        if (perIgnoreLst.includes(menuKey)) { this.navigate(menuKey, menuItem) }
        else {
            const ignoreKycLst = ["transactions"];
            if ((this.props.userConfig.isKYC && !this.props.userConfig.isDocsRequested && this.props.twoFA?.isEnabled) || ignoreKycLst.includes(menuItem.key)) {
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
    closeDrawer = (key) => {
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
        this.setState({ ...this.state, drawerMenu: { ...this.state.drawerMenu, [key]: false } });
    }
    readNotification() {
        let isRead = apicalls.encryptValue("true", this.props.userConfig?.sk);
        readNotifications(this.props.userConfig.id).then(() => {
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
    render() {
        const userProfileMenu = (
            <Menu>
                <div className="profile-dropdown">
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
                    <p className="mb-15 ml-8 profile-value" style={{ flexGrow: 12 }}>
                    {this.props.userConfig.isBusiness?this.props.userConfig.businessName:
                    <>{this.props.userConfig.firstName}{this.props.userConfig.lastName}</> }
                        {/* {this.props.userConfig.firstName} {this.props.userConfig.lastName} */}
                    </p>
                    <Translate
                        content="manage_account"
                        component={Button}
                        size="medium"
                        block
                        className="profile-btn"
                        onClick={() => this.userProfile()}
                    />
                    <ul className="pl-0 drpdwn-list">
                        <li
                            onClick={() => this.onMenuItemClick("transactions", { key: "transactions", path: "/modal" })}
                        >
                            <Link>
                                <Translate
                                    content="menu_transactions_history"
                                    component={Text}
                                    className="text-white-30"
                                />
                                <span className="icon md rarrow-white" />
                            </Link>
                        </li>
                        <li
                        >
                            <Popover placement="left" content={<><div onClick={() => window.open("https://pyrros.instance.kyc-chain.com/#/auth/signup/6120197cdc204d9ddb882e4d")}>
                                <Link>
                                    <Translate
                                        content="personal_account"
                                        component={Text}
                                        className="text-white-30" key="1"
                                    />
                                </Link><span className="icon c-pointer md rarrow-white ml-12" /></div>
                                <div onClick={() => window.open("https://pyrros.instance.kyc-chain.com/#/auth/signup/611b3ed20414885a6fc64fa7")}>
                                    <Link>
                                        <Translate
                                            content="business_account"
                                            component={Text}
                                            className="text-white-30" key="1"
                                        />
                                    </Link><span className="icon c-pointer md rarrow-white ml-12" /></div></>} >
                                <Link>
                                    <Translate
                                        content="get_your_own_iban"
                                        component={Text}
                                        className="text-white-30"
                                    />
                                    <span className="icon md rarrow-white" />
                                </Link>

                            </Popover>
                        </li>
                        <li
                            onClick={() => this.onMenuItemClick("auditLogs", { key: "auditLogs", path: "/modal" })}
                        >
                            <Link>
                                <Translate
                                    content="AuditLogs"
                                    component={Text}
                                    className="text-white-30"
                                />
                                <span className="icon md rarrow-white" />
                            </Link>
                        </li>
                        <li
                            onClick={() => window.open('https://suissebase.egnyte.com/ul/jnDqGI4Nxj', '_blank')}
                        >
                            <Link>
                                <span className="text-left">
                                    <Translate
                                        content="upload_documents"
                                        component={Text}
                                        className="d-block text-white-30"
                                    />
                                    <Translate
                                        content='compliance'
                                        component={Text}
                                        className="text-white-30"
                                    />
                                </span>
                                <span className="icon md rarrow-white" />
                            </Link>
                        </li>
                        <li onClick={() => this.clearEvents()}>
                        <Link className="text-left">
                              <span> 
                                <Translate
                                    content="logout"
                                    className="text-white-30"
                                    component={Text}
                                />
                             </span>
                            </Link>
                        </li>
                    </ul>
                </div>
            </Menu>
        );
        const { features: { data, error, loading } } = this.props.menuItems;
        const { collapsed, isShowSider } = this.props;

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
                {data?.map((item, indx) => item.menuitemType === "dropdown" ? <Dropdown
                    onClick={() =>
                        this.setState({ ...this.state, visbleProfileMenu: false })
                    }
                    overlay={<Menu>
                        <ul className="pl-0 drpdwn-list">
                            {item?.subMenu?.map((subItem) => <li onClick={() => this.onMenuItemClick(subItem.key, subItem)}>
                                <Link>
                                    <Translate content={subItem.content} conmponent={Text} />{" "}
                                    <span className="icon md rarrow-white" />
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
                        key={indx}
                        className="mr-16"
                    />
                </Dropdown> : item.key === "trade" && <Translate
                    content={item.content}
                    component={Menu.Item}
                    key={item.key}
                    onClick={() => this.onMenuItemClick(item.key, item)}
                    className="list-item"
                />)}
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
                            this.props.dashboard?.notificationCount != 0 && (
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
                    <Menu.Item key="10" className="ml-16">
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
                <MobileHeaderMenu onMenuItemClick={this.onMenuItemClick} features={this.props.menuItems} dispatch={this.props.dispatch} />
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
                showDrawer={this.state.drawerMenu.trade}
                onClose={() => this.closeDrawer("trade")}
            />
            <SendReceive
                showDrawer={this.state.drawerMenu.sendreceivecrypto}
                onClose={() => this.closeDrawer("sendreceivecrypto")}
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
                showDrawer={this.state.drawerMenu.sendreceivefiat}
                onClose={() => this.closeDrawer("sendreceivefiat")}
            />
            {this.state.drawerMenu.transactions && (
                <TransactionsHistory
                    showDrawer={this.state.drawerMenu.transactions}
                    onClose={() => {
                        this.props.dispatch(setHeaderTab(" "))
                        this.closeDrawer("transactions");
                        if (this.child1) {
                            this.child1.setKy();
                        }
                    }}
                    thref={(cd) => (this.child1 = cd)}
                />
            )}

            <Drawer
                title={[
                    <div className="side-drawer-header">
                        <span
                            onClick={() =>
                                this.closeDrawer("changePassword")
                            }
                            className="icon md close-white c-pointer"
                        />
                        <div className="text-center fs-14">
                            <Translate
                                className="mb-0 text-white-30 fw-600 text-upper"
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
