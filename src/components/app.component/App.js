import Layout from "../../layout";
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from "react-redux";
import { store } from "../../store";
import { loadUser, OidcProvider } from 'redux-oidc';
import { useEffect, useRef, useState } from "react";
import { userManager } from "../../authentication";
import { onMessageListener } from "../../utils/firebase";
import ErrorBoundary from "antd/lib/alert/ErrorBoundary";
import { AppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { reactPlugin } from "../../Shared/appinsights";
import Notifications from "../../notifications";
import { setNotificationCount } from '../../reducers/dashboardReducer';
import { connection } from "../../utils/signalR";
function App(props) {
  const [loading, setLoading] = useState(true);
  const [showNotifications, setNotifications] = useState(false);
  useEffect(() => {
    onMessageListener().then(payload => {
      const { dashboard: { notificationCount } } = store.getState();
      setNotificationCount(notificationCount ? notificationCount + 1 : 1);
    })
    localStorage.setItem("__url", window.location.pathname);
    loadUser(store, userManager).then(user => {
      setLoading(false);
      window.$zoho = window.$zoho || {};
      window.$zoho.salesiq?.reset();
      window.$zoho.salesiq = window.$zoho.salesiq || {
        widgetcode: "96756975ac1c2aab2d1534678a55b38fe0ca21ca94a31c4145a23ab14e64cb9aa81d6b547a35c109951d24f6be71d2d0",
        values: {},
        ready: function () {

          window.$zoho.salesiq.chatbutton.click(function () {
            // insert your code 
            window.$zoho.salesiq.visitor.email(user.profile.email);
            window.$zoho.salesiq.visitor.name(user.profile.preferred_username);
          })
        },
      }
      const d = document;
      let s;
      s = d.createElement('script');
      s.type = 'text/javascript';
      s.id = 'zsiqscript';
      s.defer = true;
      s.src = 'https://salesiq.zoho.in/widget';
      let t;
      t = d.getElementsByTagName('script')[0];
      t.parentNode.insertBefore(s, t);

    })
    connection.on("sendToUser", (user, message) => {
      debugger;
    });
  }, [])
  return (
    <Provider store={store}>
      <OidcProvider userManager={userManager} store={store}>
        <Router basename={process.env.PUBLIC_URL}>
          <AppInsightsContext.Provider value={reactPlugin}>
            <ErrorBoundary>
              {loading ? <div className="loader">Loading....</div> : <><Layout /></>}
            </ErrorBoundary>
          </AppInsightsContext.Provider>
          <Notifications showDrawer={showNotifications} onClose={() => setNotifications(false)} />
        </Router>
      </OidcProvider>
    </Provider>
  );
}

export default App;