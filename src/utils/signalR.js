import * as SignalR from '@microsoft/signalr';
import { notification } from 'antd';
import { updateDocRequest } from '../reducers/configReduser';
import { fetchDashboardcalls, setNotificationCount } from '../reducers/dashboardReducer';
import { clearPermissions,updateAccessdenied } from '../reducers/feturesReducer';
import { store } from '../store';
import AppConfig from './app_config';
function openNotification(message, title) {
    const args = {
        message: title,
        description:
            message,
        duration: 10,
        closeIcon: <span className="icon md close c-pointer" />
    };
    notification.open(args);
}
async function start(id) {
    const connection = new SignalR.HubConnectionBuilder()
        .withUrl(AppConfig.REACT_APP_NOTIFICATION_HUB + "NotificationHub?userid=" + id)
        .configureLogging(SignalR.LogLevel.Information)
        .build();
    try {
        await connection.start();
    } catch (err) {
        const { userConfig: { userProfileInfo } } = store.getState();
        setTimeout(() => { start(userProfileInfo?.id) }, 10000);
    }
    connection.onclose(async () => {
        const { userConfig: { userProfileInfo } } = store.getState();
        await start(userProfileInfo?.id);
    });
    connection.on("sendToUser", (user, message, title, text) => {
        openNotification(message, user);
        const { dashboard: { notificationCount } } = store.getState();
        store.dispatch(setNotificationCount(notificationCount ? notificationCount + 1 : 1));
    });
    connection.on("SendDocRequestedMessage ", (g) => {
        store.dispatch(updateDocRequest(true));
    });
    connection.on("SendDocApproved", (a, b, c) => {
        store.dispatch(updateDocRequest(b === "Requested"));
    });

    connection.on("UpdateWallet", (e) => {
        const { userConfig: { userProfileInfo } } = store.getState();
        store.dispatch(fetchDashboardcalls(userProfileInfo?.id));
    });
    connection.on("SendRoleUpdatedMessage", () => {
          store.dispatch(clearPermissions());
        //   store.dispatch(updateAccessdenied(true));
    });
}



// Start the connection.
function startConnection(id) {
    start(id);
}

export { startConnection }