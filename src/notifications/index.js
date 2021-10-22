import React, { useEffect, useState } from 'react';
import { List, Drawer, Typography, Alert, Empty } from 'antd';
import { getNotifications } from './api';
import connectStateProps from '../utils/state.connect';
import Moment from 'react-moment';
import { setNotificationCount } from '../reducers/dashboardReducer';
const { Text } = Typography;
const Notifications = ({ onClose, showDrawer, userProfile,dispatch }) => {
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetchNotifications();
    }, []);
    const fetchNotifications = async () => {
        setLoading(true);
        debugger
        const response = await getNotifications(userProfile.id);
        if (response.ok) {
            setNotifications(response.data.listNotificationsModel || []);
            dispatch(setNotificationCount(response?.data?.unReadCount));
        } else {
            setError(response?.data?.message || response.data);
        }
        setLoading(false);
    }
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
                {!loading && error && <Alert type="error" description={error} showIcon />}
                <List
                    itemLayout="vertical"
                    size="large"
                    className="notifications-list mt-24"
                    loading={loading}
                    locale={{ emptyText: <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No data found" /> }}
                >
                    {notifications.data?.map((item, indx) => <List.Item key={indx} style={{ borderWidth: '0px' }} >
                        <List.Item.Meta
                            className={`${item.notificationType}bg`}
                            avatar={<span className="icon md recivewhitearrow c-pointer" />}
                            title={<div className="d-flex justify-content align-center text-white-30"><p className="mb-0">{item.type}</p><p className="mb-0 text-secondary fs-14"><Moment format={"DD MMM YY"}></Moment></p></div>}
                        />
                        <Text className="text-white-30">{item?.description} </Text>
                    </List.Item>)}
                </List>
            </Drawer>
        </>
    )
}
export default connectStateProps(Notifications);;