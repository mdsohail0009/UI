import React, { Component } from "react";
import {
  Layout,
  Menu,
  Typography,
  Dropdown,
  Drawer,
  Button, Popover
} from "antd";
import { Link, withRouter } from "react-router-dom";
import logoWhite from "../assets/images/logo-white.png";
import logoColor from "../assets/images/logo-color.png";
import counterpart from "counterpart";
import Translate from "react-translate-component";
import en from "../lang/en";
import ch from "../lang/ch";
import my from "../lang/my";
import { userManager } from "../authentication";
import Changepassword from "../components/changepassword";
import {
  updateCoinDetails,
  updateReceiveCoinDetails,
  updateSwapdata,
  clearSwapData,
  //setStep 
} from "../reducers/swapReducer";
import { connect } from "react-redux";
import DefaultUser from "../assets/images/defaultuser.jpg";
import { setHeaderTab} from "../reducers/buysellReducer";
// import {
//   setStep as sendSetStep,
// } from "../reducers/sendreceiveReducer";
import { readNotification as readNotifications } from "../notifications/api";
import apiCalls from "../api/apiCalls";
import { setNotificationCount } from "../reducers/dashboardReducer";
import { getmemeberInfo } from "../reducers/configReduser";
import HeaderPermissionMenu from '../components/shared/permissions/header.menu';
import { clearPermissions } from "../reducers/feturesReducer";
import { handleHeaderProfileMenuClick } from "../utils/pubsub";
import Notifications from "../notifications";
import { checkCustomerState } from "../utils/service";

counterpart.registerTranslations("en", en);
counterpart.registerTranslations("ch", ch);
counterpart.registerTranslations("my", my);
const { Paragraph, Text } = Typography;
class Header extends Component {
  componentDidMount() {
    counterpart.setLocale(
      this.props.userConfig ? this.props.userConfig.language : "en"
    );
  }
  componentWillUnmount() {
    this.props.dispatch(setHeaderTab(""));
  }
  constructor(props) {
    super(props);
    this.state = {
      lang: "en",
      buyToggle: "Buy",
      depositToggle: "From Crypto",
      payDrawer: false,
      payCardsDrawer: false,
      cardsDetails: false,
      billingAddress: false,
      initLoading: true,
      collapsed: true,
      showNotificationsDrawer: false
    };
    this.userProfile = this.userProfile.bind(this);
  }
  userProfile() {
    this.props.history.push("/userprofile");
    if (this.props.oidc.user.profile?.sub) {
      this.props.getmemeberInfoa(this.props.oidc.user.profile.sub);
    }
  }
  enableDisable2fa = (status) => {
    var url = "";
    if (status) {
      url =
        process.env.REACT_APP_AUTHORITY +
        "/account/login?returnUrl=/manage/EnableAuthenticator";
    } else {
      url =
        process.env.REACT_APP_AUTHORITY +
        "/account/login?returnUrl=/manage/Disable2faWarning";
    }
    window.open(url);
  };
  trackEvent() {
    this.props.dispatch(clearPermissions());
    window.$zoho?.salesiq?.chat.complete();
    window.$zoho?.salesiq?.reset();
    // this.props.dispatch(clearUserInfo());
    userManager.signoutRedirect();
    apiCalls.trackEvent({
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
  clearEvents() {
    this.trackEvent();
  }
  readNotification() {
    //let isRead = apiCalls.encryptValue("true", this.props.userConfig?.sk);
    readNotifications(this.props.userConfig.id).then(() => {
      this.props.dispatch(setNotificationCount(0));
    });
  }
  routeToHome = () => {
    this.routeToCockpit();
  };
  routeToCockpit = () => {
    this.props.dispatch(setHeaderTab(''));
    if (!this.props.userConfig?.isKYC) {
      this.props.history.push("/notkyc");
    } else if (checkCustomerState(this.props.userConfig)) {
      this.props.history.push("/sumsub");
    } else {
      this.props.history.push("/cockpit");
    }
    this.setState({ ...this.state, collapsed: true, isShowSider: false })
  }
  showToggle = () => {
    this.setState({ ...this.state, collapsed: !this.state.collapsed, isShowSider: true })
  }
  onMenuItemClick = (menuitem, menuKey) => {
    handleHeaderProfileMenuClick(menuitem, menuKey);
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
          <p className="mb-15 ml-8 profile-value" style={{ flexGrow: 12, marginTop: "5px" }}>
            {this.props.userConfig.isBusiness ? this.props.userConfig.businessName :
              <>{this.props.userConfig.firstName}{" "}{" "}{this.props.userConfig.lastName}</>}
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
                  content="transactions_history"
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
              onClick={() => this.onMenuItemClick("addressbook", { key: "addressbook", path: "/addressbook" })}
            >
              <Link>
                <Translate
                  content="address_book"
                  component={Text}
                  className="text-white-30"
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
    return (
      <>
        <Layout className="layout">
          <div className="tlv-header" id="area">
            <div className="login-user">
              <ul className="header-logo pl-0">
                <li className="visible-mobile pr-24 p-relative" onClick={this.showToggle}>
                  {this.state.collapsed ?
                    <span className="icon lg hamburg " /> : <span className="icon md close-white " />}
                </li>
                <li className="mobile-logo">
                  {
                    <img
                      src={logoWhite}
                      alt="logo"
                      className="tlv-logo dark c-pointer p-relative ml-12"
                      onClick={this.routeToHome}
                    />
                  }
                  {
                    <img
                      src={logoColor}
                      alt="logo"
                      className="tlv-logo light c-pointer p-relative ml-12"
                      onClick={this.routeToHome}
                    />
                  }
                </li>

                <li className="mobile-user ml-8">
                  <Translate
                    content="header_title"
                    onClick={this.routeToCockpit}
                    component={Text}
                    className="text-white-30 fs-20 c-pointer cp-link mb-d-none"
                  />
                  <Text className="text-white-30 fs-24 ">|</Text>
                  <Translate
                    content="user_type"
                    with={{
                      lable: this.props.userConfig?.isBusiness
                        ? "Business"
                        : "Personal"
                    }}
                    component={Text}
                    className="text-white-30 fs-20 ml-16 fw-300"
                  />
                </li>

              </ul>
              <Menu
                theme="light"
                mode="horizontal"
                className="header-right mobile-header-right"
              >
                <Menu.Item
                  key="6"
                  className="notification-conunt mr-8"
                  onClick={() => this.setState({ ...this.state, showNotificationsDrawer: true })}
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
                  trigger={["click"]}
                  overlay={userProfileMenu}
                  placement="topRight"
                  arrow
                  overlayClassName="secureDropdown"
                  getPopupContainer={() => document.getElementById("area")}
                >
                  <Menu.Item key="7">
                    {this.props.userConfig?.imageURL != null && (
                      <img
                        src={
                          this.props.userConfig?.imageURL
                            ? this.props.userConfig?.imageURL
                            : DefaultUser
                        }
                        className="user-profile "
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
            </div>
            <HeaderPermissionMenu collapsed={this.state.collapsed} isShowSider={this.state.isShowSider} routeToCockpit={this.routeToCockpit} />

          </div>
        </Layout>
        <Drawer
          title={[
            <div className="side-drawer-header">
              <span
                onClick={() =>
                  this.setState({ ...this.state, showChangePassword: false })
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
          visible={this.state.showChangePassword}
          closeIcon={null}
          onClose={() =>
            this.setState({ ...this.state, showChangePassword: false })
          }
          className="side-drawer"
        >
          <Changepassword
            onSubmit={() => {
              this.setState({ ...this.state, showChangePassword: false });
            }}
          />
        </Drawer>
        {this.state.showNotificationsDrawer && (
          <Notifications
            showDrawer={this.state.showNotificationsDrawer}
            onClose={() => this.setState({ ...this.state, showNotificationsDrawer: false })}
          />
        )}
      </>
    );
  }
}

const connectStateToProps = ({
  swapStore,
  userConfig,
  oidc,
  dashboard,
  buySell
}) => {
  return {
    swapStore,
    userConfig: userConfig.userProfileInfo,
    twoFA: userConfig.twoFA,
    dashboard,
    buySell,
    oidc
  };
};
const connectDispatchToProps = (dispatch) => {
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
  };
};

export default connect(
  connectStateToProps,
  connectDispatchToProps
)(withRouter(Header));
