import React from 'react';
import ReactDOM from 'react-dom';
import '@progress/kendo-theme-default/dist/all.css';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css';
import './assets/css/styles.css';
import './assets/css/custom-styles.css';
// import './assets/css/framework.css';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import IdleCmp from './authentication/idle.component';
import { Provider } from 'react-redux';
import { store } from './store';
import { CookiesProvider } from 'react-cookie';
import * as serviceWorkerRegistration from './serviceWorkerRegistration';
import { updateWorker } from './reducers/serviceWorker';
import NavBar from './authentication/auth0/login';
import { getConfig } from './authentication/auth0/configs';
import { Auth0Provider } from "@auth0/auth0-react";
import history from "./authentication/auth0/history";


const onUpdate = () => {
  store.dispatch(updateWorker());
}
const onRedirectCallback = (appState) => {
  history.push(
    appState && appState.returnTo ? appState.returnTo : window.location.pathname
  );
};

const config = getConfig();

const providerConfig = {
  domain: config.domain,
  clientId: config.clientId,
  authorizationParams:{
    redirect_uri: `http://localhost:3000/callback`,
    ...(config.audience ? { audience: config.audience } : null)
  },
  onRedirectCallback,
};
ReactDOM.render(
  <React.StrictMode>
    <Auth0Provider {...providerConfig}>
    {/* <NavBar /> */}
  
    <ThemeSwitcherProvider defaultTheme="DRT" themeMap={{ DRT: "./custom-dark2.0.css", LHT: "./custom-light2.0.css" }}>
      <Provider store={store}>
        <CookiesProvider>
          <IdleCmp />
        </CookiesProvider>
      </Provider>
    </ThemeSwitcherProvider>
    </Auth0Provider>
   </React.StrictMode>,
  document.getElementById('root')
);
serviceWorkerRegistration.register({ onUpdate });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
