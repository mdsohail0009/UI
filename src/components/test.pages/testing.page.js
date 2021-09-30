import React, { Component }  from 'react';
import { List, Layout, Divider,notification,Space } from 'antd';
import {  Button,Modal } from "antd";
const { Content } = Layout;
class TestingPage extends Component {
    state = {
        selectWalletModal : false,
        confirmLoading : false,
        modalText : 'Content of the modal'
    }
    openNotification(){
      const args = {
        message: 'Notification Title',
        description:
        'I will never close automatically. This is a purposely very very long description that has many many characters and words.',
        duration: 0,
      };
      notification.open(args);
    };
    openNotificationWithIcon = type => {
      notification[type]({
        message: 'Notification Title',
        description:
        'This is the content of the notification. This is the content of the notification. This is the content of the notification.',
      });
    };

    showWallet = () => {
      this.setState({
        selectWalletModal: true
      })
    };
    handleOk = () => {
      this.setState({
        confirmLoading : true,
        selectWalletModal: false
      })
    };
    handleCancel = () => {
      this.setState({
        selectWalletModal: false
      })
    };

    render() {
        return <Content style={{ padding: "0 50px" }}>
            <List dataSource={[{ name: "Highcharts Docs", url: "https://www.highcharts.com/docs/index" }]}
                header={<div>Document Links</div>}
                bordered
                renderItem={(item) => <a style={{ padding: "0 25px" }} href={item.url} target="_blank">{item.name}</a>}
            />

            <Divider />

            <Button className="card-btn" onClick={this.showWallet}>Open Model</Button>
            <Modal
                title="Title"
                visible={this.state.selectWalletModal}
                onOk={this.handleOk}
                confirmLoading={this.confirmLoading}
                onCancel={this.handleCancel}
            >
                <p>{this.state.modalText}</p>
            </Modal>

            <Divider />

            <Button
                type="default"
                className="addContent px-16"
                size="small"
                style={{ padding: "0 50px" }}
                onClick={() => {
                    this.props.history.push("/neo/FormValidation");
                }}
                > Form Validations
            </Button>

            <Divider />

            <Button
                type="default"
                className="addContent px-16"
                size="small"
                onClick={() => {
                    this.props.history.push("/neo/highchart");
                }}
                > High Charts
            </Button>

            <Divider />

            <Button type="primary" onClick={this.openNotification}>
                Open the notification box
            </Button>
            <Space>
                <Button onClick={() => this.openNotificationWithIcon('success')}>Success</Button>
                <Button onClick={() => this.openNotificationWithIcon('info')}>Info</Button>
                <Button onClick={() => this.openNotificationWithIcon('warning')}>Warning</Button>
                <Button onClick={() => this.openNotificationWithIcon('error')}>Error</Button>
            </Space>,

            <Divider />

        </Content>

    }
}
export default TestingPage