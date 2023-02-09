import React, { Component } from 'react';
import { Typography,Switch,Menu,Dropdown} from 'antd';
import Translate from 'react-translate-component';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import AppConfig from '../../utils/app_config';

const { Title,Paragraph } = Typography;
class SecurityMenu extends Component {
    securityMenu=(<Menu><Translate className="fs-24 text-white my-16 fw-500 mx-30" content="security" component={Title} />
    <ul className="drpdwn-list">
        <li className="no-hover dropdown-flex text-white fs-14 pb-16">2FA<Switch size="small" checked={this.props.userConfig?.twofactorVerified} onChange={(status)=>{
            if(status){
                window.open(AppConfig.REACT_APP_AUTHORITY+ "/account/login?returnUrl=/manage/EnableAuthenticator","_self");
            }else{
                window.open(AppConfig.REACT_APP_AUTHORITY+ "/account/login?returnUrl=/manage/Disable2faWarning","_self");
            }
        }} /> </li>
        <li className="">
            <Link className="dropdown-flex" to="/changepassword" >Change Password <span className="icon md rarrow-white" /></Link>

        </li>
        <li className="no-hover">
            <div className="">
                <Translate className="text-white fs-14 pt-16 mb-0" content="current_security_level" component={Paragraph} />
                <Translate className="text-green fw-900" content="medium" component={Paragraph} />
            </div>
            <Translate className="text-white fs-14" style={{ paddingRight: '78px' }} content="current_security_text" component={Paragraph} />
        </li>
        <li>
            <div className="dropdown-flex-top">
                <Translate content="protect_your_account" component={Link} />
                <span className="icon md rarrow-white" />
            </div>
        </li>
    </ul></Menu>)
    render() {
        return(
            <>
                <Dropdown overlay={this.securityMenu} placement="topRight" arrow overlayClassName="secureDropdown" getPopupContainer={() => document.getElementById('area')}>
                    <Translate key="5" content="security" component={Menu.Item} />
                </Dropdown>
            
        </>
        )
    }
}
const connectStateToProps = ({ userConfig}) => {
    return { userConfig: userConfig.userProfileInfo }
}
export default connect(connectStateToProps)(SecurityMenu);