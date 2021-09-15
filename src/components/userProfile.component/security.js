import React, { Component, useState } from 'react';
import { Row, Col, Typography, Switch, Drawer } from 'antd'
import Translate from 'react-translate-component';
import Changepassword from '../../components/changepassword';
import { connect } from 'react-redux';
import { updatechange } from '../../reducers/UserprofileReducer';
import {store} from '../../store'

const Security =({userConfig,onChange})=> {
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
        var win = window.open(url,"_self");
        
    }
        const { Title, Text, Paragraph } = Typography;
        return (<>
            <div className="box basic-info">
                <Title className="basicinfo">Two Factor Authentication</Title>
                <Paragraph className="basic-decs">Protect your account with 2-Step Verification</Paragraph>
                <ul className="user-list pl-0">
                    <li className="profileinfo">
                        <div className="d-flex profile-block">
                            <label className="mb-0 profile-label" >2FA</label>
                            <p className="mb-0 ml-8 profile-value" style={{ flexGrow: 12 }}>{userConfig?.twofactorVerified?'Enabled':'Disabled'}</p>
                            <div>
                                <Switch onChange={(status)=>enableDisable2fa(status)} checked={userConfig?.twofactorVerified} size="medium" className="custom-toggle ml-12" /></div>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="box contact-info">
                <Title className="basicinfo">Change Password</Title>
                <Paragraph className="basic-decs">Choose a unique password to protect your account</Paragraph>
                <ul className="user-list pl-0">
                    <li className="profileinfo c-pointer" onClick={()=>showDrawer()}>
                        <div className="d-flex profile-block">
                            <label className="mb-0 profile-label">Password</label>
                            <div style={{ flexGrow: 12 }}>
                                <p className="mb-0 ml-8 profile-value"> ************</p>
                                <p className="mb-0 ml-8 fs-14 text-white"> {userConfig?.email}</p>
                            </div>
                            <div>
                                <span className="icon md rarrow-white" />
                            </div>
                        </div>
                    </li>
                </ul>
            </div>
            <Drawer
                title={[<div className="side-drawer-header">
                    <span onClick={()=>onClose()} className="icon md lftarw-white c-pointer" />
                    <div className="text-center fs-14">
                        <Translate className="mb-0 text-white-30 fw-600 text-upper" content="change_password" component={Paragraph} />
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
                <Paragraph className="mb-16 ml-8 fs-14 text-white mt-8 fw-200 py-16">Choose a unique password to protect your account</Paragraph>
                <Changepassword onSubmit={() => setisChangepassword(false)} />
            </Drawer>


        </>)
    }
const connectStateToProps = ({  userConfig }) => {
    return {userConfig: userConfig.userProfileInfo }
  }
export default connect(connectStateToProps)(Security);