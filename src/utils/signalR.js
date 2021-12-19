import * as SignalR from '@microsoft/signalr';

const connection = new SignalR.HubConnectionBuilder()
    .withUrl(process.env.REACT_APP_NOTIFICATION_HUB + "/NotificationHub?userid=123456789")
    .configureLogging(SignalR.LogLevel.Information)
    .build();

async function start() {
    try {
        await connection.start();
        console.log("SignalR Connected.");
    } catch (err) {
        console.log(err);
        setTimeout(start, 5000);
    }
}

connection.onclose(async () => {
    await start();
});

// Start the connection.
start();

export { connection }