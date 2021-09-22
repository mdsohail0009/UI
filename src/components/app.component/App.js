import Layout from "../../layout";
import { BrowserRouter as Router } from 'react-router-dom'
import { Provider } from "react-redux";
import { store } from "../../store";
import { loadUser, OidcProvider } from 'redux-oidc';
import { useEffect, useState } from "react";
import { userManager } from "../../authentication";
// import { onMessageListener } from "../../utils/firebase";

function App() {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // onMessageListener().then(payload => {
    //   console.log(payload)
    // })
    localStorage.setItem("__url", window.location.pathname);
    loadUser(store, userManager).then(user => {
      setLoading(false)
    })
  }, [])
  return (
    <Provider store={store}>
      <OidcProvider userManager={userManager} store={store}>
        <Router basename={process.env.PUBLIC_URL}>
          {loading ? <div className="loader">Loading....</div> : <Layout />}
        </Router>
      </OidcProvider>
    </Provider>
  );
}

export default App;
