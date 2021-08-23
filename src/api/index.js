import { create } from 'apisauce';
import { store } from '../store';
const firebaseServer = create({
    baseURL: "https://fcm.googleapis.com/",
    // headers: {
    //     "AUthorization": "key=" + REACT_APP_FIREBASE_AUTH
    // }
});
const apiClient = create({
    baseURL: process.env.REACT_APP_API_END_POINT
})
const coinGekoClient = create({
    baseURL: process.env.REACT_APP_COIN_GECO_API
})
apiClient.axiosInstance.interceptors.request.use((config) => {
    const { oidc: { user } } = store.getState()
    config.headers.Authorization = `Bearer ${user.access_token}`
    return config;
})
export { firebaseServer, apiClient, coinGekoClient }