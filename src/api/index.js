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
    baseURL:"https://test-api.sumsub.com/",
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'X-App-Token': 'tst:vGf24U2YVIWhDsXuo7DfWJI0'
    }
})
export { firebaseServer,apiClient,sumSubClient }