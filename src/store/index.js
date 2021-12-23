import { createStore, combineReducers, applyMiddleware } from 'redux'
import { composeWithDevTools } from 'redux-devtools-extension';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import thunk from 'redux-thunk';
import buyReducer from '../reducers/buyReducer';
import authReducer from '../reducers/authReducer';
import buySellReducer from '../reducers/buysellReducer'
import SendReceive from '../reducers/sendreceiveReducer'
import SwapReducer from '../reducers/swapReducer';
import BuyFiat from '../reducers/buyFiatReducer';
import UserConfig from '../reducers/configReduser';
import sellReducer from '../reducers/sellReducer';
import depositReducer from '../reducers/depositReducer';
import dashboardReducer from '../reducers/dashboardReducer';
import UserprofileReducer from '../reducers/UserprofileReducer';
import AddressBookReducer from '../reducers/addressBookReducer';

const persistConfig = {
    key: "root",
    storage,
    whitelist: ["oidc", "userConfig"]
}
const rootReducer = combineReducers({
    oidc: authReducer,
    buySell: buySellReducer,
    sendReceive: SendReceive,
    swapStore: SwapReducer,
    buyFiat: BuyFiat,
    userConfig: UserConfig,
    buyInfo: buyReducer,
    sellInfo: sellReducer,
    depositInfo: depositReducer,
    dashboard: dashboardReducer,
    userProfile: UserprofileReducer,
    addressBookReducer: AddressBookReducer

})
const reducer = persistReducer(persistConfig, rootReducer)
let store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(thunk)),
);
const persistor = persistStore(store);

export { store, persistor }