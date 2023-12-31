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

const onUpdate = () => {
  store.dispatch(updateWorker());
}
ReactDOM.render(
  <React.StrictMode>
    <ThemeSwitcherProvider defaultTheme="DRT" themeMap={{ DRT: "./custom-dark2.0.css", LHT: "./custom-light2.0.css" }}>
     <Provider store={store}>
     <CookiesProvider>
      <IdleCmp />
      </CookiesProvider>
      </Provider>
    </ThemeSwitcherProvider>
  </React.StrictMode>,
  document.getElementById('root')
);
serviceWorkerRegistration.register({ onUpdate });

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
