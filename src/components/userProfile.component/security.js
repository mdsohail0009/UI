import React, { Component } from 'react';
import { Row, Col, Typography, Switch, Drawer } from 'antd'
import Translate from 'react-translate-component';
import ChangePassword from './changePassword';

class Security extends Component {
    state = {
        isChangepassword: false
    }
    showDrawer = () => {
        this.setState({ isChangepassword: true })
    }
    onClose = () => {
        this.setState({ isChangepassword: false })
    }
    render() {
        const { Title, Text, Paragraph } = Typography;
        return (<>
            <div className="box basic-info">
                <Title className="basicinfo">Two Factor Authentication</Title>
                <Paragraph className="basic-decs">Protect your account with 2-Step Verification</Paragraph>
                <ul className="user-list pl-0">
                    <li className="profileinfo">
                        <div className="d-flex profile-block">
                            <label className="mb-0 profile-label" >2FA</label>
                            <p className="mb-0 ml-8 profile-value" style={{ flexGrow: 12 }}>Active</p>
                            <div>
                                <Switch onChange={this.onChange} size="medium" className="custom-toggle ml-12" /></div>
                        </div>
                    </li>
                </ul>
            </div>
            <div className="box contact-info">
                <Title className="basicinfo">Change Password</Title>
                <Paragraph className="basic-decs">Choose a unique password to protect your account</Paragraph>
                <ul className="user-list pl-0">
                    <li className="profileinfo" onClick={this.showDrawer}>
                        <div className="d-flex profile-block">
                            <label className="mb-0 profile-label">Password</label>
                            <div style={{ flexGrow: 12 }}>
                                <p className="mb-0 ml-8 profile-value"> ************</p>
                                <p className="mb-0 ml-8 fs-14 text-white"> Johndoe@suissebase.com</p>
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
                    <span onClick={this.onClose} className="icon md lftarw-white c-pointer" />
                    <div className="text-center fs-14">
                        <Translate className="mb-0 text-white-30 fw-600 text-upper" content="change_password" component={Paragraph} />
                    </div>
                    <span onClick={this.onClose} className="icon md close-white c-pointer" />

                </div>]}
                placement="right"
                closable={true}
                visible={this.state.isChangepassword}
                closeIcon={null}
                onClose={() => this.setState({ ...this.state, isChangepassword: false })}
                className="side-drawer"
            >
                <Paragraph className="mb-0 ml-8 fs-14 text-white mt-16 fw-200">Choose a unique password to protect your account</Paragraph>
                <ChangePassword onSubmit={() => { this.setState({ ...this.state, isChangepassword: false }) }} />
            </Drawer>


        </>)
    }
}
export default Security;