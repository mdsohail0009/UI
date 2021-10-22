import React from 'react';
import { List, Drawer, Typography } from 'antd';
const { Text } = Typography;
const Notifications = ({onClose,showDrawer}) => {
    return (
        <>
            <Drawer
                title={[<div className="side-drawer-header">
                    <span className="text-white">Notifications</span>
                    <div className="text-center fs-16"></div>
                    <span onClick={onClose} className="icon md close-white c-pointer" />
                </div>]}
                placement="right"
                closable={false}
                onClose={onClose}
                visible={showDrawer}
                className="side-drawer"
            >
                <List
                    itemLayout="vertical"
                    size="large"
                    className="notifications-list mt-24"
                >
                    <List.Item style={{ borderWidth: '0px' }} >
                        <List.Item.Meta
                            className="depositbg"
                            avatar={<span className="icon md recivewhitearrow c-pointer" />}
                            title={<div className="d-flex justify-content align-center text-white-30"><p className="mb-0">Deposit</p><p className="mb-0 text-secondary fs-14">Otc 20, 4.30 PM</p></div>}
                        />
                        <Text className="text-white-30">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an printer </Text>
                    </List.Item>
                    <List.Item style={{ borderWidth: '0px' }} >
                        <List.Item.Meta
                            className="withdrawbg"
                            avatar={<span className="icon md sentwhitearrow c-pointer" />}
                            title={<div className="d-flex justify-content align-center text-white-30"><p className="mb-0">Withdraw</p><p className="mb-0 text-secondary fs-14">Otc 20, 4.30 PM</p></div>}
                        />
                        <Text className="text-white-30">Lorem Ipsum has been the industry's since the 1500s, when an printer </Text>
                    </List.Item>
                    <List.Item style={{ borderWidth: '0px' }} >
                        <List.Item.Meta
                            className="approvebg"
                            avatar={<span className="icon md approve c-pointer" />}
                            title={<div className="d-flex justify-content align-center text-white-30"><p className="mb-0">Approve</p><p className="mb-0 text-secondary fs-14">Otc 20, 4.30 PM</p></div>}
                        />
                        <Text className="text-white-30">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an printer </Text>
                    </List.Item>
                    <List.Item style={{ borderWidth: '0px' }} >
                        <List.Item.Meta
                            className="requestbg"
                            avatar={<span className="icon lg documents-icon c-pointer" />}
                            title={<div className="d-flex justify-content align-center text-white-30"><p className="mb-0">Request for doc</p><p className="mb-0 text-secondary fs-14">Otc 20, 4.30 PM</p></div>}
                        />
                        <Text className="text-white-30">Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an printer </Text>
                    </List.Item>
                </List>
            </Drawer>
        </>
    )
}
export default Notifications;