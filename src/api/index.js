import { create } from 'apisauce';
const firebaseServer = create({
    baseURL: "https://fcm.googleapis.com/",
    // headers: {
    //     "AUthorization": "key=" + REACT_APP_FIREBASE_AUTH
    // }
});
const apiClient = create({
    baseURL:process.env.REACT_APP_API_END_POINT
      
})
export { firebaseServer,apiClient }