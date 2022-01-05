import React, { Component } from 'react';
import { Layout, Menu, Modal, Typography, Dropdown, Row, Col, Divider, Avatar, Carousel, Switch, Drawer, Button } from 'antd';

class HomeComponent extends Component {
    render() {
        const { Title, Text, Paragraph } = Typography;
        return (
            <>
                <div className="text-center">
                    <Text className="d-block wlecome-text">Welcome John Doe</Text>
                    <Text>Good Morning</Text>

                </div>

            </>
        )
    }
}

export default HomeComponent;