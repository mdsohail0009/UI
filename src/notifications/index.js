import React, { useEffect, useState } from 'react';
import { List, Drawer, Typography, Alert, Empty } from 'antd';
import { getNotifications, readNotification } from './api';
import connectStateProps from '../utils/state.connect';
import Moment from 'react-moment';
import { setNotificationCount } from '../reducers/dashboardReducer';
import Translate from 'react-translate-component';
import apiCalls from '../api/apiCalls';

const { Text } = Typography;
const Notifications = ({ onClose, showDrawer, userProfile, dispatch, dashboard }) => {
    const [loading, setLoading] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [error, setError] = useState(null);
    useEffect(() => {
        fetchNotifications();
    }, []);
    const fetchNotifications = async () => {
        setLoading(true);
        const response = await getNotifications(userProfile?.id);
        if (response.ok) {
            debugger
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
                title={[<div className="side-drawer-header p-0">
                    <Translate className="text-white-30 fs-20 fw-500" component={Text} content="notifications" />
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
                    className="notifications-list"
                    loading={loading}
                    locale={{
                        emptyText: <Empty className="mt-36" image={Empty.PRESENTED_IMAGE_SIMPLE} description={apiCalls.convertLocalLang('notification_msg')} />
                    }}
                >
                    {notifications?.map((item, indx) => <List.Item onClick={() => { if (!item.isRead) { readNotification(item.id); dispatch(setNotificationCount(dashboard.notificationCount - 1)) } }} key={indx} style={{ borderWidth: '0px' }} >
                        <List.Item.Meta
                            className={`${item?.action?.toLowerCase()}bg mb-0`}
                            avatar={<span className={`icon md notifyIcon ${item?.action?.toLowerCase()}`} />}
                            title={<div className="d-flex justify-content align-center"><Text className="text-white-30 fs-14">{item.action}</Text><Text className="text-secondary fs-12"><Moment format={"DD MMM YY"}>{item.notifiedDate}</Moment></Text></div>}
                            description={<Text className={`text-white-50 ${!item.isRead ? "fw-200" : "fw-500"} fs-12`}>{item?.message} </Text>}
                        />
                    </List.Item>)}
                </List>
            </Drawer>
        </>
    )
}
export default connectStateProps(Notifications);