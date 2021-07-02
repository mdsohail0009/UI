import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk'
import authReducer from '../reducers/authReducer';
import buySellReducer from '../reducers/buysellReducer'
const persistConfig = {
    key: "root",
    storage,
    whitelist: ["oidc"]
}
const rootReducer = combineReducers({
    oidc: authReducer,
    buySell:buySellReducer
})
const reducer = persistReducer(persistConfig, rootReducer)
let store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(thunk)),
);
const persistor = persistStore(store);

export { store, persistor }