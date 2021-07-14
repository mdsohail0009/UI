import { create } from 'apisauce';
const firebaseServer = create({
    baseURL: "https://fcm.googleapis.com/",
    // headers: {
    //     "AUthorization": "key=" + REACT_APP_FIREBASE_AUTH
    // }
});
const apiClient = create({
    baseURL:"https://cefiapi.azurewebsites.net/api/v1"
      
})
const sumSubClient = create({
    baseURL:"https://cefiapi.azurewebsites.net/api/v1/Sumsub",
})
export { firebaseServer,apiClient,sumSubClient }