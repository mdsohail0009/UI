import * as SignalR from '@microsoft/signalr';
import { notification } from 'antd';
import { setNotificationCount } from '../reducers/dashboardReducer';
import { store } from '../store';
function openNotification(message, title) {
    const args = {
        message: title,
        description:
            message,
        duration: 10,
    };
    notification.open(args);
}
async function start(id) {
  const  connection = new SignalR.HubConnectionBuilder()
        .withUrl(process.env.REACT_APP_NOTIFICATION_HUB + "NotificationHub?userid=" + id)
        .configureLogging(SignalR.LogLevel.Information)
        .build();
    try {
        await connection.start();
    } catch (err) {
        const { userConfig: { userProfileInfo } } = store.getState();
        openNotification("Connection failed to hub",err.message||err.data);
        setTimeout(()=>{start(userProfileInfo?.id)}, 5000);
    }
    connection.onclose(async () => {
        const { userConfig: { userProfileInfo } } = store.getState();
        await start(userProfileInfo?.id);
    });
    connection.on("sendToUser", (user, message, title) => {
        openNotification(message, title);
        const { dashboard: { notificationCount } } = store.getState();
        setNotificationCount(notificationCount ? notificationCount + 1 : 1);
    });
}



// Start the connection.
function startConnection(id) {
    start(id);
}

export {startConnection }