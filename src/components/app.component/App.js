import Layout from "../../layout";
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from "react-redux";
import { store } from "../../store";
import { loadUser, OidcProvider } from 'redux-oidc';
import { useEffect, useState } from "react";
import { userManager } from "../../authentication";
import { onMessageListener } from "../../utils/firebase";
import ErrorBoundary from "antd/lib/alert/ErrorBoundary";
import { AppInsightsContext } from "@microsoft/applicationinsights-react-js";
import { reactPlugin } from "../../Shared/appinsights";
import Notifications from "../../notifications";

function App() {
  const [loading, setLoading] = useState(true);
  const [showNotifications, setNotifications] = useState(false);
  useEffect(() => {
    onMessageListener().then(payload => {
      //setNotifications(true);
    })
    localStorage.setItem("__url", window.location.pathname);
    loadUser(store, userManager).then(user => {
      setLoading(false)
    })
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
