import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/app.component/App';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css'
import './assets/css/styles.css';
import './assets/css/framework.css';
//import './assets/css/dark-theme.css';
import './assets/css/light-theme.css';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
ReactDOM.render(
  <React.StrictMode>
    <ThemeSwitcherProvider defaultTheme="LHT" themeMap={{ DRT: "./assets/css/dark-theme.css", LHT: "./assets/css/light-theme.css" }}>
      <App />
    </ThemeSwitcherProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
