import React, { Component } from 'react';
import { Layout, Menu, Modal, Typography, Dropdown, Row, Col, Divider, Avatar, Carousel, Switch, Drawer, Button } from 'antd';
import { Link, withRouter } from 'react-router-dom';
import logoWhite from '../../assets/images/logo-white.png';
import logoColor from '../../assets/images/logo-color.png';
import Translate from 'react-translate-component';
import DefaultUser from '../../assets/images/defaultuser.jpg';
import { connect } from 'react-redux';

const userProfileMenu = (
    <Menu>
        <div className="profile-dropdown">
            {/* {this.props.userConfig?.imageURL != null && <img src={this.props.userConfig?.imageURL ? this.props.userConfig?.imageURL : DefaultUser} className="user-profile" alt={"image"} />}
            {this.props.userConfig?.imageURL === null && <img src={this.props.userConfig?.imageURL ? this.props.userConfig?.imageURL : DefaultUser} className="user-profile" alt={"image"} />} */}
            {/* <p className="mb-15 ml-8 profile-value" style={{ flexGrow: 12 }}>{this.props.userConfig.firstName} {this.props.userConfig.lastName}</p> */}
            <p className="mb-15 ml-8 profile-value" style={{ flexGrow: 12 }}>John Doe</p>
            <Translate content="manage_account" component={Button} size="medium" block className="profile-btn" onClick={() => this.userProfile()} />
            <ul className="pl-0 drpdwn-list">
                <li className="c-pointer" onClick={() => this.showAuditLogsDrawer()}>
                    <Translate content="AuditLogs" component={Link} className="c-pointer px-0" />
                </li>
                <li className="c-pointer" onClick={() => this.clearEvents()}>
                    <Translate content="logout" className="c-pointer px-0" component={Link} />
                </li>
            </ul>
        </div>
    </Menu>
);
class InitialHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {

        }
    }
    render() {
        return (
            <Layout className="layout">
                <menuHeader className="tlv-header inital-header" id="area">
                    <div className="login-user">
                        <ul className="header-logo pl-0">
                            <li className="pr-30 p-relative">
                                {<img src={logoWhite} alt="logo" className="tlv-logo dark" alt={"image"} />}
                                {<img src={logoColor} alt="logo" className="tlv-logo light" alt={"image"} />}
                            </li>
                        </ul>
                        <Menu theme="light" mode="horizontal" className="header-right mobile-header-right">
                            <Menu.Item key="6"><span className="icon md bell" onClick={this.showNotificationsDrawer} /></Menu.Item>
                            <Dropdown overlay={userProfileMenu} trigger={['click']} placement="topRight" arrow overlayClassName="secureDropdown" getPopupContainer={() => document.getElementById('area')}>
                                <Menu.Item key="7">{this.props.userConfig?.imageURL != null && <img src={this.props.userConfig?.imageURL ? this.props.userConfig?.imageURL : DefaultUser} className="user-profile" alt={"image"} />}
                                    {this.props.userConfig?.imageURL === null && <img src={this.props.userConfig?.imageURL ? this.props.userConfig?.imageURL : DefaultUser} className="user-profile" alt={"image"} />}</Menu.Item>
                            </Dropdown>
                        </Menu>
                    </div>
                    <Menu theme="light" mode="horizontal" className="header-right">
                        <Menu.Item key="6" className="notification-conunt" onClick={this.showNotificationsDrawer}><span className="icon md bell ml-4 p-relative" onClick={() => this.readNotification()}>{(this.props.dashboard?.notificationCount != null && this.props.dashboard?.notificationCount != 0) && <span>{this.props.dashboard?.notificationCount}</span>}</span></Menu.Item>
                        <Dropdown onVisibleChange={() => this.setState({ ...this.state, Visibleprofilemenu: !this.state.Visibleprofilemenu })} visible={this.state.Visibleprofilemenu} onClick={() => this.setState({ ...this.state, Visibleprofilemenu: true })} overlay={userProfileMenu} placement="topRight" arrow overlayClassName="secureDropdown" getPopupContainer={() => document.getElementById('area')}>
                            <Menu.Item key="7" className="ml-16" >{this.props.userConfig?.imageURL != null && <img src={this.props.userConfig?.imageURL ? this.props.userConfig?.imageURL : DefaultUser} className="user-profile" alt={"image"} />}
                                {this.props.userConfig?.imageURL === null && <img src={this.props.userConfig?.imageURL ? this.props.userConfig?.imageURL : DefaultUser} className="user-profile" alt={"image"} />}</Menu.Item>
                        </Dropdown>
                    </Menu>
                </menuHeader>
            </Layout >
        )
    }
}
const connectStateToProps = ({ swapStore, userConfig, oidc, dashboard, buySell }) => {
    return { swapStore, userConfig: userConfig.userProfileInfo, dashboard, buySell, oidc }
}
const connectDispatchToProps = dispatch => {
    return {
        dispatch
    }
}

export default connect(connectStateToProps, connectDispatchToProps)(withRouter(InitialHeader));