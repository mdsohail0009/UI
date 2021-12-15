import React from 'react';
import ReactDOM from 'react-dom';
import '@progress/kendo-theme-default/dist/all.css';
import reportWebVitals from './reportWebVitals';
import 'antd/dist/antd.css'
import './assets/css/styles.css';
import './assets/css/framework.css';
import { ThemeSwitcherProvider } from 'react-css-theme-switcher';
import IdleCmp from './authentication/idle.component';
ReactDOM.render(
  <React.StrictMode>
    <ThemeSwitcherProvider defaultTheme="DRT" themeMap={{ DRT: "./dark-theme.css", LHT: "./light-theme.css" }}>
      <IdleCmp />
    </ThemeSwitcherProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
