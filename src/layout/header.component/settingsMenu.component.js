import React, { Component } from 'react';
import { Typography} from 'antd';
import Translate from 'react-translate-component';
import { Link } from 'react-router-dom';
import { userManager } from '../../authentication';

const { Title } = Typography;
class SettingsMenu extends Component {
    render() {
        return(
            <>
            <Translate className="fs-24 text-white my-16 fw-500 mx-30" content="settings" component={Title} />
            <ul className="pl-0 drpdwn-list">
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
                        <Translate content="terms_service" component={Link} />
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
                <li className="d-flex justify-content align-center" onClick={() => userManager.signoutRedirect()}>
                    <Translate content="logout" component={Link} />
                    <span className="icon md rarrow-white" />
                </li>
            </ul>
        </>
        )
    }
}
export default SettingsMenu