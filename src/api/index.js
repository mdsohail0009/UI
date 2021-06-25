import { create } from 'apisauce';
const firebaseServer = create({
    baseURL: "https://fcm.googleapis.com/",
    headers: {
        "AUthorization": "key=" + REACT_APP_FIREBASE_AUTH
    }
})
export { firebaseServer }