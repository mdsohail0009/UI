import React, { useEffect, useState } from "react";
import { List, Drawer, Typography, Alert, Empty } from "antd";
import { getNotifications } from "./api";
import ConnectStateProps from "../utils/state.connect";
import Moment from "react-moment";
import { setNotificationCount } from "../reducers/dashboardReducer";
import Translate from "react-translate-component";
import apiCalls from "../api/apiCalls";
import Loader from "../Shared/loader";

const { Text } = Typography;
const Notifications = ({
  onClose,
  showDrawer,
  userProfile,
  dispatch,
  userProfileInfo
}) => {
  const [loading, setLoading] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [error, setError] = useState(null);
  useEffect(() => {
    fetchNotifications();
  }, []);// eslint-disable-line react-hooks/exhaustive-deps
  const notificationsTrack = () => {
    apiCalls.trackEvent({
      Type: "User",
      Action: "Notifications page view",
      Username: userProfileInfo?.userName,
      customerId: userProfileInfo?.id,
      Feature: "Notifications",
      Remarks: "Notifications page view",
      Duration: 1,
      Url: window.location.href,
      FullFeatureName: "Notificatons"
    });
  };
  const fetchNotifications = async () => {
    notificationsTrack();
    if (userProfile?.id) {
      setLoading(true);
      const response = await getNotifications();
      if (response.ok) {
        setNotifications(response.data.listNotificationsModel || []);
        dispatch(setNotificationCount(response?.data?.unReadCount));
      } else {
        setError(response?.data?.message || response.data);
      }
      setLoading(false);
    }
  };
  const convertUTCToLocalTime = (dateString) => {
    let date = new Date(dateString);
    const milliseconds = Date.UTC(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      date.getHours(),
      date.getMinutes(),
      date.getSeconds(),
    );
    return new Date(milliseconds).toISOString()
  };
  return (
    <>
      <Drawer
        title={[
          <div className="side-drawer-header">
            <div></div>
            <Translate
              className="drawer-maintitle"
              component={Text}
              content="notifications"
            />
            <span onClick={onClose} className="icon md close-white c-pointer" />
          </div>
        ]}
        placement="right"
        closable={false}
        onClose={onClose}
        visible={showDrawer}
        className="side-drawer"
      >
        {!loading && error && (
          <Alert type="error" description={error} showIcon />
        )}
        {loading && <Loader />}
         {!loading && <><List
          itemLayout="vertical"
          size="large"
          className="notifications-list"
          loading={loading}
          locale={{
            emptyText: (
              <Empty
                className="mt-36"
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={apiCalls.convertLocalLang("notification_msg")}
              />
            )
          }}
        >
          {!loading && (!notifications || notifications.length === 0) && (
            <Empty
              className="mt-36"
              image={Empty.PRESENTED_IMAGE_SIMPLE}
              description={apiCalls.convertLocalLang("notification_msg")}
            />
          )}
          {notifications?.map((item, indx) => (
            <List.Item
              key={indx}
              // style={{ borderWidth: "0px" }}
            >
              <List.Item.Meta
                className={`${item?.action?.toLowerCase()}bg mb-0`}
                avatar={
                  <span
                    className={`icon md notifyIcon ${item?.action?.toLowerCase()}`}
                  />
                }
                title={
                  <div className="d-flex justify-content align-center">
                    <Text className="profile-value">{item.action}</Text>
                    <Text className="profile-label">
                      <Moment format={"DD MMM YY hh:mm A"}>
                        {item.notifiedDate ? convertUTCToLocalTime(item.notifiedDate) : item.notifiedDate}
                      </Moment>
                    </Text>
                  </div>
                }
                description={
                  <Text
                    className={`profile-value value-description ${!item.isRead ? "" : ""
                      } fs-12`}
                  >
                    {item?.message}{" "}
                  </Text>
                }
              />
            </List.Item>
          ))}
        </List>
        </>
         }
      </Drawer>
    </>
  );
};

export default ConnectStateProps(Notifications);
