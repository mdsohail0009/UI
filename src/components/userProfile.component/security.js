import React, { useState } from 'react';
import { Typography, Switch, Drawer } from 'antd'
import Translate from 'react-translate-component';
import Changepassword from '../../components/changepassword';
import { connect } from 'react-redux';
import { updatechange } from '../../reducers/UserprofileReducer';
import {store} from '../../store'
import Moment from 'react-moment';

const Security =({userConfig})=> {
    const [isChangepassword,setisChangepassword]=useState(false)
    
    const showDrawer = () => {
        setisChangepassword(true);
        store.dispatch(updatechange())
    }
    const onClose = () => {
        setisChangepassword(false)
    }
    const enableDisable2fa = (status) => {
        var url = '';
        if (status) {
            url = process.env.REACT_APP_AUTHORITY + "/account/login?returnUrl=/manage/EnableAuthenticator";
        } else {
            url = process.env.REACT_APP_AUTHORITY + "/account/login?returnUrl=/manage/Disable2faWarning"
        }
        window.open(url,"_self");
        
    }
        const { Title, Paragraph,Text } = Typography;
        return (<>
            <div className="box basic-info">
                <Title className="basicinfo"><Translate content="TwoFactorAuthentication" component={Title} className="basicinfo"/></Title>
                <Paragraph className="basic-decs"><Translate content="TwoFactorAuthentication_tag" component={Paragraph} className="basic-decs"/></Paragraph>
                <ul className="user-list pl-0">
                    <li className="profileinfo">
                        <div className="d-flex profile-block">
                            <label className="mb-0 profile-label" ><Translate content="FA_tag" component={Paragraph.label} className="mb-0 profile-label"/></label>
                            <p className="mb-0 ml-8 profile-value" style={{ flexGrow: 12 }}>{userConfig?.twofactorVerified?<Translate content="Enabled" component={Paragraph.p} className="mb-0 ml-8 profile-value" />:<Translate content="Disabled" component={Paragraph.p} className="mb-0 ml-8 profile-value"/>}</p>
                            <div>
                                <Switch onChange={(status)=>enableDisable2fa(status)} checked={userConfig?.twofactorVerified} size="medium" className="custom-toggle ml-12" /></div>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="box contact-info">
                <Title className="basicinfo"><Translate content="change_password" component={Title} className="basicinfo"/></Title>
                <Paragraph className="basic-decs"><Translate content="Choose_a_unique_pass_word_to_protect_your_account" component={Paragraph} className="basic-decs"/></Paragraph>
                <ul className="user-list pl-0">
                    <li className="profileinfo c-pointer" onClick={()=>showDrawer()}>
                        <div className="d-flex profile-block">
                            <label className="mb-0 profile-label"><Translate content="Password" component={Paragraph.label} className="mb-0 profile-label"/></label>
                            <div style={{ flexGrow: 12 }}>
                                <p className="mb-0 ml-8 profile-value"> ************</p>
                                {userConfig?.pwdModifiedDate!=null&&<p className="mb-0 ml-8 fs-14 text-white"><Translate content="Password" component={Paragraph.p} className="mb-0 ml-8 fs-14 text-white"/> <Moment format="DD-MM-YYYY">{userConfig?.pwdModifiedDate}</Moment></p>}
                            </div>
                            <div>
                            <span className='text-white'><Translate content="Click_here_to_change_pass_word" component={Paragraph.span} className='text-white'/></span><span className="icon md rarrow-white" />
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <Drawer
                title={[<div className="side-drawer-header">
                    <span onClick={()=>onClose()} className="icon md lftarw-white c-pointer" />
                    <div className="text-center fs-14">
                        <Translate className="text-center fs-14 text-white" content="change_password" component={Drawer.title} />
                    </div>
                    <span onClick={()=>onClose()} className="icon md close-white c-pointer" />

                </div>]}
                placement="right"
                closable={true}
                visible={isChangepassword}
                closeIcon={null}
                onClose={() => setisChangepassword(false)}
                className="side-drawer"
            >
                <Paragraph className="mb-16 ml-8 fs-14 text-white mt-8 fw-200 py-16"><Translate content="Choose_a_unique_pass_word_to_protect_your_account" component={Paragraph} className="mb-16 ml-8 fs-14 text-white mt-8 fw-200 py-16"/></Paragraph>
                <Changepassword onSubmit={() => setisChangepassword(false)} />
            </Drawer>


        </>)
    }
const connectStateToProps = ({  userConfig }) => {
    return {userConfig: userConfig.userProfileInfo }
  }
export default connect(connectStateToProps)(Security);