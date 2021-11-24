import * as SignalR from '@microsoft/signalr';
import { store } from '../store';
let connection;
function buildConnection() {
    const { userConfig: { userProfileInfo } } = store.getState();
    connection = new SignalR.HubConnectionBuilder()
        .withUrl(process.env.REACT_APP_SIGNALR_HUB + "/chatsocket?username=" + userProfileInfo?.id)
        .configureLogging(SignalR.LogLevel.Information)
        .build();

    start();
    connection.onclose(async () => {
        await start();
    });
}
async function start() {
    try {
        await connection.start();
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
};


// Start the connection.

export { connection, buildConnection }