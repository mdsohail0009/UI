import React, { Component } from 'react';
import { Row, Col, Typography, Select,Divider } from 'antd'
import Translate from 'react-translate-component';
import ChangePassword from './changePassword';

class Settings extends Component {
    state = {

    }
    onChange = () => {

        
    }
    themeSwitch=() =>{
        
    }
    render() {
        const { Option } = Select;
        const { Title, Text, Paragraph } = Typography;
        return (<>
            <div className="box basic-info">
                <Title className="basicinfo">Settigns</Title>
                <Paragraph className="basic-decs">User customized settings</Paragraph>
                <div className="pb-16 border-bottom">
                    <Text className="input-label">Language</Text>
                    <Select placeholder="Select a Language"  bordered={false}
                     className="cust-input cust-select mb-0"
                     dropdownClassName="select-drpdwn"
                     onChange={this.onChange}>
                        <Option value="english">English</Option>
                        <Option value="chaina">英语</Option>
                        <Option value="myalay">Malay</Option>
                    </Select>
                </div>
                <div className="py-16 border-bottom">
                    <Text className="input-label">Local Currency</Text>
                    <Select placeholder="Select a Language"  bordered={false}
                     className="cust-input cust-select mb-0"
                     dropdownClassName="select-drpdwn"
                     onChange={this.onChange}>
                        <Option value="english">India</Option>
                        <Option value="chaina">Singapur</Option>
                        <Option value="myalay">U.S.A</Option>
                    </Select>
                </div>
                <div className="pt-16">
                    <Text className="input-label">Theme</Text>
                    <div className="d-flex">
                    <div className="theme-switch theme-active" onClick={this.themeSwitch}>
                        <div className="d-flex align-center">
                            <p className="switch-circle mb-0"><span className="icon md check-arrow c-pointer"></span></p>
                            <p className="mb-0 ml-16 theme-txt">Dark Theme</p></div>
                    </div>
                    <div className="theme-switch ml-24">
                        <div className="d-flex align-center">
                            <p className="switch-circle mb-0"><span></span></p>
                            <p className="mb-0 ml-16 theme-txt">Light Theme</p></div>
                    </div>
                    </div>
                </div>
            </div>
        </>)
    }
}
export default Settings;