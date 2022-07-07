import React, { Component } from "react";
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
import { UserOutlined } from "@ant-design/icons";
import { Link, withRouter } from "react-router-dom";
import logoWhite from "../assets/images/logo-white.png";
import logoColor from "../assets/images/logo-color.png";
import counterpart from "counterpart";
import Translate from "react-translate-component";
import en from "../lang/en";
import ch from "../lang/ch";
import my from "../lang/my";
import BuySell from "../components/buy.component";
import SendReceive from "../components/send.component";
import SwapCrypto from "../components/swap.component";
import Transfor from "../components/transfor.component";
import MassPayment from "../components/buyfiat.component";
import { userManager } from "../authentication";
import Changepassword from "../components/changepassword";
import TransactionsHistory from "../components/transactions.history.component";
import AuditLogs from "../components/auditlogs.component";
import Notifications from "../notifications";
import {
  updateCoinDetails,
  updateReceiveCoinDetails,
  updateSwapdata,
  clearSwapData,
  setStep as swapSetStep
} from "../reducers/swapReducer";
import {
  setStepcode as transforSetStep
} from "../reducers/tranfor.Reducer";
import { connect } from "react-redux";
import DefaultUser from "../assets/images/defaultuser.jpg";
import { setHeaderTab, setStep } from "../reducers/buysellReducer";
import {
  setStep as sendSetStep,
  setWithdrawfiatenaable
} from "../reducers/sendreceiveReducer";
import { setStep as byFiatSetStep } from "../reducers/buyFiatReducer";
import { setdepositCurrency } from "../reducers/depositReducer";
import { readNotification as readNotifications } from "../notifications/api";
import Wallets from "../components/wallets.component.js";
import apiCalls from "../api/apiCalls";
import { setNotificationCount } from "../reducers/dashboardReducer";
import { getmemeberInfo } from "../reducers/configReduser";

counterpart.registerTranslations("en", en);
counterpart.registerTranslations("ch", ch);
counterpart.registerTranslations("my", my);

const { Panel } = Collapse;

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
const { Sider } = Layout;
class Header extends Component {
  componentDidMount() {
    counterpart.setLocale(
      this.props.userConfig ? this.props.userConfig.language : "en"
    );
  }
  componentWillUnmount(){
    this.props.dispatch(setHeaderTab(""));
  }
  securityMenu = (
    <Menu>
      <Translate
        className="fs-24 text-white my-16 fw-500 mx-30"
        content="security"
        component={Title}
      />
      <ul className="pl-0 drpdwn-list">
        <li className="no-hover dropdown-flex text-white fs-14 pb-16">
          2FA
          <Switch
            size="small"
            checked={this.props.twoFA?.isEnabled}
            onChange={(status) => {
              if (status === true) {
                window.open(
                  process.env.REACT_APP_AUTHORITY +
                  "/account/login?returnUrl=/manage/EnableAuthenticator",
                  "_self"
                );
              } else {
                window.open(
                  process.env.REACT_APP_AUTHORITY +
                  "/account/login?returnUrl=/manage/Disable2faWarning",
                  "_self"
                );
              }
            }}
          />{" "}
        </li>
        <li className="">
          <Link className="dropdown-flex" to="/changepassword">
            Change Password <span className="icon md rarrow-white" />
          </Link>
        </li>
        <li className="no-hover">
          <div className="">
            <Translate
              className="text-white fs-14 pt-16 mb-0"
              content="current_security_level"
              component={Paragraph}
            />
            <Translate
              className="text-green fw-900"
              content="medium"
              component={Paragraph}
            />
          </div>
          <Translate
            className="text-white fs-14"
            style={{ paddingRight: "78px" }}
            content="current_security_text"
            component={Paragraph}
          />
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
      <Translate
        className="fs-24 text-white my-16 fw-500 mx-30"
        content="settings"
        component={Title}
      />
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
            <Translate
              content="terms_service"
              component={Link}
              onClick={() =>
                window.open(
                  "https://www.iubenda.com/terms-and-conditions/42856099",
                  "_blank"
                )
              }
            />
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

        <li
          className="d-flex justify-content align-center c-pointer"
          onClick={() => {
            userManager.signoutRedirect();
          }}
        >
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
      lang: "en",
      walletsDrawer: false,
      buyDrawer: false,
      sendDrawer: false,
      swapDrawer: false,
      buyToggle: "Buy",
      depositToggle: "From Crypto",
      payDrawer: false,
      payCardsDrawer: false,
      cardsDetails: false,
      billingAddress: false,
      initLoading: true,
      buyFiatDrawer: false,
      showChangePassword: false,
      transactionDrawer: false,
      notificationsDrawer: false,
      auditlogsDrawer: false,
      Visibleprofilemenu: false,
      collapsed: true,
    };
    this.next = this.next.bind(this);
    this.previous = this.previous.bind(this);
    this.carousel = React.createRef();
    this.userProfile = this.userProfile.bind(this);
  }
  userProfile() {
    this.props.history.push("/userprofile");
    this.setState({ ...this.state, Visibleprofilemenu: false });
    if (this.props.oidc.user.profile?.sub) {
      this.props.getmemeberInfoa(this.props.oidc.user.profile.sub);
    }
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
      megamenu: true,
      Visibleprofilemenu: false
    });
  };
  closeMegaMenu = () => {
    this.setState({
      megamenu: false,
      Visibleprofilemenu: false
    });
  };
  showDocRequestError() {
    if (!this.props.twoFA?.isEnabled) {
      this.props.history.push("/enabletwofactor");
    }
    else if (this.props?.userConfig?.isDocsRequested) {
      this.props.history.push("/docnotices");
    }

  }
  showBuyDrawer = () => {
    if (this.props.userConfig.isKYC && !this.props.userConfig.isDocsRequested && this.props.twoFA?.isEnabled) {
      this.props.dispatch(setStep("step1"));
      this.setState({
        buyDrawer: true,
        Visibleprofilemenu: false, collapsed: true,isShowSider: false
      });
    } else {
      const isKyc = !this.props.userConfig.isKYC;
      if (isKyc) {
        this.props.history.push("/notkyc");
      } else {
        this.showDocRequestError();
      }
      this.setState({
        ...this.state,
        Visibleprofilemenu: false, collapsed: false,isShowSider: false
      });
    }
  };
  showSendDrawer = () => {
    if (this.props.userConfig.isKYC && !this.props.userConfig.isDocsRequested && this.props.twoFA?.isEnabled) {
      this.props.dispatch(sendSetStep("step1"));
      this.setState({
        sendDrawer: true,
        Visibleprofilemenu: false,collapsed:true, isShowSider:false
      });
    } else {
      const isKyc = !this.props.userConfig.isKYC;
      if (isKyc) {
        this.props.history.push("/notkyc");
      } else {
        this.showDocRequestError();
      }
      this.setState({
        ...this.state,
        Visibleprofilemenu: false,collapsed:true, isShowSider:false
      });
    }
  };
  showTransactionHistoryDrawer = () => {
    this.setState({
      transactionDrawer: true,
      Visibleprofilemenu: false,
      collapsed: true, isShowSider: false
    });
  };
  showNotificationsDrawer = () => {
    this.setState({
      notificationsDrawer: true,
      Visibleprofilemenu: false
    });
  };
  showAuditLogsDrawer = () => {
    this.setState({
      auditlogsDrawer: true,
      Visibleprofilemenu: false
    });
  };
  showSwapDrawer = () => {
    if (this.props.userConfig.isKYC && !this.props.userConfig.isDocsRequested && this.props.twoFA?.isEnabled) {
      this.props.dispatch(swapSetStep("swapcoins"));
      this.setState({
        swapDrawer: true,
        Visibleprofilemenu: false
      });
    } else {
      const isKyc = !this.props.userConfig.isKYC;
      if (isKyc) {
        this.props.history.push("/notkyc");
      } else {
        this.showDocRequestError();
      }
      this.setState({
        ...this.state,
        Visibleprofilemenu: false
      });
    }
  };
  showTrasforDrawer = () => {
    if (this.props.userConfig.isKYC && !this.props.userConfig.isDocsRequested && this.props.twoFA?.isEnabled) {
      this.props.dispatch(transforSetStep("tranforcoin"));
      this.setState({
        ...this.state,
        transforDrawer: true,
        Visibleprofilemenu: false
      });
    } else {
      const isKyc = !this.props.userConfig.isKYC;
      if (isKyc) {
        this.props.history.push("/notkyc");
      } else {
        this.showDocRequestError();
      }
      this.setState({
        ...this.state,
        Visibleprofilemenu: false
      });
    }
  };
  showBuyFiatDrawer = () => {
    if (this.props.userConfig.isKYC && !this.props.userConfig.isDocsRequested && this.props.twoFA?.isEnabled) {
      this.props.dispatch(byFiatSetStep("step1"));
      this.props.dispatch(setWithdrawfiatenaable(false));
      this.setState({
        buyFiatDrawer: true,
        Visibleprofilemenu: false, isShowSider:false, collapsed:true
      });
    } else {
      const isKyc = !this.props.userConfig.isKYC;
      if (isKyc) {
        this.props.history.push("/notkyc");
      } else {
        this.showDocRequestError();
      }
      this.setState({
        ...this.state,
        Visibleprofilemenu: false,isShowSider:false, collapsed:true
      });
    }
    this.props.dispatch(setdepositCurrency(null));
  };

  showWalletsDrawer = () => {
    this.setState({
      ...this.state,
      walletsDrawer: true, collapsed: true,isShowSider: false
    });
  };

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
    });
    this.props.clearSwapfullData();
    this.setState({
      walletsDrawer: false,
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
      notificationsDrawer: false,
      auditlogsDrawer: false,
      Visibleprofilemenu: false,
      isShowSider: false,
      transforDrawer:false
    });
  };
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
    window.$zoho?.salesiq?.chat.complete();
    window.$zoho?.salesiq?.reset();
    // this.props.dispatch(clearUserInfo());
    userManager.signoutRedirect();
    apiCalls.trackEvent({
      Type: "User",
      Action: "User Logged out",
      Username: null,
      MemeberId: null,
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
    let isRead = apiCalls.encryptValue("true", this.props.userConfig?.sk);
    readNotifications(this.props.userConfig.id).then(() => {
      this.props.dispatch(setNotificationCount(0));
    });
  }
  routeToHome = () => {
    this.props.dispatch(setHeaderTab(''));
    this.props.history.push("/cockpit");
  };

  showPayments = () => {
    if (this.props.userConfig.isKYC && !this.props.userConfig.isDocsRequested && this.props.twoFA?.isEnabled)
      this.props.history.push('/payments');
    else {
      const isKyc = !this.props.userConfig.isKYC;

      if (isKyc) {
        this.props.history.push("/notkyc");
      } else {
        this.showDocRequestError();
      }
    }
    this.setState({ ...this.state, collapsed: true, isShowSider: false })
  }
  newCard = () => {
    if (this.props.userConfig.isKYC && !this.props.userConfig.isDocsRequested && this.props.twoFA?.isEnabled)
      this.props.history.push("/cards");
    else {
      const isKyc = !this.props.userConfig.isKYC;
      if (isKyc) {
        this.props.history.push("/notkyc");
      } else {
        this.showDocRequestError();
      }
    }

  }
  showCards = () => {
    window.open(
      process.env.REACT_APP_CARDS_URL,
      "_blank"
    )
  }
  routeToCockpit = () => {
    this.props.dispatch(setHeaderTab(''));
    this.props.userConfig.isKYC ? this.props.history.push("/cockpit") : this.props.history.push("/notkyc")
    this.setState({...this.state,collapsed:true, isShowSider: false})
  }
  showToggle = () => {
    this.setState({ ...this.state, collapsed: !this.state.collapsed, isShowSider: true })
  }
  render() {
    const link = <LinkValue content="medium" />;
    const depostWithdrawMenu = (
      <Menu>
        <ul className="pl-0 drpdwn-list">
          <li onClick={this.showSendDrawer}>
            <Link>
              <Translate content="tab_crypto" conmponent={Text} />{" "}
              <span className="icon md rarrow-white" />
            </Link>
          </li>
          <li onClick={this.showBuyFiatDrawer}>
            <Link>
              <Translate content="tab_fiat" conmponent={Text} />{" "}
              <span className="icon md rarrow-white" />
            </Link>
          </li>
        </ul>
      </Menu>
    );
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
            {/* <li>
              <Collapse expandIconPosition="right" className="text-left profile-collapse">
                <Panel header="Get Your Own IBAN" key="1" >
                <span onClick={() => window.open("https://pyrros.instance.kyc-chain.com/#/auth/signup/6120197cdc204d9ddb882e4d")}>
                  <Link >
                  <Translate
                  content="personal_account"
                  component={Text}
                  className="text-white-30" key="1"
                />
                <span className="icon md rarrow-white" />
                  </Link></span>
                  <span onClick={() => window.open("https://pyrros.instance.kyc-chain.com/#/auth/signup/611b3ed20414885a6fc64fa7")}>
                  <Link>
                  <Translate
                  content="business_account"
                  component={Text}
                  className="text-white-30" key="1"
                />
                <span className="icon md rarrow-white" />
                    </Link></span>
                </Panel>
              </Collapse>
            </li> */}
            <li
            // onClick={() => window.open('https://pyrros.instance.kyc-chain.com#/auth/signup/6120197cdc204d9ddb882e4d', '_blank')}
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

            {/* <li
              onClick={() => window.open('https://pyrros.instance.kyc-chain.com#/auth/signup/6120197cdc204d9ddb882e4d', '_blank')}
            >
              <Link>
                <Translate
                  content="get_your_own_iban"
                  component={Text}
                  className="text-white-30"
                />
                <span className="icon md rarrow-white" />
              </Link>
            </li> */}
            <li
              onClick={() => this.showAuditLogsDrawer()}
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
    return (
      <>
        <Layout className="layout">
          <menuHeader className="tlv-header" id="area">
            <div className="login-user">
              <ul className="header-logo pl-0">
                <li className="visible-mobile pr-24 p-relative" onClick={this.showToggle}>
                {this.state.collapsed ?
                     <span className="icon lg hamburg " />:<span className="icon md close-white " /> }
                </li>
                <li className="mobile-logo ">
                  {
                    <img
                      src={logoWhite}
                      alt="logo"
                      className="tlv-logo dark c-pointer"
                      onClick={this.routeToHome}
                    />
                  }
                  {
                    <img
                      src={logoColor}
                      alt="logo"
                      className="tlv-logo light c-pointer"
                      onClick={this.routeToHome}
                    />
                  }
                </li>

                <li className="mobile-user ml-8">
                  <Translate
                    content="header_title"
                    onClick={this.routeToCockpit}
                    component={Text}
                    className="text-white-30 fs-24 c-pointer cp-link mb-d-none"
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
                    className="text-white-30 fs-24 ml-16"
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
                  overlay={userProfileMenu}
                  trigger={["click"]}
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
            <Menu
              theme="light"
              mode="horizontal"
              className="header-right mobile-headerview"
              selectedKeys={[this.props.buySell?.headerTab]}
              onSelect={(key) => {
                this.props.dispatch(setHeaderTab(key.key));
              }}
            >
              {this.props.userConfig.isBusiness && process.env.REACT_APP_ISSHOWCARDS == "true" && <Translate
                content="cards"
                component={Menu.Item}
                key="8"
                onClick={this.newCard}
                className="list-item"
                disabled={true}
              />
              }
              <Translate
                content="menu_payments"
                component={Menu.Item}
                key="2"
                onClick={this.showPayments}
                className="list-item"
              />
              <Translate
                content="menu_wallets"
                component={Menu.Item}
                key="3"
                onClick={this.showWalletsDrawer}
                className="list-item"
              />
              <Translate
                content="menu_buy_sell"
                component={Menu.Item}
                key="4"
                onClick={this.showBuyDrawer}
                className="list-item"
              />
              {/* <Translate
                content="menu_swap"
                component={Menu.Item}
                key="4"
                onClick={this.showSwapDrawer}
                className="list-item"
              /> */}
                <Translate
                content="menu_tranfor"
                component={Menu.Item}
                key="5"
                onClick={this.showTrasforDrawer}
                className="list-item"
              />
              <Dropdown
                onClick={() =>
                  this.setState({ ...this.state, Visibleprofilemenu: false })
                }
                overlay={depostWithdrawMenu}
                trigger={["click"]}
                placement="bottomCenter"
                arrow
                overlayClassName="secureDropdown depwith-drpdown"
                getPopupContainer={() => document.getElementById("area")}
              >
                <Translate
                  content="menu_send_receive"
                  component={Menu.Item}
                  key="6"
                  className="mr-16 list-item"
                />
              </Dropdown>

              <Translate
                content="menu_transactions_history"
                component={Menu.Item}
                key="7"
                onClick={this.showTransactionHistoryDrawer}
                className="list-item"
              />
              {/* {this.props.userConfig.isBusiness &&<Translate
                content="cards"
                component={Menu.Item}
                key="8"
                onClick={this.showCards}
                className="list-item"
              />} */}
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
                    Visibleprofilemenu: !this.state.Visibleprofilemenu
                  })
                }
                visible={this.state.Visibleprofilemenu}
                onClick={() =>
                  this.setState({ ...this.state, Visibleprofilemenu: true })
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
            {this.state.isShowSider && <Sider trigger={null}
              collapsible
              collapsed={this.state.collapsed}
              collapsedWidth={0}
              className={` ${this.state.collapsed ? '' : "sideropen"}`}>
              <Menu
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
                  {this.props.userConfig.isBusiness && process.env.REACT_APP_ISSHOWCARDS == "true" && <Translate
                content="cards"
                component={Menu.Item}
                key="8"
                onClick={this.newCard}
                className="list-item"
                disabled={true}
              />
              }
                <Translate
                  content="menu_payments"
                  component={Menu.Item}
                  key="2"
                  onClick={this.showPayments}
                  className="list-item"
                />
                <Translate
                  content="menu_wallets"
                  component={Menu.Item}
                  key="3"
                  onClick={this.showWalletsDrawer}
                  className="list-item"
                />
                <Translate
                  content="menu_buy_sell"
                  component={Menu.Item}
                  key="4"
                  onClick={this.showBuyDrawer}
                  className="list-item"
                />
                   <Translate
                content="menu_tranfor"
                component={Menu.Item}
                key="5"
                onClick={this.showTrasforDrawer}
                className="list-item"
                 />
                 <Translate
                  content="menu_send_receive"
                  component={Menu.Item}
                  key="6"
                  className="mr-16 list-item" />
                <Menu>
                  <ul className="pl-0 drpdwn-list">
                    <li onClick={this.showSendDrawer}>
                      <Link>
                        <Translate content="tab_crypto" conmponent={Text} />{" "}
                        <span className="icon md rarrow-white" />
                      </Link>
                    </li>
                    <li onClick={this.showBuyFiatDrawer}>
                      <Link>
                        <Translate content="tab_fiat" conmponent={Text} />{" "}
                        <span className="icon md rarrow-white" />
                      </Link>
                    </li>
                  </ul>
                </Menu>

                <Translate
                  content="menu_transactions_history"
                  component={Menu.Item}
                  key="7"
                  onClick={this.showTransactionHistoryDrawer}
                  className="list-item"
                />
              </Menu>
            </Sider>}
          </menuHeader>
        </Layout>

        <Modal
          title={[
            <div className="megamenu-title fs-24 text-white">
              <img
                src={logoWhite}
                alt="logo"
                className="tlv-logo"
              />
              <div>
                <span
                  className="icon sm r-arrow-o-white mr-16 c-pointer"
                  style={{ transform: "rotate(180deg)" }}
                  onClick={this.previous}
                ></span>
                <span
                  className="icon sm r-arrow-o-white c-pointer ml-24"
                  onClick={this.next}
                ></span>
                <Translate
                  content="sign_in"
                  className="text-white-30 fs-18 fw-300 c-pointer menu-items menu_Link ml-16"
                />
              </div>
            </div>
          ]}
          visible={this.state.megamenu}
          onCancel={this.closeMegaMenu}
          footer={null}
          wrapClassName="megamenu-backdrop"
          className="megamenu"
          closeIcon={<span className="icon xl closewhite" />}
        >
          <Carousel
            dots={false}
            className="mb-24 menu-carousel"
            ref={(node) => (this.carousel = node)}
          >
            <div className="mega-menu">
              <Row gutter={16} className="megamenu-link">
                <Col md={16} lg={16} xl={5}>
                  <div className="wrapper">
                    <div className="item-wrapper">
                      <Translate
                        className="text-white megamenu-label mb-16 fw-500 mt-0"
                        content="start"
                        component={Title}
                      />
                      <Translate
                        className="text-white-30 fs-16 mb-24 fw-300"
                        content="start_text"
                        component={Paragraph}
                      />
                    </div>
                    <div className="item-wrapper">
                      <Translate
                        content="the_dashboard"
                        to="/dashboard"
                        onClick={() => {
                          this.setState({ ...this.state, megamenu: false });
                        }}
                        className="text-white-30 fs-18 fw-300 c-pointer menu-items menu_Link"
                      />
                      <Translate
                        content="your_portfolio"
                        to="/dashboard"
                        onClick={() => {
                          this.setState({ ...this.state, megamenu: false });
                        }}
                        className="text-white-30 fs-18 fw-300 c-pointer menu-items menu_Link"
                      />
                    </div>
                  </div>
                </Col>
                <Col md={16} lg={16} xl={4}>
                  <div className="wrapper">
                    <div className="item-wrapper">
                      <Translate
                        className="text-white megamenu-label fw-500 mb-24 mt-0"
                        content="personal"
                        component={Title}
                      />
                      <Translate
                        className="fs-18 text-white-30 fw-200 mb-0"
                        content="wallets"
                        component={Paragraph}
                      />
                      <Translate
                        className="text-white-30 fs-16 mb-0 fw-300"
                        content="wallets_text"
                        component={Paragraph}
                      />
                    </div>
                    <div className="item-wrapper">
                      <Translate
                        className="fs-18 text-white-30 fw-200 mb-0"
                        content="cards"
                        component={Paragraph}
                      />
                      <Translate
                        className="fs-18 text-white-30 fw-200 mb-0"
                        content="exchange"
                        component={Paragraph}
                      />
                    </div>
                  </div>
                </Col>
                <Col md={16} lg={16} xl={6}>
                  <div className="wrapper">
                    <div className="item-wrapper">
                      <Translate
                        className="text-white megamenu-label fw-500 mt-0"
                        content="crypto"
                        component={Title}
                      />
                    </div>
                    <div className="item-wrapper">
                      <Translate
                        content="buy_and_sell"
                        onClick={() => {
                          this.closeMegaMenu();
                          this.showBuyDrawer();
                        }}
                        className="text-white-30 fs-18 fw-300 c-pointer menu-items menu_Link"
                      />
                      <Translate
                        content="swap_services"
                        onClick={() => {
                          this.closeMegaMenu();
                          this.showSwapDrawer();
                        }}
                        className="text-white-30 fs-18 fw-300 c-pointer menu-items menu_Link"
                      />
                      <Translate
                        content="deposit_and_withdraw"
                        onClick={() => {
                          this.closeMegaMenu();
                          this.showSendDrawer();
                        }}
                        className="text-white-30 fs-18 fw-300 c-pointer menu-items menu_Link"
                      />
                    </div>
                  </div>
                </Col>
                <Col md={16} lg={16} xl={6}>
                  <div className="wrapper">
                    <div className="item-wrapper">
                      <Translate
                        className="text-white megamenu-label fw-500 mt-0"
                        content="business"
                        component={Title}
                      />
                      <Translate
                        className="text-white-30 fs-16 fw-300"
                        content="business_text"
                        component={Paragraph}
                      />
                    </div>
                    <div className="item-wrapper">
                      <Translate
                        className="text-white-30 fs-18 fw-200 mb-0"
                        content="corporate_wallet"
                        component={Paragraph}
                      />
                      <Translate
                        content="menu_mass_pay"
                        onClick={() => {
                          this.closeMegaMenu();
                          this.showBuyFiatDrawer();
                        }}
                        className="text-white-30 fs-18 fw-300 c-pointer menu-items menu_Link"
                      />
                    </div>
                  </div>
                </Col>
                <Col xl={3} />
              </Row>
              <Divider className="megamenu-divider mobile-none" />
              <Row gutter={[16, 16]} className="megamenu-link">
                <Col lg={5} xl={5} className="mobile-none p-0"></Col>
                <Col lg={5} xl={4} className="mobile-none p-0"></Col>
                <Col md={16} lg={7} xl={6}>
                  <Translate
                    className="text-white megamenu-label  mb-16 fw-500 mt-0"
                    content="connect"
                    component={Title}
                  />
                  <Translate
                    className="text-white-30 fs-18 fw-300 mb-0"
                    content="meet_our_team"
                    component={Paragraph}
                  />
                  <Translate
                    className="text-white-30 fs-18 fw-300 mb-0"
                    content="report_a_bug"
                    component={Paragraph}
                  />
                  <Translate
                    className="text-white-30 fs-18 fw-300 mb-0"
                    content="FAQ"
                    component={Paragraph}
                  />
                  <Translate
                    className="text-white-30 fs-18 fw-300 mb-0"
                    content="contact_us"
                    component={Paragraph}
                  />
                  <Translate
                    className="text-white-30 fs-18 fw-300 mb-0"
                    content="sign_in"
                    component={Paragraph}
                  />
                </Col>

                <Col md={16} lg={5} xl={6}>
                  <Translate
                    className="text-white mb-16 fw-500 megamenu-label mt-0"
                    content="security"
                    component={Title}
                  />
                  <Translate
                    className="text-white fs-14 fw-400 mb-0"
                    content="current_security_level"
                    component={Paragraph}
                  />
                  <Translate
                    className="text-green fw-700 "
                    content="medium"
                    component={Paragraph}
                  />
                  <Translate
                    className="text-white fs-14 fw-400"
                    content="security_text"
                    component={Paragraph}
                  />
                </Col>
                <Col xl={3} />
              </Row>
            </div>
            <div className="mega-menu">
              <Row gutter={16} className="megamenu-link">
                <Col md={16} lg={16} xl={5}>
                  <div className="wrapper">
                    <div className="item-wrapper">
                      <Translate
                        className="text-white megamenu-label mb-16 fw-500 mt-0"
                        content="preferences"
                        component={Title}
                      />
                      <Avatar
                        size={60}
                        style={{ backgroundColor: "#87d068" }}
                        icon={<UserOutlined />}
                      />
                      <Translate
                        className="text-white-30 fs-16 mb-0"
                        content="michael_quiapos"
                        component={Paragraph}
                      />
                      <Translate
                        className="text-secondary fs-14"
                        content="great"
                        component={Paragraph}
                      />
                    </div>
                  </div>
                </Col>
                <Col md={16} lg={16} xl={4}>
                  <div className="wrapper">
                    <Translate
                      className="text-white megamenu-label fw-500 mb-24 item-wrapper mt-0 "
                      content="wallets"
                      component={Title}
                    />
                    <div className="item-wrapper">
                      <Translate
                        className="fs-18 text-white-30 fw-200 mb-0"
                        content="address_book"
                        component={Paragraph}
                      />
                      <Translate
                        className="fs-18 text-white-30 fw-200 mb-0"
                        content="invite_friends"
                        component={Paragraph}
                      />
                      <Translate
                        content="buy_crypto"
                        onClick={() => {
                          this.setState({ ...this.state, megamenu: false });
                          this.showBuyDrawer();
                        }}
                        className="text-white-30 fs-18 fw-300 c-pointer menu-items menu_Link"
                      />
                      <div className="d-flex align-center">
                        <Translate
                          className="fs-18 text-white-30 fw-200 mb-0"
                          content="light_theme"
                          component={Paragraph}
                        />
                        <Switch
                          onChange={this.onChange}
                          size="small"
                          className="custom-toggle ml-12"
                        />
                      </div>
                    </div>
                  </div>
                </Col>
                <Col lg={16} xl={6}>
                  <div className="wrapper">
                    <div className="item-wrapper">
                      <Translate
                        className="text-white megamenu-label fw-500"
                        content="localization"
                        component={Title}
                      />
                      <Translate
                        className="text-white-30 fs-16 fw-400"
                        content="localization_text"
                        component={Paragraph}
                      />
                    </div>
                    <div className="item-wrapper">
                      <div className="d-flex justify-content">
                        <Translate
                          className="text-white-30 fs-18 mb-0 fw-200"
                          content="language"
                          component={Paragraph}
                        />
                        <Translate
                          className="text-white-30 fs-18 mb-0 fw-200"
                          content="lang"
                          component={Paragraph}
                        />
                      </div>
                      <div className="d-flex justify-content">
                        <Translate
                          className="text-white-30 fs-18 mb-0 fw-200"
                          content="currency"
                          component={Paragraph}
                        />
                        <p className="text-white-30 fs-18 mb-0  fw-200"> USD</p>
                      </div>
                    </div>
                  </div>
                </Col>
                <Col xl={1} className=" mobile-none p-0" />
                <Col md={16} lg={16} xl={6}>
                  <div className="wrapper">
                    <div className="item-wrapper">
                      <Translate
                        className="text-white megamenu-label fw-500"
                        content="support"
                        component={Title}
                      />
                    </div>
                    <div className="item-wrapper">
                      <Translate
                        className="fs-18 text-white-30 fw-200 mb-0"
                        content="help_center"
                        component={Paragraph}
                      />
                      <Translate
                        className="fs-18 text-white-30 fw-200 mb-0"
                        content="about"
                        component={Paragraph}
                      />
                      <Translate
                        className="fs-18 text-white-30 fw-200 mb-0"
                        content="social_networks"
                        component={Paragraph}
                      />
                    </div>
                  </div>
                </Col>
                <Col xl={2} className=" mobile-none p-0" />
              </Row>
              <Divider className="megamenu-divider mobile-none" />
              <Row gutter={[16, 16]} className="megamenu-link ">
                <Col xl={5} className=" mobile-none p-0"></Col>
                <Col xl={4} className="pt-24 mobile-none"></Col>
                <Col md={16} lg={16} xl={6}>
                  <Translate
                    className=" text-white mb-16  megamenu-label fw-500"
                    content="connect"
                    component={Title}
                  />
                  <Translate
                    className="fs-18 text-white-30 fw-200 mb-0"
                    content="report_a_bug"
                    component={Paragraph}
                  />
                  <Translate
                    className="fs-18 text-white-30 fw-200 mb-0"
                    content="FAQ"
                    component={Paragraph}
                  />
                  <div className="d-flex align-center">
                    <Translate
                      className="fs-18 text-white-30 fw-200 mb-0"
                      content="chat"
                      component={Paragraph}
                    />
                    <span className="icon lg chat"></span>
                  </div>
                </Col>
                <Col lg={16} xl={1} className=" mobile-none p-0" />
                <Col md={16} lg={16} xl={6}>
                  <Translate
                    className=" text-yellow mb-16 megamenu-label fw-500"
                    content="security"
                    component={Title}
                  />
                  <Translate
                    content="medium_text"
                    with={{ link }}
                    component={Paragraph}
                    className="text-white fs-16"
                  />
                  <Translate
                    className="fs-18 text-white-30 fw-200 mb-0"
                    content="backup_wallet"
                    component={Paragraph}
                  />
                  <Translate
                    className="fs-18 text-white-30 fw-200 mb-0"
                    content="reset_wallet"
                    component={Paragraph}
                  />

                  <div className="d-flex align-center">
                    <Translate
                      className="fs-18 mb-0 text-white-30 fw-300"
                      content="always_ask_pin"
                      component={Paragraph}
                    />
                    <Switch
                      onChange={this.onChange}
                      size="small"
                      className="custom-toggle ml-12"
                    />
                  </div>
                  <div className="d-flex align-center">
                    <Translate
                      className="fs-18 mb-0 text-white-30 fw-300"
                      content="activate_face"
                      component={Paragraph}
                    />
                    <Switch
                      defaultChecked
                      onChange={this.onChange}
                      size="small"
                      className="custom-toggle ml-12"
                    />
                  </div>
                  <div className="d-flex align-center">
                    <Translate
                      className="fs-18 mb-0 text-white-30 fw-300"
                      content="activate_biometry"
                      component={Paragraph}
                    />
                    <Switch
                      defaultChecked
                      onChange={this.onChange}
                      size="small"
                      className="custom-toggle ml-12"
                    />
                  </div>
                </Col>
                <Col xl={2} className=" mobile-none p-0" />
              </Row>
            </div>
          </Carousel>
        </Modal>
        <Wallets
          showDrawer={this.state.walletsDrawer}
          onClose={() => this.closeDrawer()}
        />
        <BuySell
          showDrawer={this.state.buyDrawer}
          onClose={() => this.closeDrawer()}
        />
        <SendReceive
          showDrawer={this.state.sendDrawer}
          onClose={() => this.closeDrawer()}
        />
        <SwapCrypto
          swapRef={(cd) => (this.child = cd)}
          showDrawer={this.state.swapDrawer}
          onClose={() => this.closeDrawer()}
        />
        <Transfor
          swapRef={(cd) => (this.child = cd)}
          showDrawer={this.state.transforDrawer}
          onClose={() => this.closeDrawer()}
        />
        <MassPayment
          showDrawer={this.state.buyFiatDrawer}
          onClose={() => this.closeDrawer()}
        />
        {this.state.transactionDrawer && (
          <TransactionsHistory
            showDrawer={this.state.transactionDrawer}
            onClose={() => {
              this.closeDrawer(this.props.dispatch(setHeaderTab("")));
              if (this.child1) {
                this.child1.setKy();
              }
            }}
            thref={(cd) => (this.child1 = cd)}
          />
        )}
        {this.state.notificationsDrawer && (
          <Notifications
            showDrawer={this.state.notificationsDrawer}
            onClose={() => this.closeDrawer()}
          />
        )}
        {this.state.auditlogsDrawer && (
          <AuditLogs
            showDrawer={this.state.auditlogsDrawer}
            onClose={() => this.closeDrawer()}
          />
        )}
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
    clearSwapfullData: (member_id) => {
      dispatch(clearSwapData(member_id));
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
