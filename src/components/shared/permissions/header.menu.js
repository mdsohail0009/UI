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
import { fetchFeaturePermissions, fetchFeatures } from "../../../reducers/feturesReducer";
counterpart.registerTranslations("en", en);
counterpart.registerTranslations("ch", ch);
counterpart.registerTranslations("my", my);
const LinkValue = (props) => {
    return (
        <Translate
            className="text-yellow fw-700 fs-16 d-inlineblock"
            content={props.content}
            component={Link}
        />
    );
};

const { Title, Paragraph, Text } = Typography;

class HeaderPermissionMenu extends Component {

    state = {
        visbleProfileMenu: false,
        drawerMenu: {
            buySell: false,
            balances: false,
            transactions: false,
            depositWithdraw: false,
            transfer: false,
            sendReceive: false,
            buyFiat: false,
            wallets: false,
            payments: false,
            auditLogs: false,
            notifications: false,
            swap: false,
            changePassword: false

        },
        menuItems: [
            {
                label: "Cards",
                key: "cards",
                url: "/cards",
                content: "cards"
            }, ,
            {
                label: "Bill Payments",
                key: "billpayments",
                url: "/payments",
                content: "menu_payments"
            },
            {
                label: "Wallets",
                key: "wallets",
                url: "modal",
                content: "menu_wallets"
            },
            {
                label: "Buy / Sell",
                key: "buySell",
                url: "modal",
                content: "menu_buy_sell",
                dispatchStep: "step1",
            },
            {
                label: "Transfer",
                key: "transfer",
                url: "modal",
                content: "menu_tranfor",
                dispatchStep: "tranforcoin"
            },
            {
                label: "Deposit / Withdraw",
                key: "depositWithdraw",
                menuitemType: 'dropdown',
                content: "menu_send_receive",
                subMenu: [{
                    label: "Crypto",
                    key: "sendReceive",
                    url: "modal",
                    content: "tab_crypto"
                }, {
                    label: "Fiat",
                    key: "buyFiat",
                    url: "modal",
                    content: "tab_fiat"
                }]

            },
            {
                label: "Transactions",
                key: "transactions",
                content: "menu_transactions_history",
                url: "modal",

            }
        ]
    }
    componentDidMount() {
        this.props.dispatch(fetchFeatures(this.props.userConfig.appId || "5960CF10-017C-4E54-8F96-0E47EC4BC4A4", this.props.userConfig.id));
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
    onMenuItemClick = async (menuKey, menuItem) => {
        if (this.props.userConfig.isKYC && !this.props.userConfig.isDocsRequested && this.props.twoFA?.isEnabled) {
            if (menuItem.url === "modal") {
                if (menuItem.dispatchStep) {
                    switch (menuKey) {
                        case "buySell":
                            this.props.dispatch(setStep(menuItem.dispatchStep));
                            break;
                        case "transfer":
                            this.props.dispatch(transforSetStep(menuItem.dispatchStep));
                            break;
                        case "sendReceive":
                            this.props.dispatch(sendSetStep("step1"));
                            break;
                        case "buyFiat":
                            this.props.dispatch(byFiatSetStep("step1"));
                            this.props.dispatch(setWithdrawfiatenaable(false));
                            break;
                        default:
                            break;
                    }


                }
                if (!this.props.menuItems.featurePermissions[menuItem.key])
                    this.props.dispatch(fetchFeaturePermissions(menuItem.featureId || menuItem.id));
                this.setState({ ...this.state, drawerMenu: { ...this.drawerMenu, [menuKey]: true } });
            } else if (menuItem.url) {
                this.props.history.push(menuItem.url);
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
    closeDrawer = (key) => {
        this.setState({ ...this.state, drawerMenu: { ...this.drawerMenu, [key]: false } });
    }
    render() {
        const link = <LinkValue content="medium" />;
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
                        {this.props.userConfig.firstName} {this.props.userConfig.lastName}
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
                            onClick={() => this.onMenuItemClick("auditLogs", { key: "auditLogs", url: "modal" })}
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
                            <Link>
                                <Translate
                                    content="logout"
                                    className="text-white-30"
                                    component={Text}
                                />
                            </Link>
                        </li>
                    </ul>
                </div>
            </Menu>
        );
        const { features: { data, error, loading } } = this.props.menuItems;
        return <>    <Menu
            theme="light"
            mode="horizontal"
            className="header-right mobile-headerview"
            selectedKeys={[this.props.buySell?.headerTab]}
            onSelect={(key) => {
                this.props.dispatch(setHeaderTab(key.key));
            }}
        >
            {data.map((item, indx) => item.menuitemType === "dropdown" ? <Dropdown
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
            </Dropdown> : <Translate
                content={item.content}
                component={Menu.Item}
                key={indx}
                onClick={() => this.onMenuItemClick(item.key, item)}
                className="list-item"
            />)}
            <Menu.Item
                key="9"
                className="notification-conunt"
                onClick={this.showNotificationsDrawer}
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

            <Wallets
                showDrawer={this.state.drawerMenu.wallets}
                onClose={() => this.closeDrawer("wallets")}
            />
            <BuySell
                showDrawer={this.state.drawerMenu.buySell}
                onClose={() => this.closeDrawer("buySell")}
            />
            <SendReceive
                showDrawer={this.state.drawerMenu.sendReceive}
                onClose={() => this.closeDrawer("sendReceive")}
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
                showDrawer={this.state.drawerMenu.buyFiat}
                onClose={() => this.closeDrawer("buyFiat")}
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
            {this.state.notificationsDrawer && (
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
        dispatch
    }
}
class MobileHeaderMenu extends Component {

    state = {
        visbleProfileMenu: false,
        drawerMenu: {
            buySell: false,
            balances: false,
            transactions: false,
            depositWithdraw: false,
            transfer: false,
            sendReceive: false,
            buyFiat: false,
            wallets: false,
            payments: false,
            auditLogs: false,
            notifications: false,
            swap: false,
            changePassword: false

        },
        menuItems: [
            {
                label: "Cards",
                key: "cards",
                url: "/cards",
                content: "cards"
            }, ,
            {
                label: "Bill Payments",
                key: "billpayments",
                url: "/payments",
                content: "menu_payments"
            },
            {
                label: "Wallets",
                key: "wallets",
                url: "modal",
                content: "menu_wallets"
            },
            {
                label: "Buy / Sell",
                key: "buySell",
                url: "modal",
                content: "menu_buy_sell",
                dispatchStep: "step1",
            },
            {
                label: "Transfer",
                key: "transfer",
                url: "modal",
                content: "menu_tranfor",
                dispatchStep: "tranforcoin"
            },
            {
                label: "Deposit / Withdraw",
                key: "depositWithdraw",
                menuitemType: 'dropdown',
                content: "menu_send_receive",
                subMenu: [{
                    label: "Crypto",
                    key: "sendReceive",
                    url: "modal",
                    content: "tab_crypto"
                }, {
                    label: "Fiat",
                    key: "buyFiat",
                    url: "modal",
                    content: "tab_fiat"
                }]

            },
            {
                label: "Transactions",
                key: "transactions",
                content: "menu_transactions_history",
                url: "modal",

            }
        ]
    }
    componentDidMount() {

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
    onMenuItemClick = (menuKey, menuItem) => {
        if (this.props.userConfig.isKYC && !this.props.userConfig.isDocsRequested && this.props.twoFA?.isEnabled) {
            if (menuItem.url === "modal") {
                if (menuItem.dispatchStep) {
                    switch (menuKey) {
                        case "buySell":
                            this.props.dispatch(setStep(menuItem.dispatchStep));
                            break;
                        case "transfer":
                            this.props.dispatch(transforSetStep(menuItem.dispatchStep));
                            break;
                        case "sendReceive":
                            this.props.dispatch(sendSetStep("step1"));
                            break;
                        case "buyFiat":
                            this.props.dispatch(byFiatSetStep("step1"));
                            this.props.dispatch(setWithdrawfiatenaable(false));
                            break;
                        default:
                            break;
                    }


                }
                this.setState({ ...this.state, drawerMenu: { ...this.drawerMenu, [menuKey]: true } });
            } else if (menuItem.url) {
                this.props.history.push(menuItem.url);
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
    closeDrawer = (key) => {
        this.setState({ ...this.state, drawerMenu: { ...this.drawerMenu, [key]: false } });
    }
    render() {
        const { features: { data, error, loading } } = this.props.menuItems;
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
                onClick={this.routeToCockpit}
                component={Menu.Item}
                className="list-item"
            />
            {data.map((item, indx) => item.menuitemType === "dropdown" ?
                <><Translate
                    content={item.content}
                    component={Menu.Item}
                    key={indx}
                    className="mr-16"
                /><Menu>
                        <ul className="pl-0 drpdwn-list">
                            {item?.subMenu?.map((subItem) => <li onClick={() => this.onMenuItemClick(subItem.key, subItem)}>
                                <Link>
                                    <Translate content={subItem.content} conmponent={Text} />{" "}
                                    <span className="icon md rarrow-white" />
                                </Link>
                            </li>)}

                        </ul>
                    </Menu></>
                : <Translate
                    content={item.content}
                    component={Menu.Item}
                    key={indx}
                    onClick={() => this.onMenuItemClick(item.key, item)}
                    className="list-item"
                />)}
        </Menu>

            <Wallets
                showDrawer={this.state.drawerMenu.wallets}
                onClose={() => this.closeDrawer("wallets")}
            />
            <BuySell
                showDrawer={this.state.drawerMenu.buySell}
                onClose={() => this.closeDrawer("buySell")}
            />
            <SendReceive
                showDrawer={this.state.drawerMenu.sendReceive}
                onClose={() => this.closeDrawer("sendReceive")}
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
                showDrawer={this.state.drawerMenu.buyFiat}
                onClose={() => this.closeDrawer("buyFiat")}
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
            {this.state.notificationsDrawer && (
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
const MobileMenu = withRouter(connect(connectStateToProps, connectDispatchToProps)(MobileHeaderMenu));
export default withRouter(connect(connectStateToProps, connectDispatchToProps)(HeaderPermissionMenu));
export { MobileMenu }
