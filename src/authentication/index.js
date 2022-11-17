import { WebStorageStateStore } from 'oidc-client';
import { createUserManager } from 'redux-oidc';
import AppConfig from '../utils/app_config';
const config = {
    authority: AppConfig.REACT_APP_AUTHORITY,
    client_id: AppConfig.REACT_APP_CLIENT_ID,
    redirect_uri: AppConfig.REACT_APP_REDIRECT_URI,
    response_type: "id_token token",
    scope: "openid profile",
    silent_redirect_uri: AppConfig.REACT_APP_SILENT_REDIRECT_URI,
    automaticSilentRenew: true,
    userStore: new WebStorageStateStore({ store: window.localStorage })
}
const userManager = createUserManager(config);
export { userManager }