import React, { Component } from 'react';
import { Layout, Typography, Menu, Button, Dropdown } from 'antd';
import labels from '../utils/lables.json'
const { Footer: AntFooter } = Layout

const languages = (
    <Menu>
        <Menu.Item key="0">English</Menu.Item>
        <Menu.Item key="1">Chineese</Menu.Item>
        <Menu.Item key="3">Indonasia</Menu.Item>
        <Menu.Item key="4">Europe</Menu.Item>
    </Menu>
);

class Footer extends Component {
    render() {
        // return <AntFooter style={{ textAlign: 'center' }}>{labels.company} @copy; {new Date().getFullYear()} Created by {labels.company}</AntFooter>
        return <AntFooter style={{ backgroundColor: 'transparent', padding: 0 }}>
            <div className="main-container footer-links">
                <div>
                    <Typography.Link>Home</Typography.Link>
                    <Typography.Link>Careers </Typography.Link>
                    <Typography.Link>Legan & Policy</Typography.Link>
                    <Typography.Link>{new Date().getFullYear()} Suissebase</Typography.Link>
                </div>
                <Dropdown overlay={languages} trigger={['click']} placement="topRight">
                    <Button type="primary" size="large" className="lng-btn">EN</Button>
                </Dropdown>
            </div>
        </AntFooter>
    }

}

export default Footer