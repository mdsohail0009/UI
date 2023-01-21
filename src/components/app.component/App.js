import Layout from "../../layout";
import { BrowserRouter as Router } from 'react-router-dom'
import { store } from "../../store";
import { loadUser, OidcProvider } from 'redux-oidc';
import { useEffect, useState } from "react";
import { userManager } from "../../authentication";
import ErrorBoundary from "antd/lib/alert/ErrorBoundary";
import Notifications from "../../notifications";
import { startConnection } from "../../utils/signalR";
import { useThemeSwitcher } from "react-css-theme-switcher";
import apiCalls from '../../api/apiCalls';
import { updatetwofactor } from "../../reducers/configReduser";
import SecurityLogin from "../../authentication/temp.security";
import ConnectStateProps from "../../utils/state.connect";
function App(props) {
  const { switcher, themes } = useThemeSwitcher()
  const [loading, setLoading] = useState(true);
  const [showNotifications, setNotifications] = useState(false);
  const connectToHub = () => {
    setTimeout(() => {
      const { userConfig: { userProfileInfo } } = store.getState();
      if (userProfileInfo?.id) {
        apiCalls.twofactor().then(res => {
          if (res.ok) {
            store.dispatch(updatetwofactor({ loading: false, isEnabled: res.data }));
          }
        })
        startConnection(userProfileInfo?.id);
        switcher({ theme: userProfileInfo?.theme === 'Light Theme' ? themes.LHT : themes.DRT });
      } else {
        connectToHub();
      }
    }, 2000)

  }

  useEffect(() => {
    localStorage.setItem("__url", window.location.pathname);
    loadUser(store, userManager).then(user => {
      setLoading(false);
      store.dispatch(updatetwofactor({ loading: true, isEnabled: false }));
      window.$zoho = window.$zoho || {};
      window.$zoho.salesiq?.reset();
      window.$zoho.salesiq = window.$zoho.salesiq || {
        widgetcode: process.env.REACT_APP_ZOHO_WIDGET_CODE,
        values: {},
        ready: function () {
          window.$zoho.salesiq.chatbutton.click(function () {
            // insert your code 
            window.$zoho.salesiq.visitor.email(user.profile.email);
            window.$zoho.salesiq.visitor.name(user.profile.preferred_username);
          })
          window.$zoho.salesiq.floatbutton.coin.hidetooltip();
        },
      }
      const d = document;
      let s;
      s = d.createElement('script');
      s.type = 'text/javascript';
      s.id = 'zsiqscript';
      s.defer = true;
      s.src = process.env.REACT_APP_ZOHO_WIDGET_URL;
      let t;
      t = d.getElementsByTagName('script')[0];
      t.parentNode.insertBefore(s, t);
    });

    //this should be unComment to STG and LIVE Only connectToHub
    connectToHub(); 
  }, [])// eslint-disable-line react-hooks/exhaustive-deps
  return (
    <OidcProvider userManager={userManager} store={store}>
      <Router basename={process.env.PUBLIC_URL}>
        <SecurityLogin>
          <ErrorBoundary>
            {loading ? <div className="loader">Loading....</div> : <>
              <Layout /></>}
          </ErrorBoundary>
        </SecurityLogin>
        <Notifications showDrawer={showNotifications} onClose={() => setNotifications(false)} />
      </Router>
    </OidcProvider>
  );
}

export default ConnectStateProps(App);