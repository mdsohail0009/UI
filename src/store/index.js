import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk'
import authReducer from '../reducers/authReducer';
import buySellReducer from '../reducers/buysellReducer'
import SendReceive from '../reducers/sendreceiveReducer'
import SwapReducer from '../reducers/swapReducer';
import BuyFiat from '../reducers/buyFiatReducer';
import CryptoReducer from '../components/buysell.component/crypto.reducer';

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["oidc"]
}
const rootReducer = combineReducers({
    oidc: authReducer,
    buySell: buySellReducer,
    sendReceive: SendReceive,
    swapStore: SwapReducer,
    buyFiat: BuyFiat,
    sellData:CryptoReducer
})
const reducer = persistReducer(persistConfig, rootReducer)
let store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(thunk)),
);
const persistor = persistStore(store);

export { store, persistor }