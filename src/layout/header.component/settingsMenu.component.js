import React, { Component } from 'react';
import { Typography, Menu, Dropdown } from 'antd';
import Translate from 'react-translate-component';
import { Link } from 'react-router-dom';
import { userManager } from '../../authentication';

const { Title } = Typography;
class SettingsMenu extends Component {
    settingMenu = (<Menu><Translate className="fs-24 text-white my-16 fw-500 mx-30" content="settings" component={Title} />
        <ul className="drpdwn-list">
            <li>
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
                    <Translate content="terms_service" component={Link} onClick={() => window.open("https://www.iubenda.com/terms-and-conditions/42856099", '_blank')} />
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
            <li className="d-flex justify-content align-center c-pointer" onClick={() => { userManager.signoutRedirect() }}>
                <Translate content="logout" component={Link} />
                <span className="icon md rarrow-white" />
            </li>
        </ul></Menu>)
    render() {

        return (
            <>
                <Dropdown overlay={this.settingMenu} trigger={['click']} placement="topRight" arrow overlayClassName="secureDropdown" getPopupContainer={() => document.getElementById('area')}>
                    <Menu.Item key="7"><span className="icon md gear ml-4" /></Menu.Item>
                </Dropdown>

            </>
        )
    }
}
export default SettingsMenu