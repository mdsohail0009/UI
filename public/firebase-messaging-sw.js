importScripts('https://www.gstatic.com/firebasejs/8.8.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.8.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: 'AIzaSyDmT-HTYbyhikz559fSl8dYiZU6jf45WUQ',
    authDomain: 'suisse-base.firebaseapp.com',
    databaseURL: 'https://suisse-base.firebaseio.com',
    projectId: 'suisse-base',
    storageBucket: 'suisse-base.appspot.com',
    messagingSenderId: '674898191081',
    appId: '1:674898191081:web:0a24367d7a751139f40678',
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
messaging.onBackgroundMessage((payload) => {
    console.log('[firebase-messaging-sw.js] Received background message ', payload);
    // Customize notification here
    const notificationTitle = 'Background Message Title';
    const notificationOptions = {
        body: 'Background Message body.',
        icon: '/firebase-logo.png'
    };

    self.registration.showNotification(notificationTitle,
        notificationOptions);
});